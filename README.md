# Hyperfix — Landing Page

Single-page Next.js 15 landing page for Hyperfix, a hyperfixation tracker for the people who can't shut up about their current obsession. Built to deploy to Vercel in under five minutes and rank for "hyperfixation tracker" in Google.

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

Deploy:

```bash
# Option A — Vercel (recommended)
npx vercel

# Option B — any host that runs Next.js 15
npm run build
npm start
```

## What's in here

```
app/
  layout.tsx              SEO metadata, fonts, schema.org JSON-LD
  page.tsx                The landing page (single file, all sections)
  globals.css             Paper texture, animations, base styles
  opengraph-image.tsx     Dynamic OG image at /opengraph-image
  sitemap.ts              Programmatic sitemap with reserved SEO routes
  robots.ts               Robots.txt
public/                   Static assets (currently empty)
tailwind.config.ts        Custom theme: paper, ink, accent, fonts
```

## The SEO play

The keyword landscape for "hyperfixation tracker" is wide open. Existing top results are clinical OCD apps and Notion templates. None are positioned for fandom / BookTok / Gen Z culture, which is where the actual demand lives.

This site targets that gap with:

1. **Primary keyword in the H1** — "hyperfixation tracker" is in the meta title and natural-language H1 ("What are you unwell about?" is the hook; the keyword is in the subhead and meta).
2. **FAQ schema** — the FAQ section is marked up with `FAQPage` JSON-LD. Google often surfaces this as a rich result, which doubles your SERP real estate.
3. **SoftwareApplication + WebSite schema** in `layout.tsx` — helps Google understand what the site is and qualify for sitelinks.
4. **OpenGraph image** generated at the edge — when this URL is pasted anywhere (TikTok bios, Twitter, iMessage, Discord), the preview card pops. This is your free distribution.
5. **Sitemap reserves SEO landing pages** — `/hyperfixation-tracker`, `/fanfic-tracker`, `/booktok-tracker`, plus comparison pages (`/vs/notion`, `/vs/letterboxd`, `/vs/shelf`). Build these one at a time over the first 90 days; each one ranks for a long-tail keyword.

## Next things to build (in order)

1. **Wire the email form to Resend + Supabase** (or ConvertKit / Loops / Beehiiv if you prefer). The form currently `preventDefault`s — make it actually save the email.
2. **Buy the domain.** `hyperfix.app` is the canonical domain. It's set in `app/layout.tsx` (`SITE_URL`), `app/sitemap.ts`, `app/robots.ts`, and `app/opengraph-image.tsx`.
3. **Replace social links** in the footer with real handles once you create the accounts.
4. **Build the first SEO landing page** at `/hyperfixation-tracker` — same layout, headline targets the exact phrase, content goes deeper. Then `/fanfic-tracker`. Then comparison pages.
5. **Add a `/manifesto` or `/about`** page once the brand voice is locked. Heavy on personality, low on features. Good for backlinks.
6. **Set up Google Search Console** the day you deploy. Submit the sitemap. Watch the impressions.

## Where to change things

- **Brand name / domain:** `SITE_URL` and `SITE_NAME` in `app/layout.tsx`. Also update `app/sitemap.ts` and `app/robots.ts`.
- **Hero copy:** `app/page.tsx`, first `<section>`. The H1 currently reads "What are you unwell about?" — that's the hook, don't soften it.
- **FAQs:** the `faqs` array in `app/page.tsx`. Every answer is currently SEO-optimized. Change the *answers* freely, but keep the *questions* — they're targeting real search queries.
- **Card mockups:** the `cards` array in `app/page.tsx`. Three sample fixations. Tweak the names but keep them specific (Marauders > generic "fanfic"). Specificity is what makes them feel real.
- **Colors:** `tailwind.config.ts`. The accent red `#D72638` is the one accent — use it sparingly.
- **Fonts:** loaded from Google Fonts in `app/layout.tsx`. Fraunces (display), Instrument Sans (body), JetBrains Mono (counters and labels). If you change them, change all three together.

## Things I deliberately did not include

- **Analytics.** Add PostHog or Plausible when you deploy. Five lines in `layout.tsx`.
- **A real backend.** The waitlist form is intentionally a stub. Wire it in week 1 of build.
- **An actual auth flow.** This is a landing page, not the product yet.
- **Native app messaging.** You said web-first. The copy reflects that ("there is no app yet, web-first by design").
- **Stock photos.** Every visual is type or SVG. Stock photos would kill the aesthetic.

## A note on the design

The aesthetic commits hard to editorial / book-coded / slightly unhinged diary. Warm cream paper, ink black, one electric red accent. Big serif (Fraunces), modern sans body (Instrument Sans), monospaced labels and counters (JetBrains Mono). The hero visual is a tilted "currently unwell" card with a giant day counter — that's the product moment, and it needs to be irresistible to screenshot.

If you change one thing without changing the others, the whole thing falls apart. The minimum coherent edits are: copy in the cards and FAQs, the accent color, the brand name. Don't swap in a sans-serif body font or it'll look like every other AI-generated landing page.
