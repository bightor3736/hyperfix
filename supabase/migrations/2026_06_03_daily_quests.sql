-- ─────────────────────────────────────────────────────────────
-- Daily quests: 3 per user per day, generated server-side
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

CREATE POLICY "own_quests_all" ON daily_quests
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
