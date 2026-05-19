import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Shelf — reading logs vs. obsession tracking",
  description:
    "Shelf is a beautiful reading tracker. Hyperfix is for when the book stops being something you read and starts being something that's happening to you.",
  alternates: {
    canonical: "https://hyperfix.app/vs/shelf",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/shelf",
    title: "Hyperfix vs. Shelf — Hyperfix",
    description: "Shelf tracks your reading. Hyperfix tracks what your reading is doing to you.",
    images: [{ url: "/api/og?title=Hyperfix+vs.+Shelf&sub=reading+logs+vs.+obsession+tracking+%C2%B7+hyperfix.app&accent=Shelf", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Shelf", item: "https://hyperfix.app/vs/shelf" },
  ],
};

const comparisonRows = [
  {
    feature: "Logging books you've read",
    shelf: "Beautiful. That's the product.",
    hyperfix: "Not the focus.",
    edge: "shelf",
  },
  {
    feature: "Currently-reading tracker",
    shelf: "Yes — progress, page count, dates.",
    hyperfix: "Yes — day counter, intensity, notes.",
    edge: "both",
  },
  {
    feature: "Post-book obsession tracking",
    shelf: "No — marks the book as finished.",
    hyperfix: "Yes — the obsession continues after the last page.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity / emotional state",
    shelf: "Star rating on completion.",
    hyperfix: "Live 1–10 meter, updatable in real time.",
    edge: "hyperfix",
  },
  {
    feature: "Shareable cards",
    shelf: "Book cover + review.",
    hyperfix: "\"Currently unwell\" card with day count.",
    edge: "hyperfix",
  },
  {
    feature: "Tracking non-book obsessions",
    shelf: "Books only.",
    hyperfix: "Songs, fics, ships, shows, anything.",
    edge: "hyperfix",
  },
  {
    feature: "Reading stats and yearly wrap",
    shelf: "Excellent — pages, genres, pace.",
    hyperfix: "Hyperfix Wrapped — longest fix, most intense, eras.",
    edge: "both",
  },
  {
    feature: "Social / community",
    shelf: "Friends, reviews, reading groups.",
    hyperfix: "Profiles, public fixes, friend feeds.",
    edge: "both",
  },
  {
    feature: "Eulogy when the obsession ends",
    shelf: "No — the record just stays.",
    hyperfix: "Auto-generated on close.",
    edge: "hyperfix",
  },
  {
    feature: "Beautiful design",
    shelf: "Yes — one of the best-looking reading apps.",
    hyperfix: "Different aesthetic. Intentionally unhinged.",
    edge: "shelf",
  },
];

export default function VsShelfPage() {
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
              comparison · hyperfix vs shelf
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              Shelf tracks your reading.
              <br />
              <span className="italic text-accent">
                Hyperfix tracks what
                <br />
                your reading is doing to you.
              </span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Shelf is a genuinely good reading tracker — clean design,
                social features, beautiful stats. If you want to know how
                many books you read last year, which genres you gravitate
                toward, and what your friends are reading, Shelf handles
                all of that well.
              </p>
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                But there's a gap between "I'm currently reading this" and
                "this book has taken over my life and I've been thinking
                about chapter eighteen for eleven days." Shelf logs the
                former. Hyperfix is built for the latter.
              </p>
            </div>
          </div>
        </section>

        {/* THE READING LOG VS THE OBSESSION */}
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the distinction
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              Reading logs track completion.
              <br />
              <span className="italic text-accent">
                Hyperfix tracks possession.
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  A reading log is fundamentally a record of things you've
                  finished. The moment you close the book, it moves from
                  "currently reading" to "read." The page count gets logged,
                  the star rating goes in, and you move on. That's the whole
                  model.
                </p>
                <p>
                  But finishing the book and being done with the book are
                  completely different events. The Fourth Wing hangover. The
                  week after you finished Normal People where you couldn't
                  start anything new. The three days post-ACOTAR where you
                  just stared at the wall.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Shelf marks it as finished. Hyperfix asks: are you though?
                  The post-book obsession — the haunting, the searching for
                  fan content, the texting everyone you know — is its own
                  phase. It gets its own counter.
                </p>
                <p>
                  This isn't a knock on Shelf. It's a different product for
                  a different moment. You need both: Shelf for the archive,
                  Hyperfix for the current crisis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT SHELF DOES WELL */}
        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              What Shelf{" "}
              <span className="italic text-accent">genuinely gets right</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "The design",
                  p: "Shelf is one of the best-looking reading apps available. It treats books as objects worth displaying. The visual design is intentional and coherent in a way that most reading trackers aren't.",
                },
                {
                  h: "Reading stats",
                  p: "Pages read, genres, reading pace, streaks. If you want to understand your reading habits as data — trends over time, how long it takes you to finish different genres — Shelf is built for that.",
                },
                {
                  h: "The social layer",
                  p: "Shelf has friends, reviews, and reading groups. The community is smaller and more intentional than Goodreads. If you want to read alongside people rather than just log next to them, Shelf's social model works well.",
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
                    <th className="text-left py-4 pr-8 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">Feature</th>
                    <th className="text-left py-4 pr-8 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">Shelf</th>
                    <th className="text-left py-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">Hyperfix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(244,244,244,0.07)]">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td className="py-4 pr-8 font-display text-base tracking-tight text-ink align-top">
                        {row.feature}
                      </td>
                      <td className={`py-4 pr-8 font-sans text-sm leading-snug align-top ${row.edge === "shelf" || row.edge === "both" ? "text-ink font-medium" : "text-[rgba(244,244,244,0.4)]"}`}>
                        {(row.edge === "shelf" || row.edge === "both") && <span className="mr-1">✓</span>}
                        {row.shelf}
                      </td>
                      <td className={`py-4 font-sans text-sm leading-snug align-top ${row.edge === "hyperfix" || row.edge === "both" ? "text-accent font-medium" : "text-[rgba(244,244,244,0.4)]"}`}>
                        {(row.edge === "hyperfix" || row.edge === "both") && <span className="text-accent mr-1">✓</span>}
                        {row.hyperfix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-8 font-display italic text-[rgba(244,244,244,0.4)] text-base max-w-xl">
              Use Shelf to track your reading life. Use Hyperfix for the
              moment reading stops being a hobby and starts being a
              condition.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 sm:px-10 py-24 sm:py-36 bg-[#111113]">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              join the waitlist
            </span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-2xl text-balance">
              Log the books on Shelf.
              <br />
              <span className="italic text-accent">
                Log what they do to you here.
              </span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
              Waitlist is open. Early users get a permanent Pro discount
              and the best usernames before they're taken.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
