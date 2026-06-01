import { Zap, Sparkles, Flame, Snowflake, Dice5, Share2, BrickWall, BookOpen, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: <BookOpen size={20} strokeWidth={2} />,
    title: "Hyperfixation log",
    body: "Finally a home for the obsessions. Log what you're deep in, rate your intensity, check in daily, and archive when it fades. Each entry earns XP.",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={2} />,
    title: "Proof of action",
    body: "No more clicking a box and lying to yourself. Run the timer or write what you actually did. XP only drops when you've shown your receipt.",
  },
  {
    icon: <Dice5 size={20} strokeWidth={2} />,
    title: "Dopamine menu",
    body: "Bored or understimulated? One tap deals a real dopamine hit matched to your energy — move, create, connect, reset. Reroll until one clicks.",
  },
  {
    icon: <BrickWall size={20} strokeWidth={2} />,
    title: "Beat the Wall",
    body: "Can't start? Name the task you're dreading and we shrink it to a 2-minute first step. You get rewarded for starting — the starting is the whole battle.",
  },
  {
    icon: <Zap size={20} strokeWidth={2.5} />,
    title: "XP & 7 levels",
    body: "Every real action earns XP. Level up through 7 tiers from Mildly Curious to Clinically Obsessed. The bar always wants to be filled.",
  },
  {
    icon: <Sparkles size={20} strokeWidth={2} />,
    title: "Jackpot rewards",
    body: "Roughly 1 in 8 hits pays out a 3× jackpot. Variable rewards are exactly what your brain chases — so the loop never goes stale.",
  },
  {
    icon: <Flame size={20} strokeWidth={2} />,
    title: "Forgiving streaks",
    body: "Bad days happen. Streak freezes protect your run automatically. Power-Up gets 5 a month — because ADHD isn't linear.",
  },
  {
    icon: <Share2 size={20} strokeWidth={2} />,
    title: "Shareable stats card",
    body: "Your level, streak, XP and badges on one card. Built to screenshot and share — your progress, not a ranking.",
  },
  {
    icon: <Snowflake size={20} strokeWidth={2} />,
    title: "Built for your brain",
    body: "No blank lists. No guilt. No streak you shatter in one bad week. Designed for executive function struggles, not neurotypical defaults.",
  },
];

export function Features() {
  return (
    <section id="features" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="max-w-[620px] mb-14">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--energy)" }}>
              Everything you get
            </p>
            <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
              <span className="text-ink">Executive function&apos;s </span>
              <span className="text-game-gradient">favorite toolkit.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-muted">
              Most apps assume you can keep a routine and feel motivated by a blank list.
              Hyperfix is built around how your brain actually works — variable rewards, low-friction starts, real accountability.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const pastels = [
              "var(--pastel-purple)", "var(--pastel-green)", "var(--pastel-pink)", "var(--pastel-blue)",
              "var(--pastel-orange)", "var(--pastel-yellow)", "var(--pastel-blue)", "var(--pastel-pink)", "var(--pastel-green)",
            ];
            return (
              <Reveal key={f.title} delay={(i % 4) * 70}>
                <article
                  className="motion-card h-full rounded-[var(--radius-lg)] p-5"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
                >
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                    style={{ background: pastels[i % pastels.length], color: "var(--ink)" }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-display text-[19px] leading-[1.15] tracking-tight text-ink mb-2">{f.title}</h3>
                  <p className="text-[13px] leading-[1.65] text-ink-muted">{f.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
