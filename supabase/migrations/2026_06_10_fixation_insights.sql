-- ─────────────────────────────────────────────────────────────
-- Deep Dive insights: reflection-prompt answers tied to a hyperfixation.
-- One answer per (user, fixation, prompt) — UNIQUE makes XP idempotent.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fixation_insights (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fixation_id UUID NOT NULL REFERENCES hyperfixations(id) ON DELETE CASCADE,
  prompt_key  TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, fixation_id, prompt_key)
);

CREATE INDEX IF NOT EXISTS fixation_insights_fixation
  ON fixation_insights (fixation_id, created_at DESC);

ALTER TABLE fixation_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fixation_insights_own ON fixation_insights;
CREATE POLICY fixation_insights_own ON fixation_insights
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
