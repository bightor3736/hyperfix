-- =============================================================
-- HYPERFIX — COMPLETE DATABASE SETUP
-- Run this entire file in the Supabase SQL Editor:
-- supabase.com/dashboard -> your project -> SQL Editor -> paste -> Run
--
-- Safe to run multiple times: every statement is idempotent.
-- =============================================================


-- =====================
-- 001: Core tables
-- =====================

-- profiles (one per auth user)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- fixes (core entity)
create table if not exists public.fixes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null default 'other',
  status text not null default 'Day 1',
  intensity int not null default 5 check (intensity >= 1 and intensity <= 10),
  note text,
  eulogy text,
  cover_url text,
  is_public boolean default false,
  started_at timestamptz default now(),
  ended_at timestamptz,
  created_at timestamptz default now()
);

-- fix_entries (daily intensity log for sparkline)
create table if not exists public.fix_entries (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date default current_date,
  intensity int not null check (intensity >= 1 and intensity <= 10),
  note text,
  created_at timestamptz default now(),
  unique(fix_id, date)
);

alter table public.profiles enable row level security;
alter table public.fixes enable row level security;
alter table public.fix_entries enable row level security;

-- profiles policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (is_public = true);
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- fixes policies
drop policy if exists "Public fixes are viewable by everyone" on public.fixes;
create policy "Public fixes are viewable by everyone" on public.fixes for select using (is_public = true);
drop policy if exists "Users can view own fixes" on public.fixes;
create policy "Users can view own fixes" on public.fixes for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own fixes" on public.fixes;
create policy "Users can insert own fixes" on public.fixes for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own fixes" on public.fixes;
create policy "Users can update own fixes" on public.fixes for update using (auth.uid() = user_id);
drop policy if exists "Users can delete own fixes" on public.fixes;
create policy "Users can delete own fixes" on public.fixes for delete using (auth.uid() = user_id);

-- fix_entries policies
drop policy if exists "Users can manage own entries" on public.fix_entries;
create policy "Users can manage own entries" on public.fix_entries for all using (auth.uid() = user_id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =====================
-- 002: Reactions
-- =====================
create table if not exists public.fix_reactions (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique(fix_id, user_id, emoji)
);

alter table public.fix_reactions enable row level security;

drop policy if exists "Anyone can view reactions" on public.fix_reactions;
create policy "Anyone can view reactions" on public.fix_reactions for select using (true);
drop policy if exists "Authenticated users can add reactions" on public.fix_reactions;
create policy "Authenticated users can add reactions" on public.fix_reactions for insert with check (auth.uid() = user_id);
drop policy if exists "Users can remove own reactions" on public.fix_reactions;
create policy "Users can remove own reactions" on public.fix_reactions for delete using (auth.uid() = user_id);


-- =====================
-- 003: Following + Notifications
-- =====================
create table if not exists public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

alter table public.follows enable row level security;

drop policy if exists "Anyone can view follows" on public.follows;
create policy "Anyone can view follows" on public.follows for select using (true);
drop policy if exists "Users can follow others" on public.follows;
create policy "Users can follow others" on public.follows for insert with check (auth.uid() = follower_id);
drop policy if exists "Users can unfollow" on public.follows;
create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  actor_id uuid references public.profiles(id) on delete cascade,
  fix_id uuid references public.fixes(id) on delete cascade,
  emoji text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "System can insert notifications" on public.notifications;
create policy "System can insert notifications" on public.notifications for insert with check (true);
drop policy if exists "Users can mark own notifications read" on public.notifications;
create policy "Users can mark own notifications read" on public.notifications for update using (auth.uid() = user_id);


-- =====================
-- 004: Pro tier + Referrals
-- =====================
alter table public.profiles add column if not exists is_pro boolean default false;
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists referral_code text unique;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id);
alter table public.profiles add column if not exists referral_count int default 0;

create or replace function public.generate_referral_code()
returns trigger language plpgsql as $$
begin
  if new.referral_code is null then
    new.referral_code := lower(substring(new.id::text, 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists set_referral_code on public.profiles;
create trigger set_referral_code
  before insert on public.profiles
  for each row execute function public.generate_referral_code();

-- Backfill referral codes for existing profiles that don't have one
update public.profiles
set referral_code = lower(substring(id::text, 1, 8))
where referral_code is null;


-- =====================
-- 005: Lists
-- =====================
create table if not exists public.fix_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.fix_list_items (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references public.fix_lists(id) on delete cascade not null,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  note text,
  sort_order int default 0,
  added_at timestamptz default now(),
  unique(list_id, fix_id)
);

alter table public.fix_lists enable row level security;
alter table public.fix_list_items enable row level security;

drop policy if exists "Public lists viewable by everyone" on public.fix_lists;
create policy "Public lists viewable by everyone" on public.fix_lists for select using (is_public = true);
drop policy if exists "Users can view own lists" on public.fix_lists;
create policy "Users can view own lists" on public.fix_lists for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own lists" on public.fix_lists;
create policy "Users can insert own lists" on public.fix_lists for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own lists" on public.fix_lists;
create policy "Users can update own lists" on public.fix_lists for update using (auth.uid() = user_id);
drop policy if exists "Users can delete own lists" on public.fix_lists;
create policy "Users can delete own lists" on public.fix_lists for delete using (auth.uid() = user_id);

drop policy if exists "List items viewable if list is accessible" on public.fix_list_items;
create policy "List items viewable if list is accessible" on public.fix_list_items for select using (
  exists (select 1 from public.fix_lists where id = list_id and (is_public = true or user_id = auth.uid()))
);
drop policy if exists "Users can manage own list items" on public.fix_list_items;
create policy "Users can manage own list items" on public.fix_list_items for all using (
  exists (select 1 from public.fix_lists where id = list_id and user_id = auth.uid())
);


-- =====================
-- 006: Comments
-- =====================
create table if not exists public.fix_comments (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 500),
  created_at timestamptz default now()
);

alter table public.fix_comments enable row level security;

drop policy if exists "Comments on public fixes are viewable by everyone" on public.fix_comments;
create policy "Comments on public fixes are viewable by everyone"
  on public.fix_comments for select
  using (
    exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

drop policy if exists "Fix owners can read all comments on their fixes" on public.fix_comments;
create policy "Fix owners can read all comments on their fixes"
  on public.fix_comments for select
  using (
    exists (select 1 from public.fixes where id = fix_id and user_id = auth.uid())
  );

drop policy if exists "Logged in users can comment on public fixes" on public.fix_comments;
create policy "Logged in users can comment on public fixes"
  on public.fix_comments for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

drop policy if exists "Users can delete own comments" on public.fix_comments;
create policy "Users can delete own comments"
  on public.fix_comments for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can update own comments" on public.fix_comments;
create policy "Users can update own comments"
  on public.fix_comments for update
  using (auth.uid() = user_id);


-- =====================
-- 007: Tags
-- =====================
alter table public.fixes add column if not exists tags text[] not null default '{}';
create index if not exists fixes_tags_idx on public.fixes using gin(tags);


-- =====================
-- 008: Profile enhancements
-- =====================
alter table public.profiles
  add column if not exists pinned_fix_id uuid references public.fixes(id) on delete set null,
  add column if not exists banner_url text;


-- =====================
-- 009: Hyperfix Studio
-- =====================
create table if not exists public.fix_studio_blocks (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('note', 'link', 'image')),
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists fix_studio_blocks_fix_id_idx
  on public.fix_studio_blocks(fix_id);

alter table public.fix_studio_blocks enable row level security;

drop policy if exists "Owner can read own studio blocks" on public.fix_studio_blocks;
create policy "Owner can read own studio blocks"
  on public.fix_studio_blocks for select
  using (auth.uid() = user_id);

drop policy if exists "Studio blocks on public fixes are viewable by everyone" on public.fix_studio_blocks;
create policy "Studio blocks on public fixes are viewable by everyone"
  on public.fix_studio_blocks for select
  using (
    exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

drop policy if exists "Owner can insert studio blocks" on public.fix_studio_blocks;
create policy "Owner can insert studio blocks"
  on public.fix_studio_blocks for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fixes where id = fix_id and user_id = auth.uid())
  );

drop policy if exists "Owner can update own studio blocks" on public.fix_studio_blocks;
create policy "Owner can update own studio blocks"
  on public.fix_studio_blocks for update
  using (auth.uid() = user_id);

drop policy if exists "Owner can delete own studio blocks" on public.fix_studio_blocks;
create policy "Owner can delete own studio blocks"
  on public.fix_studio_blocks for delete
  using (auth.uid() = user_id);


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


-- =====================
-- Notification preferences
-- =====================
-- jsonb map of email + social notification toggles used by Settings and cron jobs
alter table public.profiles add column if not exists notification_prefs jsonb not null default '{}'::jsonb;


-- =====================
-- Storage buckets (avatars + banners)
-- =====================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('banners', 'banners', true)
on conflict (id) do nothing;

-- Anyone can view avatar / banner images
drop policy if exists "Public read profile images" on storage.objects;
create policy "Public read profile images"
  on storage.objects for select
  using (bucket_id in ('avatars', 'banners'));

-- Users can upload into their own folder (path = <user_id>/<file>)
drop policy if exists "Users can upload own profile images" on storage.objects;
create policy "Users can upload own profile images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('avatars', 'banners')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own profile images" on storage.objects;
create policy "Users can update own profile images"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('avatars', 'banners')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own profile images" on storage.objects;
create policy "Users can delete own profile images"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('avatars', 'banners')
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- =============================================================
-- DONE. Your Hyperfix database is fully set up.
-- =============================================================
