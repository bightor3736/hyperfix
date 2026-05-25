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

create policy "Users can see their own conversations"
  on conversations for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can create conversations they participate in"
  on conversations for insert
  with check (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can see messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.user_a = auth.uid() or conversations.user_b = auth.uid())
    )
  );

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
