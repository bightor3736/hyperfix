import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "K-Pop Tracker — log your bias era, count the days, survive comebacks",
  description:
    "A K-pop tracker for the bias wrecker spiral, the album that broke you, and the comeback you've been streaming on loop. Log the era. Count the days. Mourn it when it ends.",
  alternates: {
    canonical: "https://hyperfix.app/kpop-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/kpop-tracker",
    title: "K-Pop Tracker — Hyperfix",
    description: "Log the era. Count the days. Mourn it when it ends.",
    images: [{ url: "/api/og?title=K-Pop+Tracker&sub=log+the+era+%C2%B7+count+the+days+%C2%B7+hyperfix.app&accent=K-Pop", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    q: "Can I track individual songs, albums, and full bias eras separately?",
    a: "Yes — each fixation is its own entry. If you're in a comeback era for a specific album AND you're deep in a bias spiral for one member AND there's a specific b-side running your life, those are three separate fixes with three separate counters. Most K-pop fans run two to four simultaneously. Hyperfix handles all of them.",
  },
  {
    q: "What's a bias wrecker spiral and can Hyperfix track it?",
    a: "A bias wrecker spiral is when someone who isn't your main bias starts threatening that position — new fancam, a specific live performance, a Run BTS moment, a weverse post at 3 a.m. — and you spend two weeks in crisis. Yes, Hyperfix tracks this. Log it the moment you notice it's happening. The counter will be evidence you can share with your group chat.",
  },
  {
    q: "What about tracking comebacks specifically?",
    a: "Comebacks are logged as fixes just like anything else: title (the album or mini-album name), type (comeback era), start date (release day), intensity (how wrecked you are). When the comeback hype fades and regular listening resumes, you close the fix and the eulogy captures the run. Some comebacks are three-week spirals. Some run you for six months. The counter knows the difference.",
  },
  {
    q: "Can I see my K-pop history over time?",
    a: "Yes — your graveyard shows all your closed fixes in chronological order. You'll be able to look back at your entire K-pop history: every era, every comeback, every bias wrecker spiral, every album that broke you in some way. At the end of the year, Hyperfix Wrapped summarizes it — your longest K-pop era, highest intensity moment, how many days of your year were consumed by a specific group.",
  },
  {
    q: "Is this for multi-stans?",
    a: "Especially for multi-stans. If you're following three groups actively and one comeback just dropped, Hyperfix lets you run multiple active fixes simultaneously. You can see at a glance which group is currently dominating your brain (highest intensity), how long each era has been running, and what the active count looks like. It's basically a dashboard for your stanning.",
  },
  {
    q: "What happens when the era ends?",
    a: "You close the fix. Hyperfix asks you for a closing note — a sentence or two about what this era was, what it gave you, what you'll remember. Then it generates a eulogy card: day count, peak intensity, your note. It lives in your graveyard forever. You'll be able to look at it two years from now and remember exactly what the 5-STAR era did to you.",
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
    { "@type": "ListItem", position: 2, name: "K-Pop Tracker", item: "https://hyperfix.app/kpop-tracker" },
  ],
};

const sampleCards = [
  {
    title: "Stray Kids — ‘5-STAR’ album era",
    type: "kpop · full album",
    day: 67,
    intensity: 9,
    user: "@skz5star",
    tilt: "tilt-l",
    started: "Stream count: 847",
    note: "i cannot explain what this album did to me",
    color: "bg-paper",
  },
  {
    title: "Jungkook — solo bias era",
    type: "kpop · bias",
    day: 23,
    intensity: 8,
    user: "@jkbiaswrecker",
    tilt: "tilt-r",
    started: "Golden on loop",
    note: "bias wrecker became main bias. again.",
    color: "bg-[#1C1C1E]",
  },
];

export default function KPopTrackerPage() {
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
              k-pop tracker · hyperfix.app · 2026
            </span>
            <h1 className="font-display font-medium text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.92] tracking-crush text-ink text-balance">
              K-Pop
              <br />
              <span className="italic text-accent">Tracker</span>
            </h1>
            <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              K-pop hyperfixation has a specific shape. The bias era that rewires your brain. The comeback you prestreamed at midnight. The album you've listened to so many times you can't hear what other people hear when they play it for the first time. The deep-dive into discography that started as casual listening and ended with you having opinions about b-sides from 2019.
            </p>
            <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              Hyperfix tracks all of it. The era, the days, the intensity. When a new comeback kicks off a new spiral, log it. When the bias wrecker overtakes your main bias — log that too. When it finally fades, the eulogy captures the whole run: how many days, peak intensity, the note you wrote at 3 a.m. after the fancam.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the k-pop era
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-10 text-balance">
              A bias era is a hyperfixation.
              <br />
              <span className="italic text-accent">Treat it like one.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  A K-pop hyperfixation isn't "being a fan." Fans listen to the music. A hyperfixation is when you've memorized every member's birthday, you have opinions about the choreography direction decisions, you're watching 4-year-old fancams at 2 a.m., and your Spotify Wrapped has one group in the top five spots with stream counts that concern your friends.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  The bias wrecker spiral is its own phenomenon. You were solid. You had a main bias. And then one comeback happened and now your top three has completely reshuffled and you're not okay. Hyperfix gives every era its own counter — so when the wrecker becomes the bias and the bias becomes a wrecker, you have the receipts.
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
                <span className="italic">what it's tracking.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
              <div className="space-y-12">
                {[
                  {
                    n: "01",
                    h: "Log the era.",
                    p: "Name it: the album, the comeback, the bias, the ship, the specific b-side. Add a start date or log it now. One field is enough. The counter starts immediately.",
                  },
                  {
                    n: "02",
                    h: "Track the spiral.",
                    p: "Update the intensity as the era deepens. Day 3 is different from day 34. The intensity meter captures the arc — the peak, the plateau, the slow fade. When a new comeback resets the clock, log a new fix.",
                  },
                  {
                    n: "03",
                    h: "Share the card.",
                    p: "Every era generates a shareable card with the day count and intensity. Post it when a comeback drops. Send it to your group chat when you've just watched a fancam forty-three times in one sitting. Let people know the state of your brain.",
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
              Not Twitter.
              <br />
              <span className="italic text-accent">Not your head.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. Twitter / X
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Twitter is where K-pop happens — drops, comebacks, fancam wars. Hyperfix is where you record what it does to you. Twitter doesn't have a day counter for how long you've been in a specific bias era. It doesn't write a eulogy when the era finally lifts. You need both: Twitter for the community, Hyperfix for the record.
                  </p>
                </div>
              </div>

              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. keeping count in your head
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Most K-pop fans track their eras mentally — "I've been in this era for like two months I think?" The problem with mental tracking is that two months feels different at the start and the end. Day 67 of a bias era is not the same as day 12. The counter makes it real. Looking at the number does something. It gives the era a weight your memory can't.
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
              The era started.
              <br />
              <span className="italic text-accent">Log it before you forget day one.</span>
            </h2>
            <p className="mt-8 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl mx-auto leading-snug">
              The waitlist gets first access in waves. Early users get a permanent Pro discount and the most embarrassing usernames before they're gone.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
