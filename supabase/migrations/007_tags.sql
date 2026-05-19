-- Add tags array column to fixes (simple, queryable with @> operator)
alter table public.fixes add column if not exists tags text[] not null default '{}';

-- Index for tag lookups
create index if not exists fixes_tags_idx on public.fixes using gin(tags);
