create table if not exists public.fix_reactions (
  id uuid default gen_random_uuid() primary key,
  fix_id uuid references public.fixes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique(fix_id, user_id, emoji)
);

alter table public.fix_reactions enable row level security;

create policy "Anyone can view reactions" on public.fix_reactions for select using (true);
create policy "Authenticated users can add reactions" on public.fix_reactions for insert with check (auth.uid() = user_id);
create policy "Users can remove own reactions" on public.fix_reactions for delete using (auth.uid() = user_id);
