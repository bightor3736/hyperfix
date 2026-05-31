-- ─────────────────────────────────────────────────────────────
-- Gamification: points ledger, levels, achievements, boosts, leaderboard
-- ─────────────────────────────────────────────────────────────

-- 1. Points balance on profiles (denormalised for cheap reads / leaderboard)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_points        INT     NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS leaderboard_opt_out BOOLEAN NOT NULL DEFAULT false;

-- Leaderboard ordering index
CREATE INDEX IF NOT EXISTS profiles_total_points_idx ON profiles (total_points DESC);

-- 2. Append-only points ledger
CREATE TABLE IF NOT EXISTS point_events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind          TEXT        NOT NULL,              -- check_in | new_fix | mood_log | task_done | med_log | rsd_entry | user_creation | achievement
  points        INT         NOT NULL,              -- final awarded amount (after multiplier)
  multiplier    NUMERIC     NOT NULL DEFAULT 1,
  ref_id        TEXT        NOT NULL,              -- natural idempotency key for the awarding action
  description   TEXT,
  balance_after INT,                               -- running total after this event (for history display)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotency: a given (user, kind, ref) can only ever award once
CREATE UNIQUE INDEX IF NOT EXISTS point_events_dedupe ON point_events (user_id, kind, ref_id);
CREATE INDEX IF NOT EXISTS point_events_user_time ON point_events (user_id, created_at DESC);

-- 3. Achievements catalog (shared) + per-user unlock state
CREATE TABLE IF NOT EXISTS achievements (
  id          TEXT    PRIMARY KEY,                 -- stable string key
  name        TEXT    NOT NULL,
  description TEXT,
  trigger     TEXT    NOT NULL DEFAULT 'metric',   -- metric | streak | api
  badge_url   TEXT,
  bonus       INT     NOT NULL DEFAULT 0,          -- points awarded on unlock
  rarity      NUMERIC,
  sort        INT     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT        NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- 4. Point boosts (time-boxed global multipliers)
CREATE TABLE IF NOT EXISTS point_boosts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  multiplier  NUMERIC     NOT NULL DEFAULT 2,
  starts_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at     TIMESTAMPTZ,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Atomic award function (idempotent). Returns the awarded amount + new balance.
CREATE OR REPLACE FUNCTION award_points(
  p_user        UUID,
  p_kind        TEXT,
  p_points      INT,
  p_multiplier  NUMERIC,
  p_ref         TEXT,
  p_description TEXT
)
RETURNS TABLE (awarded INT, balance_after INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  final_points INT := GREATEST(0, ROUND(p_points * COALESCE(p_multiplier, 1)))::int;
  new_total    INT;
BEGIN
  INSERT INTO point_events (user_id, kind, points, multiplier, ref_id, description)
  VALUES (p_user, p_kind, final_points, COALESCE(p_multiplier, 1), p_ref, p_description)
  ON CONFLICT (user_id, kind, ref_id) DO NOTHING;

  IF NOT FOUND THEN
    RETURN; -- already awarded; no-op
  END IF;

  UPDATE profiles
    SET total_points = COALESCE(total_points, 0) + final_points
    WHERE id = p_user
    RETURNING total_points INTO new_total;

  UPDATE point_events
    SET balance_after = new_total
    WHERE user_id = p_user AND kind = p_kind AND ref_id = p_ref;

  awarded := final_points;
  balance_after := new_total;
  RETURN NEXT;
END;
$$;

-- 6. RLS
ALTER TABLE point_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_boosts      ENABLE ROW LEVEL SECURITY;

-- Users read their own ledger; achievements catalog + boosts are public-read;
-- user_achievements are publicly readable (for profile badges + leaderboard flair).
DROP POLICY IF EXISTS point_events_own_select ON point_events;
CREATE POLICY point_events_own_select ON point_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS achievements_public ON achievements;
CREATE POLICY achievements_public ON achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS user_achievements_public ON user_achievements;
CREATE POLICY user_achievements_public ON user_achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS point_boosts_public ON point_boosts;
CREATE POLICY point_boosts_public ON point_boosts FOR SELECT USING (active = true);

-- Writes happen exclusively through the service-role admin client / award_points(),
-- so no INSERT/UPDATE policies are granted to anon/authenticated.

-- 7. Seed achievements (on-brand)
INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('first_fix',     'First Obsession',   'Log your very first hyperfixation.',                 'metric', 25,  60, 1),
  ('checkin_7',     'One Week In',        'Check in 7 days total.',                              'metric', 30,  45, 2),
  ('checkin_30',    'Deeply Unwell',      'Check in 30 days total.',                             'metric', 75,  20, 3),
  ('streak_7',      'On A Roll',          'Hit a 7-day check-in streak.',                        'streak', 40,  35, 4),
  ('streak_30',     'Feral',              'Hit a 30-day check-in streak.',                       'streak', 120, 8,  5),
  ('five_fixes',    'Chaos Mode',         'Have 5 active fixations at once.',                    'metric', 50,  25, 6),
  ('graveyard_3',   'Graveyard Keeper',   'Lay 3 fixations to rest.',                            'metric', 40,  30, 7),
  ('mood_10',       'Self-Aware',         'Log your mood 10 times.',                             'metric', 35,  30, 8),
  ('task_25',       'Brain Emptied',      'Complete 25 brain-dump tasks.',                       'metric', 45,  18, 9),
  ('points_1000',   'Clinically Obsessed','Reach 1,000 XP.',                                     'metric', 100, 10, 10)
ON CONFLICT (id) DO NOTHING;
