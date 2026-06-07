-- ─────────────────────────────────────────────────────────────
-- First-party funnel analytics. One row per tracked event so we own
-- the data and can query the whole funnel in plain SQL:
--   signup → first task_start → return → share → checkout → upgrade
--
-- Written server-side with the service role (RLS-protected from clients).
-- user_id is nullable so we can capture pre-auth events later if needed.
-- props is free-form JSON for per-event detail (minutes, surface, source…).
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_events (
  id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  event      TEXT        NOT NULL,            -- canonical event name
  props      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  source     TEXT,                            -- first-touch attribution, if known
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Funnel-over-time queries: event then day.
CREATE INDEX IF NOT EXISTS analytics_events_event_time
  ON analytics_events (event, created_at DESC);

-- Per-user timelines + "is this the user's first X?" lookups.
CREATE INDEX IF NOT EXISTS analytics_events_user
  ON analytics_events (user_id, event, created_at DESC);

-- Locked down: only the service role writes/reads. No client policies,
-- so with RLS enabled the anon/auth keys can't touch this table at all.
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
