"use client";

import { useState, useEffect } from "react";
import { Check, Flame, Play, Zap, ArrowRight, Star } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      {/* Steep hero glow — apricot wash radial from top-center */}
      <div className="steep-hero-glow" aria-hidden />

      <div className="relative mx-auto max-w-[1200px] px-6 pb-10 pt-20 sm:px-8 sm:pt-28">

        {/* ── Centered headline block ── */}
        <div className="mx-auto max-w-[760px] text-center">
          {/* Eyebrow */}
          <span
            className="anim-fadeUp mb-8 inline-block rounded-full px-4 py-1.5 text-[13px]"
            style={{
              background: "var(--fill-soft)",
              color: "var(--ink-muted)",
              border: "1px solid var(--line)",
              letterSpacing: "-0.009em",
            }}
          >
            For ADHD brains
          </span>

          {/* Steep: large Signifier-style display headline */}
          <h1
            className="steep-display anim-fadeUp delay-100 text-ink"
            style={{ fontSize: "clamp(42px, 7vw, 80px)" }}
          >
            Trick your brain into{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>starting.</span>
          </h1>

          <p
            className="anim-fadeUp delay-200 mx-auto mt-7 max-w-[520px] text-[18px] leading-[1.6]"
            style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}
          >
            Name what you&apos;re avoiding, shrink it to five minutes, and earn XP
            for starting — not for finishing. No guilt, no dead streaks.
          </p>

          {/* Steep: one filled Ink CTA + text link */}
          <div className="anim-fadeUp delay-300 mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="brutal-btn h-[52px] px-8 text-[16px]"
              style={{ background: "var(--ink)", color: "#ffffff" }}
            >
              Start for free
            </a>
            <a
              href="#features"
              className="text-[16px] transition-opacity hover:opacity-70"
              style={{ color: "var(--ink)", letterSpacing: "-0.009em" }}
            >
              See how it works →
            </a>
          </div>

          {/* Reassurance line */}
          <div className="anim-fadeUp delay-400 mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--ink-faint)" stroke="var(--ink-faint)" />
              ))}
            </span>
            <span className="text-[13px]" style={{ color: "var(--ink-faint)", letterSpacing: "-0.009em" }}>
              Free to start · no credit card
            </span>
          </div>
        </div>

        {/* ── Floating product cards — Steep style ── */}
        <div className="relative mx-auto mt-16 max-w-[860px]">

          {/* Central app demo — the main product card */}
          <div
            className="relative mx-auto max-w-[480px]"
            style={{
              background: "var(--bg-elevated)",
              borderRadius: 24,
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            <HeroStartDemo />
          </div>

          {/* Floating stat card — left */}
          <div
            className="absolute hidden md:block"
            style={{
              top: 20,
              left: -60,
              width: 160,
              background: "var(--bg-elevated)",
              borderRadius: 20,
              boxShadow: "var(--shadow)",
              padding: "16px 18px",
              transform: "rotate(-2deg)",
            }}
          >
            <p className="text-[11px]" style={{ color: "var(--ink-faint)", letterSpacing: "-0.009em" }}>Current streak</p>
            <p className="mt-1 text-[32px] font-semibold leading-none tabular-nums" style={{ color: "var(--ink)", letterSpacing: "-0.04em" }}>14</p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--flame)" }}>🔥 days</p>
          </div>

          {/* Floating XP card — right */}
          <div
            className="absolute hidden md:block"
            style={{
              top: 32,
              right: -50,
              width: 148,
              background: "var(--apricot)",
              borderRadius: 20,
              boxShadow: "var(--shadow)",
              padding: "16px 18px",
              transform: "rotate(1.5deg)",
            }}
          >
            <p className="text-[11px]" style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}>XP earned</p>
            <p className="mt-1 text-[28px] font-semibold leading-none tabular-nums" style={{ color: "var(--ink)", letterSpacing: "-0.04em" }}>+20</p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--ink-muted)" }}>for starting ✓</p>
          </div>

          {/* Floating level card — bottom left */}
          <div
            className="absolute hidden md:block"
            style={{
              bottom: 20,
              left: -40,
              width: 152,
              background: "var(--sky)",
              borderRadius: 20,
              boxShadow: "var(--shadow)",
              padding: "14px 18px",
              transform: "rotate(1deg)",
            }}
          >
            <p className="text-[11px]" style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}>Level</p>
            <p className="mt-1 text-[15px] font-semibold leading-tight" style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}>Deeply Unwell</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(23,25,28,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: "72%", background: "var(--accent)" }} />
            </div>
          </div>
        </div>

        {/* ── Proof strip — Steep white card below hero ── */}
        <div
          className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-[20px] px-8 py-6"
          style={{
            background: "var(--bg-elevated)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {PROOF_ITEMS.map((p) => (
            <span key={p.label} className="flex items-center gap-2.5 text-[14px]" style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: p.tint, color: p.color }}
              >
                {p.icon}
              </span>
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROOF_ITEMS = [
  { label: "XP for starting, not finishing",  icon: <Zap size={13} strokeWidth={2.5} />,              tint: "var(--accent-soft)", color: "var(--accent)" },
  { label: "5-minute deal your brain accepts", icon: <Play size={12} strokeWidth={2.5} fill="currentColor" />, tint: "var(--apricot)",      color: "var(--ink-muted)" },
  { label: "Streaks that survive bad weeks",   icon: <Flame size={13} strokeWidth={2.5} />,             tint: "var(--flame-soft)",  color: "var(--flame)" },
  { label: "Built with ADHD, for ADHD",        icon: <span>♥</span>,                                   tint: "var(--fill-soft)",   color: "var(--ink-muted)" },
];

/* ── Animated product demo card ── */
const DEMO_TASKS: { task: string; step: string }[] = [
  { task: "the email I've been dreading", step: "open it, write one line" },
  { task: "my tax return",                step: "just find the login" },
  { task: "the gym bag by the door",      step: "put on the shoes" },
  { task: "that essay due Friday",        step: "type the title" },
];

type DemoPhase = "ask" | "deal" | "running" | "done";

function HeroStartDemo() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>("ask");
  const [xp, setXp] = useState(140);
  const [live, setLive] = useState(true);
  const item = DEMO_TASKS[i];

  useEffect(() => {
    if (!live) return;
    const delays: Record<DemoPhase, number> = { ask: 2000, deal: 1800, running: 1700, done: 2200 };
    const t = setTimeout(() => {
      setPhase((p) => {
        if (p === "ask") return "deal";
        if (p === "deal") return "running";
        if (p === "running") { setXp((x) => x + 20); return "done"; }
        setI((n) => (n + 1) % DEMO_TASKS.length);
        return "ask";
      });
    }, delays[phase]);
    return () => clearTimeout(t);
  }, [phase, live]);

  function advance() {
    setLive(false);
    setPhase((p) => {
      if (p === "ask") return "deal";
      if (p === "deal") return "running";
      if (p === "running") { setXp((x) => x + 20); return "done"; }
      setI((n) => (n + 1) % DEMO_TASKS.length);
      return "ask";
    });
  }

  return (
    <div className="w-full p-6">
      {/* Header row */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <LogoMark size={15} color="var(--accent)" />
            <span className="text-[11px] font-semibold" style={{ color: "var(--ink-faint)", letterSpacing: "-0.009em" }}>Just start</span>
          </div>
          <h3 className="steep-heading text-[22px] text-ink" style={{ fontSize: 22 }}>
            {phase === "done" ? "You started." : "What are you avoiding?"}
          </h3>
        </div>
        {/* XP badge — Steep Apricot Wash */}
        <div
          className="flex shrink-0 flex-col items-center rounded-[14px] px-3.5 py-2"
          style={{ background: "var(--apricot)" }}
        >
          <span className="text-[20px] font-semibold leading-none tabular-nums" style={{ color: "var(--ink)", letterSpacing: "-0.04em" }}>{xp}</span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--ink-muted)" }}>XP</span>
        </div>
      </div>

      {/* Task card */}
      <div
        className="mb-4 rounded-[16px] p-4"
        style={{
          background: phase === "done" ? "var(--sky)" : "var(--bg)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              background: phase === "done" ? "var(--reward-mint)" : "var(--bg-elevated)",
              color: phase === "done" ? "#fff" : "var(--ink-muted)",
              border: phase === "done" ? "none" : "1px solid var(--line)",
            }}
          >
            {phase === "done" ? <Check size={11} strokeWidth={2.5} /> : <Zap size={11} strokeWidth={2.5} />}
            {phase === "done" ? "Started ✓" : "Dreaded task"}
          </span>
          {phase === "running" && (
            <span className="flex items-center gap-1.5 text-[13px] font-semibold tabular-nums" style={{ color: "var(--ink)" }}>
              <span className="live-dot" style={{ color: "var(--reward-mint)", width: 8, height: 8 }} />
              4:59
            </span>
          )}
        </div>
        <p className="text-[17px] font-semibold leading-snug text-ink" style={{ letterSpacing: "-0.015em" }}>
          {item.task}
        </p>
        <p className="mt-1 text-[13px]" style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}>
          {phase === "ask"     && "tap to name it"}
          {phase === "deal"    && `smallest move: ${item.step}`}
          {phase === "running" && "5 minutes. you can quit after."}
          {phase === "done"    && "the hard part is over."}
        </p>
      </div>

      {/* CTA */}
      {phase === "done" ? (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--fill-soft)", color: "var(--ink)", border: "1px solid var(--line)" }}>
          <Zap size={15} strokeWidth={2.5} /> Start another
        </button>
      ) : phase === "deal" ? (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--ink)", color: "#fff" }}>
          <Play size={16} strokeWidth={2.5} fill="currentColor" /> Do 5 minutes
        </button>
      ) : phase === "running" ? (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--reward-mint)", color: "#fff" }}>
          <Check size={16} strokeWidth={2.5} /> I started — +20 XP
        </button>
      ) : (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--ink)", color: "#fff" }}>
          <ArrowRight size={16} strokeWidth={2.5} /> Name it
        </button>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--line)" }}>
        <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "var(--flame)" }}>
          <Flame size={12} strokeWidth={2.5} fill="currentColor" /> 14-day streak
        </span>
        <span className="text-[12px]" style={{ color: "var(--ink-faint)", letterSpacing: "-0.009em" }}>Lvl 3 · Invested</span>
      </div>
    </div>
  );
}
