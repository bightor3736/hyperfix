-- ─────────────────────────────────────────────────────────────
-- Beat the Wall: task-initiation game. Name a dreaded task, shrink it
-- to a 2-minute first step, and we reward the moment you START — not
-- the finish. The "Wall of Awful" is the #1 ADHD pain point and almost
-- nobody gamifies it. Drives XP + a "walls broken" count.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS walls_broken (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task        TEXT        NOT NULL,           -- the dreaded task, in the user's words
  first_step  TEXT        NOT NULL,           -- the 2-minute step we generated
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS walls_broken_user_time ON walls_broken (user_id, created_at DESC);

ALTER TABLE walls_broken ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS walls_broken_own ON walls_broken;
CREATE POLICY walls_broken_own ON walls_broken
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wall-breaking achievements
INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('wall_first', 'Wall Breaker',   'Start a task you''ve been dreading.',                'metric', 20,  60, 14),
  ('wall_10',    'Momentum',       'Break through 10 walls. Starting got easier.',      'metric', 60,  28, 15),
  ('wall_50',    'Unstoppable',    'Break 50 walls. The hardest part stopped being hard.','metric', 200, 10, 16)
ON CONFLICT (id) DO NOTHING;
