import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "ADHD Hyperfixation Tracker — hyperfix",
  description:
    "The only app built for how ADHD brains actually work. Track your hyperfixations, archive the ones that fade, see your pattern. No streaks. No shame.",
  openGraph: {
    title: "ADHD Hyperfixation Tracker — hyperfix",
    description:
      "Track your obsessions, archive the ones that fade, understand your pattern. Built for ADHD brains. Free.",
    url: "https://hyperfix.app/adhd",
  },
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

const PAIN_POINTS = [
  {
    emoji: "🔁",
    title: "You get obsessed with something for 3 weeks",
    sub: "Learn everything. Buy the gear. Tell everyone. Feel electric.",
  },
  {
    emoji: "💀",
    title: "Then one day you just... don't",
    sub: "No warning. The interest is gone. The supplies sit there judging you.",
  },
  {
    emoji: "😬",
    title: "The guilt is the worst part",
    sub: "\"Why can't I stick to anything?\" You can. Your brain just cycles. That's not a flaw.",
  },
];

const FEATURES = [
  {
    icon: "📍",
    title: "Log what's taken over your brain",
    desc: "Name it, rate how deep you are (1–10), track the exact day count. No setup, no system to maintain.",
  },
  {
    icon: "🪦",
    title: "The Graveyard — not a failure, a museum",
    desc: "When a fixation fades, it goes to the Graveyard. All the things you loved, preserved. Because they mattered.",
  },
  {
    icon: "📊",
    title: "See your actual pattern",
    desc: "How long do your fixations usually last? What categories come back? Your data answers questions your brain can't.",
  },
  {
    icon: "🚫",
    title: "No streaks. No shame.",
    desc: "Streaks punish ADHD brains. Here, missing days is neutral. Come back when you come back. Welcome back energy, always.",
  },
  {
    icon: "⚡",
    title: "Zero friction",
    desc: "One tap to check in. No onboarding cliff, no system to set up, no 47-step tutorial. Works immediately.",
  },
  {
    icon: "🔓",
    title: "Free. Always.",
    desc: "Tracking and the Graveyard are free. Share your fixation as a card. No paywall before you get value.",
  },
];

const QUOTES = [
  {
    text: "\"Is there an app that just lets me log what I'm obsessed with right now without making it a whole system\"",
    source: "r/ADHD",
  },
  {
    text: "\"I need something that doesn't shame me when I abandon a hobby\"",
    source: "r/adhdwomen",
  },
  {
    text: "\"Does anything exist for tracking how long hyperfixations last? I feel like mine are getting shorter\"",
    source: "r/ADHDers",
  },
  {
    text: "\"I want to look back at all my old fixations like a museum\"",
    source: "r/ADHD",
  },
];

const FAQ = [
  {
    q: "Is this actually for ADHD brains or just rebranded?",
    a: "Built because of the exact ADHD frustration described above. No streaks — we call them runs and missing one doesn't reset anything. No shame messages. No system to maintain. One-tap check-ins. The Graveyard exists because losing interest is part of the cycle, not a failure.",
  },
  {
    q: "What's the difference between hyperfixation and hyperfocus?",
    a: "Hyperfixation is the obsessive interest in a topic — can last days, weeks, or months. Hyperfocus is the tunnel-vision concentration state. Both are ADHD traits. Hyperfix tracks fixations (the interests), not the focus sessions.",
  },
  {
    q: "Will I actually stick with this app?",
    a: "Honestly, maybe not forever — and that's fine. The Graveyard captures everything even if you drift. When you come back, your history is there. No guilt, no catch-up required.",
  },
  {
    q: "Is the Graveyard really free?",
    a: "Yes. Logging fixations, archiving them to the Graveyard, and sharing cards are all free. Always.",
  },
];

export default async function ADHDPage() {
  const supabase = await createClient();
  const { data: countData } = await supabase
    .from("fixes")
    .select("id", { count: "exact", head: true });
  const fixCount = (countData as unknown as { count: number } | null)?.count ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#070708", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-8 py-4 border-b" style={{ background: "rgba(7,7,8,0.85)", backdropFilter: "blur(12px)", borderColor: CARD_BORDER }}>
        <Link href="/" className="font-mono font-bold text-lg tracking-tight">
          <span style={{ color: TEAL }}>hyper</span>
          <span style={{ color: "#F4F4F4" }}>fix</span>
        </Link>
        <Link
          href="/auth/signup"
          className="font-sans text-sm font-semibold px-4 py-2 rounded-full transition-all hover:opacity-90 active:scale-95"
          style={{ background: TEAL, color: "#0A1F1C" }}
        >
          Start free
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-20 pb-16 max-w-3xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 font-mono text-xs rounded-full px-3 py-1.5 mb-8"
          style={{ background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)", color: TEAL }}
        >
          built for adhd brains
        </div>

        <h1
          className="font-display font-semibold mb-6 leading-tight"
          style={{ fontSize: "clamp(36px, 8vw, 68px)", letterSpacing: "-0.03em" }}
        >
          your brain cycles through obsessions.{" "}
          <span style={{ color: TEAL }}>that&apos;s not a flaw.</span>
        </h1>

        <p className="font-sans text-lg sm:text-xl mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
          hyperfix tracks your hyperfixations, archives the ones that fade, and shows you your actual pattern over time. no streaks. no shame. no system to maintain.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signup"
            className="font-sans font-semibold px-8 py-3.5 rounded-full text-base transition-all hover:opacity-90 active:scale-95"
            style={{ background: TEAL, color: "#0A1F1C", boxShadow: "0 0 32px rgba(94,234,212,0.25)" }}
          >
            Start tracking — it&apos;s free
          </Link>
          <Link
            href="/explore"
            className="font-sans font-semibold px-8 py-3.5 rounded-full text-base transition-all hover:opacity-80"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, color: "rgba(255,255,255,0.7)" }}
          >
            See what others track
          </Link>
        </div>

        {fixCount > 100 && (
          <p className="mt-6 font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fixCount.toLocaleString()}+ fixations tracked so far
          </p>
        )}
      </section>

      {/* The cycle */}
      <section className="px-5 sm:px-8 py-16 max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          the cycle you know too well
        </p>
        <div className="flex flex-col gap-4">
          {PAIN_POINTS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-5 rounded-3xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <span style={{ fontSize: 32, flexShrink: 0 }}>{p.emoji}</span>
              <div>
                <p className="font-display font-semibold text-lg mb-1" style={{ letterSpacing: "-0.01em" }}>{p.title}</p>
                <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <p
          className="mt-8 font-display font-semibold text-center"
          style={{ fontSize: "clamp(20px, 4vw, 28px)", letterSpacing: "-0.02em", color: TEAL }}
        >
          hyperfix is built for this exact cycle.
        </p>
      </section>

      {/* Features */}
      <section className="px-5 sm:px-8 py-16 max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          what&apos;s different
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="rounded-3xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{f.icon}</span>
              <p className="font-display font-semibold text-base mb-2" style={{ letterSpacing: "-0.01em" }}>{f.title}</p>
              <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real quotes from community */}
      <section className="px-5 sm:px-8 py-16 max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          what the adhd community actually asked for
        </p>
        <div className="flex flex-col gap-4">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="rounded-3xl p-6"
              style={{ background: "rgba(94,234,212,0.03)", border: "1px solid rgba(94,234,212,0.12)" }}
            >
              <p className="font-display text-base sm:text-lg mb-3" style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                {q.text}
              </p>
              <p className="font-mono text-xs" style={{ color: "rgba(94,234,212,0.5)" }}>{q.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 sm:px-8 py-16 max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          questions
        </p>
        <div className="flex flex-col gap-4">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl p-6"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <p className="font-display font-semibold text-base mb-3" style={{ letterSpacing: "-0.01em" }}>{item.q}</p>
              <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 py-20 max-w-xl mx-auto text-center">
        <h2
          className="font-display font-semibold mb-4"
          style={{ fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "-0.03em" }}
        >
          your pattern isn&apos;t random.
          <br />
          <span style={{ color: TEAL }}>it&apos;s yours.</span>
        </h2>
        <p className="font-sans mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          start logging today. when it fades, it goes to the graveyard — not the trash. come back whenever.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex font-sans font-semibold px-10 py-4 rounded-full text-base transition-all hover:opacity-90 active:scale-95"
          style={{ background: TEAL, color: "#0A1F1C", boxShadow: "0 0 40px rgba(94,234,212,0.3)" }}
        >
          Start free — no streak required
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-8 py-8 text-center border-t" style={{ borderColor: CARD_BORDER }}>
        <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          <Link href="/" className="hover:text-[#5EEAD4] transition-colors">hyperfix.app</Link>
          {" · "}
          <Link href="/explore" className="hover:text-[#5EEAD4] transition-colors">explore</Link>
          {" · "}
          <Link href="/blog" className="hover:text-[#5EEAD4] transition-colors">blog</Link>
        </p>
      </footer>
    </div>
  );
}
