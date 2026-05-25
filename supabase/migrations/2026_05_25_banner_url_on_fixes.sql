-- Adds banner_url to the fixes table.
-- Run this in the Supabase SQL editor.

alter table public.fixes
  add column if not exists banner_url text;

-- Allow public read on the fix banner when the fix is public
-- (no policy change needed if RLS already allows public-fix selects on this table).

-- Storage bucket for fix banners (mirrors the existing "banners" bucket used for profile banners).
-- If you haven't created a "banners" bucket in Supabase Storage yet, do this in the dashboard:
--   1. Storage → New bucket → name: "banners" → public bucket: ON
--   2. (Optional) Policy: allow authenticated users to upload to {user_id}/*
--
-- Existing profile banners already use this bucket so it may already exist.
