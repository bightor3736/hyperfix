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

create policy "Public lists viewable by everyone" on public.fix_lists for select using (is_public = true);
create policy "Users can view own lists" on public.fix_lists for select using (auth.uid() = user_id);
create policy "Users can insert own lists" on public.fix_lists for insert with check (auth.uid() = user_id);
create policy "Users can update own lists" on public.fix_lists for update using (auth.uid() = user_id);
create policy "Users can delete own lists" on public.fix_lists for delete using (auth.uid() = user_id);

create policy "List items viewable if list is accessible" on public.fix_list_items for select using (
  exists (select 1 from public.fix_lists where id = list_id and (is_public = true or user_id = auth.uid()))
);
create policy "Users can manage own list items" on public.fix_list_items for all using (
  exists (select 1 from public.fix_lists where id = list_id and user_id = auth.uid())
);
