"use client";

import { useState, useEffect } from "react";
import { Check, Flame, Play, Zap, ArrowRight, Star, Heart, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* soft pastel blobs backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent 72%)" }}
        />
        <div
          className="absolute bottom-[-20%] left-[-8%] h-[420px] w-[420px] rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, var(--pastel-pink), transparent 72%)" }}
        />
        <div
          className="absolute top-[30%] left-[38%] h-[300px] w-[300px] rounded-full opacity-50"
          style={{ background: "radial-gradient(closest-side, var(--pastel-yellow), transparent 72%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 pt-14 pb-6 sm:px-8 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">

          {/* ── Left: copy ── */}
          <div>
            {/* eyebrow chip — soft pastel pill */}
            <span
              className="anim-fadeUp mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              <Sparkles size={14} strokeWidth={2.5} /> Made for ADHD brains
            </span>

            <h1
              className="anim-fadeUp delay-100 leading-[1.04] text-ink"
              style={{ fontSize: "clamp(40px,6.4vw,76px)", fontWeight: 700, letterSpacing: "-0.025em" }}
            >
              Trick your brain into{" "}
              <span className="relative inline-block" style={{ color: "var(--accent)" }}>
                starting
                <svg
                  aria-hidden
                  viewBox="0 0 220 14"
                  className="absolute -bottom-2 left-0 w-full"
                  style={{ height: 12 }}
                >
                  <path
                    d="M4 10 C 60 2, 160 2, 216 8"
                    fill="none"
                    stroke="var(--yellow)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="anim-fadeUp delay-200 mt-7 max-w-[480px] text-[18px] font-medium leading-[1.6] text-ink-muted">
              Stuck staring at the thing you&apos;ve been avoiding? Name it, shrink
              it, and do just 5 minutes. We reward you for{" "}
              <span className="text-ink" style={{ fontWeight: 700 }}>starting</span> —
              not for being perfect. No guilt, no dead streaks.
            </p>

            <div className="anim-fadeUp delay-300 mt-9 flex flex-wrap items-center gap-3">
              <a
                href="/auth/signup"
                className="brutal-btn h-[56px] rounded-full px-8 text-[16px]"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Start something free <ArrowRight size={18} strokeWidth={2.5} />
              </a>
              <a
                href="#features"
                className="brutal-btn h-[56px] rounded-full px-8 text-[16px]"
                style={{ background: "var(--bg-elevated)", color: "var(--ink)", border: "1px solid var(--line)" }}
              >
                See how it works
              </a>
            </div>

            {/* rating + reassurance strip */}
            <div className="anim-fadeUp delay-400 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--yellow)" stroke="var(--yellow)" />
                ))}
              </span>
              <span className="text-[13px] font-semibold text-ink-muted">
                Loved by brains that can&apos;t just start
              </span>
              <span className="text-[13px] font-medium text-ink-faint">
                Free to start · no credit card
              </span>
            </div>
          </div>

          {/* ── Right: interactive demo in a phone frame ── */}
          <div className="anim-fadeUp delay-300 flex justify-center lg:justify-end">
            <PhoneFrame>
              <HeroStartDemo />
            </PhoneFrame>
          </div>
        </div>

        {/* soft proof strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-[28px] px-6 py-5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}
        >
          {PROOF_ITEMS.map((p) => (
            <span key={p.label} className="inline-flex items-center gap-2 text-[13.5px] font-bold text-ink-muted">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full"
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
  { label: "Rewards the start, not the finish", icon: <Zap size={14} strokeWidth={2.5} />, tint: "var(--accent-soft)", color: "var(--accent)" },
  { label: "5-minute deals your brain accepts", icon: <Play size={13} strokeWidth={2.5} fill="currentColor" />, tint: "var(--pastel-yellow)", color: "#B8860B" },
  { label: "Streaks that forgive bad weeks", icon: <Flame size={14} strokeWidth={2.5} />, tint: "var(--flame-soft)", color: "var(--flame)" },
  { label: "Built with ADHD, for ADHD", icon: <Heart size={13} strokeWidth={2.5} fill="currentColor" />, tint: "var(--pastel-pink)", color: "var(--pink)" },
];

/* Rounded device shell around the live demo — the friendly app-in-hand look. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-[400px] p-3"
      style={{
        background: "var(--ink)",
        borderRadius: 44,
        boxShadow: "var(--shadow-xl)",
      }}
    >
      <div
        className="overflow-hidden"
        style={{ background: "var(--bg)", borderRadius: 34 }}
      >
        {/* speaker notch bar */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="h-[5px] w-16 rounded-full" style={{ background: "var(--line-strong)" }} />
        </div>
        {children}
      </div>
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
    <div className="w-full p-5">
      {/* header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5">
            <LogoMark size={16} color="var(--accent)" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Just start</span>
          </span>
          <h3 className="text-[21px] font-bold leading-tight text-ink" style={{ letterSpacing: "-0.02em" }}>
            {phase === "done" ? "You started." : "What are you avoiding?"}
          </h3>
        </div>
        <div
          className="flex shrink-0 flex-col items-center rounded-2xl px-3 py-1.5"
          style={{ background: "var(--xp)", boxShadow: "var(--shadow-sm)" }}
        >
          <span className="text-[18px] font-bold leading-none tabular-nums" style={{ color: "#fff" }}>{xp.toLocaleString()}</span>
          <span className="mt-0.5 font-mono text-[8px] uppercase tracking-widest" style={{ color: "#fff" }}>total xp</span>
        </div>
      </div>

      {/* task card */}
      <div
        className="mb-4 rounded-3xl p-4 transition-colors"
        style={{
          background: phase === "done" ? "var(--reward-mint-soft)" : "var(--bg-soft)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: phase === "done" ? "var(--lime)" : "var(--bg-elevated)",
              color: phase === "done" ? "#fff" : "var(--ink)",
              border: phase === "done" ? "none" : "1px solid var(--line)",
            }}
          >
            {phase === "done" ? <Check size={11} strokeWidth={3} /> : <Zap size={11} strokeWidth={3} />}
            {phase === "done" ? "Started · nice" : "The dreaded task"}
          </span>
          {phase === "running" && (
            <span className="inline-flex items-center gap-2 font-mono text-[12px] font-bold tabular-nums" style={{ color: "var(--flame)" }}>
              <span className="live-dot" style={{ color: "var(--lime)", width: 8, height: 8 }} />
              4:59
            </span>
          )}
        </div>
        <p className="text-[18px] font-bold leading-snug text-ink" style={{ letterSpacing: "-0.02em" }}>{item.task}</p>
        <p className="mt-0.5 text-[13px] font-medium text-ink-muted">
          {phase === "ask" && "tap to name it"}
          {phase === "deal" && `smallest move: ${item.step}`}
          {phase === "running" && "5 minutes. you can quit after."}
          {phase === "done" && "the hard part is over."}
        </p>
      </div>

      {/* action */}
      {phase === "done" ? (
        <button onClick={advance} className="brutal-btn w-full rounded-full py-3.5 text-[15px]" style={{ background: "var(--bg-elevated)", color: "var(--ink)", border: "1px solid var(--line)" }}>
          <Zap size={16} strokeWidth={2.5} /> Start another
        </button>
      ) : phase === "deal" ? (
        <button onClick={advance} className="brutal-btn w-full rounded-full py-3.5 text-[15px]" style={{ background: "var(--accent)", color: "#fff" }}>
          <Play size={17} strokeWidth={2.5} fill="currentColor" /> Do 5 minutes
        </button>
      ) : phase === "running" ? (
        <button onClick={advance} className="brutal-btn w-full rounded-full py-3.5 text-[15px]" style={{ background: "var(--lime)", color: "#fff" }}>
          <Check size={18} strokeWidth={2.5} /> I started — +20 XP
        </button>
      ) : (
        <button onClick={advance} className="brutal-btn w-full rounded-full py-3.5 text-[15px]" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <ArrowRight size={18} strokeWidth={2.5} /> Name it
        </button>
      )}

      {/* footer */}
      <div className="mt-4 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--line)" }}>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase" style={{ color: "var(--flame)" }}>
          <Flame size={13} strokeWidth={2.5} fill="var(--flame)" /> 14-day streak
        </span>
        <span className="font-mono text-[11px] font-bold uppercase text-ink-faint">Lvl 3 · Invested</span>
      </div>
    </div>
  );
}
