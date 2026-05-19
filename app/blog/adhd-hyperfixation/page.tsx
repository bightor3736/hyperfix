import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "ADHD Hyperfixation: Why Your Brain Does This",
  description:
    "ADHD hyperfixation is a real neurological experience — not lack of willpower, not just 'being a fan.' Here's what's actually happening in your brain and why it feels the way it does.",
  alternates: {
    canonical: "https://hyperfix.app/blog/adhd-hyperfixation",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/adhd-hyperfixation",
    title: "ADHD Hyperfixation: Why Your Brain Does This",
    description:
      "ADHD hyperfixation is a real neurological experience — not lack of willpower, not just 'being a fan.' Here's what's actually happening in your brain and why it feels the way it does.",
    images: [
      {
        url: "/api/og?title=ADHD+Hyperfixation&sub=why+your+brain+does+this+%C2%B7+hyperfix.app&accent=ADHD",
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
      name: "ADHD Hyperfixation: Why Your Brain Does This",
      item: "https://hyperfix.app/blog/adhd-hyperfixation",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "ADHD Hyperfixation: Why Your Brain Does This",
  description:
    "ADHD hyperfixation is a real neurological experience — not lack of willpower, not just 'being a fan.' Here's what's actually happening in your brain and why it feels the way it does.",
  url: "https://hyperfix.app/blog/adhd-hyperfixation",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    h: "ADHD and dopamine",
    body: "ADHD is, at its core, a dopamine regulation issue. The ADHD brain has difficulty sustaining attention on tasks that don't provide sufficient dopamine reward — which is why \"just focus\" doesn't work. But the flip side of this is less often discussed: when the ADHD brain finds something genuinely interesting, it can focus with an intensity that neurotypical attention rarely reaches. The interest-based nervous system isn't broken. It's differently gated.",
  },
  {
    h: "Why hyperfixation happens",
    body: "When the ADHD brain encounters something that hits the dopamine reward pathway hard enough — the right fic, the right album, the right character, the right game — it locks in. Deeply. This isn't a choice. You didn't decide to spend six hours reading AO3 instead of sleeping. The fixation arrived and the brain followed it.",
  },
  {
    h: "The experience from the inside",
    body: "It feels like everything else becomes less real. Other tasks feel duller, more effortful, more avoidable. The object of the fixation is vivid and compelling in a way that's genuinely hard to describe to someone who doesn't experience it. Time passes strangely. You look up and it's 3 a.m. You're not entirely sure how you got here. You're also not entirely upset about it.",
  },
  {
    h: "Hyperfixation vs. special interest",
    body: "These terms are often used interchangeably, but there's a distinction worth knowing: a special interest (more common in autism discourse) tends to be stable and long-lasting — a deep, enduring area of intense knowledge and interest. A hyperfixation (more common in ADHD discourse) tends to be more temporary — it arrives, consumes, and eventually lifts. The same person can have both. Many neurodivergent people do.",
  },
  {
    h: "The shame around it",
    body: "There's often shame attached to hyperfixation: the sense that this is excessive, embarrassing, something to manage or reduce. This framing misses what's actually happening. The hyperfixation isn't the problem. The mismatch between the fixation and your other obligations is the friction point. The fixation itself — the intensity, the absorption, the hours of focused engagement — is a demonstration of what your brain is capable of when it's actually interested.",
  },
  {
    h: "Tracking it as a form of self-knowledge",
    body: "Many people with ADHD struggle to remember what they were doing, feeling, or experiencing in the past. The hyperfixation log is a record of your interior life in periods of high engagement — the things that arrived and consumed you and then lifted. Looking back at them is a form of self-knowledge: what do you fixate on? What patterns emerge? What eras has your brain lived through?",
  },
];

export default function AdhdHyperfixationPage() {
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

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">
        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-12 border-b border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">deep dive · hyperfix</span>
            <h1 className="font-display font-medium text-[2.75rem] sm:text-[4.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              ADHD Hyperfixation: Why Your Brain Does This
            </h1>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
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
                  <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-relaxed">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] self-start">
              what it looks like
            </p>
            <TiltCard tiltLimit={10} scale={1.03} effect="gravitate">
              <HyperfixCard
                title="Genshin Impact lore"
                type="game · lore"
                day={156}
                intensity={8}
                user="@kai.fixated"
                tilt=""
                started="never played it"
                note="i know all the character backstories"
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] mb-6">Read next</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/blog/what-is-hyperfixation" className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">explainer</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">What Is Hyperfixation? →</p>
              </a>
              <a href="/blog/how-to-track-your-hyperfixations" className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">guide</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">How to Track Your Hyperfixations →</p>
              </a>
            </div>
          </div>
        </section>
        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[#111113]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-8 text-balance">
              Track what your brain is doing.
            </h2>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
