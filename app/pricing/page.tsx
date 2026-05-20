import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PricingOrb } from "@/components/PricingOrb";
import { ProUpgradeButton } from "@/components/ProUpgradeButton";

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

const proFeatures = [
  "Unlimited active fixes",
  "Premium card templates",
  "Custom profile URL",
  "Friends-only privacy mode",
  "Full eulogy generator",
  "Fix history & export",
  "Priority in Wrapped rankings",
  "Early access to new features",
  "Pro badge on profile",
];

const faqs = [
  {
    q: "When will Pro pricing be announced?",
    a: "Before launch. We'll email the waitlist before publishing the price anywhere — you'll have time to decide whether to lock in the early discount.",
  },
  {
    q: "What's the early waitlist discount?",
    a: "A permanent percentage discount on Pro, locked in for as long as you stay subscribed. If you're on the waitlist when we launch, you get it automatically — no code required.",
  },
  {
    q: "Will there be a free trial of Pro?",
    a: "Yes. When Pro launches there will be a trial period. We want you to use the features before committing to them.",
  },
  {
    q: "Do you sell my data?",
    a: "No. Never. We don't train AI on your obsessions. Your hyperfixation history is yours — encrypted in our database, not for sale.",
  },
  {
    q: "What happens if I cancel Pro?",
    a: "You keep everything. Your graveyard, history, closed fixes — all stays. You lose access to Pro-only features going forward, but your data is yours.",
  },
];

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-px" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="rgba(94,234,212,0.15)" />
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

      {/* Canvas orb — fixed behind everything */}
      <PricingOrb />

      <div className="relative min-h-screen" style={{ background: "transparent" }}>
        <Nav />

        <main id="main-content" className="relative text-ink" style={{ zIndex: 1 }}>

          {/* ── hero header ── */}
          <section className="relative px-6 sm:px-10 pt-16 sm:pt-20 pb-6 overflow-hidden">
            {/* huge outline "Pricing" behind content */}
            <div
              className="absolute inset-x-0 top-0 flex justify-end pr-8 pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="font-display font-bold leading-none tracking-tight"
                style={{
                  fontSize: "clamp(9rem, 26vw, 22rem)",
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(94,234,212,0.13)",
                  lineHeight: 0.85,
                }}
              >
                Pricing
              </span>
            </div>

            {/* brand label — top right, like "Forma AI" in reference */}
            <div className="absolute top-20 right-8 sm:right-12 pointer-events-none" aria-hidden="true">
              <span
                className="font-display font-bold italic"
                style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "rgba(94,234,212,0.7)" }}
              >
                Hyperfix
              </span>
            </div>

            <div className="relative z-10 max-w-xl pt-10 sm:pt-14">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">
                2026
              </p>
              <h1
                className="font-display font-bold text-white leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)" }}
              >
                Free to log.
                <br />
                <em className="italic">Pro</em> for the obsessed.
              </h1>
              <p
                className="mt-5 font-sans text-sm sm:text-base leading-relaxed max-w-sm"
                style={{ color: "rgba(244,244,244,0.45)" }}
              >
                The core product is free, always. Pro is for the ones who know they need it.
              </p>
            </div>
          </section>

          {/* ── pricing cards ── */}
          <section className="px-4 sm:px-8 pt-4 pb-16">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">

              {/* ── Free ── */}
              <div
                className="flex flex-col rounded-[20px] p-7"
                style={{
                  background: "rgba(6,10,6,0.75)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <p className="font-sans text-lg font-semibold text-white mb-1">Free</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-display font-bold text-white" style={{ fontSize: "3.2rem", lineHeight: 1.05 }}>
                    Free
                  </span>
                </div>
                <p className="font-sans text-sm mb-7 pb-7" style={{ color: "rgba(244,244,244,0.38)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  For the person who just discovered there&apos;s a word for what they do.
                </p>

                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check />
                      <span className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.6)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/#waitlist"
                  className="flex items-center justify-center font-sans text-sm font-semibold py-3.5 rounded-full transition-all hover:bg-white/20 active:scale-[0.98]"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#F4F4F4", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Choose Plan
                </a>
              </div>

              {/* ── Pro ── */}
              <div
                className="flex flex-col rounded-[20px] p-7 relative overflow-hidden"
                style={{
                  background: "rgba(6,12,6,0.82)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1px solid rgba(94,234,212,0.3)",
                  boxShadow: "inset 0 1px 0 rgba(94,234,212,0.08), 0 0 40px rgba(94,234,212,0.05)",
                }}
              >
                {/* inner corner glow */}
                <div
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(94,234,212,0.2) 0%, transparent 70%)" }}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between mb-1 relative">
                  <p className="font-sans text-lg font-semibold text-white">Pro</p>
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest rounded-full px-2.5 py-1 mt-0.5"
                    style={{ background: "rgba(94,234,212,0.15)", color: "#a3e635" }}
                  >
                    Waitlist
                  </span>
                </div>
                <div className="flex items-end gap-1.5 mb-1 relative">
                  <span className="font-display font-bold text-accent" style={{ fontSize: "3.2rem", lineHeight: 1.05 }}>
                    Early
                  </span>
                  <span className="font-sans text-sm pb-2" style={{ color: "rgba(244,244,244,0.38)" }}>price</span>
                </div>
                <p className="font-sans text-sm mb-2 relative" style={{ color: "rgba(94,234,212,0.5)" }}>
                  Price announced at launch — waitlist gets it first.
                </p>
                <p className="font-sans text-xs mb-7 pb-7 relative" style={{ color: "rgba(244,244,244,0.3)", borderBottom: "1px solid rgba(94,234,212,0.1)" }}>
                  Join now to lock in your permanent early-access discount.
                </p>

                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(244,244,244,0.28)" }}>
                  Everything in Free, plus:
                </p>

                <ul className="flex flex-col gap-3 flex-1 mb-8 relative">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check />
                      <span className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.65)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <ProUpgradeButton />
              </div>
            </div>

            <p className="text-center font-mono text-[10px] uppercase tracking-widest mt-5" style={{ color: "rgba(244,244,244,0.18)" }}>
              Early waitlist users get a permanent Pro discount — locked in forever
            </p>
          </section>

          {/* ── honest breakdown ── */}
          <section className="px-6 sm:px-10 py-16 sm:py-24">
            <div className="max-w-4xl mx-auto">
              <div
                className="rounded-[20px] p-8 sm:p-10"
                style={{
                  background: "rgba(6,10,6,0.65)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Honest breakdown</p>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-8 leading-tight">
                  What &lsquo;free&rsquo; actually means.
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.5)" }}>
                    The free tier is not a bait-and-switch. The core product — log a fix, count the days, share the card, mourn it when it ends — is free and always will be. Three active fixes is enough for most people most of the time.
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.5)" }}>
                    Pro is for people who run more than three simultaneous fixations, who want the full eulogy generator, who care about export and backup. It&apos;s a &ldquo;you know who you are&rdquo; tier.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="px-6 sm:px-10 pb-20">
            <div className="max-w-3xl mx-auto">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">FAQ</p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-8 leading-tight">Questions.</h2>
              <div
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: "rgba(6,10,6,0.65)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {faqs.map(({ q, a }, i) => (
                  <details
                    key={q}
                    className="group [&_summary::-webkit-details-marker]:hidden"
                    style={i < faqs.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}
                  >
                    <summary className="flex items-center justify-between gap-6 cursor-pointer list-none px-6 sm:px-8 py-5">
                      <span className="font-sans text-sm sm:text-base font-medium text-white leading-snug">{q}</span>
                      <span aria-hidden="true" className="font-mono text-xl shrink-0 group-open:rotate-45 transition-transform duration-200" style={{ color: "rgba(244,244,244,0.3)" }}>+</span>
                    </summary>
                    <p className="px-6 sm:px-8 pb-5 font-sans text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.45)" }}>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="px-6 sm:px-10 py-24 sm:py-32 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="max-w-xl mx-auto">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">Join the waitlist</p>
              <h2
                className="font-display font-bold text-white leading-[0.9] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
              >
                Early users get
                <br />the best price.
                <br /><em className="italic text-accent">Locked in forever.</em>
              </h2>
              <p className="font-sans text-sm mb-10 leading-relaxed" style={{ color: "rgba(244,244,244,0.4)" }}>
                First access goes out in waves. Join now to lock in the early Pro discount.
              </p>
              <WaitlistForm variant="dark" />
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
