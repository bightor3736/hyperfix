import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Discord — a server is not a personal record",
  description:
    "Discord is where you perform your hyperfixation for others. Hyperfix is where you keep it. One is a stage. The other is the archive Discord is too chaotic to be.",
  alternates: {
    canonical: "https://hyperfix.app/vs/discord",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/discord",
    title: "Hyperfix vs. Discord — Hyperfix",
    description:
      "Discord is where you perform your hyperfixation for others. Hyperfix is where you keep it. One is a stage. The other is the archive Discord is too chaotic to be.",
    images: [
      {
        url: "/api/og?title=Hyperfix+vs.+Discord&sub=performance+vs.+personal+record+%C2%B7+hyperfix.app&accent=Discord",
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
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Discord", item: "https://hyperfix.app/vs/discord" },
  ],
};

const comparisonRows = [
  {
    feature: "What it tracks",
    discord: "Chat history — messages you sent, channels you joined",
    hyperfix: "The fixation itself — intensity, day count, notes, eulogy",
    edge: "hyperfix",
  },
  {
    feature: "Personal record",
    discord: "None — it's a group chat platform",
    hyperfix: "Private log of every fix, start to close",
    edge: "hyperfix",
  },
  {
    feature: "Day counter",
    discord: "The date on your first message in a server, if you scroll far enough",
    hyperfix: "Automatic from the moment you log the fix",
    edge: "hyperfix",
  },
  {
    feature: "Intensity tracking",
    discord: "None",
    hyperfix: "Built-in 1–10 scale with a visual bar",
    edge: "hyperfix",
  },
  {
    feature: "Community / social layer",
    discord: "Exceptional — that's the whole product",
    hyperfix: "Profiles, public fixes, friend feeds",
    edge: "discord",
  },
  {
    feature: "History fragmentation",
    discord: "Scattered across servers, channels, DMs — impossible to reconstruct",
    hyperfix: "One place. Chronological. Always accessible.",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy / archive",
    discord: "Whatever you wrote before drifting out of the server",
    hyperfix: "Auto-generated when you close the fix",
    edge: "hyperfix",
  },
  {
    feature: "Voice chat / calls",
    discord: "Best-in-class for the fanbase call at 1am",
    hyperfix: "Not a communication tool",
    edge: "discord",
  },
  {
    feature: "Shareable card",
    discord: "None",
    hyperfix: "Screenshot-ready card for every fix",
    edge: "hyperfix",
  },
  {
    feature: "Survives the end of the fixation",
    discord: "Your history is still technically there — scattered, unnavigable, in a server you've muted",
    hyperfix: "Clean, closed, eulogized. The era is preserved.",
    edge: "hyperfix",
  },
];

const faqs = [
  {
    q: "Can I use Hyperfix alongside Discord?",
    a: "Yes — they do completely different things. Discord is where you find your people during the fixation. Hyperfix is where you keep the record. Use both. Just don't expect Discord to remember the arc for you.",
  },
  {
    q: "I already have a server dedicated to this fixation. Isn't that enough?",
    a: "The server holds the conversations you had with other people. Hyperfix holds the fixation itself — when it started, how intense it got, what it felt like at day 30 versus day 5, what you were doing when it ended. Those are different things. The server is the stage. Hyperfix is the diary.",
  },
  {
    q: "What happens to the Discord evidence when a fixation ends?",
    a: "It scatters. It's in three servers, twelve channels, a DM thread from someone you haven't talked to since. You can scroll back to find it — technically. You won't. Hyperfix closes with a eulogy and lives in your history, permanent and findable, the way the Discord record never will be.",
  },
  {
    q: "My fixations are very social — they're about finding a community. Does Hyperfix help with that?",
    a: "Hyperfix has public fix profiles and a friend feed — you can see what other people are currently in. That said, Discord wins on real-time community. Use Discord for the group. Use Hyperfix for the part of the fixation that's yours alone.",
  },
  {
    q: "Is Hyperfix private?",
    a: "By default, yes. Fixes are private unless you choose to make them public. The day counter, the intensity, the eulogy — all of it is yours. Discord is inherently social. Hyperfix doesn't have to be.",
  },
  {
    q: "What if the fixation is specifically about a fandom that lives on Discord?",
    a: "Log it in Hyperfix the moment the server takes over your brain. Track the intensity as the fixation peaks and fades. When you eventually leave the server or stop checking it, close the fix. The arc is preserved. The server history will fragment. The Hyperfix record won't.",
  },
];

export default function VsDiscordPage() {
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
              comparison · hyperfix vs discord
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-tight text-white">
              Discord is where you perform it.
              <br />
              <span className="text-[#5EEAD4]">Hyperfix is where you keep it.</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Discord is where the fixation goes public — the server you
                joined at 2am, the channel you have on notify-all for one
                specific show, the thread where you and three strangers
                collectively lost your minds over the same scene. For that,
                Discord is genuinely unmatched.
              </p>
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                But Discord doesn't track the fixation. It doesn't count the
                days. It doesn't know the intensity peaked at a 9 in week two
                and is now at a 6. When the fixation ends, the evidence is
                scattered across a hundred message threads and three different
                servers and one DM conversation from someone you've never spoken
                to since. Hyperfix is the record Discord is too chaotic to be.
              </p>
            </div>
          </div>
        </section>

        {/* DISTINCTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>
              the distinction
            </span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-10 max-w-3xl">
              A server is a stage.{" "}
              <span className="text-[#5EEAD4]">Hyperfix is the archive.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Discord captures the social performance of a hyperfixation —
                the takes you posted, the theories you shared, the moments when
                seven people in a channel simultaneously lost it. That's real
                and it matters. But it's not a record of the fixation. It's a
                record of the conversations you had while you were in it.
              </p>
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Hyperfix tracks the internal experience: when it started, how
                hard it hit, how long it held. The day counter runs without you.
                The intensity is yours to log, not perform. When the fix ends,
                Hyperfix generates the eulogy. The era exists. Discord history
                doesn't survive the way memory does.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT DISCORD DOES WELL */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-10">
              What Discord{" "}
              <span className="text-[#5EEAD4]">actually does well</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "Real-time community",
                  p: "There is no better tool for finding the people who are currently in the same fixation you are. The servers, the channels, the instant access to other people who are also absolutely not okay about this — Discord built that.",
                },
                {
                  h: "Voice and video",
                  p: "The 1am call with five people watching the same episode simultaneously, the lore analysis stream, the watch party that ran until 4am — Discord handles all of it. Hyperfix is not a communication tool.",
                },
                {
                  h: "Role-based organization",
                  p: "Big servers run themselves through roles, bots, and structured channels. If you're running a fandom server or a community around a fixation, Discord's tools for that are genuinely sophisticated.",
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

        {/* COMPARISON TABLE */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>side by side</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-12">
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
                      Discord
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
                          row.edge === "discord"
                            ? "text-white font-medium"
                            : "text-[rgba(255,255,255,0.55)]"
                        }`}
                      >
                        {row.edge === "discord" && (
                          <span className="text-white mr-1">✓</span>
                        )}
                        {row.discord}
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
              Discord wins on community. Hyperfix wins on keeping the record Discord scatters.
            </p>
          </div>
        </section>

        {/* ANGLE */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              The server goes quiet eventually.
              <br />
              <span className="text-[#5EEAD4]">The era doesn't have to.</span>
            </h2>
            <p className="mt-10 font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug max-w-3xl">
              You've been in servers that used to be everything. The channel
              that was on notify-all. The thread that ran for days. Now it's
              quiet and you've muted the server and the fixation is over and
              there's no record of what that period of your life felt like from
              the inside. Hyperfix is the record Discord was never built to be.
              Log the fix when it starts. Let it count the days. Close it when
              it's done. The era survives.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>faq</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-12">
              Questions
            </h2>
            <div className="divide-y divide-[rgba(255,255,255,0.06)]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-display text-lg tracking-tight text-white">
                    <span className="text-balance">{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-[rgba(255,255,255,0.55)] text-base shrink-0 group-open:rotate-45 transition-transform"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 font-sans text-base text-[rgba(255,255,255,0.65)] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>join the waitlist</span>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tight max-w-2xl">
              Keep Discord for the community.
              <br />
              <span className="text-[#5EEAD4]">Use Hyperfix for the record.</span>
            </h2>
            <p className="mt-6 font-sans text-lg text-[rgba(255,255,255,0.65)] max-w-xl leading-snug">
              Waitlist is open. First access goes out in waves — early users get
              a permanent Pro discount and the best usernames.
            </p>
            <WaitlistForm id="waitlist" variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
