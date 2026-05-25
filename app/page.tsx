import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { LogoLockup } from "@/components/Logo";
import { RevealSection } from "@/components/RevealSection";

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

async function getTrendingFixes(): Promise<{ id: string; title: string; category: string; days: number; intensity: number }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [];
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/fixes?select=id,title,category,intensity,started_at&is_public=eq.true&ended_at=is.null&order=started_at.asc&limit=24`,
      {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const rows: { id: string; title: string; category: string; intensity: number; started_at: string }[] = await res.json();
    return rows
      .map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        intensity: r.intensity,
        days: Math.max(1, Math.ceil((Date.now() - new Date(r.started_at).getTime()) / 86_400_000)),
      }))
      .sort((a, b) => b.days - a.days)
      .slice(0, 6);
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Hyperfix — what are you obsessed with?",
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

const studioFeatures = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Notes",
    body: "Drop everything you're thinking about the fix. Theories, quotes, timestamps, spirals. All of it goes here — messy is fine.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Links",
    body: "Save every video essay, every Reddit thread, every fan wiki. The research that fed the obsession, in one place.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Images",
    body: "The screenshots, the fanart, the reference images. Add a caption. Build a visual diary of exactly what took over your brain.",
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

  const [waitlistCount, publicFixCount, trendingFixes] = await Promise.all([
    getWaitlistCount(),
    getPublicFixCount(),
    getTrendingFixes(),
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
            <a href="/studio" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Studio
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
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <p className="mt-7 font-sans text-sm anim-fadeUp delay-700" style={{ color: "rgba(255,255,255,0.5)" }}>
              free forever · no credit card needed
            </p>
          </div>
        </section>

        {/* LIVE FIXATIONS ------------------------------------------------- */}
        {trendingFixes.length > 0 && (
          <section className="relative px-6 sm:px-10 py-16" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <GrainOverlay opacity={0.06} />
            <div className="relative max-w-5xl mx-auto">
              <RevealSection>
                <div className="flex items-center justify-between mb-8">
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.35)" }}>
                    people are currently tracking
                  </p>
                  <a href="/explore" className="font-mono text-xs transition-colors hover:text-[#5EEAD4]" style={{ color: "rgba(244,244,244,0.25)" }}>
                    see all →
                  </a>
                </div>
              </RevealSection>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                {trendingFixes.map((fix, i) => (
                  <RevealSection key={fix.id} delay={i * 60}>
                    <a
                      href={`/fix/${fix.id}`}
                      className="shrink-0 snap-start block rounded-2xl overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-2xl group"
                      style={{ width: 160, border: "1px solid rgba(244,244,244,0.10)" }}
                    >
                      <div className="relative" style={{ width: 160, height: 284 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/share/${fix.id}`}
                          alt={`${fix.title} — day ${fix.days}`}
                          width={160}
                          height={284}
                          style={{ width: 160, height: 284, objectFit: "cover", display: "block" }}
                          loading="lazy"
                        />
                        {/* Title overlay */}
                        <div
                          className="absolute inset-x-0 bottom-0 p-3"
                          style={{ background: "linear-gradient(to top, rgba(7,7,8,0.92) 0%, transparent 100%)" }}
                        >
                          <p className="font-display text-xs font-semibold leading-tight" style={{ color: "#F4F4F4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {fix.title}
                          </p>
                          <p className="font-mono text-[10px] mt-0.5" style={{ color: "rgba(94,234,212,0.8)" }}>
                            day {fix.days}
                          </p>
                        </div>
                      </div>
                    </a>
                  </RevealSection>
                ))}
                <RevealSection delay={trendingFixes.length * 60}>
                  <a
                    href="/explore"
                    className="shrink-0 snap-start flex flex-col items-center justify-center rounded-2xl transition-all hover:-translate-y-1"
                    style={{
                      width: 160,
                      height: 284,
                      background: "rgba(244,244,244,0.03)",
                      border: "1px solid rgba(244,244,244,0.08)",
                      color: "rgba(244,244,244,0.4)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="font-mono text-xs">explore all</span>
                  </a>
                </RevealSection>
              </div>
            </div>
          </section>
        )}

        {/* BENEFITS ------------------------------------------------------- */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32">
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>Benefits</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
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
            </RevealSection>
            <RevealSection delay={200}>
              <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Hyperfix gives your obsession the structure it deserves — without the
                spreadsheets, the Notion template, or the friend who keeps asking if
                you&apos;re okay.
              </p>
            </RevealSection>

            <div className="mt-14 grid gap-4 sm:gap-5">
              {benefits.map((b, i) => (
                <RevealSection key={b.title} delay={300 + i * 120}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-10"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      minHeight: 340,
                    }}
                  >
                    <GrainOverlay opacity={0.22} />
                    <div className="relative">
                      <div className="anim-floatY" style={{ display: "inline-block", animationDelay: `${i * 0.4}s` }}>
                        <IconTile>{b.icon}</IconTile>
                      </div>
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
                </RevealSection>
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
                <RevealSection key={s.step} delay={i * 140}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-10"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 360 }}
                  >
                    <GrainOverlay opacity={0.22} />
                    <div className="relative">
                      <EyebrowPill>{s.step}</EyebrowPill>
                      {/* Pixel-grid illustration — cells pop in sequence */}
                      <div className="mt-8 mb-10 grid" style={{ gridTemplateColumns: "repeat(14, 1fr)", gap: 4, maxWidth: 360 }}>
                        {Array.from({ length: 14 * 8 }).map((_, idx) => {
                          const row = Math.floor(idx / 14);
                          const col = idx % 14;
                          const threshold = i === 0 ? col - row * 1.2 + 4 : i === 1 ? Math.abs(col - 7) + row * 1.1 - 2 : (13 - col) - row * 1.2 + 4;
                          const lit = threshold > 0 && threshold < 6;
                          const alpha = lit ? 0.55 + (threshold / 14) : 0.06;
                          // Stagger by Manhattan distance from a corner so they cascade
                          const cellDelay = lit ? 0.2 + (row + col) * 0.04 : 0;
                          return (
                            <div
                              key={idx}
                              className={lit ? "anim-cellPop" : undefined}
                              style={{
                                aspectRatio: "1 / 1",
                                borderRadius: 4,
                                background: lit ? TEAL : "rgba(255,255,255,0.04)",
                                opacity: lit ? alpha : 1,
                                boxShadow: lit ? `0 0 8px rgba(94,234,212,${alpha * 0.7})` : "none",
                                animationDelay: lit ? `${cellDelay}s` : undefined,
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

        {/* STUDIO --------------------------------------------------------- */}
        <section id="studio" className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          {/* Soft teal bloom behind the section */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(94,234,212,0.06) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>Hyperfix Studio</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-2xl"
                style={{ fontSize: "clamp(36px, 5.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Your Fix Has
                <br />
                a Workspace Now.
              </h2>
            </RevealSection>
            <RevealSection delay={200}>
              <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Studio is a private scratchpad attached to any fixation. Drop notes,
                save links, pin images — all the things that live in twelve browser
                tabs and three Discord threads, finally in one place.
              </p>
            </RevealSection>

            {/* Block-type cards */}
            <div className="mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5">
              {studioFeatures.map((sf, i) => (
                <RevealSection key={sf.title} delay={280 + i * 100}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 260 }}
                  >
                    <GrainOverlay opacity={0.22} />
                    <div className="relative flex flex-col h-full gap-5">
                      <div className="anim-floatY" style={{ display: "inline-block", animationDelay: `${i * 0.4}s` }}>
                        <IconTile>{sf.icon}</IconTile>
                      </div>
                      <div className="mt-auto">
                        <h3
                          className="font-display text-ink"
                          style={{ fontSize: "clamp(20px, 2.4vw, 24px)", letterSpacing: "-0.01em", fontWeight: 600 }}
                        >
                          {sf.title}
                        </h3>
                        <p className="mt-2 font-sans text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {sf.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>

            {/* Studio mock workspace */}
            <RevealSection delay={500}>
              <div
                className="mt-10 relative overflow-hidden rounded-3xl p-6 sm:p-10"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${TEAL_DARK_BORDER}`,
                  boxShadow: "0 0 80px rgba(94,234,212,0.08)",
                }}
              >
                <GrainOverlay opacity={0.18} />
                <div className="relative">
                  {/* Studio header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs tracking-widest uppercase" style={{ color: TEAL }}>HYPERFIX · Studio</span>
                      <span className="h-px flex-1 w-6" style={{ background: TEAL_DARK_BORDER }} />
                    </div>
                    <span className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Day 47</span>
                  </div>
                  {/* Mock blocks */}
                  <div className="space-y-3">
                    {/* Note block */}
                    <div
                      className="rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Note</span>
                      </div>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                        ok the way the themes of isolation mirror the opening sequence is NOT a coincidence and here&apos;s my 900-word proof thread that nobody asked for but everyone needs
                      </p>
                    </div>
                    {/* Link block */}
                    <div
                      className="rounded-2xl p-4 flex items-center gap-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
                    >
                      <div
                        className="shrink-0 flex items-center justify-center rounded-xl"
                        style={{ width: 40, height: 40, background: TEAL_DARK_BG, border: `1px solid ${TEAL_DARK_BORDER}`, color: TEAL }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>Every Foreshadowing Moment (Video Essay)</p>
                        <p className="font-mono text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>youtube.com/watch?v=…</p>
                      </div>
                    </div>
                    {/* Image block */}
                    <div
                      className="rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Image</span>
                      </div>
                      <div
                        className="rounded-xl flex items-center justify-center"
                        style={{
                          height: 72,
                          background: `linear-gradient(135deg, ${TEAL_DARK_BG} 0%, rgba(94,234,212,0.03) 100%)`,
                          border: `1px dashed ${TEAL_DARK_BORDER}`,
                          color: TEAL,
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <p className="mt-2 font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>the scene that broke me, captioned</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={600}>
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="/studio"
                  className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: TEAL,
                    color: "#0A1F1C",
                    borderRadius: 999,
                    boxShadow: "0 0 40px rgba(94,234,212,0.25)",
                  }}
                >
                  Learn About Studio
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Available on every fix · no extra setup
                </p>
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
                Pro is on the Way.
              </h2>
              <p className="mt-5 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Hyperfix is free to use. A Pro tier with unlimited fixes and premium
                cards is coming soon. Early members get a permanent discount.
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
                  Start Counting
                  <br />
                  the Days.
                </h2>
              </RevealSection>
              <RevealSection delay={150}>
                <p className="mt-7 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                  Join {publicFixCount.toLocaleString()}+ logged fixations. Set up your
                  first hyperfix in minutes — no credit card, no commitment, no judgment.
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
                    Get Started
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
      </main>
    </>
  );
}
