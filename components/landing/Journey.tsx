"use client";

import { useState } from "react";
import { Dice5, Zap, Trophy, Flame, Clock, Footprints, RefreshCw, Check, Crown } from "lucide-react";
import { StreakBadge } from "@/components/ui/streak-badge";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    icon: Dice5,
    title: "Roll the dice",
    body: "Bored or stuck? One tap deals you a real dopamine hit matched to your energy. Don't like it? Reroll. No thinking required.",
    preview: <RollPreview />,
  },
  {
    n: "02",
    icon: Zap,
    title: "Collect XP",
    body: "Every hit pays out XP — and roughly 1 in 8 hits a jackpot for 3×. Watch the bar fill and level up through 7 tiers.",
    preview: <XpPreview />,
  },
  {
    n: "03",
    icon: Trophy,
    title: "Climb the leaderboard",
    body: "Stack up against others who get it. Weekly resets keep it fair — your rank is based on showing up, not being perfect.",
    preview: <LeaderboardPreview />,
  },
  {
    n: "04",
    icon: Flame,
    title: "Build your streak",
    body: "Every day you play, your streak grows. Miss a day? Freezes protect your run automatically — because ADHD isn't linear.",
    preview: <StreakPreview />,
  },
];

export function Journey() {
  return (
    <section id="how" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="max-w-[640px]">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--energy)" }}>
              How the game works
            </p>
            <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(34px,5.5vw,56px)" }}>
              <span className="text-ink">Four steps. </span>
              <span className="text-game-gradient">One loop you actually want to play.</span>
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-16">
          {/* vertical spine */}
          <div
            aria-hidden
            className="absolute left-[27px] top-4 bottom-4 w-px hidden sm:block"
            style={{ background: "var(--line-strong)" }}
          />

          <div className="flex flex-col gap-12 sm:gap-16">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-[56px_1fr] sm:gap-8 lg:grid-cols-[56px_1fr_1fr] lg:items-center">
                    {/* node */}
                    <div className="relative z-10 flex sm:justify-center">
                      <span
                        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ background: "var(--bg-elevated)", border: `1px solid var(--line)`, color: "var(--energy)" }}
                      >
                        <Icon size={24} strokeWidth={2} />
                      </span>
                    </div>

                    {/* copy */}
                    <div>
                      <p className="font-mono text-[12px] tracking-widest mb-2 text-ink-faint">
                        {s.n}
                      </p>
                      <h3 className="font-display text-ink leading-tight" style={{ fontSize: "clamp(24px,3.2vw,32px)" }}>
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-[440px] text-[15px] leading-[1.6] text-ink-muted">{s.body}</p>
                    </div>

                    {/* live preview */}
                    <div className="lg:pl-4">{s.preview}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── previews ───────── */

function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[var(--radius-xl)] p-5"
      style={{
        background: "radial-gradient(120% 120% at 0% 0%, var(--energy-soft) 0%, var(--bg-elevated) 60%)",
        border: "1px solid var(--line)",
      }}
    >
      {children}
    </div>
  );
}

function RollPreview() {
  const HITS = [
    { label: "Do 10 wall push-ups. Go.", min: 2, xp: 8 },
    { label: "Step outside for real daylight.", min: 2, xp: 8 },
    { label: "Reset one surface. Just one.", min: 8, xp: 12 },
  ];
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const hit = HITS[i];

  return (
    <PreviewShell>
      <div
        className="rounded-[var(--radius-lg)] p-4 mb-3 anim-pop"
        style={{ background: done ? "var(--accent-soft)" : "var(--bg)", border: `1px solid ${done ? "var(--energy)" : "var(--line)"}` }}
        key={`${i}-${done}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-ink-muted"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <Footprints size={11} strokeWidth={2} /> Move
          </span>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-faint">
              <Clock size={11} strokeWidth={1.5} /> {hit.min} min
            </span>
            <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: "var(--xp)" }}>
              +{hit.xp} XP
            </span>
          </div>
        </div>
        <p className="font-display text-[19px] leading-snug text-ink">{hit.label}</p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setDone(true)}
          className="press-pop flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold"
          style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
        >
          <Check size={16} strokeWidth={2.5} /> I did it
        </button>
        <button
          onClick={() => { setDone(false); setI((p) => (p + 1) % HITS.length); }}
          className="press-pop inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] font-sans text-[13px] font-medium"
          style={{ background: "var(--bg-elevated)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
        >
          <RefreshCw size={14} strokeWidth={1.5} /> Reroll
        </button>
      </div>
    </PreviewShell>
  );
}

function XpPreview() {
  return (
    <PreviewShell>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "var(--xp-soft)", color: "var(--xp)" }}>
            <Zap size={15} strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-display text-[18px] text-ink">Level 4 · Hooked</span>
        </div>
        <span className="font-mono text-[12px] tabular-nums" style={{ color: "var(--xp)" }}>520 XP</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
        <div
          className="h-full rounded-full anim-shimmer"
          style={{ width: "62%", background: "linear-gradient(90deg, var(--ink-faint), var(--ink))" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-ink-faint">
        <span>400</span>
        <span>next: Unwell · 900</span>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full anim-pulseGlow" style={{ background: "var(--xp-soft)", color: "var(--xp)" }}>
        <Zap size={13} strokeWidth={2.5} fill="currentColor" />
        <span className="font-sans text-[12px] font-bold">Jackpot! +36 XP ×3</span>
      </div>
    </PreviewShell>
  );
}

function LeaderboardPreview() {
  const rows = [
    { rank: 1, name: "feral_frog", xp: "4,120", me: false },
    { rank: 2, name: "you", xp: "3,880", me: true },
    { rank: 3, name: "scrollkiller", xp: "3,540", me: false },
    { rank: 4, name: "task_gremlin", xp: "2,990", me: false },
  ];
  return (
    <PreviewShell>
      <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--flame)" }}>This week</p>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div
            key={r.rank}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{
              background: r.me ? "var(--accent-soft)" : "var(--bg)",
              border: `1px solid ${r.me ? "var(--energy)" : "var(--line)"}`,
            }}
          >
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-bold tabular-nums"
              style={{ background: r.rank === 1 ? "var(--xp-soft)" : "var(--bg-elevated)", color: r.rank === 1 ? "var(--xp)" : "var(--ink-muted)" }}
            >
              {r.rank === 1 ? <Crown size={13} strokeWidth={2.5} /> : r.rank}
            </span>
            <span className="flex-1 font-sans text-[14px] text-ink">@{r.name}</span>
            <span className="font-mono text-[12px] tabular-nums" style={{ color: r.me ? "var(--energy)" : "var(--ink-faint)" }}>
              {r.xp}
            </span>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

function StreakPreview() {
  return (
    <div className="flex justify-center sm:justify-start">
      <StreakBadge
        size="lg"
        length={14}
        frequency="daily"
        subtitle="on a roll"
        icon={<Flame className="h-20 w-20 shrink-0 anim-flame" style={{ color: "var(--flame)" }} fill="var(--flame)" />}
      />
    </div>
  );
}
