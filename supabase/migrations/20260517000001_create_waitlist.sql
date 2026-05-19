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
