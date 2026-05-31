"use client";

import { OAuthButtons } from "./OAuthButtons";
import { Check, Flame, Sparkles, Timer } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-20 md:grid-cols-[1fr_1fr] md:gap-14 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Built for ADHD brains
            </span>
          </div>

          <h1 className="font-display leading-[1.02] tracking-tight text-ink" style={{ fontSize: "clamp(40px,5.5vw,66px)" }}>
            Your brain works
            <br />
            differently.
            <br />
            <span style={{ color: "var(--accent)" }}>We built for that.</span>
          </h1>

          <p className="mt-6 max-w-[460px] text-[16px] leading-[1.6] text-ink-muted">
            Daily quests. Forgiving streaks. Focus sessions. XP for everything.
            Hyperfix turns your ADHD brain&apos;s chaos into momentum — one small win at a time.
          </p>

          <div className="mt-9 w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[13px] text-ink-faint">
              Free to start.{" "}
              <span style={{ color: "var(--accent)" }}>No credit card.</span>
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {[
              "Daily quests",
              "Streak freezes",
              "Focus rooms",
              "XP & levels",
            ].map((f) => (
              <span key={f} className="flex items-center gap-1.5 font-mono text-[12px] text-ink-muted">
                <Check size={12} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
                {f}
              </span>
            ))}
          </div>
        </div>

        <HeroDashboardPreview />
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  const quests = [
    { label: "Check in on a project", xp: 10, done: true },
    { label: "Log your mood", xp: 8, done: true },
    { label: "Do a 25-min focus session", xp: 15, done: false },
  ];

  return (
    <div className="flex items-center justify-center">
      <div
        className="w-full max-w-[420px] rounded-[24px] p-6 space-y-4"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        {/* Header */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            good morning
          </p>
          <h3 className="font-display text-[28px] leading-tight tracking-tight text-ink mt-0.5">
            Alex.
          </h3>

          {/* XP bar */}
          <div
            className="mt-3 rounded-xl p-3"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                <Sparkles size={11} strokeWidth={1.5} />
                Invested
              </span>
              <span className="font-mono text-[10px] tabular-nums text-ink-muted">320 / 400 XP</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
              <div className="h-full rounded-full" style={{ width: "80%", background: "var(--accent)" }} />
            </div>
          </div>
        </div>

        {/* Quests */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Today&apos;s Quests</p>
            <span
              className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              2/3 done
            </span>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
          >
            {quests.map((q, i) => (
              <div
                key={q.label}
                className="flex items-center gap-3 px-3 py-2.5"
                style={{
                  borderBottom: i < quests.length - 1 ? "1px solid var(--line)" : "none",
                  background: q.done ? "var(--accent-soft)" : "var(--bg-elevated)",
                }}
              >
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                  style={{
                    background: q.done ? "var(--accent)" : "var(--bg)",
                    border: `1.5px solid ${q.done ? "var(--accent)" : "var(--line)"}`,
                  }}
                >
                  {q.done && <Check size={11} strokeWidth={2.5} color="white" />}
                </div>
                <span
                  className="flex-1 font-sans text-[12px]"
                  style={{
                    color: q.done ? "var(--accent)" : "var(--ink)",
                    textDecoration: q.done ? "line-through" : "none",
                    opacity: q.done ? 0.75 : 1,
                  }}
                >
                  {q.label}
                </span>
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: q.done ? "rgba(111,138,99,0.15)" : "var(--line)",
                    color: q.done ? "var(--accent)" : "var(--ink-muted)",
                  }}
                >
                  +{q.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className="rounded-xl p-2.5 text-center"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame size={11} strokeWidth={2} style={{ color: "var(--accent)" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Streak</span>
            </div>
            <p className="font-display text-[22px] leading-none text-ink">14</p>
            <p className="font-mono text-[9px] text-ink-faint mt-0.5">days</p>
          </div>
          <div
            className="rounded-xl p-2.5 text-center"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Timer size={11} strokeWidth={1.5} className="text-ink-faint" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Focus</span>
            </div>
            <p className="font-display text-[22px] leading-none text-ink">7</p>
            <p className="font-mono text-[9px] text-ink-faint mt-0.5">sessions</p>
          </div>
          <div
            className="rounded-xl p-2.5 text-center"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Sparkles size={11} strokeWidth={1.5} className="text-ink-faint" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Rank</span>
            </div>
            <p className="font-display text-[22px] leading-none text-ink">#12</p>
            <p className="font-mono text-[9px] text-ink-faint mt-0.5">global</p>
          </div>
        </div>
      </div>
    </div>
  );
}
