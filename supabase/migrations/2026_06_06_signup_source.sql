-- ─────────────────────────────────────────────────────────────
-- Signup attribution: where did this player come from? Lets us compare
-- the hyperfixation hook vs. the game hook by signups AND retention.
-- First-touch: captured from ?ref / ?src / utm params on landing, set
-- once at account creation, never overwritten.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_source   TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_campaign TEXT;

CREATE INDEX IF NOT EXISTS profiles_signup_source ON profiles (signup_source);
