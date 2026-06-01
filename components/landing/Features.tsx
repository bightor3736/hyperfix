import { Zap, Check, Sparkles, Flame, Snowflake, Trophy, Dice5, Share2, BrickWall } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: <Dice5 size={20} strokeWidth={2} />,
    title: "Dopamine on tap",
    body: "Bored or understimulated? One tap deals a real dopamine hit matched to your energy and time — move, create, connect, reset, treat. Reroll until one clicks.",
  },
  {
    icon: <BrickWall size={20} strokeWidth={2} />,
    title: "Beat the Wall",
    body: "Can't start? Name the task you're dreading and we shrink it to a 2-minute first step. You get rewarded for starting — because starting is the actual wall.",
  },
  {
    icon: <Zap size={20} strokeWidth={2.5} />,
    title: "XP & 7 levels",
    body: "Every action earns XP. Level up through 7 tiers from Mildly Curious to Clinically Obsessed. The bar always wants to be filled.",
  },
  {
    icon: <Sparkles size={20} strokeWidth={2} />,
    title: "Jackpot rewards",
    body: "Roughly 1 in 8 hits pays out a 3× jackpot. Variable rewards are exactly what your brain chases — so the loop never goes stale.",
  },
  {
    icon: <Check size={20} strokeWidth={2.5} />,
    title: "Daily quests",
    body: "Three small missions a day, each doable in under a minute. Tick them off, earn XP, keep your momentum alive.",
  },
  {
    icon: <Flame size={20} strokeWidth={2} />,
    title: "Forgiving streaks",
    body: "Bad days happen. Streak freezes protect your run automatically. Power-Up gets 5 a month — because ADHD isn't linear.",
  },
  {
    icon: <Trophy size={20} strokeWidth={2} />,
    title: "Weekly leaderboard",
    body: "Compete with others who get it. Weekly resets keep it fair — your rank is based on showing up, not being perfect.",
  },
  {
    icon: <Share2 size={20} strokeWidth={2} />,
    title: "Shareable player card",
    body: "Your level, streak, XP and badges on one card. Built to screenshot and post — the flex is the marketing.",
  },
  {
    icon: <Snowflake size={20} strokeWidth={2} />,
    title: "Built for your brain",
    body: "No blank to-do lists, no guilt, no streak you can shatter in one bad day. Designed for how an ADHD brain actually works.",
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
              <span className="text-ink">Real game mechanics. </span>
              <span className="text-game-gradient">Zero busywork.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-muted">
              Most productivity apps assume you can keep a routine and feel motivated by a blank list.
              We don&apos;t. Every piece here is built to give your brain a reason to come back.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 70}>
              <article
                className="h-full rounded-[var(--radius-lg)] p-5 transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ background: "var(--energy-soft)", color: "var(--energy)" }}
                >
                  {f.icon}
                </div>
                <h3 className="font-display text-[19px] leading-[1.15] tracking-tight text-ink mb-2">{f.title}</h3>
                <p className="text-[13px] leading-[1.65] text-ink-muted">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
