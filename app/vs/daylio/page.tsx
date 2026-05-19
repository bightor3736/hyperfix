import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hyperfix vs. Daylio — mood journals don't track what you're unwell about",
  description:
    "Daylio is a good mood and activity tracker. Hyperfix is for when the activity is a 400,000-word fanfic and the mood is 'unwell.' Here's the difference.",
  alternates: {
    canonical: "https://hyperfix.app/vs/daylio",
  },
  openGraph: {
    images: [
      {
        url: "/api/og?title=Hyperfix+vs.+Daylio&sub=mood+journals+vs.+obsession+tracking+%C2%B7+hyperfix.app&accent=Daylio",
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
      name: "Hyperfix vs. Daylio",
      item: "https://hyperfix.app/vs/daylio",
    },
  ],
};

const comparisonRows = [
  {
    feature: "Mood tracking",
    daylio: "Core feature — five moods, custom activities, daily streak",
    hyperfix: "Not the focus.",
    edge: "daylio",
  },
  {
    feature: "Hyperfixation-specific tracking",
    daylio: "No — it's an activity, not a first-class concept",
    hyperfix: "Yes — that's the whole product",
    edge: "hyperfix",
  },
  {
    feature: "Day counter",
    daylio: "No — logs individual days, not duration of a specific thing",
    hyperfix: "Automatic from the moment you log.",
    edge: "hyperfix",
  },
  {
    feature: "Intensity meter",
    daylio: "Mood rating, not tied to a specific obsession",
    hyperfix: "Live 1–10 scale per fix, updatable in real time",
    edge: "hyperfix",
  },
  {
    feature: "Shareable output",
    daylio: "Stats screenshots, no per-obsession card",
    hyperfix: "Screenshot-ready card for every fix",
    edge: "hyperfix",
  },
  {
    feature: "Eulogy when it ends",
    daylio: "No — the logs just continue past it",
    hyperfix: "Auto-generated when you close the fix",
    edge: "hyperfix",
  },
  {
    feature: "Habit tracking",
    daylio: "Yes — streaks, goals, activity patterns",
    hyperfix: "Not applicable",
    edge: "daylio",
  },
  {
    feature: "Community / social",
    daylio: "None",
    hyperfix: "Profiles, public fixes, friend feeds",
    edge: "hyperfix",
  },
  {
    feature: "Pattern insights over time",
    daylio: "Yes — mood correlations, charts, monthly review",
    hyperfix: "Hyperfix Wrapped — annual obsession summary",
    edge: "both",
  },
  {
    feature: "Understands present-tense obsession",
    daylio: "No — past-tense log by design",
    hyperfix: "Yes — the counter is running right now",
    edge: "hyperfix",
  },
];

export default function DaylioComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Nav />

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">
        <section className="px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">comparison · hyperfix vs daylio</span>
            <h1 className="font-display mb-12 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Daylio tracks your mood.{" "}
              <em className="text-accent not-italic">Hyperfix tracks what's causing it.</em>
            </h1>
            <div className="grid gap-8 md:grid-cols-2">
              <p className="font-sans text-lg leading-relaxed">
                Daylio is a well-designed micro-journal. You log your mood, you pick your activities,
                you build a streak. Over time it shows you patterns — what activities correlate with
                which moods, which days are harder, where your energy goes. For what it's designed to
                do, it does it well.
              </p>
              <p className="font-sans text-lg leading-relaxed">
                But when you're on day 47 of a hyperfixation and you log "unwell" as your mood and
                "reading fanfic" as your activity, Daylio doesn't know what that means. It doesn't
                know that this specific fic is the thing. It doesn't have a counter. It doesn't have
                an intensity meter. It can't write the eulogy when it ends. It just logs the data
                point and moves on.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-24 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">the distinction</span>
            <h2 className="font-display mb-12 text-4xl font-bold leading-tight md:text-5xl">
              A mood journal logs the symptom.{" "}
              <em className="text-accent not-italic">Hyperfix tracks the cause.</em>
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <p className="font-sans text-lg leading-relaxed text-[rgba(244,244,244,0.5)]">
                Daylio's model is: you were here, you felt this, you did these things. It's a record
                of states and activities. The insight is in the aggregate — patterns over weeks and
                months. It works by accumulating data points until trends emerge.
              </p>
              <p className="font-sans text-lg leading-relaxed text-[rgba(244,244,244,0.5)]">
                A hyperfixation isn't a data point. It's an era. Day 47 isn't a mood entry — it's a
                number that means something. The intensity meter isn't a mood rating — it's a live
                reading of something that's still happening. Hyperfix is built for the specificity of
                one thing consuming you, not the aggregate of many things happening.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display mb-12 text-3xl font-bold md:text-4xl">
              What Daylio Does Well
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl p-8">
                <h3 className="font-display mb-4 text-xl font-bold">Mood tracking</h3>
                <p className="font-sans text-base leading-relaxed text-[rgba(244,244,244,0.5)]">
                  Daylio's mood correlation over time is genuinely useful. If you want to understand
                  the relationship between your activities and your emotional state across months,
                  Daylio's charts and patterns are built for that.
                </p>
              </div>
              <div className="rounded-2xl p-8">
                <h3 className="font-display mb-4 text-xl font-bold">The streak</h3>
                <p className="font-sans text-base leading-relaxed text-[rgba(244,244,244,0.5)]">
                  Daylio's daily logging streak is a real behaviour design win. The habit of checking
                  in, logging the day, maintaining the streak — it works for people who respond well
                  to streaks, and many do.
                </p>
              </div>
              <div className="rounded-2xl p-8">
                <h3 className="font-display mb-4 text-xl font-bold">Simplicity</h3>
                <p className="font-sans text-base leading-relaxed text-[rgba(244,244,244,0.5)]">
                  Daylio's logging flow is fast. Tap mood, tap activities, done. For people who want
                  a minimal check-in that doesn't take more than thirty seconds, it's hard to beat.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display mb-12 text-3xl font-bold md:text-4xl">
              Feature comparison
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[rgba(244,244,244,0.07)]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1C1C1E]">
                    <th className="font-sans px-6 py-4 text-left text-sm font-semibold text-[rgba(244,244,244,0.5)]">
                      Feature
                    </th>
                    <th className="font-sans px-6 py-4 text-left text-sm font-semibold text-[rgba(244,244,244,0.5)]">
                      Daylio
                    </th>
                    <th className="font-sans px-6 py-4 text-left text-sm font-semibold text-[rgba(244,244,244,0.5)]">
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
                          row.edge === "daylio" || row.edge === "both"
                            ? "font-semibold text-accent"
                            : "text-[rgba(244,244,244,0.5)]"
                        }`}
                      >
                        {row.daylio}
                      </td>
                      <td
                        className={`font-sans px-6 py-4 text-sm ${
                          row.edge === "hyperfix" || row.edge === "both"
                            ? "font-semibold text-accent"
                            : "text-[rgba(244,244,244,0.5)]"
                        }`}
                      >
                        {row.hyperfix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono mt-6 text-sm text-[rgba(244,244,244,0.4)]">
              Daylio is a good mood journal. Hyperfix is for the specific, consuming, named thing
              that's running your life right now.
            </p>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-24 bg-[#111113] rounded-3xl border border-[rgba(244,244,244,0.07)]">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display mb-8 text-4xl font-bold leading-tight md:text-5xl">
              Your mood was 'good'.
              <br />
              <em className="text-accent not-italic">What you didn't log was why.</em>
            </h2>
            <p className="font-sans max-w-2xl text-lg leading-relaxed text-[rgba(244,244,244,0.5)]">
              Daylio has 847 entries. You've been consistent. The charts show that you're happier on
              weekends and that "reading" correlates with better mood. What the charts don't show is
              that "reading" for eleven weeks was one specific fic. That the mood was good because of
              it. That when it ended, the mood dipped for four days and you didn't know why until you
              realised you'd finished the thing and there wasn't another one. None of that is in
              Daylio. The data is there. The meaning isn't.
            </p>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">join the waitlist</span>
            <h2 className="font-display mb-6 text-4xl font-bold leading-tight md:text-5xl">
              Log the thing.{" "}
              <em className="text-accent not-italic">Not just the mood.</em>
            </h2>
            <p className="font-sans mx-auto mb-12 max-w-xl text-lg leading-relaxed text-[rgba(244,244,244,0.5)]">
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
