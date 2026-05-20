import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

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

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5" style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}>{children}</span>;
}
function SectionHeadline({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display" style={{ color: "#FFFFFF", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600 }}>{children}</h2>;
}
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-10" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function RewatchTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

        <main id="main-content" className="relative max-w-5xl mx-auto flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 anim-fadeUp" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)", border: `1px solid ${CARD_BORDER}` }}>
            <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }} />
            <div className="relative">
              <Eyebrow>rewatch tracker</Eyebrow>
              <h1 className="font-display anim-fadeUp delay-100" style={{ color: "#FFFFFF", fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.02, letterSpacing: "-0.02em", fontWeight: 600 }}>
                For the show you&apos;ve
                <br />
                watched too many times.
              </h1>
              <p className="mt-6 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.72)" }}>
                Letterboxd logs that you watched it. It doesn&apos;t log that you&apos;ve watched it seven times. It doesn&apos;t track that you&apos;re currently on your third full rewatch of a series this year. It doesn&apos;t know that rewatching isn&apos;t something you chose — it&apos;s something your brain is doing because it needs the thing and you&apos;re not done with it yet.
              </p>
              <p className="mt-4 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.6)" }}>
                Hyperfix tracks the rewatch as a first-class event. Not a footnote on the original entry — its own fixation, its own counter, its own eulogy when it ends. Because a third rewatch of Pride &amp; Prejudice in a single winter is not the same as the first watch. It&apos;s a specific era. It deserves a specific record.
              </p>
              <div className="mt-7 anim-fadeUp delay-300"><WaitlistForm id="waitlist" variant="light" /></div>
            </div>
          </div>

          <RevealSection>
            <Card>
              <Eyebrow>the rewatch isn&apos;t a repeat</Eyebrow>
              <SectionHeadline>Every rewatch is a different fixation.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <p className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  The thing about rewatches is that you&apos;re different every time. The first watch of Normal People is not the same experience as the rewatch you do at 27 after a specific thing happens in your life. The show hasn&apos;t changed. You have. The fixation that kicks in is yours, not the show&apos;s, and it belongs to this specific rewatch at this specific moment.
                </p>
                <p className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  Letterboxd lets you log a rewatch. It does not give it a day counter. It does not ask you what&apos;s happening. A comfort rewatch that runs for three weeks — going back to the same episodes, the same scenes — is a hyperfixation as much as any new obsession. Hyperfix treats it like one.
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
                    { n: "01", h: "Log the rewatch.", p: "Title, the rewatch number if you know it, the start date. Note whether it's a full series rerun or a specific episode loop. The counter starts now." },
                    { n: "02", h: "Track the return.", p: "Comfort rewatches have their own intensity arc. Sometimes you're doing one episode a night and it's peaceful. Sometimes you've watched the same two episodes six times in a week and it's peak intensity. The meter captures both." },
                    { n: "03", h: "Name what this one was for.", p: "The best feature of the rewatch eulogy is the closing note: why this rewatch, why now, what you were looking for. In two years you'll be able to read it and understand exactly where you were in your life when you needed to watch Pride & Prejudice for the seventh time." },
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
              <SectionHeadline>Not Letterboxd. Not pretending it&apos;s not happening.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-10 mt-10">
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Hyperfix vs. Letterboxd</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Letterboxd logs the film or episode. Hyperfix logs the obsession. A seventh rewatch on Letterboxd is a diary entry with a star rating. A seventh rewatch on Hyperfix is a hyperfixation with a day counter, an intensity meter, and a eulogy. They&apos;re different products for different moments — you might want both, but for the rewatch spiral, Hyperfix is the right tool.
                  </p>
                </div>
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Hyperfix vs. pretending it&apos;s not happening</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Many people don&apos;t track comfort rewatches because they feel like something to be embarrassed about. They&apos;re not. A rewatch is a form of self-care, nostalgia, emotional regulation, or all three. The counter doesn&apos;t judge. It just counts. And when the run ends, the eulogy exists as proof that this specific era happened, this specific version of you needed this specific show, and that&apos;s worth remembering.
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
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, #2DD4BF 0%, #0E4F47 26%, #08231F 50%, #0F1011 80%)", border: `1px solid ${CARD_BORDER}` }}>
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.5 }} />
              <div className="relative">
                <Eyebrow>join the waitlist</Eyebrow>
                <h2 className="font-display" style={{ color: "#FFFFFF", fontSize: "clamp(30px, 5vw, 48px)", letterSpacing: "-0.02em", fontWeight: 600, lineHeight: 1.05 }}>
                  The seventh rewatch started. Log it. You know why you&apos;re here.
                </h2>
                <p className="mt-5 font-sans text-base sm:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
                  The waitlist gets first access in waves. Early users get a permanent Pro discount and the most embarrassing usernames before they&apos;re gone.
                </p>
                <div className="mt-6"><WaitlistForm variant="dark" /></div>
              </div>
            </div>
          </RevealSection>
        </main>
      </div>
      <Footer />
    </>
  );
}
