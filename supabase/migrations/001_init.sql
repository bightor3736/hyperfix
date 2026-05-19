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
create policy "Public profiles are viewable by everyone" on public.profiles for select using (is_public = true);
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- fixes policies
create policy "Public fixes are viewable by everyone" on public.fixes for select using (is_public = true);
create policy "Users can view own fixes" on public.fixes for select using (auth.uid() = user_id);
create policy "Users can insert own fixes" on public.fixes for insert with check (auth.uid() = user_id);
create policy "Users can update own fixes" on public.fixes for update using (auth.uid() = user_id);
create policy "Users can delete own fixes" on public.fixes for delete using (auth.uid() = user_id);

-- fix_entries policies
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
