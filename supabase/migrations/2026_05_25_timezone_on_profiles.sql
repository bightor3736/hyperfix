-- Adds timezone preference to profiles so daily/weekly reminder emails fire
-- at a sensible local time per user.
-- Default: UTC. Format: IANA timezone string (e.g. "America/Los_Angeles").

alter table public.profiles
  add column if not exists timezone text default 'UTC';

-- Backfill any null values
update public.profiles set timezone = 'UTC' where timezone is null;
