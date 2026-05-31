# Hyperfix — Master Plan: Becoming the #1 ADHD App

> The goal: go from "impressively feature-rich" to "the category-defining ADHD app."
> The foundation is already strong. This plan is about **polish, retention, and
> differentiation** — not rebuilding.

---

## Where we are today (honest assessment)

**Already built and working:**
- Core hyperfixation tracking (fixes, daily check-ins, intensity, day-counter, graveyard)
- 4 ADHD tools: Brain Dump, Mood Log, RSD Journal, Medication Tracker
- Focus Rooms (body-doubling, synced Pomodoro, Spotify, room chat)
- Full social graph: public profiles, follow, explore, comments, reactions, DMs
- Gamification: streaks, heatmaps, Wrapped, referrals
- Monetization: Stripe Pro tier, AI eulogies (Claude Haiku)
- Infra: Supabase + RLS, Resend email, web push, PWA service worker, ~30 SEO pages

**The real gaps (what's holding it back):**
| Area | Score | Problem |
|---|---|---|
| Design consistency | 5.5/10 | Hardcoded dark-theme colors leak through dashboard/room/brand pages |
| Onboarding | 7/10 | No guided first-run; users don't learn what "fixes" or the ADHD tools are for |
| Performance | 6/10 | 32 client components, thin Suspense, raw `<img>`, zero error boundaries |
| Accessibility | 6.5/10 | Icon buttons lack labels, contrast risks, divs-as-buttons |
| Testing | 1/10 | **Zero tests.** A rebrand can silently break flows |
| Stubbed features | — | Wrapped (mock data), Studio blocks (no UI), tags (no editor), search (minimal) |

---

## The strategy in one sentence

**Win on capture friction + dopamine retention + a social identity layer no competitor has** —
then make it flawless on mobile and trustworthy enough that clinicians recommend it.

ADHD apps die for one of three reasons: (1) logging is too much work, (2) they get
boring after the novelty, (3) they feel like a chore/guilt machine. Every phase below
attacks one of those.

---

## PHASE 0 — Stop the bleeding (Week 1–2) · *Foundation*

Non-negotiable cleanup that everything else depends on.

- [ ] **Design token sweep.** Add semantic tokens to `globals.css`: `--danger`,
      `--warning`, `--success`, `--info` (+ `-soft` variants). Regex-audit every
      `style={{}}` for hardcoded hex/rgba and migrate. Worst offenders:
      `app/room/[code]/RoomClient.tsx`, `app/dashboard/page.tsx`,
      `app/onboarding/username/page.tsx`, `app/brand/post/adhd-slides/page.tsx`.
- [ ] **Error boundaries.** Add `error.tsx` to `app/dashboard/`, `app/room/`, and
      root. One broken component currently kills the whole subtree.
- [ ] **Image optimization.** Replace ~8 raw `<img>` with `next/image` (or at minimum
      `loading="lazy"` + width/height) in FixComments, MessageThread, banner pickers.
- [ ] **Testing harness.** Add Vitest + React Testing Library + Playwright. Write
      smoke tests for: signup → onboarding → create fix → check in. This is the
      single highest-leverage investment — it makes every future change safe.
- [ ] **CI.** GitHub Action: lint + typecheck + test + build on every PR.

---

## PHASE 1 — The capture experience (Week 3–5) · *Beat friction*

The #1 reason ADHD apps fail. Logging must take <3 seconds or it won't happen.

- [ ] **Universal quick-capture.** A global `⌘K` / floating-action "+" that captures a
      brain-dump, mood, or new fix from anywhere, including a one-tap mood slider.
- [ ] **Frictionless daily check-in.** One screen, swipe-able, that batches all active
      fixes + mood + meds into a 10-second ritual. Push notification deep-links here.
- [ ] **Voice capture.** Hold-to-talk brain dump (Web Speech API → transcript). ADHD
      users think faster than they type; this is a genuine differentiator.
- [ ] **Smart defaults & resume.** Remember last category, pre-fill start date as today,
      "continue where you left off" banner.
- [ ] **Offline-first capture.** Service worker already exists — queue captures offline
      and sync. ADHD brains capture on the subway.

---

## PHASE 2 — Onboarding & first-run (Week 4–6) · *Activation*

Turn signups into day-7 retained users.

- [ ] **Interactive onboarding.** Replace the thin username step with a 4-screen flow:
      (1) "what's got your brain right now?" → creates first fix live,
      (2) pick your ADHD tools (toggle which of the 4 tools to surface),
      (3) set a daily check-in time → schedules the push,
      (4) optional: find people tracking the same thing.
- [ ] **Empty-state coaching.** Every tool page gets a warm, specific empty state that
      explains *why an ADHD brain benefits* (RSD journal especially).
- [ ] **Progressive disclosure.** Don't show all 11 sidebar items on day one. Reveal
      tools as the user engages. Reduces overwhelm (core ADHD design principle).
- [ ] **"Aha" moment instrumentation.** Define activation = first check-in within 24h.
      Track funnel: signup → fix created → first check-in → day-3 return.

---

## PHASE 3 — Dopamine & retention loops (Week 6–9) · *Don't get boring*

- [ ] **Wrapped, for real.** Ship live Wrapped with actual user data (currently mock).
      Make it monthly, not just annual — "your November in fixations," shareable card.
      This is your biggest viral lever.
- [ ] **Streaks that forgive.** ADHD-friendly streaks: "streak freezes," grace days,
      and *never* a shaming reset-to-zero. Celebrate comebacks, not just streaks.
- [ ] **Milestone moments.** Animated celebration at 7/30/100/365 days on a fix
      (confetti, shareable card, optional AI "love letter to your obsession").
- [ ] **Variable-reward home.** Rotate the dashboard hero: sometimes a stat, sometimes
      a memory ("one year ago you were obsessed with…"), sometimes a prompt. Novelty
      is retention for ADHD.
- [ ] **Gentle nudges, not nags.** Smart notification timing based on the user's set
      check-in time + behavior; easy snooze; never guilt-trip copy.

---

## PHASE 4 — Differentiated ADHD features (Week 8–14) · *The moat*

Things competitors (Daylio, Finch, Inflow, Tiimo) don't have.

- [ ] **Hyperfixation graph / identity layer.** Your unique angle. "You've had 47
      fixations. Here's the map of your brain over time." Patterns, recurring themes,
      seasonal trends. Nobody else owns "track your obsessions as identity."
- [ ] **Body-doubling at scale.** Promote Focus Rooms hard — public drop-in rooms,
      scheduled sessions, "focus with 200 others right now." This is a top-requested
      ADHD feature and you already have the engine.
- [ ] **Task → dopamine bridge.** Connect brain dump to fixes: "turn this task into a
      fixation" / gamify boring tasks by attaching them to a current obsession.
- [ ] **Time-blindness toolkit.** Expand the timer: visual time (analog countdown),
      "time since you started" ambient clock, transition warnings.
- [ ] **RSD support flows.** Beyond journaling: in-the-moment reframe prompts, a
      "rejection panic button" with grounding exercises. Deeply differentiated.
- [ ] **Clinician/coach mode (later).** Shareable read-only reports of mood/med/pattern
      data for therapists. Opens B2B2C distribution.

---

## PHASE 5 — Mobile & native feel (Week 10–16) · *Where ADHD users live*

- [ ] **PWA → installable, app-like.** Polish the existing PWA: splash, offline,
      home-screen install prompts, haptics on key actions.
- [ ] **Native wrapper (Capacitor or Expo).** Ship to App Store / Play Store for real
      push, widgets, and discoverability. ADHD users search app stores, not Google.
- [ ] **Home-screen widgets.** "Days since" counter widget, one-tap check-in widget.
      Widgets are *enormous* for ADHD (out of sight = out of mind).
- [ ] **Lock-screen / live-activity timer** for focus sessions.

---

## PHASE 6 — Trust, accessibility, scale (ongoing) · *Credibility*

- [ ] **WCAG 2.1 AA.** Aria labels on all icon buttons, focus-visible everywhere,
      verified contrast, full keyboard nav, screen-reader pass.
- [ ] **Accessibility *as a feature*.** Dyslexia-friendly font option, reduced-motion
      mode (partly done), ADHD-friendly "focus mode" that hides everything but one task.
- [ ] **Privacy posture.** RSD/mood/med data is sensitive. Loud, clear privacy story;
      data export (exists) + delete (exists) front-and-center; consider E2E for journals.
- [ ] **Performance budget.** Move dashboard to mostly-server components, granular
      Suspense, < 2.5s LCP on mid-tier mobile.
- [ ] **Observability.** Error tracking (Sentry), product analytics (PostHog) for the
      activation/retention funnels defined in Phase 2.

---

## PHASE 7 — Growth & distribution (ongoing) · *Get big*

- [ ] **Viral share loops.** Every Wrapped, milestone, and graveyard eulogy = a
      beautiful shareable card with a watermark. You already generate OG cards — make
      sharing one tap and gorgeous.
- [ ] **SEO engine.** You have ~30 comparison/tracker pages already. Double down:
      programmatic "{interest} tracker" pages, an ADHD content blog, the quiz as a
      top-of-funnel magnet.
- [ ] **Community.** Public profiles + explore + rooms already make this a network.
      Lean in: weekly themed fixation challenges, leaderboards (opt-in), creator profiles.
- [ ] **Referral upgrade.** The system exists; make the reward compelling (free Pro
      month per referral) and the share surface unavoidable.

---

## Suggested sequencing (if I had to pick)

1. **Phase 0** first, always (2 weeks). Nothing is safe to build on otherwise.
2. **Phase 1 + 2 in parallel** (capture + onboarding) — biggest retention ROI.
3. **Phase 3** (real Wrapped + forgiving streaks) — biggest growth ROI.
4. **Phase 4** differentiators to build the moat.
5. **Phase 5** native/mobile once web is flawless.
6. **6 & 7** run continuously throughout.

---

## What I'd do *this week* if you say go

1. Design-token sweep + error boundaries + image fixes (Phase 0 quick wins).
2. Stand up Vitest + Playwright + a CI workflow with smoke tests.
3. Ship the real-data Wrapped (highest-visibility, already 80% there).
4. Build the universal quick-capture (`⌘K` / FAB) — the single biggest UX upgrade.

Tell me which thread to pull and I'll start.
