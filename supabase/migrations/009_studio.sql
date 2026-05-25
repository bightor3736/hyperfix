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
create policy "Owner can read own studio blocks"
  on public.fix_studio_blocks for select
  using (auth.uid() = user_id);

-- Studio blocks on public fixes are viewable by everyone
create policy "Studio blocks on public fixes are viewable by everyone"
  on public.fix_studio_blocks for select
  using (
    exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

-- Owners can add blocks to their own fixes
create policy "Owner can insert studio blocks"
  on public.fix_studio_blocks for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fixes where id = fix_id and user_id = auth.uid())
  );

-- Owners can update their own blocks
create policy "Owner can update own studio blocks"
  on public.fix_studio_blocks for update
  using (auth.uid() = user_id);

-- Owners can delete their own blocks
create policy "Owner can delete own studio blocks"
  on public.fix_studio_blocks for delete
  using (auth.uid() = user_id);
