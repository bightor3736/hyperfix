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

      <main id="main-content" className="relative z-10 text-ink" style={{ background: "var(--bg)" }}>
        <Nav />

        {/* HERO */}
        <section className="px-6 sm:px-8 pt-16 pb-16">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-8" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                booktok hyperfixation tracker
              </span>
              <h1 className="font-display font-semibold text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] leading-[0.98] text-ink" style={{ letterSpacing: "-0.03em" }}>
                BookTok{" "}
                <span style={{ color: "var(--accent)" }}>Tracker.</span>
              </h1>
              <p className="mt-6 font-sans text-base sm:text-lg max-w-xl" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                For the book that broke you. Not the one you gave five stars on Goodreads — the one you&apos;ve been thinking about for three weeks, sent to four people, and referenced unprompted in two separate conversations.
              </p>
              <p className="mt-4 font-sans text-base sm:text-lg max-w-xl" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                Goodreads tracks your reading. Hyperfix tracks your obsession. Use both.
              </p>
              <div className="mt-8 max-w-md">
                <WaitlistForm id="waitlist" variant="light" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <HyperfixCard {...sampleCard} />
                <p className="mt-6 font-mono text-xs text-center max-w-xs mx-auto tabular-nums" style={{ color: "var(--ink-faint)" }}>
                  day 23 · intensity 9 · she has not recovered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKTOK EXPLAINED */}
        <section className="px-6 sm:px-8 py-16">
          <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
              the experience
            </span>
            <h2 className="font-display font-semibold" style={{ color: "var(--ink)", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
              You finished the book.{" "}
              <span style={{ color: "var(--accent)" }}>The book hasn&apos;t finished with you.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 mt-10 max-w-4xl">
              <div className="space-y-4 font-sans text-base sm:text-lg" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                <p>
                  The book hangover is real. You closed the back cover three weeks ago and you still can&apos;t pick up anything new. You&apos;re posting about it. You&apos;re searching the hashtag. You&apos;re in a Discord server with thirty people who are equally unhinged about the same fictional couple.
                </p>
                <p>
                  Goodreads has you marked as &quot;read.&quot; But you&apos;re not done with it. The obsession has a life of its own after the last page.
                </p>
              </div>
              <div className="space-y-4 font-sans text-base sm:text-lg" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                <p>
                  Hyperfix tracks the obsession, not the reading. You can log a book the moment you finish it and the counter starts from there — how many days since you closed it, how unwell you still are, what you wrote in the notes field at 2 a.m. on day 8.
                </p>
                <p>
                  When the obsession finally lifts, you mark it done. Hyperfix writes the eulogy. The full record of the post-book era, saved forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HYPERFIX VS GOODREADS */}
        <section className="px-6 sm:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>the difference</span>
            <h2 className="font-display font-semibold max-w-3xl" style={{ color: "var(--ink)", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
              Goodreads logs your library.{" "}
              <span style={{ color: "var(--accent)" }}>Hyperfix logs your damage.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl">
              <div className="rounded-3xl p-6 sm:p-8" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
                <h3 className="font-display font-semibold text-xl mb-4" style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}>
                  What Goodreads does
                </h3>
                <ul className="space-y-3 font-sans text-base" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                  {[
                    "Logs every book you've ever read",
                    "Tracks reading pace and yearly goals",
                    "Star ratings and written reviews",
                    "Author following and new release alerts",
                    "Reading challenges and social comparisons",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="shrink-0 mt-1" style={{ color: "var(--ink-faint)" }}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl p-6 sm:p-8" style={{ background: "var(--bg)", border: "1px solid var(--accent)" }}>
                <h3 className="font-display font-semibold text-xl mb-4" style={{ color: "var(--accent)", letterSpacing: "-0.01em" }}>
                  What Hyperfix does
                </h3>
                <ul className="space-y-3 font-sans text-base" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
                  {[
                    "Tracks the one book currently consuming you",
                    "Running day counter from when the obsession started",
                    "Intensity meter — how unwell are you right now",
                    "Private and public notes for the things you can't say",
                    "Shareable card for your group chat",
                    "Eulogy when the obsession ends",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="shrink-0 mt-1" style={{ color: "var(--accent)" }}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-8 font-sans text-base max-w-xl" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
              Use Goodreads for the archive. Use Hyperfix for the current crisis. They&apos;re not competing.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 sm:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                frequently asked
              </span>
              <h2 className="font-display font-semibold" style={{ color: "var(--ink)", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
                The book questions.
              </h2>
            </div>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group py-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none">
                    <h3 className="font-display font-semibold text-base sm:text-lg leading-snug" style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}>
                      <span className="font-mono text-xs mr-3 tabular-nums" style={{ color: "var(--accent)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </h3>
                    <span aria-hidden="true" className="text-xl group-open:rotate-45 transition-transform shrink-0" style={{ color: "var(--accent)" }}>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 ml-9 font-sans text-base max-w-2xl" style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 sm:px-8 py-16">
          <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 text-center" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
              join the waitlist
            </span>
            <h2 className="font-display font-semibold" style={{ color: "var(--ink)", fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              The book hangover{" "}
              <span style={{ color: "var(--accent)" }}>has a home now.</span>
            </h2>
            <p className="mt-5 font-sans text-base sm:text-lg max-w-xl mx-auto" style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
              Waitlist is open. Early users get a permanent Pro discount and the best usernames before they&apos;re taken.
            </p>
            <div className="mt-7 max-w-md mx-auto">
              <WaitlistForm variant="dark" />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
