create table if not exists public.fix_comments (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) >= 1 and char_length(content) <= 500),
  created_at timestamptz default now()
);

alter table public.fix_comments enable row level security;

-- Anyone can read comments on public fixes
create policy "Comments on public fixes are viewable by everyone"
  on public.fix_comments for select
  using (
    exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

-- Users can read comments on their own fixes
create policy "Fix owners can read all comments on their fixes"
  on public.fix_comments for select
  using (
    exists (select 1 from public.fixes where id = fix_id and user_id = auth.uid())
  );

-- Logged in users can comment on public fixes
create policy "Logged in users can comment on public fixes"
  on public.fix_comments for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fixes where id = fix_id and is_public = true)
  );

-- Users can delete their own comments
create policy "Users can delete own comments"
  on public.fix_comments for delete
  using (auth.uid() = user_id);
