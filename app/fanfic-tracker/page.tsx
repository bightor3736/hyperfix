import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fanfic Tracker — log the fic that's consuming your life",
  description:
    "A fanfic tracker for Ao3 readers, re-readers, and fic hoarders. Track what you're reading, how many times you've read it, and how unwell it's made you. Not a spreadsheet.",
  alternates: {
    canonical: "https://hyperfix.app/fanfic-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/fanfic-tracker",
    title: "Fanfic Tracker — Hyperfix",
    description: "Log the fic. Count the re-reads. Mourn it when you finish.",
    images: [{ url: "/api/og?title=Fanfic+Tracker&sub=the+fic+you%27ve+re-read+six+times+%C2%B7+hyperfix.app&accent=Tracker", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Fanfic Tracker", item: "https://hyperfix.app/fanfic-tracker" },
  ],
};

const faqs = [
  {
    q: "What is a fanfic tracker?",
    a: "A fanfic tracker is a log for the fic you're currently reading — or re-reading, or have re-read six times and are about to start again. Unlike a reading list, a fanfic tracker captures the obsession itself: how long you've been in it, how unwell it's made you, the specific chapter that undid you. Hyperfix is built for this: one fic, a running day counter, an intensity rating, and a note for the things you can't say out loud.",
  },
  {
    q: "Can I track fics on multiple platforms?",
    a: "Yes. Ao3, FanFiction.net, Wattpad, Tumblr, personal blogs, Google Docs shared by a friend at 11 p.m. — Hyperfix doesn't care where the fic lives. You name the fic, tag the fandom, optionally paste a link. The platform is just metadata.",
  },
  {
    q: "What if I'm re-reading a fic I've read before?",
    a: "Start a new fix for it. The re-read counter is a first-class field — you can log how many times you've read the same fic and Hyperfix will track each era separately. Your first read of the Marauders slowburn and your third read eighteen months later are different experiences. They deserve different entries.",
  },
  {
    q: "Can I track a WIP (work in progress)?",
    a: "That's the main use case. A WIP you're actively following — waiting for updates, re-reading while you wait — is exactly what Hyperfix is for. When the fic updates, you update the log. When it finally completes (or gets abandoned, which deserves its own eulogy), you close the fix.",
  },
  {
    q: "What's the difference between a fanfic tracker and a reading list?",
    a: "A reading list is a queue. A fanfic tracker is a record of possession — the fic that has you. A reading list says 'I want to read this.' Hyperfix says 'this has been living rent-free in my brain for 34 days.' The distinction matters. You can have a TBR list of a thousand fics and still have exactly one that's currently running your life. That one is what Hyperfix is for.",
  },
  {
    q: "Is there a Goodreads or Storygraph integration?",
    a: "Not yet. Hyperfix doesn't import your reading history or sync with other platforms — it's focused on the active obsession, not the archive of everything you've ever read. The fic you're currently unwell about doesn't need to be in a database. It needs a counter.",
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

const sampleCard = {
  title: "All the Young Dudes — MsKingBean89",
  type: "fanfic · ao3",
  day: 61,
  intensity: 10,
  user: "@wolfstar.rot",
  tilt: "tilt-l",
  started: "Re-read #4",
  note: "526k words and i would do it again",
  color: "bg-paper",
};

export default function FanficTrackerPage() {
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

        {/* HERO */}
        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
                fanfic tracker · hyperfix.app · 2026
              </span>
              <h1 className="font-display font-medium text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.92] tracking-crush text-ink">
                Fanfic
                <br />
                <span className="italic text-accent">Tracker</span>
              </h1>
              <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
                For the fic you've re-read three times. The WIP you refresh
                every day. The 500k-word slowburn that consumed your entire
                March. Log it. Count the days. Show your friends how unwell
                you are.
              </p>
              <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
                Ao3, FanFiction.net, Wattpad, Google Docs — Hyperfix doesn't
                care where the fic lives. Just that it's currently living
                in your brain.
              </p>
              <WaitlistForm id="waitlist" variant="light" />
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-6 sm:-inset-10 -rotate-2 -z-10" />
                <HyperfixCard {...sampleCard} />
                <p className="mt-6 font-display italic text-[rgba(244,244,244,0.4)] text-sm text-center max-w-xs mx-auto">
                  ↑ 526k words. re-read #4. no regrets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="px-6 sm:px-10 py-20 sm:py-32 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the situation
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-10">
              You have fourteen tabs open.
              <br />
              <span className="italic text-accent">
                One of them is the fic.
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  You told yourself you'd just check the update. That was
                  three hours ago. You're now on chapter 17 again — the same
                  chapter you annotated in your Notes app at 1 a.m. last
                  Tuesday.
                </p>
                <p>
                  The fic has a hold on you that a reading list can't capture.
                  A Goodreads shelf doesn't have a "re-read count" field.
                  A spreadsheet doesn't have an intensity meter. Nothing
                  currently exists for this specific experience.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Hyperfix does. Log the fic. Add the fandom tag. Set an
                  intensity rating. Write the note you'd never say out loud.
                  Watch the counter tick. Share the card when you want someone
                  to understand what's happening to you.
                </p>
                <p>
                  When you eventually finish — or when the WIP updates and
                  the era ends — Hyperfix writes the eulogy. Day 61.
                  Re-read 4. Intensity 10. The chapter that broke you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT HYPERFIX TRACKS */}
        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">what gets tracked</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-12 max-w-2xl">
              Every field is the right field.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  n: "01",
                  h: "The day counter.",
                  p: "Starts the moment you log. Runs automatically. At day 47 you'll understand why this is the product.",
                },
                {
                  n: "02",
                  h: "Re-read count.",
                  p: "How many times you've been through it. Not a milestone — a confession. Some fics you've read more times than you've watched your favourite film.",
                },
                {
                  n: "03",
                  h: "Intensity meter.",
                  p: "1 to 10. Updates as the fic progresses. You logged it at a 6. By chapter 22 it was a 10. The arc is part of the record.",
                },
                {
                  n: "04",
                  h: "The note.",
                  p: "The thing you can't say out loud. The specific line. The chapter that broke you. Private by default, shareable if you're brave.",
                },
                {
                  n: "05",
                  h: "The shareable card.",
                  p: "Drop it in the group chat. Send it to the one person who also read it. The card is designed for exactly this moment.",
                },
                {
                  n: "06",
                  h: "The eulogy.",
                  p: "When the fic ends — or when the era does — Hyperfix writes it up. The full run. The numbers. The note. Saved forever.",
                },
              ].map((item) => (
                <div key={item.n} className="border-t border-[rgba(244,244,244,0.07)] pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3 block">
                    {item.n}
                  </span>
                  <h3 className="font-display text-xl tracking-tight mb-3">
                    {item.h}
                  </h3>
                  <p className="font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                    {item.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-6">
                frequently · asked · questions
              </span>
              <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest">
                The fic questions.
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

        {/* FINAL CTA */}
        <section className="px-6 sm:px-10 py-24 sm:py-36 bg-[#111113]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              join the waitlist
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.92] tracking-crush">
              The fic deserves
              <br />
              <span className="italic text-accent">a proper record.</span>
            </h2>
            <p className="mt-8 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl mx-auto leading-snug">
              First access goes out in waves. Early users get a permanent
              Pro discount — and the most embarrassing usernames before
              they're taken.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
