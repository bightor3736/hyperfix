import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { LogoLockup } from "@/components/Logo";
import { RevealSection } from "@/components/RevealSection";
import {
  TRACK_ITEMS,
  TRACK_SLUGS,
  getTrackItem,
  getRelatedItems,
  CATEGORY_LABEL,
} from "@/lib/track-data";

// ---- DESIGN TOKENS ---------------------------------------------------------

const TEAL = "#5EEAD4";
const TEAL_DARK_BG = "rgba(94,234,212,0.10)";
const TEAL_DARK_BORDER = "rgba(94,234,212,0.22)";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const PAGE_BG = "#070708";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// ---- STATIC PARAMS / METADATA ----------------------------------------------

export const dynamicParams = false;

export function generateStaticParams() {
  return TRACK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getTrackItem(slug);
  if (!item) return {};

  const title = `${item.name} Tracker — Hyperfix`;
  const description = `Track your ${item.name} hyperfixation. Day counter, streak, share card. Free forever. ${item.trackingCount.toLocaleString()}+ people tracking ${item.name} on Hyperfix.`;
  const url = `https://hyperfix.app/track/${slug}`;
  const ogImage = `/api/og/track/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${item.name} on Hyperfix` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ---- HELPERS ---------------------------------------------------------------

function GrainOverlay({ opacity }: { opacity: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none mix-blend-overlay"
      style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity }}
    />
  );
}

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.22em] rounded-full px-3 py-1.5"
      style={{ background: TEAL_DARK_BG, color: TEAL, border: `1px solid ${TEAL_DARK_BORDER}` }}
    >
      {children}
    </span>
  );
}

// ---- ICONS (monoline SVG) --------------------------------------------------

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconClock() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconPulse() {
  return (
    <svg {...iconProps}>
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8" />
      <path d="M7 9h6M7 13h4" />
    </svg>
  );
}

// ---- PAGE ------------------------------------------------------------------

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getTrackItem(slug);
  if (!item) notFound();

  const related = getRelatedItems(item);
  const shareCount = Math.round(item.trackingCount * 0.62);
  const categoryLabel = CATEGORY_LABEL[item.category];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
      { "@type": "ListItem", position: 2, name: "Track", item: "https://hyperfix.app/explore" },
      { "@type": "ListItem", position: 3, name: item.name, item: `https://hyperfix.app/track/${slug}` },
    ],
  };

  const faqs = [
    {
      q: `How do I track ${item.name} on Hyperfix?`,
      a: `Open Hyperfix, tap new fix, type "${item.name}". The day counter starts immediately. From there you can update the intensity, log notes, and when the era finally lifts, write a eulogy. Most people in the ${item.name} fixation run it for around ${item.avgDays} days before it shifts.`,
    },
    {
      q: `Can I track multiple ${item.name} fixations at once?`,
      a: `Yes. Every fix is its own entry — so if you're spiraling on a specific scene, a specific song, a specific character arc and the broader ${item.name} brain rot, you can run them in parallel. Hyperfix is built for the way fixations actually work: layered, overlapping, and rarely just one thing.`,
    },
    {
      q: `Is the ${item.name} tracker free?`,
      a: `Yes. The day counter, intensity log, share cards, and eulogy are free forever. No credit card, no trial timer, no upsell wall around the basics. Pro unlocks unlimited active fixes and the full graveyard archive — but the ${item.name} tracker itself costs nothing.`,
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main id="main-content" className="relative z-10 text-ink" style={{ background: PAGE_BG }}>
        {/* NAV — matches landing page */}
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
            <a href="/#features" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
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
            <a href="/#pricing" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
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

        {/* HERO */}
        <section className="relative overflow-hidden px-6 sm:px-10 pt-20 sm:pt-28 pb-20 sm:pb-28">
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
            <div className="anim-fadeUp">
              <EyebrowPill>Hyperfixation Tracker for</EyebrowPill>
            </div>
            <h1
              className="mt-6 font-display text-ink anim-fadeUp delay-100"
              style={{
                fontSize: "clamp(48px, 9vw, 96px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              {item.name}
            </h1>

            <p
              className="mt-7 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-300"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Count the days. Build the streak. Mourn it when it ends. Free hyperfixation tracker built for {categoryLabel}.
            </p>

            <div className="mt-10 flex justify-center anim-fadeUp delay-500">
              <a
                href={`/join?prefill=${encodeURIComponent(item.name)}`}
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

            <p className="mt-6 font-sans text-sm anim-fadeUp delay-700" style={{ color: "rgba(255,255,255,0.5)" }}>
              free forever · no card · 30 seconds
            </p>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="relative px-6 sm:px-10 py-14" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: item.trackingCount.toLocaleString(), label: `people tracking ${item.name}` },
              { value: `${item.avgDays}`, label: "day average run" },
              { value: shareCount.toLocaleString(), label: "share cards exported" },
            ].map((stat, i) => (
              <RevealSection key={i} delay={100 + i * 80}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <GrainOverlay opacity={0.18} />
                  <div className="relative">
                    <p
                      className="font-display tabular-nums"
                      style={{ fontSize: 44, color: TEAL, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="mt-3 font-mono text-[11px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* HOW IT TRACKS — three product cards */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-6xl mx-auto">
            <RevealSection>
              <EyebrowPill>How it works</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-3xl"
                style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                How Hyperfix tracks
                <br />
                <span style={{ color: TEAL }}>{item.name}.</span>
              </h2>
            </RevealSection>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Day Counter */}
              <RevealSection delay={200}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}
                >
                  <GrainOverlay opacity={0.18} />
                  <div className="relative flex flex-col h-full">
                    <div
                      className="rounded-2xl p-5 mb-4"
                      style={{ background: "rgba(94,234,212,0.05)", border: `1px solid ${TEAL_DARK_BORDER}` }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          className="font-display tabular-nums"
                          style={{ fontSize: 56, color: TEAL, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em" }}
                        >
                          {item.avgDays}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(94,234,212,0.6)" }}>
                          days
                        </span>
                      </div>
                      <p className="font-sans text-sm mt-3" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {item.name.toLowerCase()}
                      </p>
                      <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full anim-glowPulse" style={{ width: "78%", background: TEAL, boxShadow: `0 0 8px ${TEAL}` }} />
                      </div>
                      <p className="font-mono text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>intensity 8/10</p>
                    </div>
                    <div className="mt-auto">
                      <div style={{ color: TEAL }} className="mb-3">
                        <IconClock />
                      </div>
                      <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Day Counter</h3>
                      <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Your {item.name} era in real time. Day 1, day {item.avgDays}, day whenever it lifts.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* Intensity */}
              <RevealSection delay={280}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}
                >
                  <GrainOverlay opacity={0.18} />
                  <div className="relative flex flex-col h-full">
                    <div
                      className="rounded-2xl p-5 mb-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
                    >
                      <div className="flex items-end gap-1.5 h-24">
                        {[3, 5, 6, 8, 7, 9, 10, 9, 8, 8, 7, 6].map((h, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: `${h * 10}%`,
                              background: i > 8 ? "rgba(94,234,212,0.4)" : TEAL,
                              opacity: i > 8 ? 0.5 : 0.3 + i * 0.06,
                              borderRadius: 2,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3 font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <span>week 1</span>
                        <span style={{ color: TEAL }}>peak 10/10</span>
                        <span>now</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div style={{ color: TEAL }} className="mb-3">
                        <IconPulse />
                      </div>
                      <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Intensity Tracking</h3>
                      <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Log how bad it is, daily. Watch the {item.name} curve spike, plateau, fade.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* Share cards */}
              <RevealSection delay={360}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-6 h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 320 }}
                >
                  <GrainOverlay opacity={0.18} />
                  <div className="relative flex flex-col h-full">
                    <div
                      className="rounded-2xl p-4 mb-4 flex items-center justify-center"
                      style={{ background: "#F4EFE6", aspectRatio: "9/12", maxHeight: 180 }}
                    >
                      <div className="text-center" style={{ color: "#111" }}>
                        <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: "rgba(17,17,17,0.4)" }}>
                          hyperfix · day {item.avgDays}
                        </p>
                        <p className="font-display mt-1.5" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
                          {item.name}
                        </p>
                        <p
                          className="font-display tabular-nums mt-2"
                          style={{ fontSize: 32, color: "#D72638", fontWeight: 700, lineHeight: 1 }}
                        >
                          9<span style={{ fontSize: 16, color: "rgba(17,17,17,0.4)" }}>/10</span>
                        </p>
                        <p className="font-mono text-[7px] mt-2" style={{ color: "rgba(17,17,17,0.4)" }}>
                          i&apos;m so normal about this
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div style={{ color: TEAL }} className="mb-3">
                        <IconShare />
                      </div>
                      <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600 }}>Share Cards</h3>
                      <p className="mt-1.5 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Every {item.name} fix renders to a card. Drop it in the chat. No explanation needed.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="relative px-6 sm:px-10 py-20" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <GrainOverlay opacity={0.08} />
            <div className="relative max-w-5xl mx-auto">
              <RevealSection>
                <EyebrowPill>Adjacent obsessions</EyebrowPill>
              </RevealSection>
              <RevealSection delay={100}>
                <h2
                  className="mt-6 font-display text-ink max-w-2xl"
                  style={{ fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600 }}
                >
                  Other things tracked by{" "}
                  <span style={{ color: TEAL }}>{item.name}</span> fans.
                </h2>
              </RevealSection>
              <div className="mt-8 flex flex-wrap gap-2">
                {related.map((r) => (
                  <a
                    key={r.slug}
                    href={`/track/${r.slug}`}
                    className="inline-flex items-center font-sans text-sm rounded-full px-4 py-2 transition-all hover:opacity-90 hover:-translate-y-px"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {r.name}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO CONTENT */}
        <section className="relative px-6 sm:px-10 py-24" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-3xl mx-auto">
            <RevealSection>
              <EyebrowPill>Why people fixate on {item.name}</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-6 font-display text-ink"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                The shape of a {item.name} hyperfixation.
              </h2>
            </RevealSection>
            <div className="mt-8 space-y-6 font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              <p>
                Most {item.name} fixations don&apos;t announce themselves. They start as one episode, one song, one playthrough,
                one chapter — and then something quiet happens in your brain, and a week later you&apos;re three reddit threads
                deep at 2 a.m. learning lore that has zero application to your life. That&apos;s the shape of it. {item.blurb}
              </p>
              <p>
                A {item.name} hyperfixation isn&apos;t just enjoying a thing. It&apos;s the brain&apos;s reward system getting hooked on
                a very specific loop — anticipation, payoff, anticipation again — and refusing to disengage. You stop reading other
                books. You stop watching other shows. Your group chat starts to notice. You memorize details that won&apos;t come
                up in any conversation you&apos;ll ever have. The average run, based on what {item.trackingCount.toLocaleString()}+
                people on Hyperfix have logged, is around <span className="tabular-nums" style={{ color: TEAL }}>{item.avgDays} days</span> —
                long enough to feel like a season of your life, short enough to mourn when it ends.
              </p>
              <p>
                Hyperfix is built for that exact arc. The day counter gives the fixation a weight your memory can&apos;t. The intensity
                meter captures the spike and the slow fade. The share card gives you something to post when you need the world to
                know what {item.name} is doing to you. And when the era finally lifts — and it will — the eulogy makes sure you
                don&apos;t lose the receipts. Day {item.avgDays}. Peak intensity. The note you wrote at 3 a.m. The whole shape of it, kept.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative px-6 sm:px-10 py-24" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-3xl mx-auto">
            <RevealSection>
              <EyebrowPill>Questions</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-6 font-display text-ink"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Tracking {item.name}, FAQ.
              </h2>
            </RevealSection>
            <div className="mt-10">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group py-5 [&_summary::-webkit-details-marker]:hidden"
                  style={{
                    borderTop: i === 0 ? `1px solid ${CARD_BORDER}` : undefined,
                    borderBottom: `1px solid ${CARD_BORDER}`,
                  }}
                >
                  <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none">
                    <h3
                      className="font-display text-ink"
                      style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}
                    >
                      <span className="mr-3 tabular-nums" style={{ color: TEAL, fontSize: 13 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="text-xl group-open:rotate-45 transition-transform shrink-0"
                      style={{ color: TEAL }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 ml-9 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative px-6 sm:px-10 py-24" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.08} />
          <div className="relative max-w-3xl mx-auto">
            <div
              className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
              style={{
                background:
                  "radial-gradient(ellipse 80% 120% at 50% 130%, #2DD4BF 0%, #0E4F47 26%, #08231F 50%, #0F1011 80%)",
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <GrainOverlay opacity={0.5} />
              <div className="relative">
                <h2
                  className="font-display text-ink"
                  style={{ fontSize: "clamp(30px, 5vw, 48px)", letterSpacing: "-0.02em", fontWeight: 600, lineHeight: 1.05 }}
                >
                  Day one of your <span style={{ color: TEAL }}>{item.name}</span> era starts now.
                </h2>
                <p className="mt-5 mx-auto font-sans text-base sm:text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
                  Log it before you forget what day one felt like. Free forever, no credit card, 30 seconds.
                </p>
                <div className="mt-8 flex justify-center">
                  <a
                    href={`/join?prefill=${encodeURIComponent(item.name)}`}
                    className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "#FFFFFF",
                      color: "#0A0A0A",
                      borderRadius: 999,
                      boxShadow:
                        "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 60px rgba(94,234,212,0.25)",
                    }}
                  >
                    Start tracking {item.name}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quiet cross-link footer to other trackers */}
            <div className="mt-10 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                Track something else
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {TRACK_ITEMS.filter((t) => t.slug !== item.slug)
                  .slice(0, 12)
                  .map((t) => (
                    <a
                      key={t.slug}
                      href={`/track/${t.slug}`}
                      className="inline-flex items-center font-mono text-xs rounded-full px-3 py-1.5 transition-all hover:opacity-80"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {t.name}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
