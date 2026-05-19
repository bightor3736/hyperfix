create table if not exists public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

alter table public.follows enable row level security;

create policy "Anyone can view follows" on public.follows for select using (true);
create policy "Users can follow others" on public.follows for insert with check (auth.uid() = follower_id);
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
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (true);
create policy "Users can mark own notifications read" on public.notifications for update using (auth.uid() = user_id);
