import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Goodreads — reading logs don't track what a book does to you",
  description:
    "Goodreads logs what you've read. Hyperfix is for the two-week post-book haunting, the re-reads you've lost count of, and the fictional universe currently living rent-free in your brain.",
  alternates: {
    canonical: "https://hyperfix.app/vs/goodreads",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/goodreads",
    title: "Hyperfix vs. Goodreads — Hyperfix",
    description: "Goodreads logs what you've read. Hyperfix is for the two-week post-book haunting, the re-reads you've lost count of, and the fictional universe currently living rent-free in your brain.",
    images: [{ url: "/api/og?title=Hyperfix+vs.+Goodreads&sub=reading+logs+vs.+obsession+tracking+%C2%B7+hyperfix.app&accent=Goodreads", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Goodreads", item: "https://hyperfix.app/vs/goodreads" },
  ],
};

const comparisonRows = [
  {
    feature: "Logging books you've read",
    goodreads: "Yes — that's the whole product.",
    hyperfix: "Not the point.",
    edge: "goodreads",
  },
  {
    feature: "Post-book obsession tracking",
    goodreads: "No — marks it finished and moves on.",
    hyperfix: "Yes — the haunting gets its own counter.",
    edge: "hyperfix",
  },
  {
    feature: "Re-read tracking",
    goodreads: "Yes — re-read log per book.",
    hyperfix: "Yes — loop count is a first-class field.",
    edge: "both",
  },
  {
    feature: "Tracking non-book obsessions",
    goodreads: "Books only.",
    hyperfix: "Fics, ships, songs, shows, anything.",
    edge: "hyperfix",
  },
  {
    feature: "Day counter",
    goodreads: "No — dates started/finished, not duration.",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity / emotional state",
    goodreads: "Star rating on completion.",
    hyperfix: "Live 1–10 meter, updatable as it escalates.",
    edge: "hyperfix",
  },
  {
    feature: "Reading challenges / goals",
    goodreads: "Excellent — annual challenge with progress.",
    hyperfix: "Not the focus.",
    edge: "goodreads",
  },
  {
    feature: "Shareable cards",
    goodreads: "Book cover + rating.",
    hyperfix: "\"Currently unwell\" card with day count + intensity.",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy when the obsession ends",
    goodreads: "No end state — just the shelf.",
    hyperfix: "Auto-generated when you close the fix.",
    edge: "hyperfix",
  },
  {
    feature: "Understands what a hyperfixation is",
    goodreads: "It does not.",
    hyperfix: "It does.",
    edge: "hyperfix",
  },
];

export default function VsGoodreadsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">

        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              comparison · hyperfix vs goodreads
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              Goodreads knows what you read.
              <br />
              <span className="italic text-accent">
                Hyperfix knows what it did to you.
              </span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Goodreads is genuinely useful. It tracks your reading history,
                hosts your reviews, runs your annual challenge, and shows you
                what your friends are reading. For the catalogue of books
                you've consumed, it's solid infrastructure.
              </p>
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                But it has no concept of the Sarah J. Maas spiral. No field
                for the fandom hyperfixation that outlasts the book by months.
                No way to log the re-read you're on for the sixth time. It
                marks things as "read" and moves on. That's not what's
                happening to you.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the distinction
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              A reading log tracks completion.{" "}
              <span className="italic text-accent">Hyperfix tracks possession.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  Goodreads is a catalogue of things you've finished. Five
                  stars. One-paragraph review. Added to your 2026 reading
                  challenge. The model ends when the book ends. You read it,
                  you logged it, you shelved it. Transaction complete.
                </p>
                <p>
                  That's a reasonable model for most books. For most books,
                  finishing is finishing.
                </p>
              </div>
              <div className="space-y-5 font-sans text-lg leading-snug text-[rgba(244,244,244,0.5)]">
                <p>
                  But finishing a book and being done with it are completely
                  different events. The ACOTAR spiral. The three days after
                  Normal People where nothing else was readable. The re-read
                  that's now in its fourth loop. The fic that technically
                  isn't a book but has consumed more of your life than any
                  book on your shelf.
                </p>
                <p>
                  Goodreads marks these as "read." Hyperfix asks: are you
                  though?
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              What Goodreads{" "}
              <span className="italic text-accent">genuinely gets right</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "The catalogue",
                  p: "30 years of books with metadata, ISBN data, covers, edition tracking. The sheer database quality is irreplaceable. No one else has built this and no one is going to.",
                },
                {
                  h: "Reading challenges",
                  p: "The annual challenge works. The streak, the progress bar, the accountability layer. Nothing else does yearly reading goals as simply or as well.",
                },
                {
                  h: "The discovery layer",
                  p: "Finding books through friends' reviews, shelf surfing, recommendations. The social layer for book discovery is still Goodreads' best feature, however creaky the interface.",
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
                      Goodreads
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
                          row.edge === "goodreads" || row.edge === "both"
                            ? "text-ink font-medium"
                            : "text-[rgba(244,244,244,0.4)]"
                        }`}
                      >
                        {(row.edge === "goodreads" || row.edge === "both") && (
                          <span className="mr-1">✓</span>
                        )}
                        {row.goodreads}
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
              Use Goodreads for the catalogue. Use Hyperfix for the crisis.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-balance">
              Goodreads knows you read it.
              <br />
              <span className="italic text-accent">
                Hyperfix knows you never recovered.
              </span>
            </h2>
            <div className="mt-10 max-w-2xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                The reading log you built on Goodreads is useful. It's a good
                record. But there's no shelf for "currently destroying me" and
                no row for "re-read four times and counting." The graveyard on
                Hyperfix holds all of those: day count, peak intensity, the
                note you wrote at 1 a.m. on the sixth chapter. A complete
                record of the thing that happened to you.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-24 sm:py-36">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">join the waitlist</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-2xl text-balance">
              Log the books on Goodreads.
              <br />
              <span className="italic text-accent">
                Log what they do to you here.
              </span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
              Waitlist is open. First access goes out in waves — early users
              get a permanent Pro discount and the best usernames.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
