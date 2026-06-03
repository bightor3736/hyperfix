# Hyperfix — Design Brief for Claude

Use this file as context whenever designing UI components, landing sections, dashboard views, or any visual work in this codebase.

---

## Brand personality

Hyperfix is for ADHD brains. The visual language should feel:
- **Warm and forgiving** — not cold SaaS blue, not harsh neon, not clinical white
- **Game-like but grounded** — XP and streaks without feeling like a casino or a fitness app
- **Focused** — no decoration for decoration's sake. Every element earns its place
- **Honest** — no fabricated stats, fake testimonials, or inflated claims

References: Linear (information density, clean surfaces) × Tiimo (warmth, rounded corners, friendly copy). Not: Notion, Duolingo, generic habit tracker, Discord dark mode.

---

## Typography

```css
font-display   → font-fraunces  (Fraunces) — headlines, big numbers, display text
font-sans      → font-instrument (Lexend)  — body, labels, UI text inside dashboard
font-mono      → JetBrains Mono            — eyebrows, tags, stat labels, mono values
```

**Landing page** uses `font-landing-sans` (Inter) for body/UI and `font-landing-serif` (Source Serif 4) for italic accents.

### Headline sizing
```tsx
// Landing section headings
style={{ fontSize: "clamp(32px,5vw,48px)" }}  // standard section h2
style={{ fontSize: "clamp(36px,6vw,60px)" }}  // CTA / large
style={{ fontSize: "clamp(26px,3.4vw,38px)" }} // module / sub-section h3

// Font weight on display headlines
className="font-display leading-[1.04] tracking-tight"

// Section eyebrow (always mono, always small-caps, always accent colored)
className="font-mono text-[11px] uppercase tracking-widest mb-4"
style={{ color: "var(--accent)" }}
```

### Text colors
```
text-ink        → primary text (headings, important UI)
text-ink-muted  → body text, descriptions
text-ink-faint  → captions, metadata, timestamps
```

---

## Color tokens

### Semantic colors (use these — never raw hex in components)
```css
--accent        teal #2dd4bf (dark) / #14b8a6 (light) — primary actions, highlights
--accent-soft   teal background tint (for soft chips, soft pills)
--accent-ink    #ffffff — text on --accent backgrounds

--energy        same as --accent (use for secondary highlights, icons)
--energy-soft   same as --accent-soft

--xp            same as --accent (XP bars, level indicators)
--xp-soft       same as --accent-soft

--flame         coral #ff7a59 (dark) / #e0633e (light) — streak, fire, urgent
--flame-soft    flame background tint

--invert-bg     high-contrast fill (dark ink in light mode, white in dark mode)
--invert-ink    text on --invert-bg
```

### Surface hierarchy
```css
--bg            page background
--bg-soft       slightly off the base (alternating sections)
--bg-elevated   cards, panels (sits above bg)
--line          borders, dividers
--glass-bg / --glass-border   translucent surfaces (use .glass class)
```

### Pastel tints (for icon backgrounds, feature tints — not text)
```css
--pastel-purple  --pastel-pink  --pastel-blue
--pastel-green   --pastel-orange  --pastel-yellow
```
These adapt for dark mode automatically — they're dark muted tints in dark mode, soft pastels in light.

### Gradient text
```css
.text-game-gradient  →  teal gradient on headline spans
```
Use sparingly — one per section maximum. Example:
```tsx
<h2><span className="text-ink">Track your </span><span className="text-game-gradient">hyperfixations.</span></h2>
```

---

## Spacing & layout

```
max-w-[1100px]   landing sections content width
max-w-[840px]    narrower centered content (pricing, comparisons)
max-w-[640px]    section intro text block
max-w-[760px]    centered article/note

px-6 sm:px-10    horizontal padding for all sections
py-24 sm:py-28   vertical padding for landing sections
```

Sections alternate background:
```
odd:  style={{ background: "var(--bg)" }}
even: style={{ background: "var(--bg-soft)" }}
```

---

## Border radius tokens

```css
--radius-lg   20px (landing) / 22px (app)   — cards, modals, inputs
--radius-xl   28px (landing) / 30px (app)   — large feature blocks, wrappers
rounded-full  — pills, buttons, badges, avatars
```

---

## Component patterns

### Section structure
Every landing section:
```tsx
<section id="slug" style={{ background: "var(--bg)" }}>
  <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
    <Reveal>
      <div className="max-w-[600px] mb-14">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
          Eyebrow label
        </p>
        <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
          <span className="text-ink">Part one </span>
          <span className="text-game-gradient">part two.</span>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">Body text.</p>
      </div>
    </Reveal>
    {/* content */}
  </div>
</section>
```

### Cards
```tsx
// Standard card
<div className="rounded-[var(--radius-xl)] p-6 sm:p-8"
  style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>

// Glass card (use on colored/dark backgrounds)
<div className="glass rounded-[var(--radius-xl)] p-6">

// Soft-shadow card
<div className="soft-card rounded-[var(--radius-xl)] p-6"
  style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
```

### Buttons
```tsx
// Primary CTA
<a href="/auth/signup"
  className="press-pop inline-flex h-12 items-center rounded-full px-8 text-[15px] font-semibold hover:opacity-90"
  style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
  Get started
</a>

// Secondary / ghost
<a className="inline-flex h-12 items-center rounded-full px-6 text-[15px] font-medium hover:opacity-70"
  style={{ color: "var(--ink-muted)", border: "1px solid var(--line)", background: "var(--bg-elevated)" }}>
  Learn more
</a>

// Invert (high contrast, used for free-tier CTAs)
<a className="inline-flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold"
  style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
  Start free
</a>
```

Always use `press-pop` on interactive elements for the spring-back tap effect.

### Stat / icon chips
```tsx
// Mono eyebrow chip
<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
  style={{ background: "var(--xp-soft)", color: "var(--xp)" }}>
  <Zap size={11} /> Level 4
</span>

// Feature icon block
<span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px]"
  style={{ background: "var(--pastel-purple)", color: "var(--ink)" }}>
  <Icon size={17} strokeWidth={2} />
</span>
```

### Scroll reveal
Wrap any section content in `<Reveal>` for fade-up on scroll. Use `delay` (ms) to stagger siblings:
```tsx
import { Reveal } from "./Reveal";
<Reveal>...</Reveal>
<Reveal delay={80}>...</Reveal>
<Reveal delay={160}>...</Reveal>
```

---

## Animations — full list

```css
.anim-fadeUp      fade + rise on enter (for hero elements, use delay-100/200/300/400/500)
.anim-fadeIn      fade only
.anim-scaleIn     scale up on enter
.anim-pop         quick pop-in
.anim-shimmer     shimmer sweep (use on XP bars, loading states)
.anim-pulseDot    pulse for live indicators (green dot, equalizer bar)
.anim-glowPulse   teal glow pulse
.anim-floatY      slow vertical float
.anim-flame       flicker for flame/streak icons
.anim-neon        teal ring + glow on a card border — use very sparingly, one card max
.press-pop        spring-back on :active (all interactive elements)
.glass            backdrop blur translucent surface
.text-game-gradient  teal gradient text
```

**Delay utilities (for `.anim-fadeUp`):** `delay-100`, `delay-200`, `delay-300`, `delay-400`, `delay-500`

---

## Dark mode

The app defaults to the user's OS preference. All CSS tokens switch automatically. Rules:
- Never hardcode colors as raw hex inside components. Always use `var(--token)`.
- Exception: the FocusRooms mock intentionally has hardcoded indigo/dark palette for the room aesthetic — that's fine for product mocks that are meant to look like a dark interface.
- Test visually at both themes. `--pastel-*` tokens are completely different shades in dark mode.

---

## Anti-patterns — do not do these

**Visual**
- No `anim-neon` on more than one card per section
- No multiple gradient blobs as background decoration (one subtle glow max per section)
- No box-shadow stacks > 2 layers on standard cards
- No `text-game-gradient` on body text or UI labels — headlines only
- No hardcoded font-size in px without `clamp()` for responsive headings
- No Tailwind color classes (`bg-teal-500`, `text-gray-400`) — always use `var(--token)`
- No decorative icons that don't mean anything

**Copy**
- No fabricated stats ("134M+ views", "10,000 users")
- No fake testimonials with made-up @handles
- No generic productivity-app copy ("boost your productivity", "achieve your goals")
- No shame-based language ("stop procrastinating", "fix your habits")
- Hyperfix copy is warm, specific, first-person adjacent, occasionally funny about ADHD struggles

**Structure**
- No section without an `id` anchor (for nav scroll links)
- No `<section>` without explicit `background` style (sections must control their own bg)
- No deeply nested Tailwind conditionals — extract a variable or component

---

## Product vocabulary (use these terms consistently)

| Use | Not |
|-----|-----|
| Hyperfixation / fix | Habit, task, goal |
| Dopamine roll / hit | Activity, suggestion |
| Beat the Wall | Overcome procrastination |
| Proof of action | Check-in, completion |
| Streak freeze | Grace day, skip |
| XP | Points, score |
| Power-Up | Pro, premium |
| Focus room | Study room, work session |
| Archive / put to rest | Complete, finish (a fixation that fades) |
| Level up | Rank up |

---

## Pricing tiers

| Tier | Price | Key differentiators |
|------|-------|---------------------|
| Free | $0 forever | Unlimited dopamine rolls, hyperfixation log, proof of action, XP + 7 levels, daily quests, 1 streak freeze/month, focus rooms, share card + custom accent |
| Power-Up | $5/mo or $3.25/mo (yearly, billed $39/yr) | 5 streak freezes/month, boosted jackpot odds, XP multipliers, premium profile themes, full stats + history |

30-day full refund on Power-Up. No credit card for Free.

---

## File structure reference

```
app/
  page.tsx              Landing page — section order is intentional
  globals.css           All design tokens + utility classes
  layout.tsx            Fonts, JSON-LD schema, global metadata

components/landing/
  Nav.tsx               Sticky scroll-aware nav
  Hero.tsx              Hero + HeroDopamineDemo interactive mock
  SocialProof.tsx       3-panel honest differentiators strip
  Modules.tsx           4 feature blocks (ModuleShell pattern)
  FocusRooms.tsx        Body doubling section + dark room mock
  ProfileShowcase.tsx   Player card + level ladder + customization strip
  FoundersNote.tsx      Authentic why-we-built-this
  Pricing.tsx           2-tier pricing + comparison table
  FAQ.tsx               Accordion FAQ
  CTA.tsx               Bottom CTA with OAuthButtons
  Footer.tsx            Footer with theme toggle
  StickyMobileCTA.tsx   Fixed bottom bar on mobile
  Reveal.tsx            Scroll-triggered fade-up wrapper

lib/
  profile-themes.ts     Theme definitions (8 themes, 2 Pro-only)
  accent.ts             Accent color presets + helpers
```

---

## When designing a new section

1. Pick a `background` that alternates with its neighbors (`--bg` or `--bg-soft`)
2. Start with the `<Reveal>` eyebrow + headline + body pattern
3. Use real product concepts — no placeholder UI that doesn't exist in the app
4. One `.text-game-gradient` span max per section
5. Mock UI cards should use `--bg-elevated` with `1px solid var(--line)` border
6. Every CTA links to `/auth/signup` (primary) or `/auth/login` (secondary)
7. Wrap scroll-animated content in `<Reveal>`, stagger siblings with `delay`
8. Add `id="section-name"` to the section for nav anchoring
