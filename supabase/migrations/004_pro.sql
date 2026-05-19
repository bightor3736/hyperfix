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
