import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

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

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6"
      style={{ background: "rgba(94,234,212,0.08)", color: TEAL, border: "1px solid rgba(94,234,212,0.20)" }}
    >
      {children}
    </span>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display" style={{ color: "#FFFFFF", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600 }}>
      {children}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-6 sm:p-10" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      {children}
    </div>
  );
}

export default function KPopTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#070708" }}>
        <main id="main-content" className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* HERO */}
          <section className="px-2 sm:px-6 pt-12 pb-10 anim-fadeUp">
            <Eyebrow>k-pop hyperfixation tracker</Eyebrow>
            <h1 className="font-display anim-fadeUp delay-100" style={{ color: "#FFFFFF", fontSize: "clamp(36px, 7vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 600 }}>
              The era. The bias.{" "}
              <span style={{ color: TEAL }}>The comeback spiral.</span>
            </h1>
            <p className="mt-6 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              K-pop hyperfixation has a specific shape. The bias era that rewires your brain. The comeback you prestreamed at midnight. The album you&apos;ve listened to so many times you can&apos;t hear what other people hear when they play it for the first time. The deep-dive into discography that started as casual listening and ended with you having opinions about b-sides from 2019.
            </p>
            <p className="mt-4 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Hyperfix tracks all of it. The era, the days, the intensity. When a new comeback kicks off a new spiral, log it. When the bias wrecker overtakes your main bias — log that too. When it finally fades, the eulogy captures the whole run: how many days, peak intensity, the note you wrote at 3 a.m. after the fancam.
            </p>
            <div className="mt-8 anim-fadeUp delay-300 max-w-md"><WaitlistForm id="waitlist" variant="light" /></div>
          </section>

          <RevealSection>
            <Card>
              <Eyebrow>the k-pop era</Eyebrow>
              <SectionHeadline>A bias era is a hyperfixation. Treat it like one.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <p className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  A K-pop hyperfixation isn&apos;t &quot;being a fan.&quot; Fans listen to the music. A hyperfixation is when you&apos;ve memorized every member&apos;s birthday, you have opinions about the choreography direction decisions, you&apos;re watching 4-year-old fancams at 2 a.m., and your Spotify Wrapped has one group in the top five spots with stream counts that concern your friends.
                </p>
                <p className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  The bias wrecker spiral is its own phenomenon. You were solid. You had a main bias. And then one comeback happened and now your top three has completely reshuffled and you&apos;re not okay. Hyperfix gives every era its own counter — so when the wrecker becomes the bias and the bias becomes a wrecker, you have the receipts.
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
                    { n: "01", h: "Log the era.", p: "Name it: the album, the comeback, the bias, the ship, the specific b-side. Add a start date or log it now. One field is enough. The counter starts immediately." },
                    { n: "02", h: "Track the spiral.", p: "Update the intensity as the era deepens. Day 3 is different from day 34. The intensity meter captures the arc — the peak, the plateau, the slow fade. When a new comeback resets the clock, log a new fix." },
                    { n: "03", h: "Share the card.", p: "Every era generates a shareable card with the day count and intensity. Post it when a comeback drops. Send it to your group chat when you've just watched a fancam forty-three times in one sitting. Let people know the state of your brain." },
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
              <SectionHeadline>Not Twitter. Not your head.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-10 mt-10">
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Hyperfix vs. Twitter / X</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Twitter is where K-pop happens — drops, comebacks, fancam wars. Hyperfix is where you record what it does to you. Twitter doesn&apos;t have a day counter for how long you&apos;ve been in a specific bias era. It doesn&apos;t write a eulogy when the era finally lifts. You need both: Twitter for the community, Hyperfix for the record.
                  </p>
                </div>
                <div>
                  <h3 className="font-display mb-4" style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Hyperfix vs. keeping count in your head</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Most K-pop fans track their eras mentally — &quot;I&apos;ve been in this era for like two months I think?&quot; The problem with mental tracking is that two months feels different at the start and the end. Day 67 of a bias era is not the same as day 12. The counter makes it real. Looking at the number does something. It gives the era a weight your memory can&apos;t.
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
                The era started.{" "}
                <span style={{ color: TEAL }}>Log it before you forget day one.</span>
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
