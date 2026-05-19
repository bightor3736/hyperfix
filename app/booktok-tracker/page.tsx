import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BookTok Tracker — for the book that's currently ruining you",
  description:
    "A BookTok tracker for the readers who finish a book and immediately need to talk about it for three weeks. Not Goodreads. Not a TBR list. A tracker for the current obsession.",
  alternates: {
    canonical: "https://hyperfix.app/booktok-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/booktok-tracker",
    title: "BookTok Tracker — Hyperfix",
    description: "For the book that broke you. Log it, count the days, find the people who are equally unwell.",
    images: [{ url: "/api/og?title=BookTok+Tracker&sub=for+the+book+that+broke+you+%C2%B7+hyperfix.app&accent=Tracker", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "BookTok Tracker", item: "https://hyperfix.app/booktok-tracker" },
  ],
};

const faqs = [
  {
    q: "What is a BookTok tracker?",
    a: "BookTok is the corner of TikTok (and now the broader internet) where readers talk about books with the same intensity that fanfic readers talk about ships. A BookTok tracker is a log for the book that's currently consuming you — not just that you read it, but that it's been living in your brain for three weeks, you've sent it to four people, and you're thinking about a specific paragraph at random moments during the day. That's what Hyperfix tracks.",
  },
  {
    q: "How is Hyperfix different from Goodreads?",
    a: "Goodreads is a reading log — it tracks what you've read, want to read, and are currently reading. It's built for volume and completionism. Hyperfix is built for intensity. Goodreads asks 'did you finish it?' Hyperfix asks 'how unwell did it make you?' You can have a full Goodreads profile and still have exactly one book that's currently running your life. That one is what Hyperfix is for. The two products don't overlap — use both.",
  },
  {
    q: "Can I track books I've already finished?",
    a: "Yes. A book can wreck you for weeks after you put it down. The post-book hangover — where you can't start anything new and you're just haunting the corners of the internet looking for people who also read it — is a real and distinct phase of the obsession. Log the book when you finish it. Watch the post-read counter tick. The eulogy comes when the obsession finally lifts, not when you close the back cover.",
  },
  {
    q: "What kinds of books does BookTok mostly track?",
    a: "Romantasy, dark romance, literary fiction that went viral, sapphic novels, enemies-to-lovers of every genre, and the occasional non-fiction book about a niche historical topic that someone made a thirty-part series about. Hyperfix handles all of them. The category field is freeform — 'romantasy,' 'dark romance,' 'normal people destroyed me,' whatever you need.",
  },
  {
    q: "Can I find other people reading the same book?",
    a: "Yes — public fixes are visible to other Hyperfix users. If you log a book publicly, people who search for it can find your fix, see your day count and intensity, and follow your journey. It's the most direct way to find the one other person on the internet who is equally unwell about the same specific chapter.",
  },
  {
    q: "Does Hyperfix have a book rating system like star ratings?",
    a: "The intensity meter (1–10) is the closest thing, but it's not the same as a star rating. A star rating asks 'how good was this book?' The intensity meter asks 'how much of your brain does this currently own?' A 10/10 book can be a 3 on intensity two months later. A 6/10 book can be an 8 on intensity if it hit you at the exact right moment. They're measuring different things.",
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
  title: "Fourth Wing — Rebecca Yarros",
  type: "book · romantasy",
  day: 23,
  intensity: 9,
  user: "@violetnavarroera",
  tilt: "tilt-r",
  started: "Started April 3",
  note: "i have not recovered. i will not recover.",
  color: "bg-[#1C1C1E]",
};

export default function BooktokTrackerPage() {
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
                booktok tracker · hyperfix.app · 2026
              </span>
              <h1 className="font-display font-medium text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.92] tracking-crush text-ink">
                BookTok
                <br />
                <span className="italic text-accent">Tracker</span>
              </h1>
              <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
                For the book that broke you. Not the one you gave five stars
                on Goodreads — the one you've been thinking about for three
                weeks, sent to four people, and referenced unprompted in two
                separate conversations.
              </p>
              <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
                Goodreads tracks your reading. Hyperfix tracks your
                obsession. Use both.
              </p>
              <WaitlistForm id="waitlist" variant="light" />
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-6 sm:-inset-10 -rotate-2 -z-10" />
                <HyperfixCard {...sampleCard} />
                <p className="mt-6 font-display italic text-[rgba(244,244,244,0.4)] text-sm text-center max-w-xs mx-auto">
                  ↑ day 23. intensity 9. she has not recovered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKTOK EXPLAINED */}
        <section className="px-6 sm:px-10 py-20 sm:py-32 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the experience
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-10">
              You finished the book.
              <br />
              <span className="italic text-accent">
                The book hasn't finished with you.
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  The book hangover is real. You closed the back cover three
                  weeks ago and you still can't pick up anything new. You're
                  posting about it. You're searching the hashtag. You're in
                  a Discord server with thirty people who are equally
                  unhinged about the same fictional couple.
                </p>
                <p>
                  Goodreads has you marked as "read." But you're not done
                  with it. The obsession has a life of its own after the
                  last page.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Hyperfix tracks the obsession, not the reading. You can
                  log a book the moment you finish it and the counter starts
                  from there — how many days since you closed it, how
                  unwell you still are, what you wrote in the notes field
                  at 2 a.m. on day 8.
                </p>
                <p>
                  When the obsession finally lifts, you mark it done.
                  Hyperfix writes the eulogy. The full record of the
                  post-book era, saved forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HYPERFIX VS GOODREADS */}
        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">the difference</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-12 max-w-3xl">
              Goodreads logs your library.
              <br />
              <span className="italic text-accent">
                Hyperfix logs your damage.
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-4">
                  What Goodreads does
                </h3>
                <ul className="space-y-3 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  {[
                    "Logs every book you've ever read",
                    "Tracks reading pace and yearly goals",
                    "Star ratings and written reviews",
                    "Author following and new release alerts",
                    "Reading challenges and social comparisons",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-ink font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t-2 border-accent pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-4 text-accent">
                  What Hyperfix does
                </h3>
                <ul className="space-y-3 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  {[
                    "Tracks the one book currently consuming you",
                    "Running day counter from when the obsession started",
                    "Intensity meter — how unwell are you right now",
                    "Private and public notes for the things you can't say",
                    "Shareable card for your group chat",
                    "Eulogy when the obsession ends",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-accent font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-10 font-display italic text-[rgba(244,244,244,0.4)] text-lg max-w-xl">
              Use Goodreads for the archive. Use Hyperfix for the current
              crisis. They're not competing.
            </p>
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
                The book questions.
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
              The book hangover
              <br />
              <span className="italic text-accent">has a home now.</span>
            </h2>
            <p className="mt-8 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl mx-auto leading-snug">
              Waitlist is open. Early users get a permanent Pro discount and
              the best usernames before they're taken.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
