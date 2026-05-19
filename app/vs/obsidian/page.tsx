import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Obsidian — a markdown vault is not a hyperfixation tracker",
  description:
    "You built the Dataview query. You made the properties. You opened it once. Hyperfix is what you actually needed: a tracker that counts the days without you having to maintain it.",
  alternates: {
    canonical: "https://hyperfix.app/vs/obsidian",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/obsidian",
    title: "Hyperfix vs. Obsidian — Hyperfix",
    description:
      "You built the Dataview query. You made the properties. You opened it once. Hyperfix is what you actually needed: a tracker that counts the days without you having to maintain it.",
    images: [
      {
        url: "/api/og?title=Hyperfix+vs.+Obsidian&sub=markdown+vaults+vs.+obsession+tracking+%C2%B7+hyperfix.app&accent=Obsidian",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Obsidian", item: "https://hyperfix.app/vs/obsidian" },
  ],
};

const comparisonRows = [
  {
    feature: "Setup time",
    obsidian: "45–120 min for a usable hyperfixation template",
    hyperfix: "One field. You're done.",
    edge: "hyperfix",
  },
  {
    feature: "Day counter",
    obsidian: "A Dataview formula you write yourself",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity tracking",
    obsidian: "A number property you define and update manually",
    hyperfix: "Built-in 1–10 scale with visual bar",
    edge: "hyperfix",
  },
  {
    feature: "Data ownership",
    obsidian: "Local files, you own everything",
    hyperfix: "Hosted — you trust us with the data",
    edge: "obsidian",
  },
  {
    feature: "Shareable cards",
    obsidian: "Publish plugin, no card format",
    hyperfix: "Screenshot-ready card for every fix",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy / archive",
    obsidian: "Whatever you write before archiving the note",
    hyperfix: "Auto-generated when you close the fix",
    edge: "hyperfix",
  },
  {
    feature: "Long-form notes / essays",
    obsidian: "Excellent — that's what it's built for",
    hyperfix: "Short notes only",
    edge: "obsidian",
  },
  {
    feature: "Community / social layer",
    obsidian: "None — it's local",
    hyperfix: "Profiles, public fixes, friend feeds",
    edge: "hyperfix",
  },
  {
    feature: "Maintenance burden",
    obsidian: "High — you own the schema",
    hyperfix: "Zero — it just runs",
    edge: "hyperfix",
  },
  {
    feature: "Understands hyperfixation as an experience",
    obsidian: "It does not — it's a blank canvas",
    hyperfix: "It does — that's the whole product",
    edge: "hyperfix",
  },
];

export default function VsObsidianPage() {
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
              comparison · hyperfix vs obsidian
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              You built the vault.
              <br />
              <span className="italic text-accent">You opened it twice.</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Obsidian is extraordinary software. If you want a second brain —
                interconnected notes, local-first storage, a PKM system you
                actually own — it's one of the best tools available. The plugin
                ecosystem alone has people running their entire lives out of it.
              </p>
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                But the Obsidian hyperfixation template you found at midnight,
                the one with the Dataview query that counts days since the start
                date and the rating property you had to configure manually — you
                spent ninety minutes on it. You used it for four days. Then the
                fix ended and you archived the note and you've never looked at
                it again.
              </p>
            </div>
          </div>
        </section>

        {/* DISTINCTION */}
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">
              the distinction
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 max-w-3xl text-balance">
              A vault stores your obsession.{" "}
              <span className="italic text-accent">Hyperfix holds it.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Obsidian is a tool you build. That's both its power and its
                cost. Every tracker, every database, every Dataview query — you
                built it. You maintain it. When the schema breaks or the date
                formula stops working, that's on you, at whatever hour the fix
                arrived.
              </p>
              <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug">
                Hyperfix is opinionated by design. The day counter is automatic.
                The intensity meter is built in. The eulogy writes itself when
                you close the fix. You don't configure it. You don't maintain
                it. You log the thing and it counts.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT OBSIDIAN DOES WELL */}
        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tightest mb-10 text-balance">
              What Obsidian{" "}
              <span className="italic text-accent">actually does well</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "Local-first ownership",
                  p: "Your data lives on your machine. No subscription, no servers, no company going under. If data ownership matters to you, Obsidian is genuinely difficult to beat.",
                },
                {
                  h: "The plugin ecosystem",
                  p: "Dataview, Templater, Kanban, the entire community plugin library. If you have a specific, idiosyncratic way you want to track something, there's probably a plugin for it.",
                },
                {
                  h: "Long-form thinking",
                  p: "Obsidian is exceptional for notes that grow over time — interconnected thoughts, research, backlinks, graph view. If you want to write 6,000 words about the internal logic of a character arc, Obsidian holds that better than Hyperfix ever will.",
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
                      Obsidian
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
                          row.edge === "obsidian"
                            ? "text-ink font-medium"
                            : "text-[rgba(244,244,244,0.4)]"
                        }`}
                      >
                        {row.edge === "obsidian" && (
                          <span className="text-ink mr-1">✓</span>
                        )}
                        {row.obsidian}
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
              Obsidian wins on ownership and flexibility. Hyperfix wins on
              knowing what you actually came here for.
            </p>
          </div>
        </section>

        {/* ANGLE */}
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[#111113]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-balance">
              A blank canvas doesn't know what you're building.
              <br />
              <span className="italic text-accent">Hyperfix does.</span>
            </h2>
            <p className="mt-10 font-sans text-lg text-[rgba(244,244,244,0.5)] leading-snug max-w-3xl">
              The Obsidian vault you built for hyperfixation tracking is still
              there. The Dataview table with the broken "days active" formula.
              The four properties you defined at midnight. The three notes you
              made before the fix ended and you stopped updating it. Hyperfix
              doesn't need any of that. Log the thing. The rest runs itself.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 sm:px-10 py-24 sm:py-36">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">join the waitlist</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-2xl text-balance">
              Keep the vault for thinking.
              <br />
              <span className="italic text-accent">Use Hyperfix for the crisis.</span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
              Waitlist is open. First access goes out in waves — early users get
              a permanent Pro discount and the best usernames.
            </p>
            <WaitlistForm id="waitlist" variant="light" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
