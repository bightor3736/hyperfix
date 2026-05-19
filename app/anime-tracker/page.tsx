import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Anime Tracker — log the series, the ship, the character who broke you",
  description:
    "An anime tracker for the series that consumed your whole week, the ship you can't stop thinking about, and the character who rearranged your brain. Not a watched-list. A hyperfixation tracker.",
  alternates: {
    canonical: "https://hyperfix.app/anime-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/anime-tracker",
    title: "Anime Tracker — Hyperfix",
    description: "Not a watched-list. A hyperfixation tracker.",
    images: [{ url: "/api/og?title=Anime+Tracker&sub=not+a+watched-list+%C2%B7+a+hyperfixation+tracker+%C2%B7+hyperfix.app&accent=Anime", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    q: "Can I track individual characters separately from the series?",
    a: "Yes. The series is one potential fixation, and a specific character within it can be a different fixation with a different counter. If you watched Attack on Titan and it was fine, but then Levi Ackerman happened and you spent eight weeks exclusively in his corner of the fandom — that's its own entry. Log the thing that actually has you. Sometimes it's the show. Sometimes it's one person in the show.",
  },
  {
    q: "What about tracking ships?",
    a: "Ships are first-class fixations. Log them by name (Gojo x Geto, Forger family dynamics, whatever), set the type to 'ship,' and let the counter run. Ship fixations often outlast the source material — you'll still be reading the fic years after the series ended. The counter captures all of that.",
  },
  {
    q: "How do I handle a series I'm watching currently vs. one I finished but am still obsessed with?",
    a: "Both get logged — they're just different. A currently-airing series fix starts when it gets you, not when it ends. A finished series fix might start when you complete it and the obsession kicks in, or it might have started mid-watch. Log from when the fixation actually began, not from an arbitrary episode marker.",
  },
  {
    q: "What about manga vs. anime fixations for the same series?",
    a: "Log them separately if they feel separate, or as one if they're the same fixation in different formats. If you watched the anime and it was fine, then you read the manga and it wrecked you — that's a manga fixation, not a continuation of the anime one. If you moved from anime to manga and the obsession just kept going, update the note and keep the same fix running.",
  },
  {
    q: "Can I track non-Japanese animation?",
    a: "Hyperfix tracks anything. It doesn't check genres or regions. If Avatar: The Last Airbender is consuming you the way an anime fixation does, log it. The type field is freeform — you can call it what it is.",
  },
  {
    q: "What's the eulogy like when an anime fixation ends?",
    a: "The eulogy is a closing card: the title of the fixation, the day count, the peak intensity, and a note you write at close. It's designed to be screenshotted and shared — or just kept. You'll be able to look back at it and remember exactly what the Jujutsu Kaisen arc did to you in the spring of 2026 and why you were like that for forty-one days.",
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
    { "@type": "ListItem", position: 2, name: "Anime Tracker", item: "https://hyperfix.app/anime-tracker" },
  ],
};

const sampleCards = [
  {
    title: "Jujutsu Kaisen — Gojo Satoru",
    type: "anime · character",
    day: 41,
    intensity: 10,
    user: "@gojorot",
    tilt: "tilt-l",
    started: "Shibuya arc undid me",
    note: "i will not be explaining myself",
    color: "bg-paper",
  },
  {
    title: "Spy x Family — Loid x Yor",
    type: "anime · ship",
    day: 28,
    intensity: 8,
    user: "@forgershipper",
    tilt: "tilt-r",
    started: "Started March 4",
    note: "they're so married and they don't even know",
    color: "bg-[#1C1C1E]",
  },
];

export default function AnimeTrackerPage() {
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
              anime tracker · hyperfix.app · 2026
            </span>
            <h1 className="font-display font-medium text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.92] tracking-crush text-ink text-balance">
              Anime
              <br />
              <span className="italic text-accent">Tracker</span>
            </h1>
            <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              MAL tracks what you&apos;ve watched. Hyperfix tracks what it did to you. There&apos;s a meaningful gap between &ldquo;completed — 9/10&rdquo; and &ldquo;I watched this entire series in 36 hours and I haven&apos;t been the same since.&rdquo; The character who rearranged your brain. The ship that has you reading fanfic at midnight. The arc that broke you in a way that a star rating doesn&apos;t capture.
            </p>
            <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              Hyperfix is for that gap. Log the series, the character, the ship, the specific episode — whatever the actual object of the fixation is. The day counter starts immediately. The intensity meter tracks the arc. And when it finally lifts, the eulogy captures the whole run: how long, how intense, what you wrote at 2 a.m. after that episode.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the obsession, not the log
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-10 text-balance">
              A completed series is not
              <br />
              <span className="italic text-accent">a closed fixation.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  MAL tells you when you finished watching. It doesn&apos;t know that you finished watching Evangelion four days ago and you&apos;re still not okay. It doesn&apos;t know that you&apos;ve re-read every Gojo Satoru character analysis you can find. It doesn&apos;t know that you started reading the manga because the anime isn&apos;t enough and you&apos;ve been going to bed at 3 a.m. for two weeks.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  That&apos;s a hyperfixation. It started when you hit play on episode one, or maybe episode eight when the thing happened, or maybe when you found the fanfic. It&apos;s still running. Hyperfix gives it a counter from the moment it starts — not from when you completed the series, but from when it got you.
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
                    h: "Log the fixation.",
                    p: "The series, the character, the ship, the arc — whatever the actual hook is. Sometimes it's the whole show. Sometimes it's one character in episode seven. Log what it actually is, not what the show is called.",
                  },
                  {
                    n: "02",
                    h: "Track the depth.",
                    p: "Anime hyperfixations have phases: the initial watch, the rewatch, the fandom dive, the fanfic era, the fanart phase. The intensity meter captures where you are. Update it when a new chapter drops, when you find the fic, when the arc escalates.",
                  },
                  {
                    n: "03",
                    h: "Close it when it's done.",
                    p: "The fixation ends when it ends — not when you finish the series. When the specific brain-state lifts and you can think about other things again, close the fix. Hyperfix writes the eulogy: how long you were in it, what the peak was, what you'd want to remember.",
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
              Not MAL.
              <br />
              <span className="italic text-accent">Not your memory.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. MyAnimeList / AniList
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    MAL and AniList are completion trackers. They&apos;re excellent at what they do — logging what you&apos;ve watched, rating it, finding recommendations. Hyperfix isn&apos;t trying to replace them. Hyperfix is for the thing that happens after &ldquo;completed.&rdquo; The obsession that outlasts the series by weeks. The character who keeps living in your brain long after the credits rolled.
                  </p>
                </div>
              </div>

              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. keeping it in your head
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Anime hyperfixations are easy to undercount mentally. &ldquo;I was into JJK for like two months&rdquo; — but was it two months of casual enjoyment or two months of thinking about Gojo Satoru&apos;s backstory every single day? The counter makes it concrete. Day 41 of a character fixation is a different thing than day 12. The record exists so you can look back and know.
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
              The series got you.
              <br />
              <span className="italic text-accent">Log it before day one becomes a memory.</span>
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
