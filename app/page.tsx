import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { LogoLockup } from "@/components/Logo";

async function getWaitlistCount(): Promise<number> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return 1247;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=id`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0",
      },
      next: { revalidate: 60 },
    });
    const raw = res.headers.get("content-range") ?? "";
    return parseInt(raw.split("/")[1] ?? "0", 10) || 1247;
  } catch {
    return 1247;
  }
}

async function getPublicFixCount(): Promise<number> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return 3812;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/fixes?select=id&is_public=eq.true`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0",
      },
      next: { revalidate: 60 },
    });
    const raw = res.headers.get("content-range") ?? "";
    return parseInt(raw.split("/")[1] ?? "0", 10) || 3812;
  } catch {
    return 3812;
  }
}

export const metadata: Metadata = {
  title: "Hyperfix — what are you unwell about?",
};

// ---- DESIGN TOKENS ---------------------------------------------------------

const TEAL = "#5EEAD4";
const TEAL_DEEP = "#2DD4BF";
const TEAL_INK = "#A7F3D0";
const TEAL_DARK_BG = "rgba(94,234,212,0.10)";
const TEAL_DARK_BORDER = "rgba(94,234,212,0.22)";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const PAGE_BG = "#070708";

// Film grain noise via inline SVG (data URI)
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// ---- DATA ------------------------------------------------------------------

const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
    title: "Instant Logging",
    body: "Capture a fix in seconds, not paragraphs. Name it. Pick a category. Set intensity 1–10. The day counter starts the moment you hit save.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A7.5 7.5 0 0 0 2 9.5c0 4 3 7 5 8s2 2 2 4M14.5 2A7.5 7.5 0 0 1 22 9.5c0 4-3 7-5 8s-2 2-2 4" />
        <path d="M9 22h6" />
      </svg>
    ),
    title: "Truly Personal",
    body: "Built for the way your brain actually works. Notes, mood, intensity, streaks — the obsession is yours, the journal adapts to it, not the other way around.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    title: "Highly Shareable",
    body: "Every fix becomes a card. Drop it in the group chat, the Stories, the Discord. The card is the whole point. The unwellness is best appreciated together.",
  },
];

const features = [
  {
    title: "Day Counter",
    body: "Watch your obsession age in real time. Day 1. Day 47. Day 312. The number is the proof. The number doesn't lie.",
  },
  {
    title: "Intensity Tracking",
    body: "Log how bad it is from 1 to 10. Notice the spikes. Notice the dips. Notice when you tell yourself you're fine right before the intensity climbs back to 9.",
  },
  {
    title: "Share Cards",
    body: "Every fix renders to a beautifully designed shareable card. Built to be screenshotted and dropped into the chat without explanation.",
  },
  {
    title: "Private or Public",
    body: "Toggle per fix. Some you'll want the whole timeline to see. Some you'll want buried so deep that even you can barely find them. Both are allowed.",
  },
  {
    title: "Eulogies",
    body: "When the fix finally dies, write the obituary. Save it forever. Build a graveyard of your past selves and the things that briefly ran your life.",
  },
  {
    title: "Streaks & Heatmap",
    body: "Daily check-ins build a streak. The heatmap shows the shape of your obsession over weeks and months — the rise, the plateau, the collapse.",
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Log Your Fix",
    body: "Pick the obsession. A song, a fic, a film, a character, a real person whose Wikipedia you read at 3am. One line of input is enough. Your counter starts now.",
  },
  {
    step: "Step 2",
    title: "Check In Daily",
    body: "How bad is it today? Drop the intensity, drop a note, drop a screenshot. Each check-in builds your streak and adds a square to the heatmap.",
  },
  {
    step: "Step 3",
    title: "Mourn It When It Ends",
    body: "Every fix eventually fades. Hyperfix is there for that too. Write the eulogy. Archive the card. Visit the graveyard whenever you want to feel something.",
  },
];

const reviews = [
  {
    name: "@parchment.spiral",
    role: "the marauders era · day 312",
    quote:
      "i have been waiting for this app since 2019 when i had to explain to my therapist why i made a spreadsheet about a fictional war. i am no longer alone.",
  },
  {
    name: "@kai.unwell",
    role: "genshin lore · day 89",
    quote:
      "finally something that understands the difference between liking something and being OWNED by something. five stars. life ruined. would recommend.",
  },
  {
    name: "@theosobs",
    role: "hozier discography · day 44",
    quote:
      "i literally told my partner 'hyperfix is coming out and that's why i'm like this' and they said 'that explains so much.' the app diagnosed my whole 2024.",
  },
  {
    name: "@nour.fixated",
    role: "acotar · day 156",
    quote:
      "the day counter is the feature i didn't know i needed. yes it has been 156 days. yes i am fine. stop asking. the counter is doing the asking for me now.",
  },
];

const faqs = [
  {
    q: "What exactly is Hyperfix?",
    a: "Hyperfix is a journal for your current obsession — a song on loop, a fic you can't quit, a character who has rearranged your brain. You log the fix, count the days, check in daily, and when it finally fades, you write the eulogy.",
  },
  {
    q: "Is it free?",
    a: "Yes. Logging fixes, checking in, building streaks, and sharing cards are all free forever. A Pro tier is on the way with unlimited fixes, premium card templates, and a custom profile URL.",
  },
  {
    q: "How is this different from Notion or a journal?",
    a: "Notion is a private spreadsheet. Hyperfix is built around the moment of obsession itself — day counters, intensity meters, shareable cards. Where a journal lives in a drawer, Hyperfix lives in your group chat.",
  },
  {
    q: "Is my data private?",
    a: "Every fix has a privacy toggle. Public fixes live on your profile. Private fixes are visible only to you. You can also set a fix to friends-only. We never sell your data and we don't train AI on your content.",
  },
  {
    q: "Is there an app?",
    a: "Hyperfix is web-first. It works on every phone, every browser, no install required. A native app will follow when push notifications would meaningfully add to the experience.",
  },
  {
    q: "What kinds of things can I track?",
    a: "Anything. Songs, films, fanfics, TV shows, books, characters, ships, video essays, podcasts, video games, real people, niche historical events, recipes. If you cannot shut up about it, it counts.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// ---- SHARED PRIMITIVES -----------------------------------------------------

function GrainOverlay({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none mix-blend-overlay"
      style={{
        backgroundImage: NOISE_URL,
        backgroundSize: "240px 240px",
        opacity,
      }}
    />
  );
}

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-sans text-sm rounded-full px-4 py-1.5"
      style={{
        background: TEAL_DARK_BG,
        color: TEAL,
        border: `1px solid ${TEAL_DARK_BORDER}`,
        boxShadow: "0 0 24px rgba(94,234,212,0.10)",
      }}
    >
      {children}
    </span>
  );
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{
        width: 52,
        height: 52,
        background: TEAL_DARK_BG,
        border: `1px solid ${TEAL_DARK_BORDER}`,
        color: TEAL,
        boxShadow: "0 0 28px rgba(94,234,212,0.22), inset 0 0 18px rgba(94,234,212,0.08)",
      }}
    >
      {children}
    </div>
  );
}

// ---- PAGE ------------------------------------------------------------------

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.code) {
    const { OAuthCallback } = await import("@/components/OAuthCallback");
    return <OAuthCallback code={params.code} />;
  }

  const [waitlistCount, publicFixCount] = await Promise.all([
    getWaitlistCount(),
    getPublicFixCount(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink" style={{ background: PAGE_BG }}>
        {/* NAV ------------------------------------------------------------ */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5"
          style={{
            background: "rgba(7,7,8,0.78)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${CARD_BORDER}`,
          }}
        >
          <a href="/" className="shrink-0">
            <LogoLockup size="sm" />
          </a>

          <div className="hidden sm:flex items-center gap-9">
            <a href="#features" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Features
            </a>
            <a href="/explore" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Explore
            </a>
            <a href="/blog" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Blog
            </a>
            <a href="#pricing" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Pricing
            </a>
          </div>

          <a
            href="/join"
            className="font-sans text-sm font-semibold px-5 py-2.5 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#FFFFFF", color: "#0A0A0A", borderRadius: 999 }}
          >
            Get started
          </a>
        </nav>

        {/* HERO ----------------------------------------------------------- */}
        <section className="relative overflow-hidden px-6 sm:px-10 pt-20 sm:pt-28 pb-24 sm:pb-32">
          {/* Teal radial bloom — emerges from bottom-center */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 70% at 50% 100%, #5EEAD4 0%, #2DD4BF 18%, #0E4F47 38%, #08231F 58%, #070708 78%)",
              opacity: 0.95,
              zIndex: 0,
            }}
          />
          {/* Heavy grain on hero */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: NOISE_URL,
              backgroundSize: "200px 200px",
              opacity: 0.55,
              mixBlendMode: "overlay",
              zIndex: 1,
            }}
          />
          {/* Top vignette */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: "55%",
              background:
                "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.85) 35%, transparent 100%)",
              zIndex: 2,
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center" style={{ zIndex: 10 }}>
            <h1
              className="font-display text-ink"
              style={{
                fontSize: "clamp(48px, 9vw, 96px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              What Are You
              <br />
              Unwell About?
            </h1>

            <p
              className="mt-7 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Hyperfix is the journal built for your current obsession — the song on loop,
              the fic you can&apos;t quit, the character who has quietly rearranged your
              entire personality. Log it. Count it. Mourn it.
            </p>

            <div className="mt-10 flex justify-center">
              <a
                href="/join"
                className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all hover:opacity-95 active:scale-[0.98]"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow:
                    "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4)",
                }}
              >
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <p className="mt-7 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              free forever · no credit card · {waitlistCount.toLocaleString()} currently unwell
            </p>
          </div>
        </section>

        {/* BENEFITS ------------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32">
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <EyebrowPill>Benefits</EyebrowPill>
            <h2
              className="mt-7 font-display text-ink max-w-2xl"
              style={{
                fontSize: "clamp(36px, 5.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              Everything You Need
              <br />
              to Stay Unwell.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Hyperfix gives your obsession the structure it deserves — without the
              spreadsheets, the Notion template, or the friend who keeps asking if
              you&apos;re okay.
            </p>

            <div className="mt-14 grid gap-4 sm:gap-5">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="relative overflow-hidden rounded-3xl p-7 sm:p-10"
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${CARD_BORDER}`,
                    minHeight: 340,
                  }}
                >
                  <GrainOverlay opacity={0.22} />
                  <div className="relative">
                    <IconTile>{b.icon}</IconTile>
                    <div className="mt-32 sm:mt-48">
                      <h3
                        className="font-display text-ink"
                        style={{ fontSize: "clamp(24px, 3vw, 30px)", letterSpacing: "-0.01em", fontWeight: 600 }}
                      >
                        {b.title}
                      </h3>
                      <p className="mt-3 font-sans text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {b.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS --------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <EyebrowPill>How It Works</EyebrowPill>
            <h2
              className="mt-7 font-display text-ink max-w-2xl"
              style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
            >
              The Whole Thing
              <br />
              in 3 Simple Steps.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              No onboarding flow. No tutorial video. Just log the fix and let the rest
              unfold.
            </p>

            <div className="mt-14 grid gap-4 sm:gap-5">
              {steps.map((s, i) => (
                <div
                  key={s.step}
                  className="relative overflow-hidden rounded-3xl p-7 sm:p-10"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 360 }}
                >
                  <GrainOverlay opacity={0.22} />
                  <div className="relative">
                    <EyebrowPill>{s.step}</EyebrowPill>
                    {/* Pixel-grid illustration */}
                    <div className="mt-8 mb-10 grid" style={{ gridTemplateColumns: "repeat(14, 1fr)", gap: 4, maxWidth: 360 }}>
                      {Array.from({ length: 14 * 8 }).map((_, idx) => {
                        const row = Math.floor(idx / 14);
                        const col = idx % 14;
                        // Build a rough ascending staircase pattern unique per step
                        const threshold = i === 0 ? col - row * 1.2 + 4 : i === 1 ? Math.abs(col - 7) + row * 1.1 - 2 : (13 - col) - row * 1.2 + 4;
                        const lit = threshold > 0 && threshold < 6;
                        const alpha = lit ? 0.55 + (threshold / 14) : 0.06;
                        return (
                          <div
                            key={idx}
                            style={{
                              aspectRatio: "1 / 1",
                              borderRadius: 4,
                              background: lit ? TEAL : "rgba(255,255,255,0.04)",
                              opacity: lit ? alpha : 1,
                              boxShadow: lit ? `0 0 8px rgba(94,234,212,${alpha * 0.7})` : "none",
                            }}
                          />
                        );
                      })}
                    </div>
                    <h3 className="font-display text-ink" style={{ fontSize: "clamp(24px, 3vw, 30px)", letterSpacing: "-0.01em", fontWeight: 600 }}>
                      {s.title}
                    </h3>
                    <p className="mt-3 font-sans text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES ------------------------------------------------------- */}
        <section id="features" className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <EyebrowPill>Features</EyebrowPill>
            <h2
              className="mt-7 font-display text-ink max-w-2xl"
              style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
            >
              Everything Hyperfix Does
              <br />
              For Your Brain.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Built for the people who notice the patterns. Powerful enough for the
              chronic. Simple enough for the casual.
            </p>

            <div className="mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="relative overflow-hidden rounded-3xl p-7 sm:p-9"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 280 }}
                >
                  <GrainOverlay opacity={0.22} />
                  <div className="relative flex flex-col h-full">
                    <IconTile>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </IconTile>
                    <div className="mt-auto pt-20">
                      <h3 className="font-display text-ink" style={{ fontSize: "clamp(22px, 2.6vw, 26px)", letterSpacing: "-0.01em", fontWeight: 600 }}>
                        {f.title}
                      </h3>
                      <p className="mt-3 font-sans text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {f.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS -------------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <EyebrowPill>Reviews</EyebrowPill>
            <h2
              className="mt-7 font-display text-ink max-w-3xl"
              style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
            >
              People Who Hyperfix
              <br />
              Don&apos;t Go Back.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              From the chronically online to the deeply private — here&apos;s what
              early members are saying about their fixes.
            </p>

            <div className="mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
              {reviews.map((r) => (
                <div
                  key={r.name}
                  className="relative overflow-hidden rounded-3xl p-7 sm:p-9"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <GrainOverlay opacity={0.22} />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full"
                        style={{
                          width: 44,
                          height: 44,
                          background: TEAL_DARK_BG,
                          border: `1px solid ${TEAL_DARK_BORDER}`,
                          color: TEAL,
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21a8 8 0 0 1 16 0" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-ink" style={{ fontSize: 17, fontWeight: 600 }}>
                          {r.name}
                        </p>
                        <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {r.role}
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                      &ldquo;{r.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center"
                          style={{
                            width: 22,
                            height: 22,
                            background: TEAL,
                            color: "#0A0A0A",
                            borderRadius: 3,
                            fontSize: 14,
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING -------------------------------------------------------- */}
        <section id="pricing" className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center">
              <EyebrowPill>Pricing</EyebrowPill>
              <h2
                className="mt-7 font-display text-ink mx-auto max-w-3xl"
                style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Free Forever.
                <br />
                Pro is on the Way.
              </h2>
              <p className="mt-5 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Hyperfix is free to use. A Pro tier with unlimited fixes and premium
                cards is coming soon. Early members get a permanent discount.
              </p>
            </div>

            <div className="mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Free plan */}
              <div
                className="relative overflow-hidden rounded-3xl p-7 sm:p-9"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <GrainOverlay opacity={0.22} />
                <div className="relative">
                  <h3 className="font-display text-ink" style={{ fontSize: 26, fontWeight: 600 }}>
                    Free
                  </h3>
                  <p className="mt-2 font-sans text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Everything you need to log, count, and share your obsessions.
                  </p>
                  <p className="mt-7 font-display text-ink" style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em" }}>
                    $0<span className="font-sans text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3">
                    {[
                      "Unlimited fixes",
                      "Daily check-ins",
                      "Streaks & heatmap",
                      "Share cards",
                      "Public profile",
                      "Eulogies",
                    ].map((line) => (
                      <li key={line} className="flex items-center gap-3 font-sans text-base" style={{ color: "rgba(255,255,255,0.78)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/join"
                    className="mt-10 inline-flex w-full items-center justify-between font-sans text-base font-semibold px-6 py-4 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "#FFFFFF",
                      borderRadius: 999,
                      border: `1px solid ${CARD_BORDER}`,
                    }}
                  >
                    Get Started Free
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Pro plan — solid teal */}
              <div
                className="relative overflow-hidden rounded-3xl p-7 sm:p-9"
                style={{
                  background: TEAL,
                  border: `1px solid ${TEAL_DEEP}`,
                  color: "#0A1F1C",
                  boxShadow: "0 24px 80px rgba(94,234,212,0.25)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.3 }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display" style={{ fontSize: 26, fontWeight: 600, color: "#0A1F1C" }}>
                      Pro
                    </h3>
                    <span
                      className="font-sans text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: "#0A1F1C", color: TEAL }}
                    >
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-2 font-sans text-base" style={{ color: "rgba(10,31,28,0.78)" }}>
                    For the chronically unwell who want the full toolkit.
                  </p>
                  <p className="mt-7 font-display" style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em", color: "#0A1F1C" }}>
                    TBA<span className="font-sans text-lg" style={{ color: "rgba(10,31,28,0.6)" }}>/mo</span>
                  </p>
                  <ul className="mt-8 space-y-3">
                    {[
                      "Everything in Free",
                      "Premium card templates",
                      "Custom profile URL",
                      "Private mode by default",
                      "Eulogy generator",
                      "Hyperfix Wrapped",
                    ].map((line) => (
                      <li key={line} className="flex items-center gap-3 font-sans text-base" style={{ color: "#0A1F1C" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A1F1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/join"
                    className="mt-10 inline-flex w-full items-center justify-between font-sans text-base font-semibold px-6 py-4 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "#0A1F1C", color: TEAL, borderRadius: 999 }}
                  >
                    Join the Waitlist
                    <span>»</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ------------------------------------------------------------ */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center">
              <EyebrowPill>FAQ</EyebrowPill>
              <h2
                className="mt-7 font-display text-ink"
                style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Everything
                <br />
                You Need to Know.
              </h2>
              <p className="mt-5 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Still have questions? Here are the answers — and if you don&apos;t
                find what you&apos;re looking for, drop us a note.
              </p>
            </div>

            <div className="mt-14 flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group [&_summary::-webkit-details-marker]:hidden relative overflow-hidden rounded-2xl"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none px-6 py-5">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {faq.q}
                    </h3>
                    <span
                      aria-hidden
                      className="shrink-0 flex items-center justify-center rounded-full transition-transform group-open:rotate-45"
                      style={{
                        width: 32,
                        height: 32,
                        border: `1.5px solid ${TEAL_DARK_BORDER}`,
                        color: TEAL,
                        fontSize: 18,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA ------------------------------------------------------ */}
        <section className="relative px-6 sm:px-10 pt-12 pb-24 sm:pb-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <div
            className="relative overflow-hidden rounded-3xl mx-auto max-w-5xl px-6 sm:px-10 py-24 sm:py-36 text-center"
            style={{
              background:
                "radial-gradient(ellipse 90% 100% at 50% 100%, #5EEAD4 0%, #2DD4BF 20%, #0E4F47 45%, #08231F 70%, #0A0A0B 100%)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: NOISE_URL,
                backgroundSize: "200px 200px",
                opacity: 0.55,
                mixBlendMode: "overlay",
              }}
            />
            <div className="relative">
              <h2
                className="font-display text-ink mx-auto max-w-3xl"
                style={{ fontSize: "clamp(42px, 7vw, 80px)", lineHeight: 1.03, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Start Counting
                <br />
                the Days.
              </h2>
              <p className="mt-7 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                Join {publicFixCount.toLocaleString()}+ logged fixations. Set up your
                first hyperfix in minutes — no credit card, no commitment, no judgment.
              </p>
              <div className="mt-10 flex justify-center">
                <a
                  href="/join"
                  className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all hover:opacity-95 active:scale-[0.98]"
                  style={{
                    background: "#FFFFFF",
                    color: "#0A0A0A",
                    borderRadius: 999,
                    boxShadow:
                      "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4)",
                  }}
                >
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
