-- ═══════════════════════════════════════════════════════════════════════════
-- HYPERFIX — ALL GAME MIGRATIONS, COMBINED
-- Paste this whole file into the Supabase SQL editor and run once.
-- Idempotent: safe to re-run (IF NOT EXISTS / OR REPLACE / ON CONFLICT).
-- Covers: gamification, forgiving streaks, daily quests, dopamine hits,
--         Beat the Wall, and signup-source attribution.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────
-- 1) GAMIFICATION: points ledger, levels, achievements, boosts, leaderboard
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_points        INT     NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS leaderboard_opt_out BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS profiles_total_points_idx ON profiles (total_points DESC);

CREATE TABLE IF NOT EXISTS point_events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind          TEXT        NOT NULL,
  points        INT         NOT NULL,
  multiplier    NUMERIC     NOT NULL DEFAULT 1,
  ref_id        TEXT        NOT NULL,
  description   TEXT,
  balance_after INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS point_events_dedupe ON point_events (user_id, kind, ref_id);
CREATE INDEX IF NOT EXISTS point_events_user_time ON point_events (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS achievements (
  id          TEXT    PRIMARY KEY,
  name        TEXT    NOT NULL,
  description TEXT,
  trigger     TEXT    NOT NULL DEFAULT 'metric',
  badge_url   TEXT,
  bonus       INT     NOT NULL DEFAULT 0,
  rarity      NUMERIC,
  sort        INT     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT        NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

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
    RETURN;
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

ALTER TABLE point_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_boosts      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS point_events_own_select ON point_events;
CREATE POLICY point_events_own_select ON point_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS achievements_public ON achievements;
CREATE POLICY achievements_public ON achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS user_achievements_public ON user_achievements;
CREATE POLICY user_achievements_public ON user_achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS point_boosts_public ON point_boosts;
CREATE POLICY point_boosts_public ON point_boosts FOR SELECT USING (active = true);

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


-- ─────────────────────────────────────────────────────────────
-- 2) FORGIVING STREAKS + FREEZES + PRO MONETIZATION HOOKS
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak      INT  NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak      INT  NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin_date   DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes      INT  NOT NULL DEFAULT 2;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS freezes_refilled_on DATE;

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

  IF is_pro_u AND (refilled IS NULL OR date_trunc('month', refilled) <> date_trunc('month', p_today)) THEN
    frz := GREATEST(frz, 5);
    UPDATE profiles SET freezes_refilled_on = p_today WHERE id = p_user;
  END IF;

  IF last_date IS NULL THEN
    cur := 1;
  ELSIF last_date = p_today THEN
    NULL;
  ELSIF last_date > p_today THEN
    NULL;
  ELSE
    gap := p_today - last_date;
    IF gap = 1 THEN
      cur := cur + 1;
    ELSE
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


-- ─────────────────────────────────────────────────────────────
-- 3) DAILY QUESTS — 3 per user per day
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS daily_quests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  kind         TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  xp_reward    INT NOT NULL DEFAULT 10,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date, kind)
);

ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_quests_all" ON daily_quests;
CREATE POLICY "own_quests_all" ON daily_quests
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- 4) DOPAMINE HITS — the core daily loop
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dopamine_hits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  label       TEXT        NOT NULL,
  minutes     INT,
  energy      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dopamine_hits_user_time ON dopamine_hits (user_id, created_at DESC);

ALTER TABLE dopamine_hits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dopamine_hits_own ON dopamine_hits;
CREATE POLICY dopamine_hits_own ON dopamine_hits
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('dopamine_first', 'First Hit',           'Take your first dopamine hit instead of doomscrolling.', 'metric', 15,  70, 11),
  ('dopamine_25',    'Better Than The Feed','Choose 25 healthy dopamine hits.',                       'metric', 50,  30, 12),
  ('dopamine_100',   'Rewired',             'Choose 100 dopamine hits. Your brain learned a new path.','metric', 150, 12, 13)
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 5) BEAT THE WALL — task initiation
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS walls_broken (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task        TEXT        NOT NULL,
  first_step  TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS walls_broken_user_time ON walls_broken (user_id, created_at DESC);

ALTER TABLE walls_broken ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS walls_broken_own ON walls_broken;
CREATE POLICY walls_broken_own ON walls_broken
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('wall_first', 'Wall Breaker',   'Start a task you''ve been dreading.',                  'metric', 20,  60, 14),
  ('wall_10',    'Momentum',       'Break through 10 walls. Starting got easier.',        'metric', 60,  28, 15),
  ('wall_50',    'Unstoppable',    'Break 50 walls. The hardest part stopped being hard.','metric', 200, 10, 16)
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 6) SIGNUP-SOURCE ATTRIBUTION (first-touch)
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_source   TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_campaign TEXT;

CREATE INDEX IF NOT EXISTS profiles_signup_source ON profiles (signup_source);

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE. All game features should now work.
-- ═══════════════════════════════════════════════════════════════════════════
