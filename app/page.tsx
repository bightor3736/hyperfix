import type { Metadata } from "next";
import { Suspense } from "react";
import ActivityTicker from "@/components/ActivityTicker";
import Footer from "@/components/Footer";
import { LogoLockup } from "@/components/Logo";
import { RevealSection } from "@/components/RevealSection";
import { InteractiveHeroDemo } from "@/components/InteractiveHeroDemo";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";

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
  title: "Hyperfix — Hyperfixation Tracker for ADHD & Neurodivergent Brains",
  description:
    "The hyperfixation tracker built for ADHD and neurodivergent brains. Log your special interest or obsession, count the days, build streaks, share cards, write the eulogy. Free forever.",
  keywords: [
    "hyperfixation tracker",
    "ADHD hyperfixation",
    "neurodivergent tracker",
    "special interest tracker",
    "ADHD app",
    "hyperfixation journal",
    "ADHD obsession log",
    "track obsessions",
    "ADHD tools",
    "neurodivergent app",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — Hyperfixation Tracker for ADHD Brains",
    description:
      "Log the obsession. Count the days. Mourn it when it ends. Built for ADHD and neurodivergent brains — free forever.",
    url: "https://hyperfix.app",
    type: "website",
  },
};

const TEAL = "#5EEAD4";
const TEAL_DEEP = "#2DD4BF";
const TEAL_DARK_BG = "rgba(94,234,212,0.10)";
const TEAL_DARK_BORDER = "rgba(94,234,212,0.22)";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const PAGE_BG = "#070708";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const features = [
  { title: "Day counter", body: "Your obsession ages in real time. The number is the proof." },
  { title: "Intensity meter", body: "Log how bad it is 1–10. Watch the spikes. Lie to yourself less." },
  { title: "Share cards", body: "Every fix renders to a 9:16 card. Drop it in the chat. No explanation needed." },
  { title: "Streaks & heatmap", body: "Daily check-ins. The shape of your spiral over weeks and months." },
  { title: "Eulogies", body: "When the fix finally dies, write the obituary. File it in the graveyard." },
  { title: "Public profile", body: "Your hyperfixations, public. Followers see the eras as they unfold." },
];

const faqs = [
  { q: "Is this an ADHD app?", a: "Basically, yes. Hyperfixation is a core ADHD and neurodivergent experience — your brain locks onto something and won't let go. Hyperfix is built around that: log the fix, track the intensity, check in daily, write the eulogy when it fades. Whether you're diagnosed, self-identified, or just extremely down bad about something, you belong here." },
  { q: "What exactly is Hyperfix?", a: "A journal for your current obsession — the song on loop, the fic you can't quit, the character who rearranged your brain. You log the fix, count the days, check in daily, and when it fades, you write the eulogy." },
  { q: "Is it free?", a: "Yes. Logging, check-ins, streaks, share cards — free forever. Pro unlocks premium card templates, AI eulogies, and a custom profile URL. Cancel anytime." },
  { q: "Is my data private?", a: "Every fix has a privacy toggle. Public lives on your profile, private is yours alone. We never sell your data and we don't train AI on your content." },
  { q: "What can I track?", a: "Anything. Songs, films, fanfics, shows, books, characters, ships, video essays, podcasts, video games, niche historical events — and yes, special interests too. If you cannot shut up about it, it counts." },
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

  const publicFixCount = await getPublicFixCount();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
    logo: "https://hyperfix.app/icon?size=512",
    description: "The hyperfixation tracker built for ADHD and neurodivergent brains. Log your special interest, count the days, write the eulogy.",
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
        {/* NAV */}
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
            <a href="#pricing" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Pricing
            </a>
            <a href="/auth/login" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
              Log in
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

        {/* HERO */}
        <section className="relative overflow-hidden px-6 sm:px-10 pt-16 sm:pt-20 pb-20 sm:pb-28">
          {/* Teal radial bloom */}
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
            <div className="flex justify-center mb-6 anim-fadeUp">
              <EyebrowPill>
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="anim-glowPulse absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: TEAL }} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} />
                  </span>
                  {publicFixCount.toLocaleString()}+ obsessions logged
                </span>
              </EyebrowPill>
            </div>

            <h1
              className="font-display text-ink anim-fadeUp delay-100"
              style={{
                fontSize: "clamp(44px, 8.5vw, 88px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              The journal for
              <br />
              your ADHD brain.
            </h1>

            <p
              className="mt-6 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-300"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Log the hyperfixation. Count the days. Share the card. Mourn it when it ends.
              <br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Built for ADHD brains. Free forever. 30 seconds to day one.</span>
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center anim-fadeUp delay-500">
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
                Log your first fix
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#try"
                className="inline-flex items-center gap-2 font-sans text-base px-6 py-4 transition-all hover:opacity-80"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                or try the demo ↓
              </a>
            </div>

            {/* Interactive demo */}
            <div id="try" className="mt-14 sm:mt-20 anim-fadeUp delay-700">
              <InteractiveHeroDemo />
            </div>
          </div>
        </section>

        {/* FEATURES — condensed */}
        <section id="features" className="relative px-6 sm:px-10 py-20 sm:py-28" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto">
              <EyebrowPill>Built for ADHD brains</EyebrowPill>
              <h2
                className="mt-6 font-display text-ink"
                style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Everything one hyperfixation needs.
              </h2>
              <p className="mt-4 font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Six tools, one journal. For the brain that can&apos;t half-ass a special interest.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <RevealSection key={f.title} delay={i * 80}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                  >
                    <GrainOverlay opacity={0.18} />
                    <div className="relative">
                      <span
                        className="font-display tabular-nums"
                        style={{
                          fontSize: 32,
                          color: TEAL,
                          fontWeight: 700,
                          letterSpacing: "-0.04em",
                          textShadow: "0 0 20px rgba(94,234,212,0.35)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-ink mt-3" style={{ fontSize: 20, letterSpacing: "-0.01em", fontWeight: 600 }}>
                        {f.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {f.body}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="relative px-6 sm:px-10 py-20 sm:py-28" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center">
              <EyebrowPill>Pricing</EyebrowPill>
              <h2
                className="mt-6 font-display text-ink mx-auto max-w-2xl"
                style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Free forever. Pro for the obsessed.
              </h2>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-4 sm:gap-5">
              <RevealSection delay={0}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <GrainOverlay opacity={0.22} />
                  <div className="relative">
                    <h3 className="font-display text-ink" style={{ fontSize: 26, fontWeight: 600 }}>Free</h3>
                    <p className="mt-2 font-sans text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Everything you need to log, count, and share.
                    </p>
                    <p className="mt-6 font-display text-ink" style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em" }}>
                      $0<span className="font-sans text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>/mo</span>
                    </p>
                    <ul className="mt-6 space-y-3">
                      {["Unlimited fixes", "Daily check-ins", "Streaks & heatmap", "Share cards", "Public profile", "Eulogies"].map((line) => (
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
                      className="mt-8 inline-flex w-full items-center justify-between font-sans text-base font-semibold px-6 py-4 transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "#FFFFFF",
                        borderRadius: 999,
                        border: `1px solid ${CARD_BORDER}`,
                      }}
                    >
                      Get started free
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </RevealSection>

              <RevealSection delay={140}>
                <div className="relative h-full">
                  {/* Subtle teal bloom behind Pro card */}
                  <div
                    aria-hidden
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-40px -40px -40px -40px",
                      background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(94,234,212,0.16) 0%, transparent 70%)",
                      filter: "blur(24px)",
                      zIndex: 0,
                    }}
                  />
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${TEAL_DARK_BORDER}`,
                      boxShadow: "0 0 0 1px rgba(94,234,212,0.06), 0 24px 60px rgba(94,234,212,0.10)",
                    }}
                  >
                    <GrainOverlay opacity={0.22} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-ink" style={{ fontSize: 26, fontWeight: 600 }}>Pro</h3>
                        <span
                          className="font-mono text-[10px] tracking-widest uppercase rounded-full px-2.5 py-1"
                          style={{ background: TEAL_DARK_BG, color: TEAL, border: `1px solid ${TEAL_DARK_BORDER}` }}
                        >
                          Popular
                        </span>
                      </div>
                      <p className="font-sans text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
                        For the ADHD brain that wants the full toolkit.
                      </p>
                      <div className="mt-6 flex items-baseline gap-3 flex-wrap">
                        <p className="font-display text-ink" style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em" }}>
                          <span style={{ color: TEAL }}>$5</span>
                          <span className="font-sans text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>/mo</span>
                        </p>
                        <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                          or $39/year · save 35%
                        </p>
                      </div>
                      <ul className="mt-6 space-y-3">
                        {["Everything in Free", "Premium card templates", "Custom profile URL", "AI eulogy generator", "Hyperfix Wrapped", "Priority support"].map((line) => (
                          <li key={line} className="flex items-center gap-3 font-sans text-base" style={{ color: "rgba(255,255,255,0.82)" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            {line}
                          </li>
                        ))}
                      </ul>
                      <ProCheckoutButton
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 font-sans text-base font-semibold px-6 py-4 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                        style={{ background: TEAL, color: "#0A1F1C", borderRadius: 999 }}
                        label="Get Pro"
                      />
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative px-6 sm:px-10 py-20 sm:py-28" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center">
              <EyebrowPill>FAQ</EyebrowPill>
              <h2
                className="mt-6 font-display text-ink"
                style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Common questions.
              </h2>
            </div>

            <div className="mt-12 flex flex-col gap-3">
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

        {/* FINAL CTA */}
        <section className="relative px-6 sm:px-10 pt-12 pb-20 sm:pb-28" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <div
            className="relative overflow-hidden rounded-3xl mx-auto max-w-5xl px-6 sm:px-10 py-20 sm:py-28 text-center"
            style={{ background: "#0A0A0B" }}
          >
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
                  style={{ fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.03, letterSpacing: "-0.02em", fontWeight: 600 }}
                >
                  Your brain hyperfixes.
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>Let&apos;s log it properly.</span>
                </h2>
              </RevealSection>
              <RevealSection delay={150}>
                <p className="mt-6 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                  Free forever. No card. 30 seconds to day one. {publicFixCount.toLocaleString()}+ fixations already logged.
                </p>
              </RevealSection>
              <RevealSection delay={300}>
                <div className="mt-8 flex justify-center">
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
                    Log your first fix
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
