import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";
import { Footer } from "@/components/landing/Footer";
import { RevealSection } from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Hyperfix Pricing — free forever, Pro for the obsessed",
  description:
    "Hyperfix is free to log your hyperfixations, go deep on them, and share your stats card. Pro unlocks more streak freezes, an XP multiplier, custom themes, and analytics. Cancel anytime.",
  alternates: { canonical: "https://hyperfix.app/pricing" },
  openGraph: {
    images: [
      {
        url: "/api/og?title=Hyperfix+Pricing&sub=free+forever+%C2%B7+Pro+for+the+obsessed+%C2%B7+hyperfix.app&accent=Pricing",
      },
    ],
  },
};

const CARD_BG = "var(--bg-white)";
const CARD_BORDER = "1px solid var(--line)";
const MUTED = "var(--ink-muted)";
const FAINT = "var(--ink-faint)";
const SERIF = {
  fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
  fontStyle: "italic" as const,
  fontWeight: 400,
};

const freeFeatures = [
  "Unlimited hyperfixation logs",
  "Deep dives + brain bursts (earn XP)",
  "Intensity meter & day counter",
  "Shareable stats card (free forever)",
  "Public profile + custom accent",
  "Daily quests, XP & streaks",
  "Focus timer + proof of action",
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
  { q: "What happens if I cancel Pro?", a: "You keep everything. Your fixations, deep dives, history and XP — all stays. You lose access to Pro-only features going forward, but your data is yours." },
];

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="uppercase"
      style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: FAINT }}
    >
      {children}
    </span>
  );
}

function Check({ color = "var(--ink)", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Dash() {
  return (
    <span aria-hidden className="text-sm" style={{ color: FAINT }}>
      —
    </span>
  );
}

function Cell({ value, isPro = false }: { value: string | boolean; isPro?: boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex">
        <Check color={isPro ? "var(--ink)" : MUTED} size={15} />
      </span>
    );
  }
  if (value === false) return <Dash />;
  return (
    <span
      className="text-sm tabular-nums"
      style={{ color: isPro ? "var(--ink)" : MUTED, fontWeight: isPro ? 600 : 400 }}
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

      <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
        <Nav />

        <main id="main-content" className="relative" style={{ zIndex: 1, color: "var(--ink)" }}>
          {/* HERO ----------------------------------------------------------- */}
          <section className="relative px-6 sm:px-10 pt-32 sm:pt-40 pb-14 sm:pb-20">
            <div className="relative max-w-3xl mx-auto text-center">
              <span className="anim-fadeUp"><MicroLabel>Pricing</MicroLabel></span>
              <h1
                className="mt-7 anim-fadeUp delay-100"
                style={{ fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 500, color: "var(--ink)" }}
              >
                Free forever. Pro for the chronically{" "}
                <span style={SERIF}>obsessed.</span>
              </h1>
              <p
                className="mt-7 mx-auto text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-300"
                style={{ color: MUTED }}
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
                  className="relative overflow-hidden p-7 sm:p-9 flex flex-col h-full"
                  style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 16 }}
                >
                  <div className="relative flex flex-col h-full">
                    <h3 style={{ fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>Free</h3>
                    <p className="mt-2 text-base" style={{ color: MUTED }}>
                      Everything you need to log, count, and share.
                    </p>
                    <p
                      className="mt-7 tabular-nums"
                      style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}
                    >
                      $0
                      <span className="text-lg" style={{ color: MUTED, fontWeight: 400 }}>/mo</span>
                    </p>
                    <ul className="mt-8 mb-10 space-y-3 flex-1">
                      {freeFeatures.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-3 text-base leading-snug"
                          style={{ color: MUTED }}
                        >
                          <span className="mt-0.5"><Check color={FAINT} /></span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/join"
                      className="liquid-glass inline-flex w-full items-center justify-between text-base font-semibold px-6 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                      style={{ color: "var(--ink)", borderRadius: 9999 }}
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
                  <div
                    className="relative overflow-hidden p-7 sm:p-9 flex flex-col h-full"
                    style={{
                      background: CARD_BG,
                      border: "1px solid rgba(24,20,16,0.18)",
                      borderRadius: 16,
                    }}
                  >
                    {/* Popular badge */}
                    <span
                      className="absolute top-5 right-5 uppercase rounded-full px-2.5 py-1"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "2px",
                        background: "var(--accent)",
                        color: "#fff",
                      }}
                    >
                      Popular
                    </span>
                    <div className="relative flex flex-col h-full">
                      <h3 style={{ fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>Pro</h3>
                      <p className="mt-2 text-base" style={{ color: MUTED }}>
                        For the chronically unwell who want the full toolkit.
                      </p>
                      <p
                        className="mt-7 tabular-nums"
                        style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}
                      >
                        $5
                        <span className="text-lg" style={{ color: MUTED, fontWeight: 400 }}> / month</span>
                      </p>
                      <p className="mt-2 text-sm" style={{ color: MUTED }}>
                        or <span style={{ color: "var(--ink)", fontWeight: 600 }}>$39/year</span> — save 35%
                      </p>
                      <p className="mt-2 text-xs" style={{ color: FAINT }}>
                        Cancel anytime. Pro unlocks unlimited fixes and the full toolkit.
                      </p>
                      <ul className="mt-8 mb-10 space-y-3 flex-1">
                        {proFeatures.map((f) => (
                          <li
                            key={f.label}
                            className="flex items-start gap-3 text-base leading-snug"
                            style={{ color: f.highlight ? "var(--ink)" : MUTED }}
                          >
                            <span className="mt-0.5"><Check color="var(--ink)" /></span>
                            <span style={f.highlight ? { fontWeight: 600 } : undefined}>
                              {f.highlight ? (
                                <>
                                  <strong className="font-semibold" style={{ color: "var(--ink)" }}>{f.label}</strong>
                                </>
                              ) : (
                                f.label
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ProCheckoutButton
                        className="inline-flex w-full items-center justify-center gap-2 text-base font-semibold px-6 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] disabled:opacity-70"
                        style={{ background: "var(--accent)", color: "#fff", borderRadius: 9999, fontWeight: 600 }}
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
                <RevealSection><MicroLabel>Compare</MicroLabel></RevealSection>
                <RevealSection delay={100}>
                  <h2
                    className="mt-6"
                    style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 500, color: "var(--ink)" }}
                  >
                    Free vs. Pro, <span style={SERIF}>side by side.</span>
                  </h2>
                </RevealSection>
              </div>

              <RevealSection delay={150}>
                <div
                  className="relative overflow-hidden"
                  style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 16 }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--line)" }}>
                          <th
                            className="text-left uppercase px-5 sm:px-7 py-4"
                            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: FAINT }}
                          >
                            Feature
                          </th>
                          <th
                            className="text-center uppercase px-4 py-4"
                            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: FAINT, width: "20%" }}
                          >
                            Free
                          </th>
                          <th
                            className="text-center uppercase px-4 py-4"
                            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "var(--ink)", width: "20%" }}
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
                              borderBottom:
                                i === comparisonRows.length - 1 ? "none" : "1px solid var(--line)",
                            }}
                          >
                            <td
                              className="text-sm sm:text-base px-5 sm:px-7 py-4"
                              style={{ color: "rgba(24,20,16,0.70)" }}
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
                                  ? { background: "var(--fill)" }
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
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <div className="relative max-w-2xl mx-auto text-center">
              <RevealSection>
                <MicroLabel>Ready when you are</MicroLabel>
              </RevealSection>
              <RevealSection delay={100}>
                <h2
                  className="mt-5"
                  style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 500, color: "var(--ink)" }}
                >
                  Start your hyperfixation <span style={SERIF}>toolkit.</span>
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <div className="mt-10 flex justify-center">
                  <ProCheckoutButton
                    className="inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] disabled:opacity-70"
                    style={{ background: "var(--accent)", color: "#fff", borderRadius: 9999, minWidth: 220, fontWeight: 600 }}
                    label="Get Pro"
                  />
                </div>
              </RevealSection>
              <RevealSection delay={300}>
                <p className="mt-6 text-sm" style={{ color: MUTED }}>
                  <a href="/join" className="underline-offset-4 hover:underline transition-opacity hover:opacity-80" style={{ color: MUTED }}>
                    Continue free
                  </a>
                </p>
              </RevealSection>
            </div>
          </section>

          {/* FAQ ------------------------------------------------------------ */}
          <section
            className="relative px-6 sm:px-10 py-20 sm:py-28"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="text-center">
                <RevealSection><MicroLabel>FAQ</MicroLabel></RevealSection>
                <RevealSection delay={100}>
                  <h2
                    className="mt-6"
                    style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 500, color: "var(--ink)" }}
                  >
                    <span style={SERIF}>Questions.</span>
                  </h2>
                </RevealSection>
              </div>
              <div className="mt-12 flex flex-col gap-3">
                {faqs.map(({ q, a }, i) => (
                  <RevealSection key={q} delay={i * 60}>
                    <details
                      className="group [&_summary::-webkit-details-marker]:hidden relative overflow-hidden"
                      style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 16 }}
                    >
                      <summary className="flex items-center justify-between gap-6 cursor-pointer list-none px-6 py-5">
                        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink)" }}>{q}</h3>
                        <span
                          aria-hidden
                          className="shrink-0 flex items-center justify-center rounded-full transition-transform group-open:rotate-45"
                          style={{ width: 32, height: 32, border: "1px solid var(--line)", color: "rgba(24,20,16,0.70)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </summary>
                      <p className="px-6 pb-6 text-base leading-relaxed" style={{ color: "rgba(24,20,16,0.70)" }}>{a}</p>
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
