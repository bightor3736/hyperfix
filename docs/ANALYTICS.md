# Hyperfix — Funnel Analytics

First-party event tracking so every TikTok you post has a scoreboard. Events
land in the `analytics_events` table (service-role only) and also fire to
Vercel Analytics for the built-in dashboard.

## The funnel

```
signup → task_start (first=true)  →  return  →  share  →  checkout_start → upgrade
 (acct)        (activation)         (D1/D7)   (growth)        (intent)      (paid)
```

## Events

| event            | where fired                         | key props                          |
|------------------|-------------------------------------|------------------------------------|
| `signup`         | `app/auth/callback` (new account)   | `source`                           |
| `login`          | `app/auth/callback` (returning)     | `source`                           |
| `task_start`     | `POST /api/start`                   | `minutes`, `first`, `named`        |
| `share`          | `ShareStatsButton` (client)         | `surface` (native/download)        |
| `checkout_start` | `POST /api/stripe/checkout`         | —                                  |
| `upgrade`        | Stripe webhook (`checkout.completed`)| `amount`, `currency`              |

`signup` vs `login` is decided by the auth user's `created_at` (within 2 min of
now = new). `first` on `task_start` is true only for a user's very first start —
that's your **activation** number.

## Queries (run in Supabase SQL editor)

**Daily funnel, last 30 days**
```sql
select date_trunc('day', created_at)::date as day,
       count(*) filter (where event = 'signup')                              as signups,
       count(*) filter (where event = 'task_start' and (props->>'first')::bool) as activated,
       count(*) filter (where event = 'share')                               as shares,
       count(*) filter (where event = 'upgrade')                             as upgrades
from analytics_events
where created_at > now() - interval '30 days'
group by 1 order by 1 desc;
```

**Activation rate (signup → first start)**
```sql
with s as (select distinct user_id from analytics_events where event = 'signup'),
     a as (select distinct user_id from analytics_events
           where event = 'task_start' and (props->>'first')::bool)
select round(100.0 * count(a.user_id) / nullif(count(s.user_id), 0), 1) as activation_pct
from s left join a using (user_id);
```

**D1 / D7 return (started again the next day / within a week)**
```sql
with firsts as (
  select user_id, min(created_at) as first_start
  from analytics_events where event = 'task_start' group by 1
)
select
  round(100.0 * count(*) filter (where exists (
    select 1 from analytics_events e
    where e.user_id = f.user_id and e.event = 'task_start'
      and e.created_at >= f.first_start + interval '1 day'
      and e.created_at <  f.first_start + interval '2 day')) / count(*), 1) as d1_pct,
  round(100.0 * count(*) filter (where exists (
    select 1 from analytics_events e
    where e.user_id = f.user_id and e.event = 'task_start'
      and e.created_at >  f.first_start + interval '1 day'
      and e.created_at <= f.first_start + interval '7 day')) / count(*), 1) as d7_pct
from firsts f;
```

**Where signups come from (attribution)**
```sql
select coalesce(source, 'direct/unknown') as source, count(*) as signups
from analytics_events where event = 'signup'
group by 1 order by 2 desc;
```

**Checkout → paid conversion**
```sql
with c as (select distinct user_id from analytics_events where event = 'checkout_start'),
     u as (select distinct user_id from analytics_events where event = 'upgrade')
select round(100.0 * count(u.user_id) / nullif(count(c.user_id), 0), 1) as paid_conv_pct
from c left join u using (user_id);
```

## Notes

- Tracking is **best-effort**: it never blocks or breaks a user action. A
  failed insert is swallowed silently.
- Client events go through `POST /api/track`, which only accepts a whitelist
  (`share`, `checkout_start`) and attaches the user server-side — the body's
  identity is never trusted, so the funnel can't be spoofed.
- To add an event: add the name to `AnalyticsEvent` in `lib/analytics/server.ts`,
  fire it (server: `trackServer`, client: `track`), and document it here.
