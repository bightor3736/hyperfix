import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Airtable — a relational database is not a hyperfixation tracker",
  description:
    "Airtable is a powerful database. It's also not designed to know what a hyperfixation is. Here's what Airtable does well, what it doesn't, and why Hyperfix exists.",
  alternates: {
    canonical: "https://hyperfix.app/vs/airtable",
  },
  openGraph: {
    images: [
      {
        url: "/api/og?title=Hyperfix+vs.+Airtable&sub=databases+vs.+obsession+tracking+%C2%B7+hyperfix.app&accent=Airtable",
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://hyperfix.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Hyperfix vs. Airtable",
      item: "https://hyperfix.app/vs/airtable",
    },
  ],
};

const comparisonRows = [
  {
    feature: "Setup time",
    airtable: "30–90 min for a usable hyperfixation base",
    hyperfix: "One field. Done.",
    edge: "hyperfix",
  },
  {
    feature: "Automatic day counter",
    airtable: "A formula you write and maintain",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity tracking",
    airtable: "A rating field you configure and update manually",
    hyperfix: "Built-in 1–10 scale with visual bar",
    edge: "hyperfix",
  },
  {
    feature: "Relational data",
    airtable: "Excellent — linked records, rollups, lookups",
    hyperfix: "Not applicable",
    edge: "airtable",
  },
  {
    feature: "Shareable cards",
    airtable: "Share base view, no card format",
    hyperfix: "Screenshot-ready card for every fix",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy when it ends",
    airtable: "A status change in a dropdown",
    hyperfix: "Auto-generated when you close the fix",
    edge: "hyperfix",
  },
  {
    feature: "Community / social layer",
    airtable: "None",
    hyperfix: "Profiles, public fixes, friend feeds",
    edge: "hyperfix",
  },
  {
    feature: "Flexibility",
    airtable: "Exceptional — any schema, any view, any automation",
    hyperfix: "Opinionated — built for one thing",
    edge: "airtable",
  },
  {
    feature: "Maintenance burden",
    airtable: "High — you own everything",
    hyperfix: "Zero — it just runs",
    edge: "hyperfix",
  },
  {
    feature: "Understands hyperfixation as an experience",
    airtable: "It does not",
    hyperfix: "It does — that's the whole product",
    edge: "hyperfix",
  },
];

export default function AirtableComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Nav />

      <main id="main-content" className="relative z-10 text-white" style={{ background: "#070708", minHeight: "100vh" }}>
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>comparison · hyperfix vs airtable</span>
            <h1 className="font-display mb-12 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Airtable is a database.{" "}
              <em className="text-[#5EEAD4] not-italic">Hyperfix is a tracker.</em>
            </h1>
            <div className="grid gap-8 md:grid-cols-2">
              <p className="font-sans text-lg leading-relaxed">
                Airtable is genuinely impressive software. It sits between a spreadsheet and a
                relational database — powerful enough to run entire businesses, flexible enough to
                hold almost any schema you design. If you want to build something custom with
                relations, formulas, and automations, Airtable can do it.
              </p>
              <p className="font-sans text-lg leading-relaxed">
                But building a hyperfixation tracker in Airtable is still building it yourself. The
                day counter is a formula. The intensity is a field you define. The social layer
                doesn't exist. And when the fix ends, you update a status field and that's it — no
                eulogy, no graveyard, just a row with a different dropdown value.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>the distinction</span>
            <h2 className="font-display mb-12 text-4xl font-bold leading-tight md:text-5xl">
              A database holds the record.{" "}
              <em className="text-[#5EEAD4] not-italic">Hyperfix runs it.</em>
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <p className="font-sans text-lg leading-relaxed text-[rgba(255,255,255,0.65)]">
                Airtable's model is: you design the schema, you fill in the data, you maintain the
                automations. It's extraordinarily flexible because it does nothing by default. Every
                useful behaviour is something you configured. That's power. It's also work.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[rgba(255,255,255,0.65)]">
                Hyperfix's model is: log the thing, everything else runs. The day counter starts
                automatically. The intensity bar is already there. The eulogy generates when you
                close the fix. Nothing requires you to have built it first. The schema is opinionated
                because it's designed for one specific experience — and that experience is yours.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display mb-12 text-3xl font-bold md:text-4xl">
              What Airtable Does Well
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl p-8">
                <h3 className="font-display mb-4 text-xl font-bold">Relational data</h3>
                <p className="font-sans text-base leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Airtable's linked records are genuinely powerful. If you want to connect your
                  hyperfixations to characters, fandoms, creators, or any other entities you track —
                  and run views across those relations — Airtable does this in a way Hyperfix never
                  will.
                </p>
              </div>
              <div className="rounded-2xl p-8">
                <h3 className="font-display mb-4 text-xl font-bold">Automations</h3>
                <p className="font-sans text-base leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Airtable's automation layer is robust. If you want to trigger notifications, update
                  fields based on conditions, or connect to other tools in your stack, it handles
                  that well. The infrastructure is real.
                </p>
              </div>
              <div className="rounded-2xl p-8">
                <h3 className="font-display mb-4 text-xl font-bold">Custom views</h3>
                <p className="font-sans text-base leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Gallery, grid, kanban, calendar. If you want to visualise your obsession history in
                  multiple ways — timeline view, grouped by type, sorted by intensity — Airtable
                  gives you the tools to build that.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display mb-12 text-3xl font-bold md:text-4xl">
              Feature comparison
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[rgba(255,255,255,0.06)]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1C1C1E]">
                    <th className="font-sans px-6 py-4 text-left text-sm font-semibold text-[rgba(255,255,255,0.65)]">
                      Feature
                    </th>
                    <th className="font-sans px-6 py-4 text-left text-sm font-semibold text-[rgba(255,255,255,0.65)]">
                      Airtable
                    </th>
                    <th className="font-sans px-6 py-4 text-left text-sm font-semibold text-[rgba(255,255,255,0.65)]">
                      Hyperfix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#1C1C1E]"}
                    >
                      <td className="font-sans px-6 py-4 text-sm font-medium">{row.feature}</td>
                      <td
                        className={`font-sans px-6 py-4 text-sm ${
                          row.edge === "airtable" ? "font-semibold text-[#5EEAD4]" : "text-[rgba(255,255,255,0.65)]"
                        }`}
                      >
                        {row.airtable}
                      </td>
                      <td
                        className={`font-sans px-6 py-4 text-sm ${
                          row.edge === "hyperfix" ? "font-semibold text-[#5EEAD4]" : "text-[rgba(255,255,255,0.65)]"
                        }`}
                      >
                        {row.hyperfix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono mt-6 text-sm text-[rgba(255,255,255,0.55)]">
              Airtable wins on power and flexibility. Hyperfix wins on knowing what you're actually
              here for.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display mb-8 text-4xl font-bold leading-tight md:text-5xl">
              The base you built has seventeen fields.
              <br />
              <em className="text-[#5EEAD4] not-italic">You use three of them.</em>
            </h2>
            <p className="font-sans max-w-2xl text-lg leading-relaxed text-[rgba(255,255,255,0.65)]">
              The Airtable base is still in your workspace. The automations are configured. The
              gallery view looks good. You've updated it fourteen times. Two of those times were in
              the first week. The day counter formula broke when you linked the fandom table and
              changed the primary field. You haven't opened it in six weeks. The fix ran for
              ninety-three days. Forty-nine of them are unlogged.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>join the waitlist</span>
            <h2 className="font-display mb-6 text-4xl font-bold leading-tight md:text-5xl">
              Close the base.{" "}
              <em className="text-[#5EEAD4] not-italic">Start the counter.</em>
            </h2>
            <p className="font-sans mx-auto mb-12 max-w-xl text-lg leading-relaxed text-[rgba(255,255,255,0.65)]">
              Waitlist is open. First access goes out in waves — early users get a permanent Pro
              discount and the best usernames before they're taken.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
