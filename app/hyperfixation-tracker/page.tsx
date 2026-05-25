import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

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

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6"
      style={{
        background: "rgba(94,234,212,0.08)",
        color: TEAL,
        border: "1px solid rgba(94,234,212,0.20)",
      }}
    >
      {children}
    </span>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display"
      style={{
        color: "#FFFFFF",
        fontSize: "clamp(28px, 5vw, 44px)",
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
        fontWeight: 600,
      }}
    >
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl p-6 sm:p-10 ${className}`}
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      {children}
    </div>
  );
}

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

      <Nav />
      <div
        className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16"
        style={{ background: "#070708" }}
      >
        <main id="main-content" className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* HERO */}
          <section className="px-2 sm:px-6 pt-12 pb-10 anim-fadeUp">
            <Eyebrow>hyperfixation tracker</Eyebrow>
            <h1
              className="font-display anim-fadeUp delay-100"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(36px, 7vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                fontWeight: 600,
              }}
            >
              Log it. Count it.{" "}
              <span style={{ color: TEAL }}>Mourn it when it ends.</span>
            </h1>
            <p className="mt-6 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              A place to log your current obsession, count the days it&apos;s lasted, and mourn it when it ends. Built for fandom brains, BookTok readers, K-pop stans, and everyone whose Notes app is full of thoughts about fictional people.
            </p>
            <p className="mt-4 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Not a Notion template. Not a clinical tool. A hyperfixation tracker that actually understands what a hyperfixation is.
            </p>
            <div className="mt-8 anim-fadeUp delay-300 max-w-md">
              <WaitlistForm id="waitlist" variant="light" />
            </div>
          </section>

          {/* WHAT IS A HYPERFIXATION */}
          <RevealSection>
            <Card>
              <Eyebrow>the definition</Eyebrow>
              <SectionHeadline>What is a hyperfixation, actually?</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-5 font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <p>
                    It&apos;s not just liking something a lot. A hyperfixation is an involuntary, consuming focus on one specific thing — a song, a fic, a ship, a show, a character, a niche historical event — that takes over your brain for days or weeks at a time.
                  </p>
                  <p>
                    You didn&apos;t choose it. It arrived. And now you&apos;re reading every Dramione fic ever written, or explaining Genshin Impact lore to someone who has never played the game and did not ask.
                  </p>
                </div>
                <div className="space-y-5 font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <p>
                    The ADHD and autistic communities put language to this. But you don&apos;t need a diagnosis for it to be true. If you&apos;ve ever memorized the Hamilton soundtrack in a weekend, built a moodboard for a character with eleven lines of dialogue, or sent your friends a four-paragraph analysis of a bridge at 2 a.m. — you know exactly what this is.
                  </p>
                  <p>Hyperfix gives it a home.</p>
                </div>
              </div>
            </Card>
          </RevealSection>

          {/* HOW IT WORKS */}
          <RevealSection>
            <Card>
              <Eyebrow>how it works</Eyebrow>
              <SectionHeadline>A tracker that knows what it&apos;s tracking.</SectionHeadline>

              <div className="grid md:grid-cols-2 gap-12 mt-10">
                <div className="space-y-8">
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
                    <div key={s.n}>
                      <span className="font-sans text-xs mb-2 block" style={{ color: TEAL }}>
                        step {s.n}
                      </span>
                      <h3
                        className="font-display mb-2"
                        style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}
                      >
                        {s.h}
                      </h3>
                      <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
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
            </Card>
          </RevealSection>

          {/* NOT NOTION, NOT CLINICAL */}
          <RevealSection>
            <Card>
              <Eyebrow>the difference</Eyebrow>
              <SectionHeadline>Not a template. Not a treatment.</SectionHeadline>

              <div className="grid md:grid-cols-2 gap-10 mt-10">
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
                    Hyperfix vs. Notion
                  </h3>
                  <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <p>
                      Notion is a tool. You design the schema, maintain it manually, and open it when you remember to. It&apos;ll do whatever you tell it. That&apos;s exactly the problem — a hyperfixation doesn&apos;t wait for you to open a database.
                    </p>
                    <p>
                      Hyperfix is built around the specific shape of the thing. The counter runs automatically. The intensity meter has exactly ten bars because that&apos;s enough. The eulogy writes itself when you close the fix. You don&apos;t configure any of this — it&apos;s just how it works.
                    </p>
                    <p className="font-display text-lg" style={{ color: TEAL }}>
                      &ldquo;Notion is a spreadsheet. Hyperfix is a diary.&rdquo;
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
                    Hyperfix vs. clinical trackers
                  </h3>
                  <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <p>
                      Clinical hyperfixation trackers are built for intervention — they&apos;re designed to help you identify patterns and reduce unwanted obsessive thoughts. They&apos;re medical tools and they&apos;re good at being medical tools.
                    </p>
                    <p>
                      Hyperfix doesn&apos;t pathologize. We&apos;re not trying to get you to have fewer hyperfixations or shorter ones. The Marauders fic that consumed your entire March is not a symptom to be managed. It&apos;s a thing that happened, and it deserves a record.
                    </p>
                    <p className="font-display text-lg" style={{ color: TEAL }}>
                      &ldquo;We&apos;re not trying to fix you. We&apos;re trying to count.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealSection>

          {/* FAQ */}
          <RevealSection>
            <Card>
              <Eyebrow>frequently asked</Eyebrow>
              <SectionHeadline>Everything you wanted to ask.</SectionHeadline>
              <div className="mt-8 divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group py-5 [&_summary::-webkit-details-marker]:hidden"
                    style={{ borderTop: i === 0 ? `1px solid rgba(255,255,255,0.06)` : undefined, borderBottom: `1px solid rgba(255,255,255,0.06)` }}
                  >
                    <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none">
                      <h3
                        className="font-display"
                        style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}
                      >
                        <span className="mr-3 tabular-nums" style={{ color: TEAL, fontSize: 13 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.q}
                      </h3>
                      <span aria-hidden="true" className="text-xl group-open:rotate-45 transition-transform shrink-0" style={{ color: TEAL }}>
                        +
                      </span>
                    </summary>
                    <p className="mt-4 ml-9 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </Card>
          </RevealSection>

          {/* FINAL CTA */}
          <RevealSection>
            <div
              className="rounded-3xl p-8 sm:p-14 text-center"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <Eyebrow>join the waitlist</Eyebrow>
              <h2
                className="font-display"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(30px, 5vw, 48px)",
                  letterSpacing: "-0.03em",
                  fontWeight: 600,
                  lineHeight: 1.05,
                }}
              >
                Your hyperfixation{" "}
                <span style={{ color: TEAL }}>deserves a record.</span>
              </h2>
              <p className="mt-5 font-sans text-base sm:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                The waitlist gets first access in waves. Early users get a permanent Pro discount and the most embarrassing usernames before they&apos;re gone.
              </p>
              <div className="mt-7 max-w-md mx-auto">
                <WaitlistForm variant="dark" />
              </div>
            </div>
          </RevealSection>
        </main>
      </div>
      <Footer />
    </>
  );
}
