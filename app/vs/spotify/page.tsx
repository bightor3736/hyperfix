import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Spotify — play count is not obsession tracking",
  description:
    "Spotify knows you played it 200 times. It doesn't know that you've had the bridge on loop for three weeks because it emotionally destroyed you. Hyperfix tracks the why.",
  alternates: {
    canonical: "https://hyperfix.app/vs/spotify",
  },
  openGraph: {
    url: "https://hyperfix.app/vs/spotify",
    title: "Hyperfix vs. Spotify — Hyperfix",
    description:
      "Spotify knows you played it 200 times. It doesn't know that you've had the bridge on loop for three weeks because it emotionally destroyed you. Hyperfix tracks the why.",
    images: [
      {
        url: "/api/og?title=Hyperfix+vs.+Spotify&sub=play+count+vs.+obsession+tracking+%C2%B7+hyperfix.app&accent=Spotify",
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
    { "@type": "ListItem", position: 2, name: "Hyperfix vs. Spotify", item: "https://hyperfix.app/vs/spotify" },
  ],
};

const comparisonRows = [
  {
    feature: "What it tracks",
    spotify: "Plays, skips, saves, listening time",
    hyperfix: "The fixation itself — intensity, days active, notes, eulogy",
    edge: "hyperfix",
  },
  {
    feature: "Day counter",
    spotify: "None. Wrapped is annual.",
    hyperfix: "Automatic from the moment you log the fix",
    edge: "hyperfix",
  },
  {
    feature: "Intensity tracking",
    spotify: "Play count as a rough proxy — not the same thing",
    hyperfix: "Built-in 1–10 scale with a visual bar",
    edge: "hyperfix",
  },
  {
    feature: "Music discovery",
    spotify: "Excellent — that's the whole product",
    hyperfix: "Not a streaming service",
    edge: "spotify",
  },
  {
    feature: "Notes / context",
    spotify: "None",
    hyperfix: "You can log what the song did to you and when",
    edge: "hyperfix",
  },
  {
    feature: "Wrapped / retrospective",
    spotify: "Once a year, limited to top 5",
    hyperfix: "Every fix gets a eulogy when it closes; full history always accessible",
    edge: "hyperfix",
  },
  {
    feature: "Non-music fixations",
    spotify: "Podcasts only — no shows, games, books, fandoms",
    hyperfix: "Anything you can name",
    edge: "hyperfix",
  },
  {
    feature: "Shareable card",
    spotify: "Wrapped card once a year",
    hyperfix: "Screenshot-ready card for every single fix",
    edge: "hyperfix",
  },
  {
    feature: "Knows what the song did to you",
    spotify: "It does not",
    hyperfix: "That's the whole point",
    edge: "hyperfix",
  },
];

const faqs = [
  {
    q: "Can I use Hyperfix alongside Spotify?",
    a: "Yes — they do completely different things. Keep Spotify for streaming. Use Hyperfix when a song enters a level of emotional occupation that play count can't describe. Log the fix. Note the era. Let the day counter run.",
  },
  {
    q: "What if my fixation is specifically about music — like a whole artist or album?",
    a: "That's exactly what Hyperfix is for. The fixation isn't the play count, it's the period of your life where this music was running in the background of everything. Hyperfix tracks that arc — start to end, with intensity and notes.",
  },
  {
    q: "Spotify Wrapped tells me my top songs. Isn't that enough?",
    a: "Wrapped tells you what you listened to most. It doesn't tell you that you had one specific song on repeat for 47 days starting the night something happened. It doesn't distinguish between background listening and the kind that meant something. Hyperfix is for the second category.",
  },
  {
    q: "Does Hyperfix connect to Spotify to pull listening data?",
    a: "No. Hyperfix is intentional — you log the fixation yourself. The act of naming it is part of the point. Automatic import would miss everything that matters: the intensity, the era, what you were doing when it started.",
  },
  {
    q: "What happens when the fixation ends?",
    a: "You close the fix. Hyperfix auto-generates a eulogy: days active, peak intensity, your notes, the arc. It becomes part of your permanent record — the kind of record Spotify will never build for you.",
  },
];

export default function VsSpotifyPage() {
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
              comparison · hyperfix vs spotify
            </span>
            <h1 className="font-display font-medium text-[2.8rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.92] tracking-tight text-white text-balance">
              Spotify knows the play count.
              <br />
              <span className="text-[#5EEAD4]">It doesn't know what it did to you.</span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Spotify is exceptional at what it does. The recommendations are
                genuinely good. Discover Weekly has ruined people's lives in the
                best possible way. If you need to listen to music, Spotify is
                one of the best ways to do it.
              </p>
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                But you've been listening to the same bridge for three weeks
                because it emotionally destroyed you, and Spotify logged that as
                200 plays. It doesn't know you discovered this song during a
                specific era of your life. It doesn't know the hyperfixation
                around it lasted 47 days. Wrapped will tell you it was your top
                song. Hyperfix tells you why it had you.
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
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-10 max-w-3xl text-balance">
              A play count measures access.{" "}
              <span className="text-[#5EEAD4]">Hyperfix measures the hold it has on you.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Spotify knows what you streamed. It knows how many times and for
                how long. It knows you skipped the intro and replayed the bridge.
                None of that is the same as knowing the song is currently
                occupying your entire brain at a 9 out of 10 intensity and has
                been for three weeks straight.
              </p>
              <p className="font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug">
                Hyperfix tracks the fixation — not the stream. You log it when
                it starts. You note the intensity. You watch the day counter run.
                When it ends, the eulogy writes itself. The record exists. Spotify
                Wrapped will never give you that.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT SPOTIFY DOES WELL */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>honest assessment</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-10 text-balance">
              What Spotify{" "}
              <span className="text-[#5EEAD4]">actually does well</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              {[
                {
                  h: "The catalog",
                  p: "Nearly everything ever recorded is on it. If you want to listen to something — anything — the answer is almost always yes. That's not a small thing.",
                },
                {
                  h: "Discovery",
                  p: "Discover Weekly, Radio, the recommendation engine — Spotify is genuinely good at surfacing what you didn't know you needed. It's how a lot of fixations start.",
                },
                {
                  h: "Wrapped",
                  p: "Once a year you get a snapshot of your listening. It's fun. It's shareable. It's completely inadequate for understanding what those songs actually meant to you — but it's something.",
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
                      Spotify
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
                          row.edge === "spotify"
                            ? "text-white font-medium"
                            : "text-[rgba(255,255,255,0.55)]"
                        }`}
                      >
                        {row.edge === "spotify" && (
                          <span className="text-white mr-1">✓</span>
                        )}
                        {row.spotify}
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
              Spotify wins on music. Hyperfix wins on knowing what the music did to you.
            </p>
          </div>
        </section>

        {/* ANGLE */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
              Wrapped gives you a number.
              <br />
              <span className="text-[#5EEAD4]">Hyperfix gives you the era.</span>
            </h2>
            <p className="mt-10 font-sans text-lg text-[rgba(255,255,255,0.65)] leading-snug max-w-3xl">
              You know which songs were running the background of a specific
              period of your life. You know what you were going through when you
              found them and how long they stayed. Spotify logged the plays.
              Hyperfix holds the arc — start date, day count, intensity at peak,
              the note you wrote at 2am, the eulogy when it finally let you go.
              That's the record. No streaming service was ever going to build it
              for you.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-8" style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}>faq</span>
            <h2 className="font-display text-4xl sm:text-5xl leading-[0.98] tracking-tight mb-12 text-balance">
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
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tight max-w-2xl text-balance">
              Keep Spotify for the stream.
              <br />
              <span className="text-[#5EEAD4]">Use Hyperfix for the hold.</span>
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
