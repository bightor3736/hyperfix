import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Book Tracker — log the fixation, not just the shelf",
  description:
    "A book tracker for the novel that rearranged your brain. Not the book you read and shelved — the one you&apos;ve re-read three times, the one you&apos;re reading fic for, the author whose back-catalogue you consumed in two weeks. Goodreads tracks shelves. Hyperfix tracks the obsession.",
  alternates: {
    canonical: "https://hyperfix.app/book-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/book-tracker",
    title: "Book Tracker — Hyperfix",
    description: "Not the book you read and shelved. The one that broke you.",
    images: [{ url: "/api/og?title=Book+Tracker&sub=not+the+shelf+%C2%B7+the+obsession+%C2%B7+hyperfix.app&accent=Books", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    q: "How is this different from Goodreads or StoryGraph?",
    a: "Goodreads tracks whether you read something. StoryGraph tracks how you felt about it. Neither one tracks what it did to you — not the re-reads, not the fic, not the author deep-dives, not the forty-seven days you spent thinking about a single sentence in chapter twelve. Hyperfix isn&apos;t a reading log. It&apos;s a fixation log. The counter runs from the moment the book got its claws in you, not from when you cracked the spine.",
  },
  {
    q: "Can I track re-reads as separate fixations?",
    a: "Yes — and you should. A first read and a third read are not the same experience. Log each re-read as its own fix with its own start date, intensity, and note. You&apos;ll end up with a record that shows exactly how your relationship with the book changed: what hit differently the second time, what you missed completely on the first pass, what you couldn&apos;t stop noticing by the third. The graveyard captures the whole arc.",
  },
  {
    q: "What about tracking an author&apos;s whole back-catalogue as one fixation?",
    a: "Log it as a single fix: &ldquo;[Author name] — back-catalogue spiral.&rdquo; Start date is when you first realized you were going to read everything they&apos;d ever written. Intensity can stay high for the whole run. When you finally close it — you finished the last book, the obsession settled — the eulogy captures how long the spiral lasted and what it felt like at the end. Some of those catalogue spirals run for months.",
  },
  {
    q: "Can I track a book I&apos;m reading fic for, not the original?",
    a: "Absolutely. The fixation is the fixation — it doesn&apos;t matter whether you&apos;re in it via the source text or via ten thousand words of fan-written aftermath. If the fic is what&apos;s running your brain right now, log it that way: title of the source work, type as &ldquo;fic spiral,&rdquo; note that says whatever you need it to say. Hyperfix doesn&apos;t police how you&apos;re in it.",
  },
  {
    q: "What about BookTok spirals where the book triggers a whole fandom entry?",
    a: "Log them separately. The book gets one fix; the fandom it pulled you into gets another. They can run simultaneously — the book fix tracks your relationship with the text, the fandom fix tracks the community spiral that followed. You&apos;ll be able to see in your graveyard exactly which book opened which door. Some books are just good. Some books are portals.",
  },
  {
    q: "What if the book fixation fades before I finish reading it?",
    a: "Close it. Write the note. &ldquo;Got to page 200 and the spell broke&rdquo; is a completely valid eulogy. The counter shows how long it held you before it let go, which is its own interesting data point. You don&apos;t have to finish a book for it to count as a fixation, and you don&apos;t have to be ashamed of the fade. Sometimes a book grabs you hard for three weeks and then just... releases. Hyperfix records that too.",
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
    { "@type": "ListItem", position: 2, name: "Book Tracker", item: "https://hyperfix.app/book-tracker" },
  ],
};

const sampleCard = {
  title: "Tomorrow, and Tomorrow, and Tomorrow",
  type: "novel · hyperfixation",
  day: 52,
  intensity: 9,
  user: "@sadie-ray-pilled",
  tilt: "tilt-l",
  started: "Started April 2",
  note: "i have opinions about this book that i will be sharing for years",
  color: "bg-paper",
};

export default function BookTrackerPage() {
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
              book tracker · hyperfix.app · 2026
            </span>
            <h1 className="font-display font-medium text-[2.6rem] sm:text-[4rem] lg:text-[5.2rem] leading-[0.92] tracking-crush text-ink">
              The book didn&apos;t just break you.
              <br />
              <span className="italic text-accent">It&apos;s been breaking you for forty-seven days.</span>
            </h1>
            <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              BookTok found it. The algorithm surfaced it. You downloaded the sample at midnight and finished the whole thing by 4 a.m. and then you just... didn&apos;t put it down. Not really. You shelved it on Goodreads and gave it five stars and wrote a review, and none of that captured what actually happened. Which is that it&apos;s been forty-seven days and you&apos;re still thinking about a sentence in chapter nine.
            </p>
            <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              Hyperfix is not a reading log. It&apos;s a fixation log. Log the book that rearranged you — the re-reads, the fic, the author&apos;s entire back-catalogue you consumed in two weeks, the spiral that started with one novel and ended with you deep in a fandom you didn&apos;t plan to join. The counter runs from the moment it got its claws in you.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
            <div className="mt-16 flex justify-start">
              <TiltCard tiltLimit={10} scale={1.03} effect="gravitate">
                <HyperfixCard {...sampleCard} tilt="" />
              </TiltCard>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              what it tracks
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-16 max-w-3xl">
              Not your shelf.
              <br />
              <span className="italic text-accent">Your obsession.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  label: "01",
                  h: "The re-read counter.",
                  p: "First reads and third reads are different experiences. Log each re-read as its own fix — its own start date, intensity score, and closing note. Your graveyard will show you how your relationship with a book changes over time. What you missed the first time. What you can&apos;t stop noticing by the third.",
                },
                {
                  label: "02",
                  h: "The fic spiral.",
                  p: "You finished the book. Then you found the fic. Now it&apos;s three weeks later and you&apos;ve read 400,000 words of fan-written aftermath and you have feelings about pairings you cannot explain to anyone who hasn&apos;t read the source. Log the fic spiral as its own fix. The counter knows what&apos;s running your brain right now.",
                },
                {
                  label: "03",
                  h: "The back-catalogue dive.",
                  p: "One book cracked you open and now you&apos;re reading everything this author has ever written in publication order. That&apos;s a fixation. Log it as one entry — &ldquo;[Author] back-catalogue spiral&rdquo; — and let the counter run for as long as it takes. Some of these go for months. Hyperfix doesn&apos;t blink.",
                },
              ].map((s) => (
                <div key={s.label} className="border-t-2 border-[rgba(244,244,244,0.07)] pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3 block">
                    {s.label}
                  </span>
                  <h3 className="font-display text-2xl tracking-tight mb-3 text-ink">
                    {s.h}
                  </h3>
                  <p className="font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                    {s.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">the difference</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-16 max-w-3xl">
              Goodreads tracks shelves.
              <br />
              <span className="italic text-accent">Hyperfix tracks the damage.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. Goodreads
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Goodreads tells you how many books you&apos;ve read this year. Hyperfix tells you which one has been living in your head for fifty-two days. Goodreads has a star rating. Hyperfix has an intensity score that you can update as the fixation deepens. You can love a book and shelve it and move on. A hyperfixation doesn&apos;t give you that option. Only one of these tools knows the difference.
                  </p>
                </div>
              </div>

              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5">
                  Hyperfix vs. StoryGraph
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    StoryGraph is excellent at tracking what you read and when and how you felt about the pacing. It will not help you when you&apos;re on your third re-read of a novel you already reviewed, or when you&apos;ve spent two weeks reading fic for a book you finished a month ago, or when you&apos;ve read an author&apos;s entire catalogue and need to record the experience of doing that. Hyperfix exists for the behavior that doesn&apos;t fit on a shelf.
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
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest">
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
            <h2 className="font-display text-5xl sm:text-7xl leading-[0.92] tracking-crush">
              Day one was weeks ago.
              <br />
              <span className="italic text-accent">Log it before day one hundred.</span>
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
