-- Pinned fix and profile banner
alter table public.profiles
  add column if not exists pinned_fix_id uuid references public.fixes(id) on delete set null,
  add column if not exists banner_url text;
