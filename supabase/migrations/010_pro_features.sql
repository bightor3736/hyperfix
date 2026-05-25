-- =====================
-- 010: Pro profile features
-- =====================
-- Custom accent color (Pro) + multiple pinned fixes (Pro)

alter table public.profiles add column if not exists accent_color text;
alter table public.profiles add column if not exists pinned_fix_ids uuid[] default '{}';

-- Backfill the array from the legacy single pinned_fix_id
update public.profiles
set pinned_fix_ids = array[pinned_fix_id]
where pinned_fix_id is not null
  and (pinned_fix_ids is null or pinned_fix_ids = '{}');
