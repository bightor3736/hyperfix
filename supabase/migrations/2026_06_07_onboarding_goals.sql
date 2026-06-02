-- Onboarding: capture what each user wants help with, so the dashboard can
-- eventually prioritise the right tools. Free-form text[] of goal keys.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_goals       TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
