-- ─────────────────────────────────────────────────────────────
-- Forgiving streaks + streak freezes + Pro monetization hooks
-- ─────────────────────────────────────────────────────────────

-- Streak state lives on profiles (authoritative, forgiving)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak     INT  NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak     INT  NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin_date  DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes     INT  NOT NULL DEFAULT 2;  -- free users start with 2
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS freezes_refilled_on DATE;

-- Atomic, forgiving check-in. Consumes streak freezes to cover missed days.
-- Pro users get freezes auto-refilled to 5 once per calendar month.
CREATE OR REPLACE FUNCTION record_checkin(p_user UUID, p_today DATE)
RETURNS TABLE (current_streak INT, longest_streak INT, freezes INT, froze BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_date  DATE;
  cur        INT;
  longest    INT;
  frz        INT;
  refilled   DATE;
  is_pro_u   BOOLEAN;
  gap        INT;
  did_freeze BOOLEAN := false;
BEGIN
  SELECT last_checkin_date, profiles.current_streak, profiles.longest_streak,
         streak_freezes, freezes_refilled_on, COALESCE(is_pro, false)
    INTO last_date, cur, longest, frz, refilled, is_pro_u
    FROM profiles WHERE id = p_user FOR UPDATE;

  cur := COALESCE(cur, 0);
  longest := COALESCE(longest, 0);
  frz := COALESCE(frz, 0);

  -- Pro monthly freeze refill
  IF is_pro_u AND (refilled IS NULL OR date_trunc('month', refilled) <> date_trunc('month', p_today)) THEN
    frz := GREATEST(frz, 5);
    UPDATE profiles SET freezes_refilled_on = p_today WHERE id = p_user;
  END IF;

  IF last_date IS NULL THEN
    cur := 1;
  ELSIF last_date = p_today THEN
    NULL; -- already counted today
  ELSIF last_date > p_today THEN
    NULL; -- backdated, ignore
  ELSE
    gap := p_today - last_date;
    IF gap = 1 THEN
      cur := cur + 1;
    ELSE
      -- missed (gap - 1) days; spend freezes to keep the streak alive
      IF frz >= (gap - 1) THEN
        frz := frz - (gap - 1);
        cur := cur + 1;
        did_freeze := true;
      ELSE
        cur := 1;
      END IF;
    END IF;
  END IF;

  IF cur > longest THEN longest := cur; END IF;

  UPDATE profiles
    SET current_streak = cur,
        longest_streak = longest,
        streak_freezes = frz,
        last_checkin_date = GREATEST(COALESCE(last_checkin_date, p_today), p_today)
    WHERE id = p_user;

  current_streak := cur;
  longest_streak := longest;
  freezes := frz;
  froze := did_freeze;
  RETURN NEXT;
END;
$$;

-- Grant a one-off freeze (e.g. earned reward or admin gift)
CREATE OR REPLACE FUNCTION grant_freezes(p_user UUID, p_count INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE new_total INT;
BEGIN
  UPDATE profiles
    SET streak_freezes = COALESCE(streak_freezes, 0) + GREATEST(0, p_count)
    WHERE id = p_user
    RETURNING streak_freezes INTO new_total;
  RETURN new_total;
END;
$$;
