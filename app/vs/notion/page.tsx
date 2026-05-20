import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Notion — a hyperfixation tracker is not a database",
  description:
    "Notion is powerful. It's also the wrong tool for tracking hyperfixations. Here's what Notion does well, what it doesn't, and why Hyperfix exists.",
  alternates: {
    canonical: "https://hyperfix.app/vs/notion",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/notion",
    title: "Hyperfix vs. Notion — Hyperfix",
    description: "Notion is a tool. Hyperfix is a place. Here's the difference.",
    images: [{ url: "/api/og?title=Hyperfix+vs.+Notion&sub=a+tool+vs.+a+place+%C2%B7+hyperfix.app&accent=Notion", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Notion", item: "https://hyperfix.app/vs/notion" },
  ],
};

const comparisonRows = [
  {
    feature: "Setup time",
    notion: "30–90 min to build a usable template",
    hyperfix: "One field. You're done.",
    edge: "hyperfix",
  },
  {
    feature: "Day counter",
    notion: "Manual. You have to remember to update it.",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity meter",
    notion: "A number column you define yourself",
    hyperfix: "Built-in 1–10 scale with visual bar",
    edge: "hyperfix",
  },
  {
    feature: "Shareable cards",
    notion: "Public pages, no card format",
    hyperfix: "Screenshot-ready card for every fix",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy / archive",
    notion: "Whatever you write in a text block",
    hyperfix: "Auto-generated when you close a fix",
    edge: "hyperfix",
  },
  {
    feature: "Flexibility",
    notion: "Unlimited — build anything",
    hyperfix: "Opinionated — built for one thing",
    edge: "notion",
  },
  {
    feature: "Databases & relations",
    notion: "Best-in-class",
    hyperfix: "Not applicable",
    edge: "notion",
  },
  {
    feature: "Works for project management",
    notion: "Yes, extremely well",
    hyperfix: "No, and that's the point",
    edge: "notion",
  },
  {
    feature: "Community / social layer",
    notion: "None",
    hyperfix: "Profiles, public fixes, friend feeds",
    edge: "hyperfix",
  },
  {
    feature: "Understands what a hyperfixation is",
    notion: "It does not",
    hyperfix: "It does",
    edge: "hyperfix",
  },
];

export default function VsNotionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="relative z-10 text-white" style={{ background: "#070708", minHeight: "100vh" }}>

        <Nav />

        {/* HERO */}
        <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>
              comparison · hyperfix vs notion
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-tight text-white text-balance">
              Notion is a tool.
              <br />
              <span className="text-[#5EEAD4]">Hyperfix is a place.</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Notion is genuinely excellent software. If you want to build a
                project management system, a second brain, or a reading list
                that talks to your calendar, Notion is probably the right
                answer.
              </p>
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                But if you're currently on day 47 of a Marauders fic and you
                want to log it, count it, and eventually mourn it — Notion is
                going to make you do a lot of work before it helps you with
                that.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT NOTION DOES WELL */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>
              honest assessment
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-10 text-balance">
              What Notion{" "}
              <span className="text-[#5EEAD4]">actually does well</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "Flexibility",
                  p: "You can build literally anything. Any schema, any view, any relation. If you have a very specific, idiosyncratic way you think about your obsessions, Notion can accommodate it. Hyperfix cannot.",
                },
                {
                  h: "The ecosystem",
                  p: "Notion connects to everything. If you already live in Notion — your tasks, your notes, your reading list — keeping your hyperfixation log there too has a real convenience argument.",
                },
                {
                  h: "Sharing pages",
                  p: "Notion's public pages are clean and work well for sharing long-form content. If you want to write a 3,000-word analysis of a character arc and share it, Notion is fine for that.",
                },
              ].map((item) => (
                <div key={item.h} className="border-t border-[rgba(255,255,255,0.06)] pt-6">
                  <h3 className="font-display text-xl tracking-tight mb-3">
                    {item.h}
                  </h3>
                  <p className="font-sans text-base text-[rgba(255,255,255,0.65)] leading-relaxed">
                    {item.p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT NOTION DOESN'T DO */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>the gap</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-10 max-w-3xl text-balance">
              What Notion doesn't do
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-6 font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                <p>
                  Notion doesn't know what a hyperfixation is. It doesn't know
                  that the day counter is the emotional core of the whole thing,
                  not a metadata field. It doesn't know that an intensity meter
                  should be a visual bar, not a number you type in and
                  immediately forget about.
                </p>
                <p>
                  Notion templates are built by people and they require
                  maintenance. You have to remember to open the database. You
                  have to manually update the day count, or set up a formula,
                  or build an automation — none of which you want to do at
                  11 p.m. when you've just discovered a fic that has 400,000
                  words and is complete.
                </p>
              </div>
              <div className="space-y-6 font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                <p>
                  And Notion has no social layer. There's no moment where your
                  fix becomes a card you can drop in a group chat. There's no
                  community of people who understand why you're on day 89 of
                  a ship that will never be canon. There's no eulogy when it
                  ends — just a row in a database that you archive and never
                  look at again.
                </p>
                <p>
                  Notion is a tool. It's an extraordinary tool. But a
                  hyperfixation isn't a task and it isn't a document. It's an
                  experience that deserves its own container.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>side by side</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-12 text-balance">
              The comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.12)]">
                    <th className="text-left py-4 pr-8 font-mono text-[11px] uppercase tracking-widest text-[rgba(255,255,255,0.55)] w-1/3">
                      Feature
                    </th>
                    <th className="text-left py-4 pr-8 font-mono text-[11px] uppercase tracking-widest text-[rgba(255,255,255,0.55)] w-1/3">
                      Notion
                    </th>
                    <th className="text-left py-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(255,255,255,0.55)] w-1/3">
                      Hyperfix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="group">
                      <td className="py-4 pr-8 font-display text-base tracking-tight text-white align-top">
                        {row.feature}
                      </td>
                      <td
                        className={`py-4 pr-8 font-sans text-sm leading-snug align-top ${
                          row.edge === "notion"
                            ? "text-white font-medium"
                            : "text-[rgba(255,255,255,0.55)]"
                        }`}
                      >
                        {row.edge === "notion" && (
                          <span className="text-white mr-1">✓</span>
                        )}
                        {row.notion}
                      </td>
                      <td
                        className={`py-4 font-sans text-sm leading-snug align-top ${
                          row.edge === "hyperfix"
                            ? "text-[#5EEAD4] font-medium"
                            : "text-[rgba(255,255,255,0.55)]"
                        }`}
                      >
                        {row.edge === "hyperfix" && (
                          <span className="text-[#5EEAD4] mr-1">✓</span>
                        )}
                        {row.hyperfix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-8 font-display text-[rgba(255,255,255,0.55)] text-base max-w-xl">
              Notion wins on flexibility and power. Hyperfix wins on knowing
              what you actually need. These are different products for different
              jobs — the honest answer is you might want both.
            </p>
          </div>
        </section>

        {/* THE ANGLE */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
              A database stores your
              <br />
              obsession.{" "}
              <span className="text-[#5EEAD4]">Hyperfix holds it.</span>
            </h2>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-3xl">
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                The Notion template you built at 2 a.m. is still in your
                workspace. You updated it twice. The "days active" formula
                broke when you changed the start date format. You haven't
                opened it in three weeks.
              </p>
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Hyperfix doesn't ask you to maintain it. It just counts.
                When the fix ends, it remembers. The graveyard builds itself —
                day 47, intensity 9, the fic that made you text someone at
                midnight about a fictional character's attachment style.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>join the waitlist</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tight max-w-2xl text-balance">
              Stop maintaining the database.
              <br />
              <span className="text-[#5EEAD4]">Start counting the days.</span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(255,255,255,0.65)] max-w-xl leading-snug">
              Hyperfix is in waitlist. First access goes out in waves — early
              users get a permanent Pro discount and the best usernames.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
