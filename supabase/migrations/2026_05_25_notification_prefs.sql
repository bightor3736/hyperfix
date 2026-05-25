-- Add notification_prefs JSONB column to profiles
-- Used to store per-user toggle settings for different notification categories
alter table public.profiles
  add column if not exists notification_prefs jsonb default '{}'::jsonb;
