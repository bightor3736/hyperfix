import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Hyperfix Wrapped — a year of obsessions, counted",
  description:
    "Your longest fix. Your peak intensity. The eras your brain lived through. Hyperfix Wrapped is an annual summary of everything that ran your life — coming soon.",
  alternates: {
    canonical: "https://hyperfix.app/wrapped",
  },
  openGraph: {
    url: "https://hyperfix.app/wrapped",
    title: "Hyperfix Wrapped — Hyperfix",
    description: "Your longest fix. Your peak intensity. The eras your brain lived through.",
    images: [
      {
        url: "/api/og?title=Hyperfix+Wrapped&sub=a+year+of+obsessions%2C+counted+%C2%B7+hyperfix.app&accent=Wrapped",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix Wrapped", item: "https://hyperfix.app/wrapped" },
  ],
};

const mockStats = [
  { label: "Total fixes logged", value: "14", sub: "in 2026" },
  { label: "Total days fixated", value: "312", sub: "across all fixes" },
  { label: "Longest fix", value: "89 days", sub: "the Marauders era" },
  { label: "Peak intensity", value: "10 / 10", sub: "day 34, 2 a.m." },
];

const mockEras = [
  {
    title: "the Marauders era",
    type: "fanfic · ao3",
    day: 89,
    intensity: 10,
    user: "@parchment.spiral",
    tilt: "",
    started: "2026 · closed",
    note: "I have never cried at a fictional sixteenth-century duel before. I have now.",
    color: "bg-paper",
  },
  {
    title: "Sabrina Carpenter — Short n' Sweet",
    type: "artist · album",
    day: 61,
    intensity: 8,
    user: "@sob.exe",
    tilt: "",
    started: "Loop count: 1,204",
    note: "Short n' Sweet on repeat until the album memorised itself.",
    color: "bg-[#1C1C1E]",
  },
  {
    title: "What We Do in the Shadows",
    type: "show · rewatch",
    day: 44,
    intensity: 9,
    user: "@nandorstan",
    tilt: "",
    started: "Rewatch count: 4",
    note: "Rewatched four times. Have opinions about Nandor. Will share them.",
    color: "bg-paper",
  },
  {
    title: "Stardew Valley",
    type: "game · cozy",
    day: 38,
    intensity: 7,
    user: "@stardew.spiral",
    tilt: "",
    started: "847 parsnips harvested",
    note: "Harvested 847 parsnips. Married Harvey. No regrets.",
    color: "bg-[#1C1C1E]",
  },
];

export default async function WrappedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink bg-[var(--bg)]">
        <Nav />

        {/* HERO */}
        <section className="px-6 sm:px-10 pt-12 sm:pt-16 pb-16">
          <div className="max-w-5xl mx-auto">
            <span
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
              style={{
                background: user ? "var(--accent-soft)" : "var(--line)",
                color: user ? "var(--accent)" : "var(--ink-muted)",
                border: user ? "1px solid var(--accent)" : undefined,
              }}
            >
              {user ? `live now · your ${currentYear} wrapped` : `coming soon · hyperfix wrapped · ${currentYear}`}
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              A year of obsessions.
              <br />
              <span className="italic text-accent">Counted.</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[var(--ink-muted)] leading-snug">
                Spotify Wrapped tells you what you listened to. Hyperfix Wrapped
                tells you what ran your life. Every fix, every era, every day
                counted — stacked into a shareable annual record of your
                interior life.
              </p>
              <p className="font-sans text-lg text-[var(--ink-muted)] leading-snug">
                Your longest hyperfixation. Your peak intensity moment. The fix
                that arrived at exactly the right time and the one that ended
                before you were ready. Wrapped generates automatically at the
                end of the year — if you've been logging.
              </p>
            </div>

            {user && (
              <div className="mt-10">
                <Link
                  href={`/wrapped/${currentYear}`}
                  className="inline-flex items-center gap-2 font-sans text-base font-semibold px-7 py-4 rounded-full transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                    boxShadow: "0 12px 36px var(--accent)",
                  }}
                >
                  View your {currentYear} Wrapped
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* MOCK STATS */}
        <section className="px-6 sm:px-10 py-16">
          <div className="max-w-5xl mx-auto bg-[var(--bg)] rounded-3xl border border-[var(--line)] p-10 sm:p-14">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-8">
              preview · example wrapped stats
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-12 text-balance">
              This is what your
              <br />
              <span className="italic text-accent">year looks like.</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mb-4">
              {mockStats.map((s) => (
                <div key={s.label} className="border border-[var(--line)] p-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mb-3">
                    {s.label}
                  </p>
                  <p className="font-display text-4xl sm:text-5xl tracking-tightest text-accent leading-none mb-2">
                    {s.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)]">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)] mt-4">
              example data — not real. yours will be worse.
            </p>
          </div>
        </section>

        {/* MOCK ERAS */}
        <section className="px-6 sm:px-10 py-16">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-8">the eras</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-12 text-balance">
              Every era your brain
              <br />
              <span className="italic text-accent">lived through.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
              {mockEras.map((era) => (
                <TiltCard key={era.title} tiltLimit={10} scale={1.03} effect="gravitate">
                  <HyperfixCard {...era} />
                </TiltCard>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mt-6">
              example data — not real. yours will be worse and more embarrassing and more worth keeping.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 sm:px-10 py-16">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-8">how it works</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-12 max-w-3xl text-balance">
              Log now. Wrapped
              <br />
              <span className="italic text-accent">builds itself.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  n: "01",
                  h: "Log your fixes",
                  p: "Every hyperfixation gets logged as it happens — title, type, start date, intensity. The counter runs automatically.",
                },
                {
                  n: "02",
                  h: "Live through the year",
                  p: "Update intensities, add notes, close fixes with eulogies. The graveyard builds. The data accumulates.",
                },
                {
                  n: "03",
                  h: "Get your Wrapped",
                  p: "At the end of the year, Hyperfix generates your Wrapped automatically. Shareable. Exportable. Yours.",
                },
              ].map((step) => (
                <div key={step.n} className="border-t border-[var(--line)] pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3 block">
                    {step.n}
                  </span>
                  <h3 className="font-display text-xl tracking-tight text-ink mb-3">
                    {step.h}
                  </h3>
                  <p className="font-sans text-base text-[var(--ink-muted)] leading-relaxed">
                    {step.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 sm:px-10 py-20 bg-[var(--bg)]">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-8">
              {user ? "your year, counted" : "join the waitlist"}
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-2xl text-balance">
              {user ? (
                <>
                  Your {currentYear} Wrapped
                  <br />
                  <span className="italic text-accent">is ready.</span>
                </>
              ) : (
                <>
                  Start logging now.
                  <br />
                  <span className="italic text-accent">Get your Wrapped in December.</span>
                </>
              )}
            </h2>
            <p className="mt-6 font-sans text-lg text-[var(--ink-muted)] max-w-xl leading-snug">
              {user
                ? `Every fix, every era, every day of ${currentYear} — stacked into one shareable page.`
                : "Wrapped only works if you've been logging. Join the waitlist — early access goes out in waves, and early users get the best usernames and a permanent Pro discount."}
            </p>
            {user ? (
              <div className="mt-8">
                <Link
                  href={`/wrapped/${currentYear}`}
                  className="inline-flex items-center gap-2 font-sans text-base font-semibold px-7 py-4 rounded-full transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg)",
                    boxShadow: "0 12px 36px var(--accent)",
                  }}
                >
                  See my Wrapped
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ) : (
              <WaitlistForm variant="dark" />
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
