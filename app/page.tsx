import type { Metadata } from "next";
import { Suspense } from "react";
import ActivityTicker from "@/components/ActivityTicker";
import Footer from "@/components/Footer";
import { LogoLockup } from "@/components/Logo";
import { RevealSection } from "@/components/RevealSection";
import { HeroProductMock } from "@/components/HeroProductMock";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";
import {
  HeadphonesIcon, NoteIcon, XIcon, ChatIcon, PinIcon, BrainIcon,
  MicIcon, SparkleIcon, BookIcon, RepeatIcon, LibraryIcon, BoltIcon, FlameIcon,
} from "@/components/LandingIcons";

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
  title: "Hyperfix — Hyperfixation Tracker | Log Your Obsessions",
  description:
    "The #1 hyperfixation tracker. Log the song on loop, the fanfic you can't quit, the show that owns you. Count the days. Build streaks. Share cards. Free forever.",
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — Hyperfixation Tracker",
    description:
      "Log your current obsession. Count the days. Mourn it when it ends. Free hyperfixation tracker for songs, fanfic, shows, K-pop, anime, and more.",
    url: "https://hyperfix.app",
    type: "website",
  },
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

const reviews = [
  {
    name: "Mara",
    role: "the marauders era · day 312",
    quote:
      "i had a spreadsheet about a fictional war and now i don't. that feels like progress and also exactly the same. either way. five stars.",
  },
  {
    name: "Kai",
    role: "genshin lore · day 89",
    quote:
      "finally something that understands the difference between liking a thing and being owned by it. life ruined in the best way.",
  },
  {
    name: "Theo",
    role: "hozier discography · day 44",
    quote:
      "told my partner 'hyperfix is why i'm like this.' they said 'oh that explains so much.' app diagnosed my entire year.",
  },
  {
    name: "Nour",
    role: "acotar · day 156",
    quote:
      "the day counter does the work my therapist has been trying to do for two years. 156 days. yes i am fine. stop asking. the number is asking now.",
  },
];

const faqs = [
  {
    q: "What exactly is Hyperfix?",
    a: "Hyperfix is a journal for your current obsession — a song on loop, a fic you can't quit, a character who has rearranged your brain. You log the fix, count the days, check in daily, and when it finally fades, you write the eulogy.",
  },
  {
    q: "Is it free?",
    a: "Yes. Logging fixes, checking in, building streaks, and sharing cards are all free forever. Pro unlocks unlimited fixes, premium card templates, and a custom profile URL — cancel anytime.",
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

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
    logo: "https://hyperfix.app/icon?size=512",
    description: "The hyperfixation tracker for songs, shows, fanfic, K-pop, anime, and every obsession in between.",
    sameAs: ["https://twitter.com/hyperfixapp"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
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
            <a href="/quiz" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Quiz
            </a>
            <a href="#features" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Features
            </a>
            <a href="/explore" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Explore
            </a>
            <a href="/blog" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Blog
            </a>
            <a href="/adhd" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              ADHD
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
          {/* Teal radial bloom — slowly breathing from bottom-center */}
          <div
            aria-hidden
            className="absolute pointer-events-none anim-bloom"
            style={{
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 70% at 50% 100%, #5EEAD4 0%, #2DD4BF 18%, #0E4F47 38%, #08231F 58%, #070708 78%)",
              opacity: 0.95,
              zIndex: 0,
              transformOrigin: "50% 100%",
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
              className="font-display text-ink anim-fadeUp delay-100"
              style={{
                fontSize: "clamp(48px, 9vw, 96px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              What Are You
              <br />
              Obsessed With?
            </h1>

            <p
              className="mt-7 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-300"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Hyperfix is the journal built for your current obsession — the song on loop,
              the fic you can&apos;t quit, the character who has quietly rearranged your
              entire personality. Log it. Count it. Mourn it.
            </p>

            <div className="mt-10 flex justify-center anim-fadeUp delay-500">
              <a
                href="/join"
                className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow:
                    "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 60px rgba(94,234,212,0.25)",
                }}
              >
                Log Your First Fix
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="mt-7 flex flex-col items-center gap-2 anim-fadeUp delay-700">
              <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                free forever · no credit card · 30 seconds to your first day count
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(94,234,212,0.55)" }}>
                {publicFixCount.toLocaleString()}+ obsessions logged · and counting
              </p>
            </div>

            {/* Product mockup */}
            <div className="mt-16 sm:mt-20 anim-fadeUp delay-700">
              <HeroProductMock />
            </div>
          </div>
        </section>

        {/* PAIN POINTS ---------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32">
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>The Problem</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-3xl"
                style={{
                  fontSize: "clamp(36px, 5.5vw, 60px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                Your obsession lives across five apps.
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)" }}>None of them get it.</span>
              </h2>
            </RevealSection>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                { Icon: HeadphonesIcon, app: "Spotify", title: "One song. Ten thousand plays.", body: "Repeat hits the same. No notes, no day count, no proof you've heard this exact 30 seconds nine hundred times this week." },
                { Icon: NoteIcon, app: "Notes app", title: "A bullet point you forgot why.", body: "Three months later: 'Severance episode 7 — door???' You don't remember the door. The door remembers you." },
                { Icon: XIcon, app: "Twitter", title: "The rant thread you deleted.", body: "1.2k words on a fictional war. You scared yourself. The receipts are gone but the obsession is still there." },
                { Icon: ChatIcon, app: "Discord", title: "Screenshot graveyard in a DM.", body: "Pinned to a friend who has not opened the chat in 47 days. They liked the first one. The rest is yours." },
                { Icon: PinIcon, app: "Pinterest", title: "A board you can't show anyone.", body: "Eight hundred pins. Same character. Same outfit. Same lighting. Your algorithm has stopped trying to suggest variety." },
                { Icon: BrainIcon, app: "Your brain", title: "Vibes. No structure.", body: "You can't remember when it started. You can't tell when it ends. You only know you used to be a different person." },
              ].map((item, i) => (
                <RevealSection key={item.app} delay={200 + i * 80}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                  >
                    <GrainOverlay opacity={0.18} />
                    <div className="relative">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div
                          className="flex items-center justify-center rounded-lg shrink-0"
                          style={{
                            width: 32,
                            height: 32,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          <item.Icon size={16} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {item.app}
                        </span>
                      </div>
                      <h3 className="font-display text-ink" style={{ fontSize: 19, letterSpacing: "-0.01em", fontWeight: 600 }}>
                        {item.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {item.body}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>

            <RevealSection delay={800}>
              <p
                className="mt-12 text-center font-display max-w-2xl mx-auto"
                style={{
                  fontSize: "clamp(20px, 2.6vw, 26px)",
                  color: TEAL,
                  letterSpacing: "-0.01em",
                  fontWeight: 600,
                }}
              >
                Hyperfix is the one place that does.
              </p>
            </RevealSection>
          </div>
        </section>

        {/* TOOLS — interactive product UI cards --------------------------- */}
        <section id="tools" className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-6xl mx-auto">
            <RevealSection>
              <EyebrowPill>The Product</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-3xl"
                style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                One journal,
                <br />
                six tools for the unwell.
              </h2>
            </RevealSection>
            <RevealSection delay={200}>
              <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Each tool built for the exact way a hyperfixation behaves. The counter, the heatmap, the share card, the eulogy. All in one place. All free.
              </p>
            </RevealSection>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Day Counter card */}
              <div className="motion-card group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}>
                <GrainOverlay opacity={0.18} />
                <div className="relative flex flex-col h-full">
                  <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(94,234,212,0.05)", border: `1px solid ${TEAL_DARK_BORDER}` }}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-display tabular-nums" style={{ fontSize: 56, color: TEAL, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em" }}>
                        47
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(94,234,212,0.6)" }}>days</span>
                    </div>
                    <p className="font-sans text-sm mt-3" style={{ color: "rgba(255,255,255,0.75)" }}>severance — the door scene</p>
                    <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full anim-glowPulse" style={{ width: "78%", background: TEAL, boxShadow: `0 0 8px ${TEAL}` }} />
                    </div>
                    <p className="font-mono text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>intensity 8/10</p>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Day Counter</h3>
                    <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Watch your obsession age in real time. The number is the proof.</p>
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="motion-card group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}>
                <GrainOverlay opacity={0.18} />
                <div className="relative flex flex-col h-full">
                  <div className="rounded-2xl p-4 mb-4 flex items-center justify-center" style={{ background: "#F4EFE6", aspectRatio: "9/12", maxHeight: 180 }}>
                    <div className="text-center" style={{ color: "#111" }}>
                      <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: "rgba(17,17,17,0.4)" }}>hyperfix · day 47</p>
                      <p className="font-display mt-1.5" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>severance —</p>
                      <p className="font-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>the door scene</p>
                      <p className="font-display tabular-nums mt-2" style={{ fontSize: 32, color: "#D72638", fontWeight: 700, lineHeight: 1 }}>8<span style={{ fontSize: 16, color: "rgba(17,17,17,0.4)" }}>/10</span></p>
                      <p className="font-mono text-[7px] mt-2 uppercase tracking-widest" style={{ color: "rgba(17,17,17,0.45)" }}>@kai · hyperfix.app</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Share Cards</h3>
                    <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Every fix renders to a 9:16 card. Drop it in the chat. No explanation needed.</p>
                  </div>
                </div>
              </div>

              {/* Streak heatmap */}
              <div className="motion-card group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}>
                <GrainOverlay opacity={0.18} />
                <div className="relative flex flex-col h-full">
                  <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}>
                    <div className="grid" style={{ gridTemplateColumns: "repeat(13, 1fr)", gap: 3 }}>
                      {Array.from({ length: 13 * 5 }).map((_, idx) => {
                        const intensity = Math.sin((idx * 0.7) + 1) * 0.5 + 0.5;
                        const filled = intensity > 0.3;
                        const opacity = filled ? 0.2 + intensity * 0.8 : 0;
                        return (
                          <div
                            key={idx}
                            style={{
                              aspectRatio: "1 / 1",
                              borderRadius: 2,
                              background: filled ? TEAL : "rgba(255,255,255,0.05)",
                              opacity: filled ? opacity : 1,
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-3 font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <span>13 weeks</span>
                      <span className="inline-flex items-center gap-1" style={{ color: TEAL }}>
                        <FlameIcon size={11} />
                        12-day run
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Streak Heatmap</h3>
                    <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Daily check-ins. The shape of your obsession over weeks.</p>
                  </div>
                </div>
              </div>

              {/* Eulogy */}
              <div className="motion-card group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}>
                <GrainOverlay opacity={0.18} />
                <div className="relative flex flex-col h-full">
                  <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(215,38,56,0.05)", border: "1px solid rgba(215,38,56,0.2)" }}>
                    <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(215,38,56,0.7)" }}>◼ ended · day 156</p>
                    <p className="font-display mt-2" style={{ fontSize: 15, fontWeight: 600, color: "#F4F4F4" }}>"hozier discography"</p>
                    <p className="font-sans italic text-xs mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      we had a good run. you turned a normal commute into a five-month spiral. i&apos;ll never look at a bog the same.
                    </p>
                    <p className="font-mono text-[9px] mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>filed in the graveyard, may 2026</p>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Eulogies</h3>
                    <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>When it dies, write the obituary. Build a graveyard of past selves.</p>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="motion-card group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}>
                <GrainOverlay opacity={0.18} />
                <div className="relative flex flex-col h-full">
                  <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs" style={{ background: TEAL_DARK_BG, border: `1px solid ${TEAL_DARK_BORDER}`, color: TEAL }}>
                        KA
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm" style={{ color: "#F4F4F4" }}>kai.unwell</p>
                        <p className="font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>@kai · 8 active · 23 buried</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { cat: "ship", day: 89, color: "#EC4899" },
                        { cat: "game", day: 156, color: "#10B981" },
                        { cat: "show", day: 47, color: "#A78BFA" },
                      ].map((item, i) => (
                        <div key={i} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: item.color, opacity: 0.85 }}>{item.cat}</p>
                          <p className="font-display tabular-nums mt-0.5" style={{ fontSize: 13, color: "#F4F4F4", fontWeight: 600, lineHeight: 1 }}>
                            {item.day}<span className="font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>d</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Public Profile</h3>
                    <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Your hyperfixations, public. Followers, eras, the whole archive.</p>
                  </div>
                </div>
              </div>

              {/* Reactions / Comments */}
              <div className="motion-card group relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-1" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}>
                <GrainOverlay opacity={0.18} />
                <div className="relative flex flex-col h-full">
                  <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {[
                        { label: "buried", n: 42 },
                        { label: "spiral", n: 17 },
                        { label: "loop", n: 9 },
                        { label: "obsessed", n: 6 },
                      ].map((r) => (
                        <span
                          key={r.label}
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-widest"
                          style={{ background: TEAL_DARK_BG, border: `1px solid ${TEAL_DARK_BORDER}`, color: TEAL }}
                        >
                          {r.label}
                          <span className="tabular-nums" style={{ color: "rgba(94,234,212,0.6)" }}>{r.n}</span>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[8px] shrink-0" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>N</div>
                      <p className="font-sans text-xs italic" style={{ color: "rgba(255,255,255,0.65)" }}>&ldquo;day 156 is wild for someone who said this was a phase&rdquo;</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Reactions & Comments</h3>
                    <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Six typed reactions. Friends react in your language without keyboard hunting.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW — 4 steps -------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>How It Works</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-3xl"
                style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                From spiral to share.
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)" }}>Four steps. Same journal, every time.</span>
              </h2>
            </RevealSection>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                { n: "1", title: "Log", body: "Drop the fix. Name it, pick a category, set intensity 1–10. 30 seconds." },
                { n: "2", title: "Count", body: "Day counter starts. Check in daily. The number tells the truth your mouth won't." },
                { n: "3", title: "Share", body: "Every fix renders to a 9:16 card. Post it. Watch the group chat lose it." },
                { n: "4", title: "Mourn", body: "When it fades, write the eulogy. File it in the graveyard. Move on." },
              ].map((step, i) => (
                <RevealSection key={step.n} delay={200 + i * 100}>
                  <div className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <GrainOverlay opacity={0.18} />
                    <div className="relative">
                      <div
                        className="font-display tabular-nums mb-4"
                        style={{
                          fontSize: 56,
                          color: TEAL,
                          fontWeight: 700,
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                          textShadow: "0 0 32px rgba(94,234,212,0.4)",
                        }}
                      >
                        {step.n}
                      </div>
                      <h3 className="font-display text-ink" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
                        {step.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {step.body}
                      </p>
                    </div>
                  </div>
                </RevealSection>
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
              {features.map((f, i) => (
                <RevealSection key={f.title} delay={i * 90}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 280 }}
                  >
                    <GrainOverlay opacity={0.22} />
                    <div className="relative flex flex-col h-full">
                      <div className="anim-floatY" style={{ display: "inline-block", animationDelay: `${i * 0.35}s` }}>
                        <IconTile>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                        </IconTile>
                      </div>
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
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS -------------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <div className="flex items-center gap-3 flex-wrap">
              <EyebrowPill>Loved by the unwell</EyebrowPill>
              <span
                className="inline-flex items-center gap-2 font-mono text-xs rounded-full px-3 py-1.5"
                style={{ background: TEAL_DARK_BG, color: TEAL, border: `1px solid ${TEAL_DARK_BORDER}` }}
              >
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: TEAL }}>★</span>
                  ))}
                </span>
                4.9 / 5
                <span style={{ color: "rgba(94,234,212,0.55)" }}>· from early members</span>
              </span>
            </div>
            <h2
              className="mt-7 font-display text-ink max-w-3xl"
              style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
            >
              People who hyperfix
              <br />
              don&apos;t go back.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              From the chronically online to the deeply private — here&apos;s what
              early members are saying about their fixes.
            </p>

            <div className="mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
              {reviews.map((r, i) => (
                <RevealSection key={r.name} delay={i * 100}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full"
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
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* SEO HUB -------------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>Built for Every Obsession</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-2xl"
                style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Whatever You&apos;re
                <br />
                Unwell About.
              </h2>
            </RevealSection>
            <RevealSection delay={200}>
              <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Hyperfix works for every kind of hyperfixation — songs, fanfic, shows, K-pop, anime, books, ships, video games, and everything in between.
              </p>
            </RevealSection>

            {/* Niche tracker links */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { href: "/kpop-tracker", label: "K-pop Tracker", Icon: MicIcon, desc: "Bias eras, albums, concert runs" },
                { href: "/anime-tracker", label: "Anime Tracker", Icon: SparkleIcon, desc: "Current season, rewatch, OP loops" },
                { href: "/fanfic-tracker", label: "Fanfic Tracker", Icon: BookIcon, desc: "WIPs, re-reads, fandom phases" },
                { href: "/rewatch-tracker", label: "Rewatch Tracker", Icon: RepeatIcon, desc: "The show you can't stop" },
                { href: "/booktok-tracker", label: "BookTok Tracker", Icon: LibraryIcon, desc: "Reading era, TBR, five-stars" },
                { href: "/adhd", label: "ADHD Hyperfixation", Icon: BoltIcon, desc: "Built for the way your brain works" },
              ].map((item, i) => (
                <RevealSection key={item.href} delay={300 + i * 60}>
                  <a
                    href={item.href}
                    className="motion-card relative overflow-hidden flex flex-col gap-2 rounded-2xl p-5 h-full transition-all hover:-translate-y-0.5 group"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                  >
                    <GrainOverlay opacity={0.18} />
                    <div className="relative">
                      <div
                        className="flex items-center justify-center rounded-xl transition-colors group-hover:text-[#5EEAD4]"
                        style={{
                          width: 36,
                          height: 36,
                          background: "rgba(94,234,212,0.06)",
                          border: "1px solid rgba(94,234,212,0.15)",
                          color: TEAL,
                        }}
                      >
                        <item.Icon size={18} />
                      </div>
                      <p className="font-display text-sm font-semibold mt-3" style={{ color: "#F4F4F4" }}>{item.label}</p>
                      <p className="font-sans text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                    </div>
                  </a>
                </RevealSection>
              ))}
            </div>

            {/* Popular fixations — programmatic SEO landing pages */}
            <RevealSection delay={650}>
              <div className="mt-10 rounded-2xl p-5 sm:p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Popular fixations
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "/track/severance", label: "Severance" },
                    { href: "/track/taylor-swift", label: "Taylor Swift" },
                    { href: "/track/bts", label: "BTS" },
                    { href: "/track/baldurs-gate-3", label: "Baldur's Gate 3" },
                    { href: "/track/acotar", label: "ACOTAR" },
                    { href: "/track/jujutsu-kaisen", label: "Jujutsu Kaisen" },
                    { href: "/track/chappell-roan", label: "Chappell Roan" },
                    { href: "/track/the-bear", label: "The Bear" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center font-mono text-xs rounded-full px-3 py-1.5 transition-all hover:opacity-80"
                      style={{
                        background: "rgba(94,234,212,0.06)",
                        border: "1px solid rgba(94,234,212,0.18)",
                        color: "rgba(167,243,208,0.85)",
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* vs. comparison links */}
            <RevealSection delay={700}>
              <div className="mt-4 rounded-2xl p-5 sm:p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  How Hyperfix compares
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "/vs/notion", label: "vs. Notion" },
                    { href: "/vs/letterboxd", label: "vs. Letterboxd" },
                    { href: "/vs/goodreads", label: "vs. Goodreads" },
                    { href: "/vs/daylio", label: "vs. Daylio" },
                    { href: "/vs/spotify", label: "vs. Spotify" },
                    { href: "/vs/obsidian", label: "vs. Obsidian" },
                    { href: "/vs/discord", label: "vs. Discord" },
                    { href: "/vs/spreadsheet", label: "vs. Spreadsheets" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center font-mono text-xs rounded-full px-3 py-1.5 transition-all hover:opacity-80"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Blog links */}
            <RevealSection delay={800}>
              <div className="mt-4 rounded-2xl p-5 sm:p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  From the blog
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { href: "/blog/what-is-hyperfixation", label: "What is hyperfixation?" },
                    { href: "/blog/adhd-hyperfixation", label: "ADHD and hyperfixation: what's really happening" },
                    { href: "/blog/signs-youre-in-a-hyperfixation", label: "10 signs you're deep in a hyperfixation" },
                    { href: "/blog/how-to-track-your-hyperfixations", label: "How to track your hyperfixations" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="font-sans text-sm transition-colors hover:text-[#5EEAD4]"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      → {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>
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
                Pro for the Obsessed.
              </h2>
              <p className="mt-5 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Hyperfix is free to use. Pro unlocks unlimited fixes, premium card
                templates, and the full toolkit. Cancel anytime.
              </p>
            </div>

            <div className="mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Free plan */}
              <RevealSection delay={0}>
              <div
                className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full"
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
              </RevealSection>

              {/* Pro plan — solid teal */}
              <RevealSection delay={140}>
              <div
                className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full anim-glowPulse"
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
                      Popular
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
                  <ProCheckoutButton
                    className="mt-10 inline-flex w-full items-center justify-center gap-2 font-sans text-base font-semibold px-6 py-4 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                    style={{ background: "#0A1F1C", color: TEAL, borderRadius: 999 }}
                    label="Get Pro"
                  />
                </div>
              </div>
              </RevealSection>
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
                <RevealSection key={i} delay={i * 60}>
                <details
                  className="group [&_summary::-webkit-details-marker]:hidden motion-card relative overflow-hidden rounded-2xl"
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
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA ------------------------------------------------------ */}
        <section className="relative px-6 sm:px-10 pt-12 pb-24 sm:pb-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <div
            className="relative overflow-hidden rounded-3xl mx-auto max-w-5xl px-6 sm:px-10 py-24 sm:py-36 text-center"
            style={{ background: "#0A0A0B" }}
          >
            {/* Breathing radial bloom */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none anim-bloom"
              style={{
                background:
                  "radial-gradient(ellipse 90% 100% at 50% 100%, #5EEAD4 0%, #2DD4BF 20%, #0E4F47 45%, #08231F 70%, #0A0A0B 100%)",
                transformOrigin: "50% 100%",
              }}
            />
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
              <RevealSection>
                <h2
                  className="font-display text-ink mx-auto max-w-3xl"
                  style={{ fontSize: "clamp(42px, 7vw, 80px)", lineHeight: 1.03, letterSpacing: "-0.02em", fontWeight: 600 }}
                >
                  Log your obsession
                  <br />
                  like a person who has one.
                </h2>
              </RevealSection>
              <RevealSection delay={150}>
                <p className="mt-7 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                  Free forever. No card. 30 seconds to your first day count. {publicFixCount.toLocaleString()}+ fixations already logged.
                </p>
              </RevealSection>
              <RevealSection delay={300}>
                <div className="mt-10 flex justify-center">
                  <a
                    href="/join"
                    className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "#FFFFFF",
                      color: "#0A0A0A",
                      borderRadius: 999,
                      boxShadow:
                        "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 60px rgba(94,234,212,0.30)",
                    }}
                  >
                    Log Your First Fix
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        <Footer />
        <Suspense fallback={null}>
          <ActivityTicker />
        </Suspense>
      </main>
    </>
  );
}
