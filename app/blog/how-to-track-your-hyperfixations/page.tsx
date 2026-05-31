import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "How to Track Your Hyperfixations (and Why You Should)",
  description:
    "A practical guide to logging hyperfixations — what fields actually matter, how to count the days, and why a record of your obsessions turns out to be more useful than you'd think.",
  alternates: {
    canonical: "https://hyperfix.app/blog/how-to-track-your-hyperfixations",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/how-to-track-your-hyperfixations",
    title: "How to Track Your Hyperfixations (and Why You Should)",
    description:
      "A practical guide to logging hyperfixations — what fields actually matter, how to count the days, and why a record of your obsessions turns out to be more useful than you'd think.",
    images: [
      {
        url: "/api/og?title=How+to+Track+Your+Hyperfixations&sub=a+practical+guide+%C2%B7+hyperfix.app&accent=Track",
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
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hyperfix.app/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "How to Track Your Hyperfixations (and Why You Should)",
      item: "https://hyperfix.app/blog/how-to-track-your-hyperfixations",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Track Your Hyperfixations (and Why You Should)",
  description:
    "A practical guide to logging hyperfixations — what fields actually matter, how to count the days, and why a record of your obsessions turns out to be more useful than you'd think.",
  url: "https://hyperfix.app/blog/how-to-track-your-hyperfixations",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    h: "Why bother tracking at all",
    body: "Most hyperfixations disappear completely. Not the fandom — you might stay in the fandom — but the specific brain-state of the active fixation. Day 47 you. The person who had strong opinions about chapter eleven at 1 a.m. That person is temporary. A log is proof they existed.",
  },
  {
    h: "What to track",
    body: "The minimum viable record: (a) what it is — name, type (fic, song, show, character, game, etc.); (b) when it started — the exact date matters more than you think; (c) intensity — a number from 1 to 10, or at least a sense of \"this is peak\" vs. \"this is simmering\"; (d) a note when you need one — not an essay, just whatever you'd want to remember.",
  },
  {
    h: "The day counter is the most important thing",
    body: "Looking at a number — day 47, day 156, day 412 — does something to the obsession. It becomes concrete. It becomes evidence. It stops being something quietly running your life and starts being something you can point at. The counter doesn't require effort to maintain. It just runs. That's the whole system.",
  },
  {
    h: "When to log a new fix",
    body: "Log it when you notice it. Not when it's at peak intensity — you might miss a week of day-one data that way. Log it when you first think \"hm, I've been thinking about this a lot.\" Day one data is the most interesting data in retrospect.",
  },
  {
    h: "What happens when it ends",
    body: "The end of a hyperfixation is an event worth marking. Not just archiving the entry — writing something. What was it? What specifically got you? What was the peak? What do you want to remember? The eulogy doesn't have to be long. It just has to exist.",
  },
  {
    h: "The graveyard",
    body: "After enough fixations, you have a record. An archive. The things that ran your life for a while, stacked up. This is genuinely interesting to look back on: your fixation history is a version of your autobiography. The eras, the intensities, the things that arrived at exactly the right moment.",
  },
  {
    h: "Tools for tracking",
    body: "Options from simple to complex: Notes app (low friction, no structure), spreadsheet (structured, manual), Notion template (powerful, high maintenance), dedicated app. The dedicated app wins on the day counter, the intensity meter, the eulogy — the things that require awareness of what a hyperfixation is, not just a schema that holds data.",
  },
];

export default function HowToTrackPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink bg-[var(--bg)]">
        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-12 border-b border-[var(--line)]">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-8">guide · hyperfix</span>
            <h1 className="font-display font-medium text-ink text-balance" style={{ fontSize: "clamp(32px, 5.5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              How to Track Your Hyperfixations (and Why You Should)
            </h1>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[var(--ink-muted)]">
              Published May 2026
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-16">
              {sections.map((sec) => (
                <section key={sec.h}>
                  <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                    {sec.h}
                  </h2>
                  <p className="font-sans text-base sm:text-[17px] text-[var(--line)] leading-[1.75]">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[var(--line)]">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] self-start">
              what it looks like
            </p>
            <TiltCard tiltLimit={10} scale={1.03} effect="gravitate">
              <HyperfixCard
                title="Wednesday"
                type="show · rewatch"
                day={22}
                intensity={7}
                user="@wednesdayfan"
                tilt=""
                started="Started November"
                note="fourth rewatch. still obsessed."
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[var(--line)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mb-6">Read next</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/blog/what-is-hyperfixation" className="block rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-3">explainer</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">What Is Hyperfixation? →</p>
              </a>
              <a href="/blog/adhd-hyperfixation" className="block rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-3">deep dive</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">ADHD Hyperfixation: Why Your Brain Does This →</p>
              </a>
            </div>
          </div>
        </section>
        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[var(--bg)]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-3 text-balance">
              Start the counter.{" "}
              <span className="italic text-accent">Log the fix.</span>
            </h2>
            <p className="font-sans text-lg text-[var(--ink-muted)] leading-relaxed mb-8 max-w-lg">
              The graveyard builds itself. You just have to log the first one.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
