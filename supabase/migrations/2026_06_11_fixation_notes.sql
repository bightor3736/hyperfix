-- ─────────────────────────────────────────────────────────────
-- Brain Burst: quick free-text thoughts captured against a hyperfixation.
-- Many per fixation — the low-friction "get it out of my head" capture,
-- scoped to the obsession it belongs to.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fixation_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fixation_id UUID NOT NULL REFERENCES fixes(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS fixation_notes_fixation
  ON fixation_notes (fixation_id, created_at DESC);

ALTER TABLE fixation_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fixation_notes_own ON fixation_notes;
CREATE POLICY fixation_notes_own ON fixation_notes
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
