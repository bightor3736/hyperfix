import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Hyperfix Pricing — free forever, Pro for the obsessed",
  description:
    "Hyperfix is free to log your obsessions, share cards, and build your graveyard. Pro unlocks unlimited fixes, custom themes, analytics, and more. Cancel anytime.",
  alternates: { canonical: "https://hyperfix.app/pricing" },
  openGraph: {
    images: [
      {
        url: "/api/og?title=Hyperfix+Pricing&sub=free+forever+%C2%B7+Pro+for+the+obsessed+%C2%B7+hyperfix.app&accent=Pricing",
      },
    ],
  },
};

const TEAL = "#5EEAD4";
const TEAL_DEEP = "#2DD4BF";
const TEAL_BG = "rgba(94,234,212,0.10)";
const TEAL_BORDER = "rgba(94,234,212,0.22)";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const MUTED = "rgba(255,255,255,0.55)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const freeFeatures = [
  "Up to 3 active fixes",
  "Automatic day counter",
  "Intensity meter (1–10)",
  "Shareable fix cards (9:16, free forever)",
  "Public profile + banner",
  "Daily check-in streak",
  "The Graveyard",
  "Hyperfix Wrapped (annual)",
];

const proFeatures = [
  { label: "Everything in Free", highlight: false },
  { label: "Unlimited active fixes", highlight: true },
  { label: "Multiple pinned fixes (up to 3)", highlight: false },
  { label: "Custom accent color", highlight: false },
  { label: "Pro badge on your profile", highlight: false },
  { label: "Private analytics (intensity trends, category breakdowns)", highlight: false },
  { label: "Data export (JSON)", highlight: false },
  { label: "Priority feature requests", highlight: false },
];

type Row = { feature: string; free: string | boolean; pro: string | boolean };
const comparisonRows: Row[] = [
  { feature: "Active fixations", free: "3", pro: "Unlimited" },
  { feature: "Day counter", free: true, pro: true },
  { feature: "Share cards (9:16 PNG)", free: true, pro: true },
  { feature: "Banner image on profile + fixations", free: true, pro: true },
  { feature: "Custom accent color", free: false, pro: true },
  { feature: "Pinned fixations", free: "1", pro: "Up to 3" },
  { feature: "Pro badge", free: false, pro: true },
  { feature: "Analytics dashboard", free: false, pro: true },
  { feature: "Data export (JSON)", free: false, pro: true },
  { feature: "Premium card templates", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes. Pro is month-to-month, no commitment. Cancel from your settings and you'll keep Pro access until the end of the current billing period." },
  { q: "Is there a free trial?", a: "The Free plan is the trial — it's unlimited in time, just capped in features. When you're ready for unlimited fixes and the full toolkit, upgrade to Pro." },
  { q: "How does billing work?", a: "Pro is billed monthly via Stripe. You can update your payment method or cancel at any time from your account settings. We email a receipt for every charge." },
  { q: "Do you sell my data?", a: "No. Never. We don't train AI on your obsessions. Your hyperfixation history is yours — encrypted in our database, not for sale." },
  { q: "What happens if I cancel Pro?", a: "You keep everything. Your graveyard, history, closed fixes — all stays. You lose access to Pro-only features going forward, but your data is yours." },
];

function GrainOverlay({ opacity = 0.22 }: { opacity?: number }) {
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
      className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
      style={{ background: TEAL_BG, color: TEAL, border: `1px solid ${TEAL_BORDER}` }}
    >
      {children}
    </span>
  );
}

function Check({ color = TEAL, size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Dash() {
  return (
    <span aria-hidden className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
      —
    </span>
  );
}

function Cell({ value, isPro = false }: { value: string | boolean; isPro?: boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex">
        <Check color={isPro ? TEAL : "rgba(255,255,255,0.78)"} size={16} />
      </span>
    );
  }
  if (value === false) return <Dash />;
  return (
    <span
      className="font-mono text-sm tabular-nums"
      style={{ color: isPro ? TEAL : "rgba(255,255,255,0.85)" }}
    >
      {value}
    </span>
  );
}

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
      { "@type": "ListItem", position: 2, name: "Pricing", item: "https://hyperfix.app/pricing" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative min-h-screen" style={{ background: "#070708" }}>
        <Nav />

        <main id="main-content" className="relative text-ink" style={{ zIndex: 1 }}>
          {/* HERO ----------------------------------------------------------- */}
          <section className="relative px-6 sm:px-10 pt-24 sm:pt-32 pb-14 sm:pb-20">
            <div className="relative max-w-3xl mx-auto text-center">
              <span className="anim-fadeUp"><EyebrowPill>Pricing</EyebrowPill></span>
              <h1
                className="mt-7 font-display text-ink anim-fadeUp delay-100"
                style={{ fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Free forever. Pro for the chronically obsessed.
              </h1>
              <p
                className="mt-7 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-300"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                All the day counters and share cards are free. Pro unlocks
                unlimited fixes, custom themes, and the toolkit for serious
                hyperfixers.
              </p>
            </div>
          </section>

          {/* PRICING CARDS -------------------------------------------------- */}
          <section className="relative px-6 sm:px-10 pb-16 sm:pb-24">
            <div className="relative max-w-5xl mx-auto grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Free */}
              <RevealSection delay={0}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 flex flex-col h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <GrainOverlay opacity={0.18} />
                  <div className="relative flex flex-col h-full">
                    <h3 className="font-display text-ink" style={{ fontSize: 26, fontWeight: 600 }}>Free</h3>
                    <p className="mt-2 font-sans text-base" style={{ color: MUTED }}>
                      Everything you need to log, count, and share.
                    </p>
                    <p
                      className="mt-7 font-display text-ink tabular-nums"
                      style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em" }}
                    >
                      $0
                      <span className="font-sans text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>/mo</span>
                    </p>
                    <ul className="mt-8 mb-10 space-y-3 flex-1">
                      {freeFeatures.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-3 font-sans text-base leading-snug"
                          style={{ color: "rgba(255,255,255,0.82)" }}
                        >
                          <span className="mt-0.5"><Check color="rgba(255,255,255,0.7)" /></span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/join"
                      className="inline-flex w-full items-center justify-between font-sans text-base font-semibold px-6 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "#FFFFFF",
                        borderRadius: 999,
                        border: `1px solid ${CARD_BORDER}`,
                      }}
                    >
                      Get started free
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </RevealSection>

              {/* Pro */}
              <RevealSection delay={140}>
                <div className="relative h-full">
                  {/* Subtle teal radial bloom under Pro card only */}
                  <div
                    aria-hidden
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-40px -40px -40px -40px",
                      background:
                        "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(94,234,212,0.18) 0%, rgba(94,234,212,0.06) 35%, transparent 70%)",
                      filter: "blur(20px)",
                      zIndex: 0,
                    }}
                  />
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 flex flex-col h-full"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${TEAL_BORDER}`,
                      boxShadow: "0 0 0 1px rgba(94,234,212,0.08), 0 20px 60px rgba(94,234,212,0.10)",
                    }}
                  >
                    <GrainOverlay opacity={0.18} />
                    {/* Popular badge */}
                    <span
                      className="absolute top-5 right-5 font-mono text-[10px] tracking-widest uppercase rounded-full px-2.5 py-1"
                      style={{ background: TEAL_BG, color: TEAL, border: `1px solid ${TEAL_BORDER}` }}
                    >
                      Popular
                    </span>
                    <div className="relative flex flex-col h-full">
                      <h3 className="font-display text-ink" style={{ fontSize: 26, fontWeight: 600 }}>Pro</h3>
                      <p className="mt-2 font-sans text-base" style={{ color: MUTED }}>
                        For the chronically unwell who want the full toolkit.
                      </p>
                      <p
                        className="mt-7 font-display text-ink tabular-nums"
                        style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em" }}
                      >
                        <span style={{ color: TEAL }}>$5</span>
                        <span className="font-sans text-lg" style={{ color: "rgba(255,255,255,0.5)" }}> / month</span>
                      </p>
                      <p className="mt-2 font-sans text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                        or <span style={{ color: TEAL }}>$39/year</span> — save 35%
                      </p>
                      <p className="mt-2 font-sans text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Cancel anytime. Pro unlocks unlimited fixes and the full toolkit.
                      </p>
                      <ul className="mt-8 mb-10 space-y-3 flex-1">
                        {proFeatures.map((f) => (
                          <li
                            key={f.label}
                            className="flex items-start gap-3 font-sans text-base leading-snug"
                            style={{ color: f.highlight ? "#FFFFFF" : "rgba(255,255,255,0.82)" }}
                          >
                            <span className="mt-0.5"><Check color={TEAL} /></span>
                            <span style={f.highlight ? { fontWeight: 600 } : undefined}>
                              {f.highlight ? (
                                <>
                                  <strong className="font-sans font-semibold">{f.label}</strong>
                                </>
                              ) : (
                                f.label
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ProCheckoutButton
                        className="inline-flex w-full items-center justify-center gap-2 font-sans text-base font-semibold px-6 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] disabled:opacity-70"
                        style={{ background: TEAL, color: "#0A1F1C", borderRadius: 999 }}
                        label="Get Pro"
                      />
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </section>

          {/* hidden anchor target for legacy #waitlist links */}
          <div id="waitlist" aria-hidden style={{ position: "absolute" }} />

          {/* COMPARISON TABLE ---------------------------------------------- */}
          <section className="relative px-6 sm:px-10 pb-20 sm:pb-28">
            <div className="relative max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-14">
                <RevealSection><EyebrowPill>Compare</EyebrowPill></RevealSection>
                <RevealSection delay={100}>
                  <h2
                    className="mt-6 font-display text-ink"
                    style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
                  >
                    Free vs. Pro, side by side.
                  </h2>
                </RevealSection>
              </div>

              <RevealSection delay={150}>
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                          <th
                            className="text-left font-mono text-xs uppercase tracking-widest px-5 sm:px-7 py-4"
                            style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}
                          >
                            Feature
                          </th>
                          <th
                            className="text-center font-mono text-xs uppercase tracking-widest px-4 py-4"
                            style={{ color: "rgba(255,255,255,0.5)", width: "20%", fontWeight: 500 }}
                          >
                            Free
                          </th>
                          <th
                            className="text-center font-mono text-xs uppercase tracking-widest px-4 py-4"
                            style={{ color: TEAL, width: "20%", fontWeight: 500 }}
                          >
                            Pro
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row, i) => (
                          <tr
                            key={row.feature}
                            style={{
                              background: i % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent",
                              borderBottom:
                                i === comparisonRows.length - 1 ? "none" : `1px solid ${CARD_BORDER}`,
                            }}
                          >
                            <td
                              className="font-sans text-sm sm:text-base px-5 sm:px-7 py-4"
                              style={{ color: "rgba(255,255,255,0.82)" }}
                            >
                              {row.feature}
                            </td>
                            <td className="text-center px-4 py-4">
                              <Cell value={row.free} />
                            </td>
                            <td
                              className="text-center px-4 py-4"
                              style={
                                row.free === false
                                  ? { background: "rgba(94,234,212,0.04)" }
                                  : undefined
                              }
                            >
                              <Cell value={row.pro} isPro />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </RevealSection>
            </div>
          </section>

          {/* FINAL CTA ----------------------------------------------------- */}
          <section
            className="relative px-6 sm:px-10 py-20 sm:py-28"
            style={{ borderTop: `1px solid ${CARD_BORDER}` }}
          >
            <div className="relative max-w-2xl mx-auto text-center">
              <RevealSection>
                <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Ready when you are
                </span>
              </RevealSection>
              <RevealSection delay={100}>
                <h2
                  className="mt-5 font-display text-ink"
                  style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
                >
                  Start your hyperfixation toolkit.
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <div className="mt-10 flex justify-center">
                  <ProCheckoutButton
                    className="inline-flex items-center justify-center gap-2 font-sans text-base font-semibold px-8 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] disabled:opacity-70"
                    style={{ background: TEAL, color: "#0A1F1C", borderRadius: 999, minWidth: 220 }}
                    label="Get Pro"
                  />
                </div>
              </RevealSection>
              <RevealSection delay={300}>
                <p className="mt-6 font-sans text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <a href="/join" className="underline-offset-4 hover:underline transition-opacity hover:opacity-80">
                    Continue free
                  </a>
                </p>
              </RevealSection>
            </div>
          </section>

          {/* FAQ ------------------------------------------------------------ */}
          <section
            className="relative px-6 sm:px-10 py-20 sm:py-28"
            style={{ borderTop: `1px solid ${CARD_BORDER}` }}
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="text-center">
                <RevealSection><EyebrowPill>FAQ</EyebrowPill></RevealSection>
                <RevealSection delay={100}>
                  <h2
                    className="mt-6 font-display text-ink"
                    style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
                  >
                    Questions.
                  </h2>
                </RevealSection>
              </div>
              <div className="mt-12 flex flex-col gap-3">
                {faqs.map(({ q, a }, i) => (
                  <RevealSection key={q} delay={i * 60}>
                    <details
                      className="group [&_summary::-webkit-details-marker]:hidden motion-card relative overflow-hidden rounded-2xl"
                      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                    >
                      <summary className="flex items-center justify-between gap-6 cursor-pointer list-none px-6 py-5">
                        <h3 className="font-display text-ink" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{q}</h3>
                        <span
                          aria-hidden
                          className="shrink-0 flex items-center justify-center rounded-full transition-transform group-open:rotate-45"
                          style={{ width: 32, height: 32, border: "1.5px solid rgba(94,234,212,0.30)", color: TEAL }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </summary>
                      <p className="px-6 pb-6 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{a}</p>
                    </details>
                  </RevealSection>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
