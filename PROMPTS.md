# Hyperfix — Claude Design Prompts

Copy-paste any of these into a new Claude conversation.
Each prompt is self-contained — no need to paste DESIGN.md separately.

---

## 1. New landing section

```
Design a new landing page section for Hyperfix — an ADHD accountability app with game mechanics (XP, streaks, hyperfixation tracker, dopamine roll, focus rooms). The visual language: warm + forgiving, not cold SaaS, not gamified-casino. References: Linear density × Tiimo warmth.

**The section:** [DESCRIBE WHAT THIS SECTION SHOULD COMMUNICATE]

**Design system:**
- Fonts: `font-display` (Fraunces) for headlines, `font-mono` (JetBrains Mono) for eyebrows/labels, `font-sans` (Lexend) for body
- Colors via CSS vars only — never raw hex: `var(--accent)` teal, `var(--ink)` / `var(--ink-muted)` / `var(--ink-faint)` for text, `var(--bg)` / `var(--bg-soft)` / `var(--bg-elevated)` for surfaces, `var(--line)` for borders, `var(--flame)` coral for streaks, `var(--pastel-purple/pink/blue/green)` for icon tints
- Radius: `rounded-[var(--radius-xl)]` (28px) for large blocks, `rounded-[var(--radius-lg)]` (20px) for cards, `rounded-full` for pills
- Section padding: `px-6 py-24 sm:px-10 sm:py-28`, max-width `max-w-[1100px] mx-auto`
- Animations: `anim-fadeUp delay-100/200/300`, `anim-shimmer` (XP bars), `anim-pulseDot` (live dots), `press-pop` on interactive elements, `glass` for translucent surfaces
- Scroll reveal: wrap content in `<Reveal>` (delay prop for stagger)

**Section structure:**
```tsx
<section id="slug" style={{ background: "var(--bg)" }}>
  <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
    <Reveal>
      <div className="max-w-[600px] mb-14">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Eyebrow</p>
        <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
          <span className="text-ink">Headline </span><span className="text-game-gradient">accent.</span>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">Body copy.</p>
      </div>
    </Reveal>
    {/* content */}
  </div>
</section>
```

**Rules:**
- One `text-game-gradient` span max per section
- No fake stats, no fabricated user quotes
- Mock UI cards: `background: var(--bg-elevated), border: 1px solid var(--line)`
- All CTAs → `/auth/signup`
- Sections alternate `var(--bg)` and `var(--bg-soft)`
- Use `<Reveal delay={80}>` to stagger siblings

Write the full TSX component. "use client" only if it needs useState/useEffect.
```

---

## 2. Feature showcase (ModuleShell pattern)

```
Design a feature block for Hyperfix using the ModuleShell pattern — a 2-column section (text left, product mock right) that alternates flip direction between modules.

**Feature to showcase:** [DESCRIBE THE FEATURE]
**Icon:** [LUCIDE ICON NAME]
**Pastel tint:** [var(--pastel-purple/pink/blue/green/orange)]
**Flip (mock on left):** [true/false]

Design system (use CSS vars only):
- `var(--accent)` teal, `var(--bg-elevated)` card bg, `var(--line)` borders
- `var(--pastel-*)` for icon backgrounds (these are dark muted tints in dark mode, soft pastels in light)
- Radius: `var(--radius-xl)` blocks, `var(--radius-lg)` cards, `rounded-full` pills
- Fonts: `font-display` headlines, `font-mono text-[10px] uppercase tracking-widest` for labels, `font-sans` body

ModuleShell template:
```tsx
<ModuleShell
  icon={IconName}
  tint="var(--pastel-purple)"
  eyebrow="Feature name"
  title={<>Headline with <span style={{ color: "var(--accent)" }}>accent.</span></>}
  body="One or two sentences. ADHD-specific, honest, no generic productivity speak."
  flip={false}
>
  {/* Product mock — realistic, uses real app data structures */}
  <MockCard>...</MockCard>
</ModuleShell>
```

The product mock inside should look like the actual Hyperfix UI:
- Mono labels `text-[10px] uppercase tracking-widest text-ink-faint`
- Data rows with `border-t border-line`
- XP bars: `h-2 rounded-full` with `background: linear-gradient(90deg, var(--accent), var(--xp))`
- Accent chips: `bg-accent-soft text-accent rounded-full px-2.5 py-1 font-mono text-[10px]`
- Buttons: `bg-invert-bg text-invert-ink rounded-[var(--radius-lg)] py-3 font-bold`

No placeholder lorem ipsum. Use realistic Hyperfix data: hyperfixation names, XP values, streak counts, level names (Mildly Curious → Interested → Invested → Hooked → Unwell → Feral → Clinically Obsessed).

Write the full TSX for this ModuleShell block.
```

---

## 3. Dashboard card component

```
Design a React component for the Hyperfix dashboard. Hyperfix is an ADHD accountability app — warm, forgiving, game-like but not casino-y.

**Component:** [DESCRIBE WHAT THIS CARD SHOWS/DOES]

Design system:
- CSS vars only: `var(--bg-elevated)` surface, `var(--line)` border, `var(--accent)` teal, `var(--ink/ink-muted/ink-faint)` text, `var(--flame)` coral for streaks/urgency, `var(--xp)` for XP
- `rounded-[var(--radius-xl)]` (28px) outer, `rounded-[var(--radius-lg)]` (20px) inner cards
- Fonts: `font-display` for big numbers, `font-mono text-[10px] uppercase tracking-widest` for labels, `font-sans` for body
- `press-pop` class on all clickable elements
- XP bar pattern: `h-2.5 rounded-full overflow-hidden` outer, gradient fill with `anim-shimmer` class
- Live/active state: `anim-pulseDot` on dot indicators
- Empty state: use `var(--pastel-*)` tinted background with friendly ADHD-aware copy ("Nothing here yet — that's fine.")

Props interface first, then the component. "use client" if interactive.

Rules:
- No arbitrary Tailwind colors (`bg-teal-500`, `text-gray-400`) — only CSS vars
- No decorative icons that don't convey information
- Error/empty states must be warm and non-shaming
```

---

## 4. Pricing section

```
Redesign the pricing section for Hyperfix — an ADHD accountability app, $0 free forever / $5/mo or $3.25/mo yearly (billed $39/yr).

**Free tier includes:** Unlimited dopamine rolls, hyperfixation log + proof of action, daily quests + XP + 7 levels, 1 streak freeze/month, focus rooms (body doubling), share card + custom accent colour, jackpot rewards.

**Power-Up (Pro) adds:** 5 streak freezes/month, boosted jackpot odds, XP multipliers + boosts, premium profile themes, full stats + history + insights, priority access to new features.

**30-day full refund on Power-Up. No credit card for Free.**

Design principles:
- Clean, minimal — no glowing borders, no decorative badges, no "Popular 🔥" chip
- The Power-Up card is distinguished by an accent border (`border: 1px solid var(--accent)`) — nothing more
- Billing toggle (monthly/yearly): inline, compact, no tabs
- Comparison table at the bottom is useful — keep it but keep it tight
- Tone: honest. "Cancel anytime" not "Risk-free". "Everything in Free, plus:" not "Unlock premium features"

Design system (CSS vars only):
- Surfaces: `var(--bg-elevated)` cards on `var(--bg-soft)` section background
- `var(--accent)` teal for primary CTA button and accent card border
- `var(--invert-bg/invert-ink)` for the free tier CTA button
- `rounded-[var(--radius-xl)]` cards, `rounded-full` buttons and toggle pills
- Font: `font-display` for price numbers and tier names, `font-sans` for features, `font-mono text-[10px]` for labels

Write the full TSX component with useState for billing toggle. No lucide icons on tier headers.
```

---

## 5. Empty state

```
Design an empty state component for Hyperfix — an ADHD accountability app. Empty states here are warm and non-shaming. ADHD users already feel enough guilt; an empty state should feel like a gentle nudge, not a blank white void.

**Context:** [WHERE IS THIS EMPTY STATE? e.g. "fixation list", "achievement badges", "streak history", "focus room — no one else is here"]

**Primary action:** [WHAT SHOULD THEY DO NEXT? e.g. "Log your first fixation", "Join a room"]

Design rules:
- No sad illustrations or grey placeholders
- Copy should be warm, specific to ADHD experience, occasionally wry
- Background: `var(--pastel-purple)` or `var(--pastel-green)` tinted container (soft, not harsh)
- Icon: one lucide icon, `var(--accent)` color, `size={32} strokeWidth={1.5}`
- Headline: `font-display text-[22px]` — speaks to the ADHD experience of this blank state
- Sub-copy: `text-[14px] text-ink-muted` — one sentence max, actionable
- CTA button: `press-pop`, accent filled, rounded-full
- Max width: `max-w-[360px] mx-auto text-center`
- No border on the container — just the tinted background and `rounded-[var(--radius-xl)] p-8`

Write the TSX. Accept an optional `onAction` callback prop.
```

---

## 6. Stats / XP display widget

```
Design a stats widget for Hyperfix. It shows a user's current XP, level, streak, and recent activity.

**Data shape:**
```ts
interface StatsProps {
  xp: number           // e.g. 520
  xpToNext: number     // e.g. 900
  level: number        // 1–7
  levelName: string    // "Mildly Curious" | "Interested" | "Invested" | "Hooked" | "Unwell" | "Feral" | "Clinically Obsessed"
  streak: number       // days
  hits: number         // total verified actions
  badges: number       // count of unlocked badges
}
```

Design system:
- `font-display` for big numbers, `font-mono text-[10px] uppercase tracking-widest text-ink-faint` for labels
- `var(--accent)` / `var(--xp)` teal for XP bar and level chip
- `var(--flame)` coral for streak number and flame icon
- XP bar: `h-2.5 rounded-full`, gradient fill `linear-gradient(90deg, var(--accent), var(--xp))` with `anim-shimmer`
- Stat tiles: `rounded-[var(--radius-lg)] px-4 py-3 bg-bg border border-line flex flex-col items-center gap-1`
- Level badge: `rounded-full px-2.5 py-1 bg-xp-soft text-xp font-mono text-[11px]` with `<Zap size={12} fill="currentColor" />`

Make it compact enough to embed in a sidebar or profile card. Write the full TSX.
```

---

## 7. Profile public page

```
Design the public profile page for Hyperfix (/u/[username]). This is a shareable player card — like a game profile, not a LinkedIn.

**Data available:**
- username, display_name, avatar_url, banner_url
- level (1–7), level_name, xp, streak, hits (total actions), badge_count
- pronouns, status_emoji, status_text
- profile_theme (CSS background string), accent_color (hex)
- socials: { instagram, tiktok, x, youtube, github, discord, website }
- recent_fixes: array of { title, category, days_in, is_active }

**Visual language:**
- The profile background uses the user's `profile_theme` (a CSS background string)
- All card content uses `bg-bg-elevated/80 backdrop-blur` to float over the theme bg
- Avatar: large rounded-2xl with a colored initial fallback using the accent color
- Level badge inline with username using `anim-pulseDot` live dot if streak is active
- Status pill: `bg-accent-soft border border-accent rounded-full px-3 py-1.5` with emoji + text
- Stats row: flame streak | zap hits | trophy badges — clean horizontal strip
- Recent fixes as a compact list (not a grid)
- Social chips at the bottom: icon + label, `rounded-full bg-bg border border-line`

Design system: CSS vars + `var(--accent)` for the user's accent. No hardcoded colors except for the theme background itself.

Write the full TSX. The component receives all props — no data fetching inside.
```

---

## 8. Onboarding step

```
Design an onboarding step component for Hyperfix. Onboarding should feel like being welcomed into a game, not filling out a form. Warm, low-friction, ADHD-aware.

**This step:** [DESCRIBE WHAT THE USER IS SETTING UP — e.g. "Pick 1–3 things you want to track right now", "Set your daily check-in time", "Choose what streak freezes mean to you"]

**Step N of M:** [e.g. "2 of 4"]

Design principles:
- Full-page centered layout, max-w-[440px], generous padding
- Progress bar at the top: `h-1 bg-line rounded-full` with filled portion in `var(--accent)`
- Headline: `font-display text-[30px] leading-[1.1] tracking-tight text-ink`
- Sub-copy: `text-[15px] text-ink-muted` — one sentence, human, no jargon
- Interactive element in the middle (picker, cards, toggle — whatever fits the step)
- "Continue" CTA: full-width `h-12 bg-accent text-accent-ink rounded-full font-semibold press-pop`
- Skip link below: `text-[13px] text-ink-faint hover:text-ink-muted`
- Background: `var(--bg)` with a subtle teal radial glow at top (`radial-gradient(ellipse 60% 40% at 50% -10%, rgba(45,212,191,0.12), transparent 60%)`)

No modal framing — full page. Write the TSX. Props: `onContinue`, `onSkip`, and whatever data props the step needs.
```

---

## 9. Modal / bottom sheet

```
Design a modal (desktop) / bottom sheet (mobile) component for Hyperfix.

**What it contains:** [DESCRIBE THE MODAL PURPOSE — e.g. "Confirm archiving a hyperfixation", "Add a new fixation", "Streak freeze used — show feedback"]

Design rules:
- Desktop: centered dialog, max-w-[480px], `rounded-[var(--radius-xl)]`, `bg-bg-elevated`, `border border-line`, subtle `box-shadow: 0 24px 60px -20px rgba(0,0,0,0.5)`
- Mobile: bottom sheet, `rounded-t-[var(--radius-xl)]`, slides up with `anim-slideUp`
- Backdrop: `bg-ink/40 backdrop-blur-sm`
- Header: icon (32px, `var(--pastel-*)` bg) + title `font-display text-[22px]` + close button
- Body: `text-[15px] text-ink-muted leading-[1.6]`
- Actions: 2-button row — primary `bg-accent text-accent-ink rounded-full press-pop`, secondary `border border-line text-ink-muted rounded-full`
- Destructive action (if applicable): `bg-flame text-white` not `bg-red-500`

Write the TSX. Accept `open`, `onClose`, and action callback props. Use a portal via `createPortal` if needed.
```

---

## 10. Fix (hyperfixation) card

```
Design a fixation card component for the Hyperfix dashboard. A "fix" is one thing a user is currently obsessed with — it has intensity, a check-in streak, category, and proof-of-action history.

**Data shape:**
```ts
interface FixCardProps {
  id: string
  title: string           // e.g. "Japanese vocab"
  category: string        // e.g. "Learning"
  daysIn: number          // how long this fixation has been active
  intensity: 1 | 2 | 3 | 4 | 5  // self-rated
  lastCheckedIn: string | null    // ISO date
  proofCount: number      // total verified check-ins
  isActive: boolean
  onCheckIn: () => void
  onArchive: () => void
}
```

Visual design:
- Card: `bg-bg-elevated border border-line rounded-[var(--radius-xl)] p-5`
- Title: `font-display text-[20px] leading-tight text-ink`
- Category chip: `font-mono text-[10px] uppercase tracking-widest bg-bg border border-line rounded-full px-2.5 py-1 text-ink-muted`
- Days in: `font-mono text-[11px] text-ink-faint`
- Intensity bars: 5 small `h-4 w-1.5 rounded-full` bars, filled = `var(--accent)`, empty = `var(--line)`
- Check-in CTA: `press-pop`, prominent, `bg-accent text-accent-ink rounded-[var(--radius-lg)]` — only shown if not checked in today
- Checked-in state: soft green confirmation with check mark, XP earned
- Archive link: small, `text-ink-faint`, only visible on hover/focus
- "Last checked in X days ago" warning if lapsed > 3 days: `text-flame text-[12px]`

Write the full TSX component.
```

---

## How to use these prompts

1. Copy the relevant prompt block
2. Fill in the `[BRACKETED]` parts with your specific requirement
3. Paste into a new Claude conversation
4. If you want it to use the full design system, also paste the contents of `DESIGN.md` before the prompt

For quick iterations on existing components, add:
> "Here is the current component: [paste code]. Improve the design while keeping the same props and functionality."
