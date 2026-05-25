import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "The Hyperfix Manifesto — on hyperfixation, obsession, and the things that run your life",
  description:
    "Why Hyperfix exists. A case for taking your obsessions seriously, counting the days, and building a record of every era your brain has ever lived through.",
  alternates: {
    canonical: "https://hyperfix.app/manifesto",
  },
  openGraph: {
    url: "https://hyperfix.app/manifesto",
    title: "The Hyperfix Manifesto",
    description: "On hyperfixation, obsession, and why your fixations deserve a record.",
    images: [{ url: "/api/og?title=The+Manifesto&sub=on+obsession%2C+counting%2C+and+the+things+that+ran+your+life+%C2%B7+hyperfix.app&accent=Manifesto", width: 1200, height: 630 }],
  },
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Manifesto", item: "https://hyperfix.app/manifesto" },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Hyperfix Manifesto",
  description: "Why Hyperfix exists. A case for taking your obsessions seriously.",
  url: "https://hyperfix.app/manifesto",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    n: "I",
    h: "Something has always been running your life.",
    body: [
      "You have a memory. You're fourteen, and you've listened to the same album every night for three months. You know every breath, every stumble, every place the vocal cracks. You could hum the guitar part in your sleep. You probably did.",
      "Or you're twenty-two, and you've read the same fanfic four times. You know the chapter structure better than you know the layout of your own apartment. You have opinions about the pacing of chapter eleven that you've never said out loud because who would you say them to.",
      "Or you're thirty-one, and there's a show you've rewatched six times. A character whose internal logic you understand better than you understand most of the people in your life. A specific scene you return to the way other people return to a favourite restaurant.",
      "This has always been happening. You just never had a word for it.",
    ],
  },
  {
    n: "II",
    h: "The word is hyperfixation.",
    body: [
      "The ADHD and autistic communities put language to something that had been happening, without language, for decades. A hyperfixation is an intense, consuming focus on one specific thing — involuntary, absorbing, and usually embarrassing to admit to people who don't experience it the same way.",
      "You didn't choose it. It arrived. And it rearranged things.",
      "The clinical framing is useful but incomplete. Clinical language is built around deviation — what's abnormal, what needs intervention, what needs to be reduced. That framing doesn't fit the Marauders fanfic that got you through a hard winter. It doesn't fit the album you wore out at twenty. It doesn't fit the character who taught you something about yourself that a therapist couldn't.",
      "We're not trying to reduce your hyperfixations. We're trying to count them.",
    ],
  },
  {
    n: "III",
    h: "The problem is that nothing was built for this.",
    body: [
      "There's Letterboxd for films. Goodreads for books. Spotify Wrapped for music, once a year, in aggregate. None of them are for the thing that happens when one song plays two hundred times in a week. None of them have a counter. None of them have an intensity meter. None of them write a eulogy.",
      "So people built workarounds. Spreadsheets. Notes app entries titled 'thoughts on chapter 17' that run to six thousand words. Group chats that eventually muted them. A corner of their brain devoted permanently to a fictional sixteenth-century duel.",
      "The workarounds work, sort of. But they miss the point. A spreadsheet doesn't know what it's storing. A Notes app entry doesn't know it's a record of something that mattered. The data is there but the meaning is missing.",
    ],
  },
  {
    n: "IV",
    h: "The counter is the product.",
    body: [
      "Here is what we believe: the day counter is not a feature. It is the entire thing.",
      "When you look at a number — day 47, day 156, day 412 — something happens. The obsession gets a weight. It becomes concrete. It becomes evidence. It stops being something that's quietly consuming you and starts being something you can point at and say: this has been running my life for forty-seven days, and I would like that to be on record.",
      "There's something clarifying about that. Something almost relieving. The counter doesn't judge. It doesn't tell you to have fewer hyperfixations or shorter ones. It just counts.",
    ],
  },
  {
    n: "V",
    h: "Obsessions deserve a record.",
    body: [
      "Here is the part that took us a while to articulate: your hyperfixations are part of your autobiography.",
      "The Hamilton era. The Marauders winter. The K-pop bias who showed up at exactly the right moment. The fic that you re-read when things got hard. These are not footnotes to your life — they are the texture of it. They are the proof that you have an interior life that runs deeper than your job title and your five-year plan.",
      "You deserve to look back at them. The whole record: day count, peak intensity, the note you wrote at 3 a.m. on day 8, the chapter that broke you, the song that played on repeat for the entire month of March. Not because you need to justify them. Because they happened, and they were real, and they meant something, and they deserve not to be lost.",
    ],
  },
  {
    n: "VI",
    h: "The eulogy is not a joke.",
    body: [
      "When a hyperfixation ends, something ends. The specific brain-state that made this particular thing the most important thing — that state doesn't come back. You might return to the fic, or the album, or the show. But you won't be the person who was on day 47, intensity 9, who wrote 'the bridge undid me' in a note at 1 a.m.",
      "That person is worth commemorating. That era deserves a close.",
      "The Hyperfix eulogy is auto-generated when you close a fix. It's designed to be screenshotted and shared. But more than that, it's designed to be kept. Added to the graveyard. Stacked next to all the other eras, the other obsessions, the other versions of yourself who got completely wrecked by something for a specific number of days.",
      "Someday you'll have a hundred of them. You'll be able to look back at the shape of your interior life — what arrived, what consumed you, what you came out of the other side of, what you'd do again. That's not embarrassing. That's a record of being alive.",
    ],
  },
  {
    n: "VII",
    h: "This is why we built it.",
    body: [
      "Hyperfix is not a wellness app. It is not trying to get you to have fewer obsessions, or healthier ones, or to practise moderation with your brain.",
      "Hyperfix is a tracker. Log it. Count it. Share the card when you want someone to understand what's happening to you. Write the note that you'd never say out loud. And when it ends — when the fix finally lifts and you re-emerge into a world where other things exist again — let the eulogy be written.",
      "You were unwell about something. It ran your life for a while. That's worth counting.",
    ],
  },
];

export default function ManifestoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

        <main id="main-content" className="relative max-w-3xl mx-auto flex flex-col gap-6">
          {/* Hero — tight, restrained */}
          <div className="anim-fadeUp mb-2">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(94,234,212,0.55)" }}>
              the manifesto
            </p>
            <h1 className="font-display" style={{ color: "#F4F4F4", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.02em", fontWeight: 600 }}>
              On obsession, counting,
              <br />
              and the things that ran your life.
            </h1>
          </div>

          {/* Body sections */}
          {sections.map((sec) => (
            <RevealSection key={sec.n}>
              <div className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-10" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
                <div className="relative">
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="font-display tabular-nums" style={{ color: TEAL, fontSize: 18, fontWeight: 600 }}>
                      {sec.n}
                    </span>
                    <h2 className="font-display" style={{ color: "#FFFFFF", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                      {sec.h}
                    </h2>
                  </div>
                  <div className="space-y-5 sm:pl-8">
                    {sec.body.map((para, i) => (
                      <p key={i} className="font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}

          {/* Sign-off */}
          <RevealSection>
            <div className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-10" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
              <div className="relative">
                <p className="font-display text-xl sm:text-2xl leading-snug mb-6" style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: "-0.01em" }}>
                  &ldquo;You were unwell about something. It ran your life for a while. That&apos;s worth counting.&rdquo;
                </p>
                <p className="font-sans text-xs" style={{ color: TEAL }}>
                  — the hyperfix team, 2026
                </p>
              </div>
            </div>
          </RevealSection>

          {/* CTA */}
          <RevealSection>
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, #2DD4BF 0%, #0E4F47 26%, #08231F 50%, #0F1011 80%)", border: `1px solid ${CARD_BORDER}` }}>
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.5 }} />
              <div className="relative">
                <h2 className="font-display mb-2" style={{ color: "#FFFFFF", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                  Join the waitlist.
                </h2>
                <p className="font-sans text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  First access goes out in waves. Early users get a permanent Pro discount.
                </p>
              </div>
              <a
                href="/#waitlist"
                className="relative inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] shrink-0"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px rgba(94,234,212,0.25)",
                }}
              >
                Get on the list →
              </a>
            </div>
          </RevealSection>
        </main>
      </div>
      <Footer />
    </>
  );
}
