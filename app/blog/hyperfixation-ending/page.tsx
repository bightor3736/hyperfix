import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "How to Survive the End of a Hyperfixation",
  description:
    "The post-fix crash is real. That hollow, directionless feeling when something that consumed you for 60 days just stops. Here’s why it happens and what to do with it.",
  alternates: {
    canonical: "https://hyperfix.app/blog/hyperfixation-ending",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/hyperfixation-ending",
    title: "How to Survive the End of a Hyperfixation",
    description:
      "The post-fix crash is real. That hollow, directionless feeling when something that consumed you for 60 days just stops. Here’s why it happens and what to do with it.",
    images: [
      {
        url: "/api/og?title=How+to+Survive+the+End+of+a+Hyperfixation&sub=the+post-fix+crash%2C+explained+%C2%B7+hyperfix.app&accent=Blog",
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
      name: "How to Survive the End of a Hyperfixation",
      item: "https://hyperfix.app/blog/hyperfixation-ending",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Survive the End of a Hyperfixation",
  description:
    "The post-fix crash is real. That hollow, directionless feeling when something that consumed you for 60 days just stops. Here’s why it happens and what to do with it.",
  url: "https://hyperfix.app/blog/hyperfixation-ending",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    h: "What the end actually feels like",
    body: "It doesn’t go out dramatically. There’s no moment where you decide you’re done. One day you just notice that you haven’t thought about it. The tabs are still open. The playlist is still there. But the pull is gone, and the absence of it feels strange — like pressure you got so used to you stopped noticing it until it lifted. What’s left is a specific kind of hollow. Not sad, exactly. Not relieved. Just… directionless. Like your brain had a job for sixty days and now it doesn’t have one and nobody told it the shift was over.",
  },
  {
    h: "Why it hits so hard (the neuroscience, briefly)",
    body: "Here’s the honest version: your brain was running on dopamine. Not a little — a lot. Hyperfixation isn’t just sustained interest, it’s a sustained dopamine loop. Every new piece of information, every rewatch, every late-night thread you went down — that was your reward system doing its thing. When the fixation fades, the loop closes. The dopamine drops. And your brain, which had calibrated itself to that level of stimulation, now finds everyday life genuinely underwhelming by comparison. That’s not weakness. That’s chemistry. The crash is real because the high was real.",
  },
  {
    h: "The mistake of chasing the next fix immediately",
    body: "The tempting move, when the hollow hits, is to immediately find the next thing. Just scroll until something catches. Force enthusiasm about something new. Fill the gap before it has time to feel like a gap. This is understandable and also usually counterproductive. The next fix tends to arrive on its own schedule, and pressuring it doesn’t speed it up — it just means you spend energy performing interest in things that aren’t quite landing yet. The gap is uncomfortable. It’s also brief. You don’t need to fix it by Friday.",
  },
  {
    h: "How to write the eulogy",
    body: "Before the details go — and they go faster than you’d think — write it down. Not an essay. Just the facts: what it was, when it started, how many days it ran, what the intensity was at peak, what you made or did or learned during it, the one piece of it you’ll keep. You don’t have to be sentimental about this. It’s a log entry, not a memorial. But writing the eulogy while you still remember the texture of it does two things: it gives the fixation its due, and it makes the ending feel deliberate rather than just… something that happened to you. You were there. You noticed. You wrote it down.",
  },
  {
    h: "What comes after",
    body: "The gap period has its own character. Things that got neglected during the fix start reasserting themselves. You eat lunch at a normal time. You reply to texts. You notice that the world still exists and is fine. This part isn’t empty — it’s decompression. Let it be that. The next fixation will announce itself when it’s ready: a lookup that becomes seventeen tabs, a recommendation you can’t stop thinking about, something someone said that sent you straight to a search bar. You’ll know it when it starts because it feels exactly like this one did at the beginning.",
  },
  {
    h: "The graveyard as a gift",
    body: "If you’ve been tracking your fixations, you have a record of everything that mattered to you at full intensity — the things that ran your life, sometimes for days, sometimes for months. That record is a map. Not just of what you loved, but of who you were when you loved it, what was happening in your life, what you needed at the time. The graveyard of finished fixations isn’t a list of things you lost. It’s evidence that your brain is alive, that it connects deeply, that it doesn’t do shallow. The one that just ended belongs there now. Let it.",
  },
];

export default function HyperfixationEndingPage() {
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
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">guide · hyperfix</span>
            <h1 className="font-display font-medium text-[2.75rem] sm:text-[4.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              How to Survive the End of a Hyperfixation
            </h1>
            <p className="mt-6 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] leading-snug max-w-2xl">
              The post-fix crash is real. That hollow, directionless feeling when something that
              consumed you for sixty days just… stops. Here&apos;s why it happens, why you
              shouldn&apos;t panic-scroll for a replacement, and what to do with the gap instead.
            </p>
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
                  <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-relaxed">{sec.body}</p>
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
                title="Hamilton soundtrack"
                type="musical · listen"
                day={312}
                intensity={10}
                user="@hamilton.era"
                tilt=""
                started="Started 2017"
                note="this is the one that got away"
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] mb-6">
              Read next
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href="/blog/signs-youre-in-a-hyperfixation"
                className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors"
              >
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">guide</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">
                  Signs You&apos;re in a Hyperfixation &rarr;
                </p>
              </a>
              <a
                href="/blog/how-to-track-your-hyperfixations"
                className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors"
              >
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">guide</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">
                  How to Track Your Hyperfixations &rarr;
                </p>
              </a>
              <a
                href="/blog/what-is-hyperfixation"
                className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors"
              >
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">explainer</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">
                  What Is Hyperfixation? &rarr;
                </p>
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[#111113]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-8 text-balance">
              Log it before the details go.
            </h2>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
