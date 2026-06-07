"use client";

import { useState, useEffect } from "react";
import { Check, Flame, Play, Zap, Brain, ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* faint brutalist grid backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-60" />

      <div className="relative mx-auto max-w-[1200px] px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">

          {/* ── Left: copy ── */}
          <div>
            {/* eyebrow chip */}
            <span
              className="brutal-tag anim-fadeUp mb-6"
              style={{ background: "var(--coral)", color: "#fff" }}
            >
              <Brain size={13} strokeWidth={3} /> For brains that can&apos;t just start
            </span>

            <h1
              className="anim-fadeUp delay-100 leading-[0.95] text-ink"
              style={{ fontSize: "clamp(44px,7vw,84px)", fontWeight: 700, letterSpacing: "-0.04em" }}
            >
              Trick your brain
              <br />
              into{" "}
              <span
                className="inline-block px-2"
                style={{ background: "var(--coral)", color: "#fff", border: "2.5px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)", transform: "rotate(-1.5deg)" }}
              >
                starting.
              </span>
            </h1>

            <p className="anim-fadeUp delay-200 mt-7 max-w-[480px] text-[18px] font-medium leading-[1.5] text-ink-muted">
              Stuck staring at the thing you&apos;ve been avoiding? Name it, shrink
              it, and do just 5 minutes. We reward you for <span className="text-ink" style={{ fontWeight: 700 }}>starting</span> —
              not for being perfect. No guilt, no dead streaks.
            </p>

            <div className="anim-fadeUp delay-300 mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/auth/signup"
                className="brutal-btn h-[54px] px-7 text-[16px]"
                style={{ background: "var(--coral)", color: "#fff" }}
              >
                Start something free <ArrowRight size={18} strokeWidth={3} />
              </a>
              <a
                href="#features"
                className="brutal-btn h-[54px] px-7 text-[16px]"
                style={{ background: "var(--bg-elevated)", color: "var(--ink)" }}
              >
                See how it works
              </a>
            </div>

            <p className="anim-fadeUp delay-400 mt-5 font-mono text-[12px] uppercase tracking-widest text-ink-faint">
              Free to start · no credit card · live in 60s
            </p>
          </div>

          {/* ── Right: interactive demo ── */}
          <div className="anim-fadeUp delay-300">
            <HeroStartDemo />
          </div>
        </div>
      </div>

      {/* marquee ticker — brutalist staple */}
      <div className="mt-16 overflow-hidden border-y-[2.5px] border-ink" style={{ background: "var(--ink)" }}>
        <div className="marquee flex whitespace-nowrap py-2.5">
          <Ticker />
          <Ticker />
        </div>
      </div>
    </section>
  );
}

const TICKER_ITEMS = [
  "JUST START", "5 MINUTES", "REWARD THE START", "BEAT THE FREEZE", "NO SHAME",
  "PROOF OF ACTION", "SHOW UP", "KEEP THE STREAK", "YOU ONLY HAVE TO BEGIN",
];

function Ticker() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {TICKER_ITEMS.map((t, i) => (
        <span key={i} className="flex items-center font-mono text-[13px] font-bold uppercase tracking-widest" style={{ color: "var(--bg)" }}>
          <span className="px-5">{t}</span>
          <span style={{ color: "var(--coral)" }}>★</span>
        </span>
      ))}
    </div>
  );
}

const DEMO_TASKS: { task: string; step: string }[] = [
  { task: "the email I've been dreading", step: "open it, write one line" },
  { task: "my tax return", step: "just find the login" },
  { task: "the gym bag by the door", step: "put on the shoes" },
  { task: "that essay due Friday", step: "type the title" },
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
    const delays: Record<DemoPhase, number> = { ask: 1900, deal: 1700, running: 1600, done: 2100 };
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
    <div
      className="w-full p-5 sm:p-6"
      style={{ background: "var(--bg-elevated)", border: "3.5px solid var(--ink)", borderRadius: 8, boxShadow: "10px 10px 0 0 var(--ink)" }}
    >
      {/* header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5">
            <LogoMark size={16} color="var(--coral)" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Just start</span>
          </span>
          <h3 className="text-[22px] font-bold leading-tight text-ink" style={{ letterSpacing: "-0.02em" }}>
            {phase === "done" ? "You started." : "What are you avoiding?"}
          </h3>
        </div>
        <div
          className="flex shrink-0 flex-col items-center px-3 py-1.5"
          style={{ background: "var(--xp)", border: "2.5px solid var(--ink)", borderRadius: 6, boxShadow: "3px 3px 0 0 var(--ink)" }}
        >
          <span className="text-[18px] font-bold leading-none tabular-nums" style={{ color: "#fff" }}>{xp.toLocaleString()}</span>
          <span className="mt-0.5 font-mono text-[8px] uppercase tracking-widest" style={{ color: "#fff" }}>total xp</span>
        </div>
      </div>

      {/* task card */}
      <div
        className="mb-4 p-4 transition-colors"
        style={{
          background: phase === "done" ? "var(--lime)" : "var(--bg-soft)",
          border: "2.5px solid var(--ink)",
          borderRadius: 6,
          boxShadow: "4px 4px 0 0 var(--ink)",
        }}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "var(--bg-elevated)", border: "2px solid var(--ink)", borderRadius: 999, color: "var(--ink)" }}
          >
            {phase === "done" ? <Check size={11} strokeWidth={3} /> : <Zap size={11} strokeWidth={3} />}
            {phase === "done" ? "Started · nice" : "The dreaded task"}
          </span>
          {phase === "running" && (
            <span className="font-mono text-[12px] font-bold tabular-nums text-coral" style={{ color: "var(--coral)" }}>4:59</span>
          )}
        </div>
        <p className="text-[19px] font-bold leading-snug text-ink" style={{ letterSpacing: "-0.02em" }}>{item.task}</p>
        <p className="mt-0.5 text-[13px] font-medium text-ink-muted">
          {phase === "ask" && "tap to name it"}
          {phase === "deal" && `smallest move: ${item.step}`}
          {phase === "running" && "5 minutes. you can quit after."}
          {phase === "done" && "the hard part is over."}
        </p>
      </div>

      {/* action */}
      {phase === "done" ? (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--bg-elevated)", color: "var(--ink)" }}>
          <Zap size={16} strokeWidth={3} /> Start another
        </button>
      ) : phase === "deal" ? (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--coral)", color: "#fff" }}>
          <Play size={17} strokeWidth={3} fill="currentColor" /> Do 5 minutes
        </button>
      ) : phase === "running" ? (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--lime)", color: "var(--ink)" }}>
          <Check size={18} strokeWidth={3} /> I started — +20 XP
        </button>
      ) : (
        <button onClick={advance} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <ArrowRight size={18} strokeWidth={3} /> Name it
        </button>
      )}

      {/* footer */}
      <div className="mt-4 flex items-center justify-between border-t-[2.5px] border-ink pt-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase" style={{ color: "var(--flame)" }}>
          <Flame size={13} strokeWidth={2.5} fill="var(--flame)" /> 14-day streak
        </span>
        <span className="font-mono text-[11px] font-bold uppercase text-ink-faint">Lvl 3 · Invested</span>
      </div>
    </div>
  );
}
