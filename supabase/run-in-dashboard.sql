-- Run this entire file in the Supabase SQL Editor:
-- supabase.com/dashboard → your project → SQL Editor → paste → Run

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

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'fix_reactions' and policyname = 'Anyone can view reactions') then
    create policy "Anyone can view reactions" on public.fix_reactions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'fix_reactions' and policyname = 'Authenticated users can add reactions') then
    create policy "Authenticated users can add reactions" on public.fix_reactions for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'fix_reactions' and policyname = 'Users can remove own reactions') then
    create policy "Users can remove own reactions" on public.fix_reactions for delete using (auth.uid() = user_id);
  end if;
end $$;

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

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'follows' and policyname = 'Anyone can view follows') then
    create policy "Anyone can view follows" on public.follows for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'follows' and policyname = 'Users can follow others') then
    create policy "Users can follow others" on public.follows for insert with check (auth.uid() = follower_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'follows' and policyname = 'Users can unfollow') then
    create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);
  end if;
end $$;

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

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'Users can view own notifications') then
    create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'System can insert notifications') then
    create policy "System can insert notifications" on public.notifications for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'Users can mark own notifications read') then
    create policy "Users can mark own notifications read" on public.notifications for update using (auth.uid() = user_id);
  end if;
end $$;

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
