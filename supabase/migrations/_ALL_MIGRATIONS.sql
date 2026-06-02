-- ============================================================================
-- HYPERFIX — CONSOLIDATED MIGRATIONS (idempotent, safe to re-run)
-- Run this whole file against your Supabase project (SQL editor or psql).
-- Guards added: DROP POLICY IF EXISTS, CREATE TABLE/INDEX IF NOT EXISTS.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 001_init.sql
-- ----------------------------------------------------------------------------
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

-- RLS
alter table public.profiles enable row level security;
alter table public.fixes enable row level security;
alter table public.fix_entries enable row level security;

-- profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (is_public = true);
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- fixes policies
DROP POLICY IF EXISTS "Public fixes are viewable by everyone" ON public.fixes;
create policy "Public fixes are viewable by everyone" on public.fixes for select using (is_public = true);
DROP POLICY IF EXISTS "Users can view own fixes" ON public.fixes;
create policy "Users can view own fixes" on public.fixes for select using (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own fixes" ON public.fixes;
create policy "Users can insert own fixes" on public.fixes for insert with check (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own fixes" ON public.fixes;
create policy "Users can update own fixes" on public.fixes for update using (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own fixes" ON public.fixes;
create policy "Users can delete own fixes" on public.fixes for delete using (auth.uid() = user_id);

-- fix_entries policies
DROP POLICY IF EXISTS "Users can manage own entries" ON public.fix_entries;
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


-- ----------------------------------------------------------------------------
-- 002_reactions.sql
-- ----------------------------------------------------------------------------
create table if not exists public.fix_reactions (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique(fix_id, user_id, emoji)
);

alter table public.fix_reactions enable row level security;

DROP POLICY IF EXISTS "Anyone can view reactions" ON public.fix_reactions;
create policy "Anyone can view reactions" on public.fix_reactions for select using (true);
DROP POLICY IF EXISTS "Authenticated users can add reactions" ON public.fix_reactions;
create policy "Authenticated users can add reactions" on public.fix_reactions for insert with check (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can remove own reactions" ON public.fix_reactions;
create policy "Users can remove own reactions" on public.fix_reactions for delete using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 003_following.sql
-- ----------------------------------------------------------------------------
create table if not exists public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

alter table public.follows enable row level security;

DROP POLICY IF EXISTS "Anyone can view follows" ON public.follows;
create policy "Anyone can view follows" on public.follows for select using (true);
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
create policy "Users can follow others" on public.follows for insert with check (auth.uid() = follower_id);
DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'reaction' | 'follow'
  actor_id uuid references public.profiles(id) on delete cascade,
  fix_id uuid references public.fixes(id) on delete cascade,
  emoji text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
create policy "System can insert notifications" on public.notifications for insert with check (true);
DROP POLICY IF EXISTS "Users can mark own notifications read" ON public.notifications;
create policy "Users can mark own notifications read" on public.notifications for update using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 004_pro.sql
-- ----------------------------------------------------------------------------
-- Pro tier columns
alter table public.profiles add column if not exists is_pro boolean default false;
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;

-- Referral system columns
alter table public.profiles add column if not exists referral_code text unique;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id);
alter table public.profiles add column if not exists referral_count int default 0;

-- Auto-generate referral code on profile creation
create or replace function public.generate_referral_code()
returns trigger language plpgsql as $$
begin
  new.referral_code := lower(substring(new.id::text, 1, 8));
  return new;
end;
$$;

create or replace trigger set_referral_code
  before insert on public.profiles
  for each row execute function public.generate_referral_code();


-- ----------------------------------------------------------------------------
-- 005_lists.sql
-- ----------------------------------------------------------------------------
-- fix_lists
create table if not exists public.fix_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- fix_list_items (junction: a list contains fixes)
create table if not exists public.fix_list_items (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references public.fix_lists(id) on delete cascade not null,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  note text,
  sort_order int default 0,
  added_at timestamptz default now(),
  unique(list_id, fix_id)
);

-- RLS
alter table public.fix_lists enable row level security;
alter table public.fix_list_items enable row level security;

DROP POLICY IF EXISTS "Public lists viewable by everyone" ON public.fix_lists;
create policy "Public lists viewable by everyone" on public.fix_lists for select using (is_public = true);
DROP POLICY IF EXISTS "Users can view own lists" ON public.fix_lists;
create policy "Users can view own lists" on public.fix_lists for select using (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own lists" ON public.fix_lists;
create policy "Users can insert own lists" on public.fix_lists for insert with check (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own lists" ON public.fix_lists;
create policy "Users can update own lists" on public.fix_lists for update using (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own lists" ON public.fix_lists;
create policy "Users can delete own lists" on public.fix_lists for delete using (auth.uid() = user_id);

DROP POLICY IF EXISTS "List items viewable if list is accessible" ON public.fix_list_items;
create policy "List items viewable if list is accessible" on public.fix_list_items for select using (
  exists (select 1 from public.fix_lists where id = list_id and (is_public = true or user_id = auth.uid()))
);
DROP POLICY IF EXISTS "Users can manage own list items" ON public.fix_list_items;
create policy "Users can manage own list items" on public.fix_list_items for all using (
  exists (select 1 from public.fix_lists where id = list_id and user_id = auth.uid())
);


-- ----------------------------------------------------------------------------
-- 006_comments.sql
-- ----------------------------------------------------------------------------
create table if not exists public.fix_comments (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 500),
  created_at timestamptz default now()
);

alter table public.fix_comments enable row level security;

-- Anyone can read comments on public fixes
DROP POLICY IF EXISTS "Comments on public fixes are viewable by everyone" ON public.fix_comments;
create policy "Comments on public fixes are viewable by everyone"
  on public.fix_comments for select
  using (
    exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

-- Users can read comments on their own fixes
DROP POLICY IF EXISTS "Fix owners can read all comments on their fixes" ON public.fix_comments;
create policy "Fix owners can read all comments on their fixes"
  on public.fix_comments for select
  using (
    exists (select 1 from public.fixes where id = fix_id and user_id = auth.uid())
  );

-- Logged in users can comment on public fixes
DROP POLICY IF EXISTS "Logged in users can comment on public fixes" ON public.fix_comments;
create policy "Logged in users can comment on public fixes"
  on public.fix_comments for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

-- Users can delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON public.fix_comments;
create policy "Users can delete own comments"
  on public.fix_comments for delete
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 007_tags.sql
-- ----------------------------------------------------------------------------
-- Add tags array column to fixes (simple, queryable with @> operator)
alter table public.fixes add column if not exists tags text[] not null default '{}';

-- Index for tag lookups
create index if not exists fixes_tags_idx on public.fixes using gin(tags);


-- ----------------------------------------------------------------------------
-- 008_profile_enhancements.sql
-- ----------------------------------------------------------------------------
-- Pinned fix and profile banner
alter table public.profiles
  add column if not exists pinned_fix_id uuid references public.fixes(id) on delete set null,
  add column if not exists banner_url text;


-- ----------------------------------------------------------------------------
-- 009_studio.sql
-- ----------------------------------------------------------------------------
-- Hyperfix Studio: rich workspace blocks per fix
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

-- Owners can read their own studio blocks
DROP POLICY IF EXISTS "Owner can read own studio blocks" ON public.fix_studio_blocks;
create policy "Owner can read own studio blocks"
  on public.fix_studio_blocks for select
  using (auth.uid() = user_id);

-- Studio blocks on public fixes are viewable by everyone
DROP POLICY IF EXISTS "Studio blocks on public fixes are viewable by everyone" ON public.fix_studio_blocks;
create policy "Studio blocks on public fixes are viewable by everyone"
  on public.fix_studio_blocks for select
  using (
    exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

-- Owners can add blocks to their own fixes
DROP POLICY IF EXISTS "Owner can insert studio blocks" ON public.fix_studio_blocks;
create policy "Owner can insert studio blocks"
  on public.fix_studio_blocks for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fixes where id = fix_id and user_id = auth.uid())
  );

-- Owners can update their own blocks
DROP POLICY IF EXISTS "Owner can update own studio blocks" ON public.fix_studio_blocks;
create policy "Owner can update own studio blocks"
  on public.fix_studio_blocks for update
  using (auth.uid() = user_id);

-- Owners can delete their own blocks
DROP POLICY IF EXISTS "Owner can delete own studio blocks" ON public.fix_studio_blocks;
create policy "Owner can delete own studio blocks"
  on public.fix_studio_blocks for delete
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 010_pro_features.sql
-- ----------------------------------------------------------------------------
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


-- ----------------------------------------------------------------------------
-- 20260517000001_create_waitlist.sql
-- ----------------------------------------------------------------------------
create table if not exists waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       text        unique not null,
  source      text        not null default 'landing',
  created_at  timestamptz not null default now()
);

-- Enable RLS so the anon/authenticated roles can't touch this table.
-- The server action uses the service_role key, which bypasses RLS,
-- so no explicit policies are needed for writes. This is the lock.
alter table waitlist enable row level security;


-- ----------------------------------------------------------------------------
-- 2026_05_25_banner_url_on_fixes.sql
-- ----------------------------------------------------------------------------
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


-- ----------------------------------------------------------------------------
-- 2026_05_25_card_style_on_fixes.sql
-- ----------------------------------------------------------------------------
-- Adds a card_style column to fixes so users can save their preferred
-- share card template ("paper" | "dark" | "minimal" | "photo").
-- Run this in the Supabase SQL editor.

alter table public.fixes
  add column if not exists card_style text;

-- No default — when null, the route falls back to "photo" if banner_url is set,
-- otherwise "paper".


-- ----------------------------------------------------------------------------
-- 2026_05_25_messages.sql
-- ----------------------------------------------------------------------------
-- Conversations (deterministic pair: smaller_user_id, larger_user_id)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversations_pair_check check (user_a < user_b),
  unique (user_a, user_b)
);
create index if not exists conversations_user_a_idx on conversations(user_a);
create index if not exists conversations_user_b_idx on conversations(user_b);
create index if not exists conversations_last_msg_idx on conversations(last_message_at desc);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) > 0 and char_length(body) <= 2000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_id_idx on messages(conversation_id, created_at desc);

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

DROP POLICY IF EXISTS "Users can see their own conversations" ON conversations;
create policy "Users can see their own conversations"
  on conversations for select
  using (auth.uid() = user_a or auth.uid() = user_b);

DROP POLICY IF EXISTS "Users can create conversations they participate in" ON conversations;
create policy "Users can create conversations they participate in"
  on conversations for insert
  with check (auth.uid() = user_a or auth.uid() = user_b);

DROP POLICY IF EXISTS "Users can see messages in their conversations" ON messages;
create policy "Users can see messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.user_a = auth.uid() or conversations.user_b = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
create policy "Users can send messages in their conversations"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.user_a = auth.uid() or conversations.user_b = auth.uid())
    )
  );


-- ----------------------------------------------------------------------------
-- 2026_05_25_notification_prefs.sql
-- ----------------------------------------------------------------------------
-- Add notification_prefs JSONB column to profiles
-- Used to store per-user toggle settings for different notification categories
alter table public.profiles
  add column if not exists notification_prefs jsonb default '{}'::jsonb;


-- ----------------------------------------------------------------------------
-- 2026_05_25_push_subscriptions.sql
-- ----------------------------------------------------------------------------
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_id_idx on push_subscriptions(user_id);


-- ----------------------------------------------------------------------------
-- 2026_05_25_timezone_on_profiles.sql
-- ----------------------------------------------------------------------------
-- Adds timezone preference to profiles so daily/weekly reminder emails fire
-- at a sensible local time per user.
-- Default: UTC. Format: IANA timezone string (e.g. "America/Los_Angeles").

alter table public.profiles
  add column if not exists timezone text default 'UTC';

-- Backfill any null values
update public.profiles set timezone = 'UTC' where timezone is null;


-- ----------------------------------------------------------------------------
-- 2026_05_26_profiles_always_public.sql
-- ----------------------------------------------------------------------------
-- All profiles are public — remove the ability to go private
UPDATE profiles SET is_public = true WHERE is_public = false OR is_public IS NULL;


-- ----------------------------------------------------------------------------
-- 2026_05_29_focus_rooms.sql
-- ----------------------------------------------------------------------------
-- Focus rooms: body-doubling + Pomodoro + voice + Spotify

CREATE TABLE IF NOT EXISTS focus_rooms (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT        NOT NULL UNIQUE,          -- 6-char invite code
  name          TEXT        NOT NULL,
  owner_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  max_members   INT         NOT NULL DEFAULT 12,

  -- Pomodoro timer state (owner controls, synced to everyone)
  timer_state   JSONB       NOT NULL DEFAULT '{"mode":"focus","remaining":1500,"isRunning":false,"round":1}',

  -- Spotify integration (owner only)
  spotify_access_token   TEXT,
  spotify_refresh_token  TEXT,
  spotify_expires_at     TIMESTAMPTZ,
  current_track          JSONB,   -- {name,artist,albumArt,progressMs,durationMs,isPlaying,trackId}

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID        NOT NULL REFERENCES focus_rooms(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
  status      TEXT        NOT NULL DEFAULT 'focusing',  -- focusing | break | away
  task        TEXT        NOT NULL DEFAULT '',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS room_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID        NOT NULL REFERENCES focus_rooms(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
DO $$ BEGIN CREATE INDEX ON focus_rooms  (code); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON focus_rooms  (owner_id); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON room_members (room_id); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON room_members (user_id); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON room_messages(room_id, created_at); EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- RLS
ALTER TABLE focus_rooms   ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

-- focus_rooms: anyone authenticated can read active rooms they're in;
--              only owner can update; anyone can create
DROP POLICY IF EXISTS "rooms_select" ON focus_rooms;
CREATE POLICY "rooms_select" ON focus_rooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "rooms_insert" ON focus_rooms;
CREATE POLICY "rooms_insert" ON focus_rooms FOR INSERT WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "rooms_update" ON focus_rooms;
CREATE POLICY "rooms_update" ON focus_rooms FOR UPDATE USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "rooms_delete" ON focus_rooms;
CREATE POLICY "rooms_delete" ON focus_rooms FOR DELETE USING (auth.uid() = owner_id);

-- room_members: anyone can see membership; you manage your own row
DROP POLICY IF EXISTS "members_select" ON room_members;
CREATE POLICY "members_select" ON room_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "members_insert" ON room_members;
CREATE POLICY "members_insert" ON room_members FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "members_update" ON room_members;
CREATE POLICY "members_update" ON room_members FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "members_delete" ON room_members;
CREATE POLICY "members_delete" ON room_members FOR DELETE USING (auth.uid() = user_id);

-- room_messages: readable by all members, writable by authenticated users
DROP POLICY IF EXISTS "messages_select" ON room_messages;
CREATE POLICY "messages_select" ON room_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "messages_insert" ON room_messages;
CREATE POLICY "messages_insert" ON room_messages FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 2026_05_29_focus_rooms_visibility.sql
-- ----------------------------------------------------------------------------
-- Allow rooms to be discoverable (public) or invite-only (private)
ALTER TABLE focus_rooms ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS focus_rooms_discoverable_idx
  ON focus_rooms (is_active, is_private, last_activity DESC);


-- ----------------------------------------------------------------------------
-- 2026_05_31_adhd_features.sql
-- ----------------------------------------------------------------------------
-- ADHD toolkit tables: brain dump, mood log, RSD journal, medication tracker

-- Brain dump / task capture
CREATE TABLE IF NOT EXISTS brain_dump (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT        NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'inbox',   -- inbox | doing | done | parked
  energy_required TEXT        NOT NULL DEFAULT 'any',     -- low | medium | high | any
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- Daily mood / energy / focus check-in
CREATE TABLE IF NOT EXISTS mood_logs (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID  NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date       DATE  NOT NULL,
  energy     INT   NOT NULL CHECK (energy     BETWEEN 1 AND 10),
  focus      INT   NOT NULL CHECK (focus      BETWEEN 1 AND 10),
  mood       INT   NOT NULL CHECK (mood       BETWEEN 1 AND 10),
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- RSD journal (always private)
CREATE TABLE IF NOT EXISTS rsd_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trigger    TEXT NOT NULL,
  content    TEXT NOT NULL,
  intensity  INT  NOT NULL DEFAULT 5 CHECK (intensity BETWEEN 1 AND 10),
  reframe    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medication tracker
CREATE TABLE IF NOT EXISTS med_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medication    TEXT NOT NULL,
  dose          TEXT NOT NULL DEFAULT '',
  taken_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effect_rating INT  CHECK (effect_rating BETWEEN 1 AND 10),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
DO $$ BEGIN CREATE INDEX ON brain_dump  (user_id, status); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON brain_dump  (user_id, created_at DESC); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON mood_logs   (user_id, date DESC); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON rsd_entries (user_id, created_at DESC); EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN CREATE INDEX ON med_logs    (user_id, taken_at DESC); EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- RLS
ALTER TABLE brain_dump  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsd_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE med_logs    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brain_dump_own" ON brain_dump;
CREATE POLICY "brain_dump_own"  ON brain_dump  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "mood_logs_own" ON mood_logs;
CREATE POLICY "mood_logs_own"   ON mood_logs   USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "rsd_entries_own" ON rsd_entries;
CREATE POLICY "rsd_entries_own" ON rsd_entries USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "med_logs_own" ON med_logs;
CREATE POLICY "med_logs_own"    ON med_logs    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 2026_06_01_gamification.sql
-- ----------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────
-- Gamification: points ledger, levels, achievements, boosts, leaderboard
-- ─────────────────────────────────────────────────────────────

-- 1. Points balance on profiles (denormalised for cheap reads / leaderboard)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_points        INT     NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS leaderboard_opt_out BOOLEAN NOT NULL DEFAULT false;

-- Leaderboard ordering index
CREATE INDEX IF NOT EXISTS profiles_total_points_idx ON profiles (total_points DESC);

-- 2. Append-only points ledger
CREATE TABLE IF NOT EXISTS point_events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind          TEXT        NOT NULL,              -- check_in | new_fix | mood_log | task_done | med_log | rsd_entry | user_creation | achievement
  points        INT         NOT NULL,              -- final awarded amount (after multiplier)
  multiplier    NUMERIC     NOT NULL DEFAULT 1,
  ref_id        TEXT        NOT NULL,              -- natural idempotency key for the awarding action
  description   TEXT,
  balance_after INT,                               -- running total after this event (for history display)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotency: a given (user, kind, ref) can only ever award once
CREATE UNIQUE INDEX IF NOT EXISTS point_events_dedupe ON point_events (user_id, kind, ref_id);
CREATE INDEX IF NOT EXISTS point_events_user_time ON point_events (user_id, created_at DESC);

-- 3. Achievements catalog (shared) + per-user unlock state
CREATE TABLE IF NOT EXISTS achievements (
  id          TEXT    PRIMARY KEY,                 -- stable string key
  name        TEXT    NOT NULL,
  description TEXT,
  trigger     TEXT    NOT NULL DEFAULT 'metric',   -- metric | streak | api
  badge_url   TEXT,
  bonus       INT     NOT NULL DEFAULT 0,          -- points awarded on unlock
  rarity      NUMERIC,
  sort        INT     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT        NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- 4. Point boosts (time-boxed global multipliers)
CREATE TABLE IF NOT EXISTS point_boosts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  multiplier  NUMERIC     NOT NULL DEFAULT 2,
  starts_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at     TIMESTAMPTZ,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Atomic award function (idempotent). Returns the awarded amount + new balance.
CREATE OR REPLACE FUNCTION award_points(
  p_user        UUID,
  p_kind        TEXT,
  p_points      INT,
  p_multiplier  NUMERIC,
  p_ref         TEXT,
  p_description TEXT
)
RETURNS TABLE (awarded INT, balance_after INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  final_points INT := GREATEST(0, ROUND(p_points * COALESCE(p_multiplier, 1)))::int;
  new_total    INT;
BEGIN
  INSERT INTO point_events (user_id, kind, points, multiplier, ref_id, description)
  VALUES (p_user, p_kind, final_points, COALESCE(p_multiplier, 1), p_ref, p_description)
  ON CONFLICT (user_id, kind, ref_id) DO NOTHING;

  IF NOT FOUND THEN
    RETURN; -- already awarded; no-op
  END IF;

  UPDATE profiles
    SET total_points = COALESCE(total_points, 0) + final_points
    WHERE id = p_user
    RETURNING total_points INTO new_total;

  UPDATE point_events
    SET balance_after = new_total
    WHERE user_id = p_user AND kind = p_kind AND ref_id = p_ref;

  awarded := final_points;
  balance_after := new_total;
  RETURN NEXT;
END;
$$;

-- 6. RLS
ALTER TABLE point_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_boosts      ENABLE ROW LEVEL SECURITY;

-- Users read their own ledger; achievements catalog + boosts are public-read;
-- user_achievements are publicly readable (for profile badges + leaderboard flair).
DROP POLICY IF EXISTS point_events_own_select ON point_events;
DROP POLICY IF EXISTS point_events_own_select ON point_events;
CREATE POLICY point_events_own_select ON point_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS achievements_public ON achievements;
DROP POLICY IF EXISTS achievements_public ON achievements;
CREATE POLICY achievements_public ON achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS user_achievements_public ON user_achievements;
DROP POLICY IF EXISTS user_achievements_public ON user_achievements;
CREATE POLICY user_achievements_public ON user_achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS point_boosts_public ON point_boosts;
DROP POLICY IF EXISTS point_boosts_public ON point_boosts;
CREATE POLICY point_boosts_public ON point_boosts FOR SELECT USING (active = true);

-- Writes happen exclusively through the service-role admin client / award_points(),
-- so no INSERT/UPDATE policies are granted to anon/authenticated.

-- 7. Seed achievements (on-brand)
INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('first_fix',     'First Obsession',   'Log your very first hyperfixation.',                 'metric', 25,  60, 1),
  ('checkin_7',     'One Week In',        'Check in 7 days total.',                              'metric', 30,  45, 2),
  ('checkin_30',    'Deeply Unwell',      'Check in 30 days total.',                             'metric', 75,  20, 3),
  ('streak_7',      'On A Roll',          'Hit a 7-day check-in streak.',                        'streak', 40,  35, 4),
  ('streak_30',     'Feral',              'Hit a 30-day check-in streak.',                       'streak', 120, 8,  5),
  ('five_fixes',    'Chaos Mode',         'Have 5 active fixations at once.',                    'metric', 50,  25, 6),
  ('graveyard_3',   'Graveyard Keeper',   'Lay 3 fixations to rest.',                            'metric', 40,  30, 7),
  ('mood_10',       'Self-Aware',         'Log your mood 10 times.',                             'metric', 35,  30, 8),
  ('task_25',       'Brain Emptied',      'Complete 25 brain-dump tasks.',                       'metric', 45,  18, 9),
  ('points_1000',   'Clinically Obsessed','Reach 1,000 XP.',                                     'metric', 100, 10, 10)
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2026_06_02_streaks_monetization.sql
-- ----------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────
-- Forgiving streaks + streak freezes + Pro monetization hooks
-- ─────────────────────────────────────────────────────────────

-- Streak state lives on profiles (authoritative, forgiving)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak     INT  NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak     INT  NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin_date  DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes     INT  NOT NULL DEFAULT 2;  -- free users start with 2
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS freezes_refilled_on DATE;

-- Atomic, forgiving check-in. Consumes streak freezes to cover missed days.
-- Pro users get freezes auto-refilled to 5 once per calendar month.
CREATE OR REPLACE FUNCTION record_checkin(p_user UUID, p_today DATE)
RETURNS TABLE (current_streak INT, longest_streak INT, freezes INT, froze BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_date  DATE;
  cur        INT;
  longest    INT;
  frz        INT;
  refilled   DATE;
  is_pro_u   BOOLEAN;
  gap        INT;
  did_freeze BOOLEAN := false;
BEGIN
  SELECT last_checkin_date, profiles.current_streak, profiles.longest_streak,
         streak_freezes, freezes_refilled_on, COALESCE(is_pro, false)
    INTO last_date, cur, longest, frz, refilled, is_pro_u
    FROM profiles WHERE id = p_user FOR UPDATE;

  cur := COALESCE(cur, 0);
  longest := COALESCE(longest, 0);
  frz := COALESCE(frz, 0);

  -- Pro monthly freeze refill
  IF is_pro_u AND (refilled IS NULL OR date_trunc('month', refilled) <> date_trunc('month', p_today)) THEN
    frz := GREATEST(frz, 5);
    UPDATE profiles SET freezes_refilled_on = p_today WHERE id = p_user;
  END IF;

  IF last_date IS NULL THEN
    cur := 1;
  ELSIF last_date = p_today THEN
    NULL; -- already counted today
  ELSIF last_date > p_today THEN
    NULL; -- backdated, ignore
  ELSE
    gap := p_today - last_date;
    IF gap = 1 THEN
      cur := cur + 1;
    ELSE
      -- missed (gap - 1) days; spend freezes to keep the streak alive
      IF frz >= (gap - 1) THEN
        frz := frz - (gap - 1);
        cur := cur + 1;
        did_freeze := true;
      ELSE
        cur := 1;
      END IF;
    END IF;
  END IF;

  IF cur > longest THEN longest := cur; END IF;

  UPDATE profiles
    SET current_streak = cur,
        longest_streak = longest,
        streak_freezes = frz,
        last_checkin_date = GREATEST(COALESCE(last_checkin_date, p_today), p_today)
    WHERE id = p_user;

  current_streak := cur;
  longest_streak := longest;
  freezes := frz;
  froze := did_freeze;
  RETURN NEXT;
END;
$$;

-- Grant a one-off freeze (e.g. earned reward or admin gift)
CREATE OR REPLACE FUNCTION grant_freezes(p_user UUID, p_count INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE new_total INT;
BEGIN
  UPDATE profiles
    SET streak_freezes = COALESCE(streak_freezes, 0) + GREATEST(0, p_count)
    WHERE id = p_user
    RETURNING streak_freezes INTO new_total;
  RETURN new_total;
END;
$$;


-- ----------------------------------------------------------------------------
-- 2026_06_03_daily_quests.sql
-- ----------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────
-- Daily quests: 3 per user per day, generated server-side
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS daily_quests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  kind         TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  xp_reward    INT NOT NULL DEFAULT 10,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date, kind)
);

ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_quests_all" ON daily_quests;
CREATE POLICY "own_quests_all" ON daily_quests
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 2026_06_04_dopamine.sql
-- ----------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────
-- Dopamine hits: the core daily loop. One tap → a healthy dopamine
-- hit instead of a doomscroll. Drives XP + streak.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dopamine_hits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id TEXT        NOT NULL,
  category    TEXT        NOT NULL,    -- move | create | connect | reset | treat
  label       TEXT        NOT NULL,
  minutes     INT,
  energy      TEXT,                    -- low | med | high
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dopamine_hits_user_time ON dopamine_hits (user_id, created_at DESC);

ALTER TABLE dopamine_hits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dopamine_hits_own ON dopamine_hits;
DROP POLICY IF EXISTS dopamine_hits_own ON dopamine_hits;
CREATE POLICY dopamine_hits_own ON dopamine_hits
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dopamine-loop achievements
INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('dopamine_first', 'First Hit',           'Take your first dopamine hit instead of doomscrolling.', 'metric', 15,  70, 11),
  ('dopamine_25',    'Better Than The Feed','Choose 25 healthy dopamine hits.',                       'metric', 50,  30, 12),
  ('dopamine_100',   'Rewired',             'Choose 100 dopamine hits. Your brain learned a new path.','metric', 150, 12, 13)
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2026_06_05_walls.sql
-- ----------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────
-- Beat the Wall: task-initiation game. Name a dreaded task, shrink it
-- to a 2-minute first step, and we reward the moment you START — not
-- the finish. The "Wall of Awful" is the #1 ADHD pain point and almost
-- nobody gamifies it. Drives XP + a "walls broken" count.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS walls_broken (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task        TEXT        NOT NULL,           -- the dreaded task, in the user's words
  first_step  TEXT        NOT NULL,           -- the 2-minute step we generated
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS walls_broken_user_time ON walls_broken (user_id, created_at DESC);

ALTER TABLE walls_broken ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS walls_broken_own ON walls_broken;
DROP POLICY IF EXISTS walls_broken_own ON walls_broken;
CREATE POLICY walls_broken_own ON walls_broken
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wall-breaking achievements
INSERT INTO achievements (id, name, description, trigger, bonus, rarity, sort) VALUES
  ('wall_first', 'Wall Breaker',   'Start a task you''ve been dreading.',                'metric', 20,  60, 14),
  ('wall_10',    'Momentum',       'Break through 10 walls. Starting got easier.',      'metric', 60,  28, 15),
  ('wall_50',    'Unstoppable',    'Break 50 walls. The hardest part stopped being hard.','metric', 200, 10, 16)
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2026_06_06_signup_source.sql
-- ----------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────
-- Signup attribution: where did this player come from? Lets us compare
-- the hyperfixation hook vs. the game hook by signups AND retention.
-- First-touch: captured from ?ref / ?src / utm params on landing, set
-- once at account creation, never overwritten.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_source   TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_campaign TEXT;

CREATE INDEX IF NOT EXISTS profiles_signup_source ON profiles (signup_source);


-- ----------------------------------------------------------------------------
-- 2026_06_07_onboarding_goals.sql
-- ----------------------------------------------------------------------------
-- Onboarding: capture what each user wants help with, so the dashboard can
-- eventually prioritise the right tools. Free-form text[] of goal keys.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_goals       TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;


-- ----------------------------------------------------------------------------
-- 2026_06_08_focus_realtime.sql
-- ----------------------------------------------------------------------------
-- Enable Supabase Realtime (Postgres Changes) for focus rooms so the shared
-- timer and member presence push instantly instead of relying on polling.
--
-- REPLICA IDENTITY FULL ensures UPDATE/DELETE payloads include the full row
-- (needed for the client to react to timer_state and member changes).

ALTER TABLE focus_rooms  REPLICA IDENTITY FULL;
ALTER TABLE room_members REPLICA IDENTITY FULL;

-- Add the tables to the realtime publication (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'focus_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE focus_rooms;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'room_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
  END IF;
END $$;


-- ----------------------------------------------------------------------------
-- 2026_06_08_spotify_env_note.sql
-- ----------------------------------------------------------------------------
-- Spotify "now playing" integration for focus rooms.
--
-- No schema changes are required. The columns used by this feature already
-- exist on `focus_rooms` (added in 2026_05_29_focus_rooms.sql):
--
--   spotify_access_token   TEXT
--   spotify_refresh_token  TEXT
--   spotify_expires_at     TIMESTAMPTZ
--   current_track          JSONB  -- {name,artist,albumArt,progressMs,durationMs,isPlaying,trackId}
--
-- Required environment variables (set these in your deployment):
--
--   SPOTIFY_CLIENT_ID       -- from the Spotify developer dashboard
--   SPOTIFY_CLIENT_SECRET   -- from the Spotify developer dashboard
--   NEXT_PUBLIC_SITE_URL    -- e.g. https://hyperfix.app (used for the OAuth redirect)
--
-- Spotify app redirect URI to whitelist:
--   ${NEXT_PUBLIC_SITE_URL}/api/spotify/callback
--
-- This migration is intentionally a no-op documentation marker.

