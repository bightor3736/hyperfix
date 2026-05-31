-- ─────────────────────────────────────────────────────────────
-- Dopamine hits: the core daily loop. One tap → a healthy dopamine
-- hit instead of a doomscroll. Drives XP + streak.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dopamine_hits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id TEXT        NOT NULL,
  category    TEXT        NOT NULL,    -- move | create | connect | reset | treat
  label       TEXT        NOT NULL,
  minutes     INT,
  energy      TEXT,                    -- low | med | high
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dopamine_hits_user_time ON dopamine_hits (user_id, created_at DESC);

ALTER TABLE dopamine_hits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dopamine_hits_own ON dopamine_hits;
CREATE POLICY dopamine_hits_own ON dopamine_hits
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dopamine-loop achievements
INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('dopamine_first', 'First Hit',           'Take your first dopamine hit instead of doomscrolling.', 'metric', 15,  70, 11),
  ('dopamine_25',    'Better Than The Feed','Choose 25 healthy dopamine hits.',                       'metric', 50,  30, 12),
  ('dopamine_100',   'Rewired',             'Choose 100 dopamine hits. Your brain learned a new path.','metric', 150, 12, 13)
ON CONFLICT (id) DO NOTHING;
