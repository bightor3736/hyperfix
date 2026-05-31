import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import { BlogCardCTA } from "@/components/BlogCardCTA";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "What Is Hyperfixation? Definition, Examples, and Why It Matters",
  description:
    "Hyperfixation is an intense, consuming focus on one specific thing — involuntary, absorbing, and common in ADHD and autism. Here's what it actually means.",
  alternates: {
    canonical: "https://hyperfix.app/blog/what-is-hyperfixation",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/what-is-hyperfixation",
    title: "What Is Hyperfixation?",
    description: "Hyperfixation is an intense, consuming focus on one specific thing — involuntary, absorbing, and common in ADHD and autism. Here's what it actually means.",
    images: [
      {
        url: "/api/og?title=What+Is+Hyperfixation%3F&sub=definition%2C+examples%2C+and+why+it+matters+%C2%B7+hyperfix.app&accent=Hyperfixation",
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
      name: "What Is Hyperfixation?",
      item: "https://hyperfix.app/blog/what-is-hyperfixation",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Hyperfixation? Definition, Examples, and Why It Matters",
  description:
    "Hyperfixation is an intense, consuming focus on one specific thing — involuntary, absorbing, and common in ADHD and autism. Here's what it actually means.",
  url: "https://hyperfix.app/blog/what-is-hyperfixation",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    h: "The definition",
    body: "Hyperfixation is an intense, consuming focus on one specific thing — a piece of media, a person, a topic, a fandom — that arrives largely involuntarily and tends to absorb a disproportionate amount of your time, attention, and emotional bandwidth. It's most commonly discussed in the context of ADHD and autism, though many people who don't identify with either experience it.",
  },
  {
    h: "Where the word comes from",
    body: "The term emerged primarily from ADHD and autistic community spaces online. Clinical psychology had related concepts — \"perseveration,\" \"restricted interests\" — but these were framed around deficit and dysfunction. The word \"hyperfixation\" as used colloquially is more neutral: it describes the experience without pathologizing it. You didn't choose it. It arrived. It's doing something to your brain. That's worth naming.",
  },
  {
    h: "What it actually looks like",
    body: "The book you've re-read four times this year. The song that's been on loop for three weeks. The show you rewatched six times. The fictional character whose internal logic you understand better than most people in your life. The fandom you fell into at 11 p.m. on a Tuesday and climbed out of three months later. The K-pop group whose discography you have opinions about. The Minecraft server you played for eight hours a day for two months and then never touched again.",
  },
  {
    h: "Hyperfixation vs. a hobby",
    body: "A hobby is something you chose. A hyperfixation arrived. A hobby takes up a reasonable proportion of your time and attention. A hyperfixation takes up more than that — sometimes significantly more. A hobby doesn't make you reorganise your whole day around it. A hyperfixation does. The intensity distinguishes it: not just interest, but consuming interest. Not just enjoyment, but something closer to possession.",
  },
  {
    h: "Why it ends",
    body: "Hyperfixations don't last forever. The specific brain-state that made this particular thing the most important thing tends to lift. Sometimes gradually, sometimes suddenly. You might still love the thing — but you're no longer in it the way you were on day 47. This ending is its own experience, and it's one of the reasons tracking them matters: the record is proof it happened, proof you were that person at that moment.",
  },
  {
    h: "Why tracking it matters",
    body: "A hyperfixation is part of your autobiography. The Hamilton era. The specific fanfic winter. The K-pop phase that arrived at exactly the right moment. Tracking it gives you a weight for the experience — day 47, intensity 9, the note you wrote at 1 a.m. A record of your interior life. Not a task, not a document. An era.",
  },
];

export default function WhatIsHyperfixationPage() {
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
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-8">explainer · hyperfix</span>
            <h1 className="font-display font-medium text-ink text-balance" style={{ fontSize: "clamp(32px, 5.5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              What Is Hyperfixation?
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
                title="Marauders fanfic"
                type="fanfic · ao3"
                day={47}
                intensity={9}
                user="@lupin-loving-loser"
                tilt=""
                started="Started March 21"
                note="i should be studying. instead."
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[var(--line)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mb-6">Read next</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/blog/adhd-hyperfixation" className="block rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-3">deep dive</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">ADHD Hyperfixation: Why Your Brain Does This →</p>
              </a>
              <a href="/blog/how-to-track-your-hyperfixations" className="block rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[var(--line)] text-[var(--ink-muted)] mb-3">guide</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">How to Track Your Hyperfixations →</p>
              </a>
            </div>
          </div>
        </section>
        <BlogCardCTA />
        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[var(--bg)]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-8 text-balance">
              Log your current hyperfixation.
            </h2>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
