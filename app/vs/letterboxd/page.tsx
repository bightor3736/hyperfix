import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Letterboxd — not everything you're unwell about is a film",
  description:
    "Letterboxd is for cinema. Hyperfix is for the Marauders fic, the Sabrina Carpenter bridge, the K-pop bias, and everything else that's currently running your life.",
  alternates: {
    canonical: "https://hyperfix.app/vs/letterboxd",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/letterboxd",
    title: "Hyperfix vs. Letterboxd — Hyperfix",
    description: "Letterboxd is for cinema. Hyperfix is for whatever's currently running your life.",
    images: [{ url: "/api/og?title=Hyperfix+vs.+Letterboxd&sub=cinema+vs.+whatever%27s+running+your+life+%C2%B7+hyperfix.app&accent=Letterboxd", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Letterboxd", item: "https://hyperfix.app/vs/letterboxd" },
  ],
};

const comparisonRows = [
  {
    feature: "Logging films",
    letterboxd: "Best in class. Just use Letterboxd.",
    hyperfix: "Not the point.",
    edge: "letterboxd",
  },
  {
    feature: "Logging fanfics, songs, ships, games",
    letterboxd: "Not supported.",
    hyperfix: "Anything. One field.",
    edge: "hyperfix",
  },
  {
    feature: "Ongoing day counter",
    letterboxd: "No — it logs the past, not the present.",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity tracking",
    letterboxd: "Star rating for completed films.",
    hyperfix: "1–10 scale, live, updatable as it escalates.",
    edge: "hyperfix",
  },
  {
    feature: "Social layer",
    letterboxd: "Excellent. Friends, likes, reviews, lists.",
    hyperfix: "Profiles, public fixes, friend feeds.",
    edge: "both",
  },
  {
    feature: "Shareable cards",
    letterboxd: "Film poster + your review.",
    hyperfix: "\"Currently unwell\" card with day count + intensity.",
    edge: "hyperfix",
  },
  {
    feature: "Community discovery",
    letterboxd: "Deep. Lists, reviews, popular films.",
    hyperfix: "Public fixes and trending obsessions.",
    edge: "letterboxd",
  },
  {
    feature: "Tracks rewatches / re-reads",
    letterboxd: "Yes — rewatch log per film.",
    hyperfix: "Yes — loop count is a first-class field.",
    edge: "both",
  },
  {
    feature: "Eulogy when it ends",
    letterboxd: "No end state — it's a permanent log.",
    hyperfix: "Auto-generated when you close the fix.",
    edge: "hyperfix",
  },
  {
    feature: "Understands present-tense obsession",
    letterboxd: "No — past tense by design.",
    hyperfix: "Yes — that's the whole product.",
    edge: "hyperfix",
  },
];

export default function VsLetterboxdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">

        <Nav />

        {/* HERO */}
        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              comparison · hyperfix vs letterboxd
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              Letterboxd is for cinema.
              <br />
              <span className="italic text-accent">
                Hyperfix is for whatever's
                <br />
                currently running your life.
              </span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Letterboxd is one of the best-designed social products on the
                internet. If you want to log every film you've ever watched,
                write reviews, follow people with good taste, and build lists —
                it's close to perfect.
              </p>
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                But your current hyperfixation is not a film. Or if it is a
                film, you've rewatched it eleven times this month and what you
                need is not a star rating — it's a day counter, an intensity
                meter, and somewhere to put the note you wrote at 2 a.m. about
                the cinematography of one specific scene.
              </p>
            </div>
          </div>
        </section>

        {/* THE CORE DIFFERENCE */}
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the distinction
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              Past tense vs.{" "}
              <span className="italic text-accent">present tense.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Letterboxd is a log. You watched a film — past tense — and
                  you record it. The diary is a record of things that happened.
                  That's its entire design philosophy and it executes it
                  beautifully.
                </p>
                <p>
                  A hyperfixation is present tense. It's happening right now.
                  You are currently, actively unwell about the Dramione slowburn
                  you started on Tuesday. The counter is running. The intensity
                  is a 9 and climbing.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Letterboxd has no concept of this. There's no field for "day
                  47 and still not okay." There's no way to log a fic, a song,
                  a ship, a K-pop bias who is currently rearranging your nervous
                  system, or the single Homestuck panel you've been thinking
                  about for a year.
                </p>
                <p>
                  Hyperfix is built for the present tense. The counter starts
                  when you log. It runs until you close the fix. Then it becomes
                  past tense — and that's when the eulogy gets written.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT LETTERBOXD DOES WELL */}
        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              What Letterboxd{" "}
              <span className="italic text-accent">genuinely gets right</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "The social layer",
                  p: "Letterboxd's friends and followers model is genuinely good. Seeing what your friends are watching, their reviews, their lists — it's the best film-social product that exists. Hyperfix is building something similar but it's not there yet.",
                },
                {
                  h: "The design",
                  p: "Film posters, clean diary entries, beautiful lists. Letterboxd understood early that the visual identity of what you're logging matters. Hyperfix took notes.",
                },
                {
                  h: "The community",
                  p: "The Letterboxd community writes genuinely good reviews. The lists are a cultural artifact. If you're a film person, the network effects alone make it irreplaceable.",
                },
              ].map((item) => (
                <div key={item.h} className="border-t border-[rgba(244,244,244,0.07)] pt-6">
                  <h3 className="font-display text-xl tracking-tight mb-3">
                    {item.h}
                  </h3>
                  <p className="font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed">
                    {item.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">side by side</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-12 text-balance">
              The comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(244,244,244,0.15)]">
                    <th className="text-left py-4 pr-8 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">
                      Feature
                    </th>
                    <th className="text-left py-4 pr-8 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">
                      Letterboxd
                    </th>
                    <th className="text-left py-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">
                      Hyperfix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(244,244,244,0.07)]">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td className="py-4 pr-8 font-display text-base tracking-tight text-ink align-top">
                        {row.feature}
                      </td>
                      <td
                        className={`py-4 pr-8 font-sans text-sm leading-snug align-top ${
                          row.edge === "letterboxd" || row.edge === "both"
                            ? "text-ink font-medium"
                            : "text-[rgba(244,244,244,0.4)]"
                        }`}
                      >
                        {(row.edge === "letterboxd" || row.edge === "both") && (
                          <span className="mr-1">✓</span>
                        )}
                        {row.letterboxd}
                      </td>
                      <td
                        className={`py-4 font-sans text-sm leading-snug align-top ${
                          row.edge === "hyperfix" || row.edge === "both"
                            ? "text-accent font-medium"
                            : "text-[rgba(244,244,244,0.4)]"
                        }`}
                      >
                        {(row.edge === "hyperfix" || row.edge === "both") && (
                          <span className="text-accent mr-1">✓</span>
                        )}
                        {row.hyperfix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-8 font-display italic text-[rgba(244,244,244,0.4)] text-base max-w-xl">
              If you're a film person, you should have both. Letterboxd for
              what you've watched. Hyperfix for the one film you've rewatched
              eleven times this month and cannot explain.
            </p>
          </div>
        </section>

        {/* THE ANGLE */}
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-balance">
              Letterboxd knows
              <br />
              what you watched.
              <br />
              <span className="italic text-accent">
                Hyperfix knows what
                <br />
                you can't stop watching.
              </span>
            </h2>
            <div className="mt-10 max-w-2xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                There's a difference between a film you loved and a film that
                consumed two weeks of your life, three notebooks of thoughts,
                and a group chat that eventually muted you. Letterboxd holds
                the first one. Hyperfix holds the second.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 sm:px-10 py-24 sm:py-36">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">join the waitlist</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-2xl text-balance">
              Log the films on Letterboxd.
              <br />
              <span className="italic text-accent">
                Log the obsession here.
              </span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
              Waitlist is open. First access goes out in waves — early users
              get a permanent Pro discount and the best usernames before
              they're gone.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
