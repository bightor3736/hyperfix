-- Adds a card_style column to fixes so users can save their preferred
-- share card template ("paper" | "dark" | "minimal" | "photo").
-- Run this in the Supabase SQL editor.

alter table public.fixes
  add column if not exists card_style text;

-- No default — when null, the route falls back to "photo" if banner_url is set,
-- otherwise "paper".
