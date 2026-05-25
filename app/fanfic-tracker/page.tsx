import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

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

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1.5 mb-6" style={{ background: "rgba(94,234,212,0.08)", color: TEAL, border: "1px solid rgba(94,234,212,0.20)" }}>{children}</span>;
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

export default function FanficTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#070708" }}>
        <main id="main-content" className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* HERO */}
          <section className="px-2 sm:px-6 pt-12 pb-10 anim-fadeUp">
            <div className="grid lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-7">
                <Eyebrow>fanfic hyperfixation tracker</Eyebrow>
                <h1 className="font-display anim-fadeUp delay-100" style={{ color: "#FFFFFF", fontSize: "clamp(36px, 7vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 600 }}>
                  Log the fic.{" "}
                  <span style={{ color: TEAL }}>Count the re-reads.</span>
                </h1>
                <p className="mt-6 font-sans text-base sm:text-lg max-w-xl anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  For the fic you&apos;ve re-read three times. The WIP you refresh every day. The 500k-word slowburn that consumed your entire March. Log it. Count the days. Show your friends how unwell you are.
                </p>
                <p className="mt-4 font-sans text-base sm:text-lg max-w-xl anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  Ao3, FanFiction.net, Wattpad, Google Docs — Hyperfix doesn&apos;t care where the fic lives. Just that it&apos;s currently living in your brain.
                </p>
                <div className="mt-8 anim-fadeUp delay-300 max-w-md"><WaitlistForm id="waitlist" variant="light" /></div>
              </div>
              <div className="lg:col-span-5 flex justify-center">
                <HyperfixCard {...sampleCard} />
              </div>
            </div>
          </section>

          <RevealSection>
            <Card>
              <Eyebrow>the situation</Eyebrow>
              <SectionHeadline>You have fourteen tabs open. One of them is the fic.</SectionHeadline>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-5 font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <p>
                    You told yourself you&apos;d just check the update. That was three hours ago. You&apos;re now on chapter 17 again — the same chapter you annotated in your Notes app at 1 a.m. last Tuesday.
                  </p>
                  <p>
                    The fic has a hold on you that a reading list can&apos;t capture. A Goodreads shelf doesn&apos;t have a &quot;re-read count&quot; field. A spreadsheet doesn&apos;t have an intensity meter. Nothing currently exists for this specific experience.
                  </p>
                </div>
                <div className="space-y-5 font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <p>
                    Hyperfix does. Log the fic. Add the fandom tag. Set an intensity rating. Write the note you&apos;d never say out loud. Watch the counter tick. Share the card when you want someone to understand what&apos;s happening to you.
                  </p>
                  <p>
                    When you eventually finish — or when the WIP updates and the era ends — Hyperfix writes the eulogy. Day 61. Re-read 4. Intensity 10. The chapter that broke you.
                  </p>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <Card>
              <Eyebrow>what gets tracked</Eyebrow>
              <SectionHeadline>Every field is the right field.</SectionHeadline>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {[
                  { n: "01", h: "The day counter.", p: "Starts the moment you log. Runs automatically. At day 47 you'll understand why this is the product." },
                  { n: "02", h: "Re-read count.", p: "How many times you've been through it. Not a milestone — a confession. Some fics you've read more times than you've watched your favourite film." },
                  { n: "03", h: "Intensity meter.", p: "1 to 10. Updates as the fic progresses. You logged it at a 6. By chapter 22 it was a 10. The arc is part of the record." },
                  { n: "04", h: "The note.", p: "The thing you can't say out loud. The specific line. The chapter that broke you. Private by default, shareable if you're brave." },
                  { n: "05", h: "The shareable card.", p: "Drop it in the group chat. Send it to the one person who also read it. The card is designed for exactly this moment." },
                  { n: "06", h: "The eulogy.", p: "When the fic ends — or when the era does — Hyperfix writes it up. The full run. The numbers. The note. Saved forever." },
                ].map((item) => (
                  <div key={item.n}>
                    <span className="font-sans text-xs mb-2 block" style={{ color: TEAL }}>{item.n}</span>
                    <h3 className="font-display mb-2" style={{ color: "#FFFFFF", fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{item.h}</h3>
                    <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{item.p}</p>
                  </div>
                ))}
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <Card>
              <Eyebrow>frequently asked</Eyebrow>
              <SectionHeadline>The fic questions.</SectionHeadline>
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
                The fic{" "}
                <span style={{ color: TEAL }}>deserves a proper record.</span>
              </h2>
              <p className="mt-5 font-sans text-base sm:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                First access goes out in waves. Early users get a permanent Pro discount — and the most embarrassing usernames before they&apos;re taken.
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
