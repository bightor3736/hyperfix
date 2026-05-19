import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rewatch Tracker — for the show you've watched too many times to admit",
  description:
    "A rewatch tracker for the fifth time through Pride & Prejudice, the comfort rewatch that's now a hyperfixation, and the show that's different every time you watch it because you're different.",
  alternates: {
    canonical: "https://hyperfix.app/rewatch-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/rewatch-tracker",
    title: "Rewatch Tracker — Hyperfix",
    description: "For the show you've seen too many times to admit.",
    images: [{ url: "/api/og?title=Rewatch+Tracker&sub=for+the+show+you%27ve+seen+too+many+times+%C2%B7+hyperfix.app&accent=Rewatch", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    q: "Should I log a rewatch as a new fix or extend an existing one?",
    a: "New fix. A rewatch is its own event — a different period of engagement with the same material. Log it separately with the rewatch number in the title. This way you'll have a complete history: first watch, second watch, the one you did in March 2026 for reasons you'd rather not examine too closely. Each one gets its own counter and its own eulogy.",
  },
  {
    q: "What if I don't finish the rewatch? Does it still count?",
    a: "Yes. A comfort rewatch that you abandon after episode four because you got what you needed is still a fixation. Close it when you stop, write a note if you want ('only needed the first four episodes this time'), and let Hyperfix log however many days it actually ran. Incomplete rewatches are real. They count.",
  },
  {
    q: "Can I track individual episode loops — not full rewatches but specific scenes?",
    a: "Yes. If you've watched the Pemberley scene from Pride & Prejudice 2005 forty times in the last two weeks, that's a fixation. Log the scene, not the film. The specificity is the point — the counter for 'that one scene' is a different object than the counter for 'the full film again.' Both are valid.",
  },
  {
    q: "How is this different from a watch diary?",
    a: "A watch diary logs what you watched. Hyperfix logs what's happening to you while you watch — the intensity, the duration of the obsession, the reason you started and the state you were in when you stopped. The eulogy is the difference: a watch diary doesn't ask you why this rewatch, why now, what you were looking for. Hyperfix does.",
  },
  {
    q: "What about audio rewatches — podcasts, albums, audiobooks?",
    a: "Hyperfix is not media-specific. If you're on your fourth full listen of an audiobook, or you've been replaying the same album for three weeks as a comfort loop, or you re-listen to a specific podcast episode repeatedly — log it. The type field is freeform. 'Album rewatch' isn't the right word but you know what you mean.",
  },
  {
    q: "Can I see all my rewatches over time?",
    a: "Your graveyard will show the full history. You'll be able to see how many times you've gone back to the same source material across different periods of your life — and what the intensity was each time. Some things you rewatch once at low intensity. Some things you return to repeatedly at peak intensity every time. The pattern across multiple entries is its own kind of self-knowledge.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Rewatch Tracker", item: "https://hyperfix.app/rewatch-tracker" },
  ],
};

const sampleCards = [
  {
    title: "Pride & Prejudice (2005) — rewatch #7",
    type: "film · comfort rewatch",
    day: 18,
    intensity: 9,
    user: "@darcyrot",
    tilt: "tilt-l",
    started: "Rewatch count: 7",
    note: "it's different every time and i am always ruined",
    color: "bg-paper",
  },
  {
    title: "What We Do in the Shadows — full rerun",
    type: "show · rewatch",
    day: 31,
    intensity: 8,
    user: "@nandordevotee",
    tilt: "tilt-r",
    started: "3rd full rewatch",
    note: "i have opinions about nandor that i will share",
    color: "bg-[#1C1C1E]",
  },
];

export default function RewatchTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">

        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              rewatch tracker · hyperfix.app · 2026
            </span>
            <h1 className="font-display font-medium text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.92] tracking-crush text-ink text-balance">
              Rewatch
              <br />
              <span className="italic text-accent">Tracker</span>
            </h1>
            <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              Letterboxd logs that you watched it. It doesn&apos;t log that you&apos;ve watched it seven times. It doesn&apos;t track that you&apos;re currently on your third full rewatch of a series this year. It doesn&apos;t know that rewatching isn&apos;t something you chose — it&apos;s something your brain is doing because it needs the thing and you&apos;re not done with it yet.
            </p>
            <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              Hyperfix tracks the rewatch as a first-class event. Not a footnote on the original entry — its own fixation, its own counter, its own eulogy when it ends. Because a third rewatch of Pride &amp; Prejudice in a single winter is not the same as the first watch. It&apos;s a specific era. It deserves a specific record.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the rewatch isn&apos;t a repeat
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-10 text-balance">
              Every rewatch is
              <br />
              <span className="italic text-accent">a different fixation.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  The thing about rewatches is that you&apos;re different every time. The first watch of Normal People is not the same experience as the rewatch you do at 27 after a specific thing happens in your life. The show hasn&apos;t changed. You have. The fixation that kicks in is yours, not the show&apos;s, and it belongs to this specific rewatch at this specific moment.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Letterboxd lets you log a rewatch. It does not give it a day counter. It does not ask you what&apos;s happening. A comfort rewatch that runs for three weeks — going back to the same episodes, the same scenes — is a hyperfixation as much as any new obsession. Hyperfix treats it like one.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-6">how it works</span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest max-w-2xl text-balance">
                A tracker that knows
                <br />
                <span className="italic">what it&apos;s tracking.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
              <div className="space-y-12">
                {[
                  {
                    n: "01",
                    h: "Log the rewatch.",
                    p: "Title, the rewatch number if you know it, the start date. Note whether it's a full series rerun or a specific episode loop. The counter starts now.",
                  },
                  {
                    n: "02",
                    h: "Track the return.",
                    p: "Comfort rewatches have their own intensity arc. Sometimes you're doing one episode a night and it's peaceful. Sometimes you've watched the same two episodes six times in a week and it's peak intensity. The meter captures both.",
                  },
                  {
                    n: "03",
                    h: "Name what this one was for.",
                    p: "The best feature of the rewatch eulogy is the closing note: why this rewatch, why now, what you were looking for. In two years you'll be able to read it and understand exactly where you were in your life when you needed to watch Pride & Prejudice for the seventh time.",
                  },
                ].map((s) => (
                  <div key={s.n} className="border-t border-[rgba(244,244,244,0.07)] pt-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3 block">
                      step {s.n}
                    </span>
                    <h3 className="font-display text-2xl tracking-tight mb-3">
                      {s.h}
                    </h3>
                    <p className="font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                      {s.p}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-8 items-center justify-center">
                {sampleCards.map((card, i) => (
                  <TiltCard key={i} tiltLimit={10} scale={1.03} effect="gravitate">

                    <HyperfixCard {...card} tilt="" />

                  </TiltCard>))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">the difference</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-16 max-w-3xl text-balance">
              Not Letterboxd.
              <br />
              <span className="italic text-accent">Not pretending it&apos;s not happening.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. Letterboxd
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Letterboxd logs the film or episode. Hyperfix logs the obsession. A seventh rewatch on Letterboxd is a diary entry with a star rating. A seventh rewatch on Hyperfix is a hyperfixation with a day counter, an intensity meter, and a eulogy. They&apos;re different products for different moments — you might want both, but for the rewatch spiral, Hyperfix is the right tool.
                  </p>
                </div>
              </div>

              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. pretending it&apos;s not happening
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Many people don&apos;t track comfort rewatches because they feel like something to be embarrassed about. They&apos;re not. A rewatch is a form of self-care, nostalgia, emotional regulation, or all three. The counter doesn&apos;t judge. It just counts. And when the run ends, the eulogy exists as proof that this specific era happened, this specific version of you needed this specific show, and that&apos;s worth remembering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-6">
                frequently · asked · questions
              </span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest text-balance">
                Everything you wanted
                <br />
                <span className="italic text-accent">to ask.</span>
              </h2>
            </div>
            <div className="divide-y divide-[rgba(244,244,244,0.07)] border-y border-[rgba(244,244,244,0.07)]">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group py-6 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none">
                    <h3 className="font-display text-xl sm:text-2xl tracking-tight leading-snug text-ink">
                      <span className="font-mono text-xs text-accent mr-3 tabular">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </h3>
                    <span aria-hidden="true" className="font-mono text-2xl text-[rgba(244,244,244,0.4)] group-open:rotate-45 transition-transform shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 ml-10 font-sans text-base sm:text-lg text-[rgba(244,244,244,0.5)] leading-relaxed max-w-2xl">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-24 sm:py-40 bg-[#111113]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              join the waitlist
            </span>
            <h2 className="font-display text-5xl sm:text-7xl leading-[0.92] tracking-crush text-balance">
              The seventh rewatch started.
              <br />
              <span className="italic text-accent">Log it. You know why you&apos;re here.</span>
            </h2>
            <p className="mt-8 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl mx-auto leading-snug">
              The waitlist gets first access in waves. Early users get a permanent Pro discount and the most embarrassing usernames before they&apos;re gone.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
