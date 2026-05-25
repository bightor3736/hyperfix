import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import { BlogCardCTA } from "@/components/BlogCardCTA";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "How to Explain Hyperfixation to Someone Who Doesn't Have It",
  description:
    "How do you explain to a neurotypical person why you've been talking about the same fanfic for three months? A practical guide for the conversation you've been avoiding.",
  alternates: {
    canonical: "https://hyperfix.app/blog/how-to-explain-hyperfixation",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/how-to-explain-hyperfixation",
    title: "How to Explain Hyperfixation to Someone Who Doesn't Have It",
    description:
      "How do you explain to a neurotypical person why you've been talking about the same fanfic for three months? A practical guide for the conversation you've been avoiding.",
    images: [
      {
        url: "/api/og?title=How+to+Explain+Hyperfixation&sub=the+conversation+you%27ve+been+avoiding+%C2%B7+hyperfix.app&accent=Explain",
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
      name: "How to Explain Hyperfixation to Someone Who Doesn't Have It",
      item: "https://hyperfix.app/blog/how-to-explain-hyperfixation",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Explain Hyperfixation to Someone Who Doesn't Have It",
  description:
    "How do you explain to a neurotypical person why you've been talking about the same fanfic for three months? A practical guide for the conversation you've been avoiding.",
  url: "https://hyperfix.app/blog/how-to-explain-hyperfixation",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    h: "Why this is hard",
    body: "The difficulty isn't vocabulary. You can define hyperfixation in one sentence. The difficulty is that the person you're explaining it to has probably experienced intense interest in something, and they're going to assume that's what you're describing. It's not. The gap between strong interest and hyperfixation is the gap between wanting a second slice of cake and thinking about cake for eleven consecutive hours without deciding to. One is a choice. The other arrived.",
  },
  {
    h: "Start with the involuntary part",
    body: "The most important thing to communicate is that this isn't enthusiasm you can turn down. It's not that you really like this thing. It's that this thing has taken up residence in your brain and is running in the background regardless of what else you're doing. You're at work thinking about a fictional character's attachment style. You're trying to sleep and you're running through plot points. You didn't choose this. It's just happening. That's the part neurotypical people usually don't have a reference for.",
  },
  {
    h: "The intensity comparison that tends to work",
    body: "Something like this: imagine you just fell in love. In the first week. Where the other person is in your thoughts constantly and you don't mind because it feels good and interesting and you want to know everything. Now imagine that feeling, but directed at a book series. Or a fictional character. Or a specific album. Or a person you will never meet. That's the emotional register. The intensity isn't strange — it's familiar. The target is the part that surprises people.",
  },
  {
    h: "What it's not",
    body: "It's not immaturity. It's not a phase in the dismissive sense — some hyperfixations are phases, some become lifelong interests, and neither is better or worse. It's not something that needs to be grown out of. It's not a lack of real interests or real friends or real problems. It's not something that stops you from caring about other things. Most people with hyperfixations also have jobs, relationships, and functional adult lives — the fixation coexists with all of it, sometimes inconveniently, sometimes as a genuine resource.",
  },
  {
    h: "How to explain the day counter",
    body: "If you're showing someone Hyperfix, the day counter is usually the thing that needs the most explanation. Why count? Because the count gives the fixation a weight it doesn't otherwise have. Saying \"I've been into this for a while\" is vague. Saying \"I've been in this for forty-seven days\" is concrete. It converts a fuzzy internal experience into something you can point at. People who don't have hyperfixations tend to understand numbers more easily than they understand intensities.",
  },
  {
    h: "When they still don't get it",
    body: "Some people won't, and that's okay. Neurological diversity means that some experiences aren't fully translatable. What you can do is ask for acceptance rather than understanding: you don't need them to have had this experience, you just need them to not treat it as a problem that requires fixing. The fixation is doing something useful. It's regulating you. It's connecting you to communities and ideas and states of intense engagement that a lot of people never feel. You don't need to justify it. You just need the people close to you to let it exist.",
  },
  {
    h: "The graveyard argument",
    body: "If you want to make the case for why this matters — why track it, why count it, why build a record — the graveyard is the argument. Every hyperfixation you've ever had has left you with something: knowledge, a community, a skill, a piece of media that meant something to you, a version of yourself that existed in that specific brain-state for a specific number of days. That's not trivial. That's a record of how you engage with the world. The graveyard is the proof that it happened and that it was real.",
  },
];

export default function HowToExplainHyperfixationPage() {
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

      <main id="main-content" className="relative z-10 text-ink bg-[#070708]">
        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-12 border-b border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">guide · hyperfix</span>
            <h1 className="font-display font-medium text-ink text-balance" style={{ fontSize: "clamp(32px, 5.5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              How to Explain Hyperfixation to Someone Who Doesn&apos;t Have It
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
                  <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
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
                title="What We Do in the Shadows"
                type="show · hulu"
                day={67}
                intensity={9}
                user="@nandorstan"
                tilt=""
                started="Rewatch count: 4"
                note="have opinions about Nandor"
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] mb-6">Read next</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/blog/what-is-hyperfixation" className="block rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0F1011] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(94,234,212,0.3)]">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">explainer</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">What Is Hyperfixation? →</p>
              </a>
              <a href="/blog/adhd-hyperfixation" className="block rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0F1011] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(94,234,212,0.3)]">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">deep dive</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">ADHD Hyperfixation: Why Your Brain Does This →</p>
              </a>
            </div>
          </div>
        </section>

        <BlogCardCTA />
        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[#0F1011]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-8 text-balance">
              Log the one you&apos;re explaining right now.
            </h2>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
