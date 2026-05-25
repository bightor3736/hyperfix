import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

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

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6" style={{ background: "rgba(94,234,212,0.08)", color: TEAL, border: "1px solid rgba(94,234,212,0.20)" }}>{children}</span>
  );
}
function SectionHeadline({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display" style={{ color: "#FFFFFF", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600 }}>{children}</h2>;
}
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-6 sm:p-10" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      {children}
    </div>
  );
}

export default function AnimeTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#070708" }}>
        <main id="main-content" className="max-w-5xl mx-auto flex flex-col gap-6">
          <section className="px-2 sm:px-6 pt-12 pb-10 anim-fadeUp">
            <Eyebrow>anime hyperfixation tracker</Eyebrow>
            <h1 className="font-display anim-fadeUp delay-100" style={{ color: "#FFFFFF", fontSize: "clamp(36px, 7vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 600 }}>
              The series. The ship.{" "}
              <span style={{ color: TEAL }}>The character who broke you.</span>
            </h1>
            <p className="mt-6 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              MAL tracks what you&apos;ve watched. Hyperfix tracks what it did to you. There&apos;s a meaningful gap between &ldquo;completed — 9/10&rdquo; and &ldquo;I watched this entire series in 36 hours and I haven&apos;t been the same since.&rdquo; The character who rearranged your brain. The ship that has you reading fanfic at midnight. The arc that broke you in a way that a star rating doesn&apos;t capture.
            </p>
            <p className="mt-4 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Hyperfix is for that gap. Log the series, the character, the ship, the specific episode — whatever the actual object of the fixation is. The day counter starts immediately. The intensity meter tracks the arc. And when it finally lifts, the eulogy captures the whole run: how long, how intense, what you wrote at 2 a.m. after that episode.
            </p>
            <div className="mt-8 anim-fadeUp delay-300 max-w-md"><WaitlistForm id="waitlist" variant="light" /></div>
          </section>

          <RevealSection>
            <Card>
              <Eyebrow>the obsession, not the log</Eyebrow>
              <SectionHeadline>A completed series is not a closed fixation.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <p className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  MAL tells you when you finished watching. It doesn&apos;t know that you finished watching Evangelion four days ago and you&apos;re still not okay. It doesn&apos;t know that you&apos;ve re-read every Gojo Satoru character analysis you can find. It doesn&apos;t know that you started reading the manga because the anime isn&apos;t enough and you&apos;ve been going to bed at 3 a.m. for two weeks.
                </p>
                <p className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  That&apos;s a hyperfixation. It started when you hit play on episode one, or maybe episode eight when the thing happened, or maybe when you found the fanfic. It&apos;s still running. Hyperfix gives it a counter from the moment it starts — not from when you completed the series, but from when it got you.
                </p>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <Card>
              <Eyebrow>how it works</Eyebrow>
              <SectionHeadline>A tracker that knows what it&apos;s tracking.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-12 mt-10">
                <div className="space-y-8">
                  {[
                    { n: "01", h: "Log the fixation.", p: "The series, the character, the ship, the arc — whatever the actual hook is. Sometimes it's the whole show. Sometimes it's one character in episode seven. Log what it actually is, not what the show is called." },
                    { n: "02", h: "Track the depth.", p: "Anime hyperfixations have phases: the initial watch, the rewatch, the fandom dive, the fanfic era, the fanart phase. The intensity meter captures where you are. Update it when a new chapter drops, when you find the fic, when the arc escalates." },
                    { n: "03", h: "Close it when it's done.", p: "The fixation ends when it ends — not when you finish the series. When the specific brain-state lifts and you can think about other things again, close the fix. Hyperfix writes the eulogy: how long you were in it, what the peak was, what you'd want to remember." },
                  ].map((s) => (
                    <div key={s.n}>
                      <span className="font-sans text-xs mb-2 block" style={{ color: TEAL }}>step {s.n}</span>
                      <h3 className="font-display mb-2" style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{s.h}</h3>
                      <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{s.p}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-8 items-center justify-center">
                  {sampleCards.map((card, i) => (
                    <TiltCard key={i} tiltLimit={10} scale={1.03} effect="gravitate">
                      <HyperfixCard {...card} tilt="" />
                    </TiltCard>
                  ))}
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <Card>
              <Eyebrow>the difference</Eyebrow>
              <SectionHeadline>Not MAL. Not your memory.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-10 mt-10">
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Hyperfix vs. MyAnimeList / AniList</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    MAL and AniList are completion trackers. They&apos;re excellent at what they do — logging what you&apos;ve watched, rating it, finding recommendations. Hyperfix isn&apos;t trying to replace them. Hyperfix is for the thing that happens after &ldquo;completed.&rdquo; The obsession that outlasts the series by weeks. The character who keeps living in your brain long after the credits rolled.
                  </p>
                </div>
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Hyperfix vs. keeping it in your head</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Anime hyperfixations are easy to undercount mentally. &ldquo;I was into JJK for like two months&rdquo; — but was it two months of casual enjoyment or two months of thinking about Gojo Satoru&apos;s backstory every single day? The counter makes it concrete. Day 41 of a character fixation is a different thing than day 12. The record exists so you can look back and know.
                  </p>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <Card>
              <Eyebrow>frequently asked</Eyebrow>
              <SectionHeadline>Everything you wanted to ask.</SectionHeadline>
              <div className="mt-8">
                {faqs.map((faq, i) => (
                  <details key={i} className="group py-5 [&_summary::-webkit-details-marker]:hidden" style={{ borderTop: i === 0 ? `1px solid rgba(255,255,255,0.06)` : undefined, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                    <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none">
                      <h3 className="font-display" style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                        <span className="mr-3 tabular-nums" style={{ color: TEAL, fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</span>
                        {faq.q}
                      </h3>
                      <span aria-hidden="true" className="text-xl group-open:rotate-45 transition-transform shrink-0" style={{ color: TEAL }}>+</span>
                    </summary>
                    <p className="mt-4 ml-9 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{faq.a}</p>
                  </details>
                ))}
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <div className="rounded-3xl p-8 sm:p-14 text-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <Eyebrow>join the waitlist</Eyebrow>
              <h2 className="font-display" style={{ color: "#FFFFFF", fontSize: "clamp(30px, 5vw, 48px)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.05 }}>
                The series got you.{" "}
                <span style={{ color: TEAL }}>Log it before day one becomes a memory.</span>
              </h2>
              <p className="mt-5 font-sans text-base sm:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                The waitlist gets first access in waves. Early users get a permanent Pro discount and the most embarrassing usernames before they&apos;re gone.
              </p>
              <div className="mt-7 max-w-md mx-auto"><WaitlistForm variant="dark" /></div>
            </div>
          </RevealSection>
        </main>
      </div>
      <Footer />
    </>
  );
}
