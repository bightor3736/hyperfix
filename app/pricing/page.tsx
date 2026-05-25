import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";
import { PRO_FEATURES } from "@/lib/pro-features";

export const metadata: Metadata = {
  title: "Hyperfix Pricing — free to start, Pro for the obsessed",
  description:
    "Hyperfix is free to log your obsessions, share cards, and build your graveyard. Pro unlocks unlimited fixes, premium cards, and more. Early waitlist users get a permanent discount.",
  alternates: { canonical: "https://hyperfix.app/pricing" },
  openGraph: {
    images: [
      {
        url: "/api/og?title=Hyperfix+Pricing&sub=free+to+start+%C2%B7+Pro+for+the+obsessed+%C2%B7+hyperfix.app&accent=Pricing",
      },
    ],
  },
};

const TEAL = "#5EEAD4";
const TEAL_DEEP = "#2DD4BF";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const freeFeatures = [
  "Up to 3 active fixes",
  "Automatic day counter",
  "Intensity meter (1–10)",
  "Private notes",
  "Shareable fix cards",
  "Public profile & friend feed",
  "Basic graveyard",
  "Hyperfix Wrapped (annual)",
];


const faqs = [
  { q: "When will Pro pricing be announced?", a: "Before launch. We'll email the waitlist before publishing the price anywhere — you'll have time to decide whether to lock in the early discount." },
  { q: "What's the early waitlist discount?", a: "A permanent percentage discount on Pro, locked in for as long as you stay subscribed. If you're on the waitlist when we launch, you get it automatically — no code required." },
  { q: "Will there be a free trial of Pro?", a: "Yes. When Pro launches there will be a trial period. We want you to use the features before committing to them." },
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

function EyebrowPill({ children, tone = "teal" }: { children: React.ReactNode; tone?: "teal" | "ink" }) {
  return (
    <span
      className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
      style={
        tone === "teal"
          ? { background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }
          : { background: "#0A1F1C", color: TEAL, border: "1px solid rgba(10,31,28,0.5)" }
      }
    >
      {children}
    </span>
  );
}

function Check({ color = TEAL }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
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
          <section className="relative overflow-hidden px-6 sm:px-10 pt-20 sm:pt-28 pb-16">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none anim-bloom"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 100%, #5EEAD4 0%, #2DD4BF 18%, #0E4F47 38%, #08231F 58%, #070708 78%)",
                transformOrigin: "50% 100%",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55, mixBlendMode: "overlay" }}
            />
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ height: "55%", background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.85) 35%, transparent 100%)" }}
            />

            <div className="relative max-w-4xl mx-auto text-center" style={{ zIndex: 10 }}>
              <span className="anim-fadeUp"><EyebrowPill>pricing</EyebrowPill></span>
              <h1
                className="mt-7 font-display text-ink anim-fadeUp delay-100"
                style={{ fontSize: "clamp(44px, 8vw, 88px)", lineHeight: 1.02, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Free to log.
                <br />
                Pro for the obsessed.
              </h1>
              <p className="mt-7 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.72)" }}>
                The core product is free, always. Pro is for the ones who know they
                need it. No credit card to start. Early waitlist users get a
                permanent discount on Pro.
              </p>
            </div>
          </section>

          {/* CARDS ---------------------------------------------------------- */}
          <section className="relative px-6 sm:px-10 pb-20">
            <div className="relative max-w-5xl mx-auto grid sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Free */}
              <RevealSection delay={0}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 flex flex-col h-full"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <GrainOverlay />
                  <div className="relative flex flex-col h-full">
                    <h3 className="font-display text-ink" style={{ fontSize: 26, fontWeight: 600 }}>Free</h3>
                    <p className="mt-2 font-sans text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
                      For the person who just discovered there&apos;s a word for what they do.
                    </p>
                    <p className="mt-7 font-display text-ink" style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em" }}>
                      $0<span className="font-sans text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>/mo</span>
                    </p>
                    <ul className="mt-8 mb-10 space-y-3 flex-1">
                      {freeFeatures.map((line) => (
                        <li key={line} className="flex items-start gap-3 font-sans text-base" style={{ color: "rgba(255,255,255,0.78)" }}>
                          <Check />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/auth/signup"
                      className="inline-flex w-full items-center justify-between font-sans text-base font-semibold px-6 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
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

              {/* Pro */}
              <RevealSection delay={140}>
                <div
                  className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 flex flex-col h-full anim-glowPulse"
                  style={{
                    background: TEAL,
                    border: `1px solid ${TEAL_DEEP}`,
                    color: "#0A1F1C",
                    boxShadow: "0 24px 80px rgba(94,234,212,0.28)",
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.3 }}
                  />
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display" style={{ fontSize: 26, fontWeight: 600, color: "#0A1F1C" }}>Pro</h3>
                      <EyebrowPill tone="ink">Waitlist</EyebrowPill>
                    </div>
                    <p className="mt-2 font-sans text-base" style={{ color: "rgba(10,31,28,0.78)" }}>
                      For the chronically unwell who want the full toolkit.
                    </p>
                    <p className="mt-7 font-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em", color: "#0A1F1C" }}>
                      TBA<span className="font-sans text-lg" style={{ color: "rgba(10,31,28,0.6)" }}>/mo</span>
                    </p>
                    <p className="mt-2 font-sans text-sm" style={{ color: "rgba(10,31,28,0.7)" }}>
                      Price announced at launch. Waitlist gets it first.
                    </p>
                    <p className="mt-1 font-sans text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(10,31,28,0.55)" }}>
                      Everything in Free, plus:
                    </p>
                    <ul className="mt-6 mb-10 space-y-3 flex-1">
                      {PRO_FEATURES.map((f) => (
                        <li key={f.name} className="flex items-start gap-2.5 font-sans text-base" style={{ color: "#0A1F1C" }}>
                          <span className="shrink-0 leading-none mt-0.5 inline-flex" aria-hidden>
                            <f.Icon size={16} />
                          </span>
                          <span>{f.name}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#waitlist"
                      className="inline-flex w-full items-center justify-between font-sans text-base font-semibold px-6 py-4 transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
                      style={{ background: "#0A1F1C", color: TEAL, borderRadius: 999 }}
                    >
                      Join the Waitlist
                      <span>»</span>
                    </a>
                  </div>
                </div>
              </RevealSection>
            </div>

            <p className="text-center mt-6 font-sans text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Early waitlist users get a permanent Pro discount — locked in forever.
            </p>
          </section>

          {/* HONEST BREAKDOWN ---------------------------------------------- */}
          <section className="relative px-6 sm:px-10 py-20 sm:py-28" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <GrainOverlay opacity={0.08} />
            <div className="relative max-w-5xl mx-auto">
              <RevealSection><EyebrowPill>honest breakdown</EyebrowPill></RevealSection>
              <RevealSection delay={100}>
                <h2
                  className="mt-7 font-display text-ink max-w-2xl"
                  style={{ fontSize: "clamp(36px, 5.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
                >
                  What &lsquo;free&rsquo; actually means.
                </h2>
              </RevealSection>
              <div className="mt-12 grid md:grid-cols-2 gap-4 sm:gap-5">
                <RevealSection delay={200}>
                  <div className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <GrainOverlay />
                    <p className="relative font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      The free tier is not a bait-and-switch. The core product —
                      log a fix, count the days, share the card, mourn it when
                      it ends — is free and always will be. Three active fixes
                      is enough for most people most of the time.
                    </p>
                  </div>
                </RevealSection>
                <RevealSection delay={300}>
                  <div className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <GrainOverlay />
                    <p className="relative font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      Pro is for people who run more than three simultaneous
                      fixations, who want the full eulogy generator, who care
                      about export and backup. It&apos;s a &ldquo;you know who
                      you are&rdquo; tier.
                    </p>
                  </div>
                </RevealSection>
              </div>
            </div>
          </section>

          {/* FAQ ------------------------------------------------------------ */}
          <section className="relative px-6 sm:px-10 py-20 sm:py-28" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <GrainOverlay opacity={0.08} />
            <div className="relative max-w-3xl mx-auto">
              <div className="text-center">
                <RevealSection><EyebrowPill>FAQ</EyebrowPill></RevealSection>
                <RevealSection delay={100}>
                  <h2
                    className="mt-7 font-display text-ink"
                    style={{ fontSize: "clamp(36px, 5.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}
                  >
                    Questions.
                  </h2>
                </RevealSection>
              </div>
              <div className="mt-14 flex flex-col gap-3">
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
                          style={{ width: 32, height: 32, border: "1.5px solid rgba(94,234,212,0.30)", color: TEAL, fontSize: 18 }}
                        >
                          +
                        </span>
                      </summary>
                      <p className="px-6 pb-6 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{a}</p>
                    </details>
                  </RevealSection>
                ))}
              </div>
            </div>
          </section>

          {/* WAITLIST CTA -------------------------------------------------- */}
          <section id="waitlist" className="relative px-6 sm:px-10 pt-12 pb-24 sm:pb-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <div
              className="relative overflow-hidden rounded-3xl mx-auto max-w-5xl px-6 sm:px-10 py-24 sm:py-32 text-center"
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
                style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55, mixBlendMode: "overlay" }}
              />
              <div className="relative">
                <RevealSection><EyebrowPill>join the waitlist</EyebrowPill></RevealSection>
                <RevealSection delay={100}>
                  <h2
                    className="mt-7 font-display text-ink mx-auto max-w-3xl"
                    style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.03, letterSpacing: "-0.02em", fontWeight: 600 }}
                  >
                    Lock in the
                    <br />
                    early Pro discount.
                  </h2>
                </RevealSection>
                <RevealSection delay={200}>
                  <p className="mt-7 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                    First access goes out in waves. Join now to lock in the
                    permanent early-access discount.
                  </p>
                </RevealSection>
                <RevealSection delay={300}>
                  <div className="mt-10 max-w-md mx-auto">
                    <WaitlistForm variant="dark" />
                  </div>
                </RevealSection>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
