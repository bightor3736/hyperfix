import { Check, Flame, Sparkles, Timer, Users, Snowflake, Trophy, Inbox } from "lucide-react";

const features = [
  {
    icon: <Check size={20} strokeWidth={2} />,
    title: "Daily Quests",
    body: "3 small missions every day — designed to be achievable in under a minute. Tick them off, earn XP, keep your momentum alive.",
  },
  {
    icon: <Timer size={20} strokeWidth={1.5} />,
    title: "Focus Sessions",
    body: "Start a distraction-proof timer. Body-double with others in live Focus Rooms. Get XP for every session you complete.",
  },
  {
    icon: <Flame size={20} strokeWidth={2} />,
    title: "Forgiving Streaks",
    body: "Bad days happen. Streak freezes protect your run automatically. Pro users get 5 freezes a month — because ADHD is not linear.",
  },
  {
    icon: <Sparkles size={20} strokeWidth={1.5} />,
    title: "XP & Levels",
    body: "Every action earns XP. Log a mood, complete a quest, do a focus session — it all counts. Level up through 7 tiers from Mildly Curious to Clinically Obsessed.",
  },
  {
    icon: <Trophy size={20} strokeWidth={1.5} />,
    title: "Leaderboard",
    body: "Compete with others who get it. Weekly resets keep it fair. Your rank is based on actions taken, not perfect consistency.",
  },
  {
    icon: <Inbox size={20} strokeWidth={1.5} />,
    title: "Brain Dump",
    body: "Hit ⌘K anywhere, dump what's in your head, sort it later. Capture the thought before your brain moves on to the next thing.",
  },
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: "Focus Rooms",
    body: "Join a live room and work alongside other ADHD brains. The accountability effect is real — show up, stay present, get things done.",
  },
  {
    icon: <Snowflake size={20} strokeWidth={1.5} />,
    title: "ADHD Toolkit",
    body: "Mood tracking, RSD journal, medication log, pattern analytics. Everything your brain needs, designed for how you actually use apps.",
  },
];

export function Features() {
  return (
    <section id="features" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="max-w-[600px] mb-16">
          <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Everything you need
          </p>
          <h2
            className="font-display leading-[1.05] tracking-tight text-ink"
            style={{ fontSize: "clamp(32px,5vw,48px)" }}
          >
            Designed for the ADHD brain. Not against it.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-ink-muted">
            Most productivity apps assume you can maintain a routine, remember tasks without prompting,
            and feel motivated by a blank todo list. We don&apos;t. Hyperfix works with how your brain actually functions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <div
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-4"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-[20px] leading-[1.1] tracking-tight text-ink mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] leading-[1.65] text-ink-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
