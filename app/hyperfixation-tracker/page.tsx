import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfixation Tracker — log, count, and mourn your obsessions",
  description:
    "A hyperfixation tracker built for fandom, BookTok, and AuDHD brains. Not a Notion template. Not a medical tool. A place for the song on loop, the fic you've re-read six times, and the character who rearranged your brain.",
  alternates: {
    canonical: "https://hyperfix.app/hyperfixation-tracker",
  },
  openGraph: {
    url: "https://hyperfix.app/hyperfixation-tracker",
    title: "Hyperfixation Tracker — Hyperfix",
    description: "Log your current obsession. Count the days. Mourn it when it ends.",
    images: [{ url: "/api/og?title=Hyperfixation+Tracker&sub=log+%C2%B7+count+%C2%B7+mourn+%C2%B7+hyperfix.app&accent=Tracker", width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    q: "What exactly is a hyperfixation?",
    a: "A hyperfixation is an intense, consuming focus on one specific thing — a song, a show, a fic, a ship, a person, a niche historical event — that takes over your brain for days, weeks, or months at a time. It's different from a regular interest because it's involuntary and absorbing: you're not choosing to think about it, it's just happening. The term was popularized by the ADHD and autistic communities, but plenty of people experience hyperfixation without a formal diagnosis. If you've ever had to stop yourself from sending a fifth paragraph about the same topic in a group chat, you know what this is.",
  },
  {
    q: "What does the Hyperfixation Tracker actually do?",
    a: "Hyperfix lets you log a current fixation — its name, the category (song, fic, ship, show, game, real person, niche historical event, anything), and a start date. From there it counts the days automatically. You add an intensity rating, a private note, and optionally a public one. When the fix ends, you mark it done and Hyperfix writes a eulogy: a shareable card summarizing the run — day count, peak intensity, the note you wrote at day 3. Everything is archivable. You end up with a graveyard of past selves and the things that consumed them.",
  },
  {
    q: "How is this different from a Notion template?",
    a: "Notion templates are databases. They require you to design your own schema, update it manually, remember to open the app, and stare at a table. Hyperfix is built around the specific shape of a hyperfixation: a counter that ticks in real time, an intensity meter, a eulogy at the end. It's also social in a way Notion never is — every fix generates a shareable card designed to drop into a group chat. The difference is between a spreadsheet and a diary. Both store information. Only one is worth reading.",
  },
  {
    q: "How is this different from clinical OCD trackers or mood journals?",
    a: "Clinical tools are built to help you manage or reduce unwanted thoughts — they're oriented toward intervention and treatment. Hyperfix doesn't pathologize hyperfixation. We're not trying to get you to have fewer of them. The goal is to give your current fixation a home and to give past fixations a record. We're the Letterboxd for your obsessions, not the CBT worksheet. That said: if you're using Hyperfix and you notice your fixations are causing real distress or disrupting your life, please talk to someone who can actually help. We're a tracker, not a therapist.",
  },
  {
    q: "Who is Hyperfix actually for?",
    a: "People who re-read the same fanfic. People who have a dedicated playlist for a single character. People who can explain the entire lore of a game they've never played. People whose Spotify Wrapped is twenty-three listens to one song from one week in March. BookTok readers. Ao3 regulars. K-pop fans deep in a bias era. Anyone who has used the phrase 'I am unwell about this' unironically and meant it. You don't need an ADHD diagnosis to use Hyperfix, though a disproportionate number of early users have one.",
  },
  {
    q: "Can I track multiple fixations at once?",
    a: "Yes. Most people have a primary fixation and one or two secondary ones running in parallel — Hyperfix calls these your active fixes. You can have as many active as you want on Pro, and up to three on the free tier. Each one gets its own counter, card, and eventual eulogy. The dashboard shows them all ranked by intensity so you can see at a glance which one is currently running your life the hardest.",
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
    { "@type": "ListItem", position: 2, name: "Hyperfixation Tracker", item: "https://hyperfix.app/hyperfixation-tracker" },
  ],
};

const sampleCards = [
  {
    title: "Dramione — The Auction fic on Ao3",
    type: "fanfic · ao3",
    day: 34,
    intensity: 9,
    user: "@dramione.rot",
    tilt: "tilt-l",
    started: "Chapter 22 undid me",
    note: "this fic is a public health crisis",
    color: "bg-paper",
  },
  {
    title: "Stray Kids — 'Miroh' (the bridge specifically)",
    type: "song · on loop",
    day: 19,
    intensity: 8,
    user: "@skzbrainrot",
    tilt: "tilt-r",
    started: "Loop count: 341",
    note: "i am not okay",
    color: "bg-paperDeep",
  },
];

export default function HyperfixationTrackerPage() {
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
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              hyperfixation tracker · hyperfix.app · 2026
            </span>
            <h1 className="font-display font-medium text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.92] tracking-crush text-ink">
              Hyperfixation
              <br />
              <span className="italic text-accent">Tracker</span>
            </h1>
            <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              A place to log your current obsession, count the days it's lasted,
              and mourn it when it ends. Built for fandom brains, BookTok
              readers, K-pop stans, and everyone whose Notes app is full of
              thoughts about fictional people.
            </p>
            <p className="mt-4 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-2xl leading-snug">
              Not a Notion template. Not a clinical tool. A hyperfixation
              tracker that actually understands what a hyperfixation is.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        {/* WHAT IS A HYPERFIXATION */}
        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)] p-10 sm:p-16">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the definition
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-10 text-ink">
              What is a hyperfixation,
              <br />
              <span className="italic text-accent">actually?</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  It's not just liking something a lot. A hyperfixation is an
                  involuntary, consuming focus on one specific thing — a song,
                  a fic, a ship, a show, a character, a niche historical
                  event — that takes over your brain for days or weeks at a
                  time.
                </p>
                <p>
                  You didn't choose it. It arrived. And now you're reading
                  every Dramione fic ever written, or explaining Genshin Impact
                  lore to someone who has never played the game and did not ask.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  The ADHD and autistic communities put language to this. But
                  you don't need a diagnosis for it to be true. If you've ever
                  memorized the Hamilton soundtrack in a weekend, built a
                  moodboard for a character with eleven lines of dialogue, or
                  sent your friends a four-paragraph analysis of a bridge at
                  2 a.m. — you know exactly what this is.
                </p>
                <p>
                  Hyperfix gives it a home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-6">how it works</span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest max-w-2xl text-ink">
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
                    h: "Log the fix.",
                    p: "Name it. Categorize it — song, fic, ship, show, game, real person, niche historical rabbit hole. Add a start date or let Hyperfix timestamp it now. One field is enough to start; the rest fills in as you go.",
                  },
                  {
                    n: "02",
                    h: "Watch the counter.",
                    p: "The day counter starts the moment you log. It ticks. Watching it climb is the point — it externalizes the thing your brain is already doing. Set an intensity rating from 1 to 10. Update it when day 3 becomes day 34.",
                  },
                  {
                    n: "03",
                    h: "Share the card.",
                    p: "Every fixation generates a shareable card. Drop it in your group chat. Post it to Instagram Stories. Send it to the one friend who also read the fic. The card is designed to be screenshotted — that's not a side feature, it's the product.",
                  },
                ].map((s) => (
                  <div key={s.n} className="border-t border-[rgba(244,244,244,0.07)] pt-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3 block">
                      step {s.n}
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

              <div className="flex flex-col gap-8 items-center justify-center">
                {sampleCards.map((card, i) => (
                  <HyperfixCard key={i} {...card} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NOT NOTION, NOT CLINICAL */}
        <section className="px-6 sm:px-10 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto bg-[#1C1C1E] rounded-3xl border border-[rgba(244,244,244,0.07)] p-10 sm:p-16">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">the difference</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-16 max-w-3xl text-ink">
              Not a template.
              <br />
              <span className="italic text-accent">Not a treatment.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5 text-ink">
                  Hyperfix vs. Notion
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Notion is a tool. You design the schema, maintain it
                    manually, and open it when you remember to. It'll do
                    whatever you tell it. That's exactly the problem — a
                    hyperfixation doesn't wait for you to open a database.
                  </p>
                  <p>
                    Hyperfix is built around the specific shape of the thing.
                    The counter runs automatically. The intensity meter has
                    exactly ten bars because that's enough. The eulogy writes
                    itself when you close the fix. You don't configure any of
                    this — it's just how it works.
                  </p>
                  <p className="font-display italic text-[rgba(244,244,244,0.5)] text-lg">
                    "Notion is a spreadsheet. Hyperfix is a diary."
                  </p>
                </div>
              </div>

              <div className="border-t border-[rgba(244,244,244,0.07)] pt-8">
                <h3 className="font-display text-2xl tracking-tight mb-5 text-ink">
                  Hyperfix vs. clinical trackers
                </h3>
                <div className="space-y-4 font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                  <p>
                    Clinical hyperfixation trackers are built for intervention
                    — they're designed to help you identify patterns and reduce
                    unwanted obsessive thoughts. They're medical tools and
                    they're good at being medical tools.
                  </p>
                  <p>
                    Hyperfix doesn't pathologize. We're not trying to get you
                    to have fewer hyperfixations or shorter ones. The Marauders
                    fic that consumed your entire March is not a symptom to be
                    managed. It's a thing that happened, and it deserves a
                    record.
                  </p>
                  <p className="font-display italic text-[rgba(244,244,244,0.5)] text-lg">
                    "We're not trying to fix you. We're trying to count."
                  </p>
                </div>
              </div>
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
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest text-ink">
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

        {/* FINAL CTA */}
        <section className="px-6 sm:px-10 py-24 sm:py-40">
          <div className="max-w-4xl mx-auto text-center bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)] p-12 sm:p-20">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              join the waitlist
            </span>
            <h2 className="font-display text-5xl sm:text-7xl leading-[0.92] tracking-crush text-ink">
              Your hyperfixation
              <br />
              <span className="italic text-accent">deserves a record.</span>
            </h2>
            <p className="mt-8 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl mx-auto leading-snug">
              The waitlist gets first access in waves. Early users get a
              permanent Pro discount and the most embarrassing usernames before
              they're gone.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
