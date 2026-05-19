import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Spreadsheets — your Google Sheet is not a hyperfixation tracker",
  description:
    "You built the sheet. You named the columns. You updated it twice. Hyperfix is what you actually needed: automatic day counter, intensity meter, and a eulogy when it ends.",
  alternates: {
    canonical: "https://hyperfix.app/vs/spreadsheet",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/spreadsheet",
    title: "Hyperfix vs. Spreadsheets — Hyperfix",
    description: "You built the sheet. You named the columns. You updated it twice. Hyperfix is what you actually needed: automatic day counter, intensity meter, and a eulogy when it ends.",
    images: [{ url: "/api/og?title=Hyperfix+vs.+Spreadsheets&sub=the+sheet+you+built+vs.+the+tracker+you+needed+%C2%B7+hyperfix.app&accent=Spreadsheets", width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Spreadsheets", item: "https://hyperfix.app/vs/spreadsheet" },
  ],
};

const comparisonRows = [
  {
    feature: "Setup time",
    spreadsheet: "30–60 min to build something usable",
    hyperfix: "One field. Done.",
    edge: "hyperfix",
  },
  {
    feature: "Automatic day counter",
    spreadsheet: "A formula you write, test, and maintain",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity tracking",
    spreadsheet: "A column you update manually when you remember",
    hyperfix: "Built-in 1–10 scale with visual bar",
    edge: "hyperfix",
  },
  {
    feature: "Data ownership",
    spreadsheet: "100% — it's a file you own",
    hyperfix: "Hosted — you trust Hyperfix",
    edge: "spreadsheet",
  },
  {
    feature: "Maintenance burden",
    spreadsheet: "High — you own the schema and all the data",
    hyperfix: "Zero — it just runs",
    edge: "hyperfix",
  },
  {
    feature: "Shareable cards",
    spreadsheet: "A screenshot of a row, if you try hard enough",
    hyperfix: "Screenshot-ready card for every fix",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy when it ends",
    spreadsheet: "Nothing — you just stop updating the row",
    hyperfix: "Auto-generated when you close the fix",
    edge: "hyperfix",
  },
  {
    feature: "Community / social layer",
    spreadsheet: "None",
    hyperfix: "Profiles, public fixes, friend feeds",
    edge: "hyperfix",
  },
  {
    feature: "Custom columns and relations",
    spreadsheet: "Unlimited flexibility",
    hyperfix: "Fixed schema, opinionated by design",
    edge: "spreadsheet",
  },
  {
    feature: "Understands what a hyperfixation is",
    spreadsheet: "It does not — it's a blank grid",
    hyperfix: "It does — that's the whole product",
    edge: "hyperfix",
  },
];

export default function VsSpreadsheetPage() {
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
              comparison · hyperfix vs spreadsheets
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              You built the sheet.
              <br />
              <span className="italic text-accent">You updated it twice.</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                The spreadsheet is an impressive object. You named the columns
                yourself — "Title," "Type," "Start Date," "Rating," "Status,"
                "Days Active." You added conditional formatting. You spent
                forty-five minutes on the day counter formula. It almost worked.
              </p>
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Then you updated it on day one. And day four. And then you
                forgot, and when you came back the formula was broken because
                you'd changed the date format, and the whole thing was just a
                row in a sheet that didn't know it was supposed to be counting
                something important.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the distinction
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 max-w-3xl text-balance">
              A spreadsheet stores the data.{" "}
              <span className="italic text-accent">Hyperfix runs itself.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <div className="space-y-6 font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                <p>
                  A spreadsheet is passive. It holds whatever you put in it and
                  nothing else. The day counter only works if you remembered the
                  formula. The intensity only updates if you open the file. The
                  archive only exists if you remember to archive it. Every single
                  thing requires you to do something.
                </p>
              </div>
              <div className="space-y-6 font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                <p>
                  Hyperfix runs. The counter starts the moment you log — no
                  formula, no update required. The intensity is built in. When
                  the fix ends, it closes itself and writes the eulogy. The
                  graveyard builds automatically. You don't maintain any of it.
                  That's not a minor difference. That's the entire product.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              What spreadsheets actually do well
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "Total flexibility",
                  p: "A spreadsheet will hold any schema you design. If you have a very specific way you want to track something — columns Hyperfix doesn't have, relations it can't do — a spreadsheet can accommodate it. Hyperfix is opinionated. A spreadsheet is not.",
                },
                {
                  h: "Data export and analysis",
                  p: "If you want to run statistics on your hyperfixation history — averages, trends, correlation between intensity and duration — a spreadsheet is genuinely better for that. You own the data in a portable format.",
                },
                {
                  h: "No account required",
                  p: "A spreadsheet lives on your machine or in your Google Drive. No signup, no service going down, no company making product decisions you disagree with. For people who care about that, it's a real advantage.",
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
                      Spreadsheet
                    </th>
                    <th className="text-left py-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] w-1/3">
                      Hyperfix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(244,244,244,0.07)]">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="group">
                      <td className="py-4 pr-8 font-display text-base tracking-tight text-ink align-top">
                        {row.feature}
                      </td>
                      <td
                        className={`py-4 pr-8 font-sans text-sm leading-snug align-top ${
                          row.edge === "spreadsheet"
                            ? "text-ink font-medium"
                            : "text-[rgba(244,244,244,0.4)]"
                        }`}
                      >
                        {row.edge === "spreadsheet" && (
                          <span className="text-ink mr-1">✓</span>
                        )}
                        {row.spreadsheet}
                      </td>
                      <td
                        className={`py-4 font-sans text-sm leading-snug align-top ${
                          row.edge === "hyperfix"
                            ? "text-accent font-medium"
                            : "text-[rgba(244,244,244,0.4)]"
                        }`}
                      >
                        {row.edge === "hyperfix" && (
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
              Spreadsheets win on flexibility and ownership. Hyperfix wins on
              knowing what you came here for and doing it without being asked.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-balance">
              The formula broke.
              <br />
              The sheet got archived.
              <br />
              <span className="italic text-accent">The fix kept going.</span>
            </h2>
            <div className="mt-10 max-w-2xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                The spreadsheet you built is still in your Google Drive. It has
                six rows. The "Days Active" column stopped calculating after you
                changed the start date format on row three. You haven't opened
                it in two months. The hyperfixation ran for eighty-seven days.
                None of that is in the sheet.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-24 sm:py-36">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">join the waitlist</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-2xl text-balance">
              Close the spreadsheet.
              <br />
              <span className="italic text-accent">Start the counter.</span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
              Waitlist is open. First access goes out in waves — early users get
              a permanent Pro discount and the best usernames before they're
              taken.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
