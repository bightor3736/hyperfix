-- Rich, fully-customizable profiles (Discord / Vault style).
--
-- Also back-fills `social_link`, which application code has been reading and
-- writing for a while without a migration ever creating the column.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_link    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pronouns       TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_emoji   TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_text    TEXT;

-- Structured social connections, e.g.
--   { "twitter": "...", "instagram": "...", "tiktok": "...",
--     "youtube": "...", "github": "...", "discord": "...", "website": "..." }
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS socials        JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Visual theme + accent. accent_color already exists (Pro-only historically);
-- it's now available to everyone. theme drives the profile background/vibe.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_theme  TEXT NOT NULL DEFAULT 'aurora';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_layout TEXT NOT NULL DEFAULT 'classic';
