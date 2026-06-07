"use client";

import { useState, useEffect } from "react";
import { Check, Flame, Plus, Zap, Target } from "lucide-react";
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
              style={{ background: "var(--yellow)", color: "var(--ink)" }}
            >
              <Target size={13} strokeWidth={3} /> The app for your hyperfixations
            </span>

            <h1
              className="anim-fadeUp delay-100 leading-[0.95] text-ink"
              style={{ fontSize: "clamp(44px,7vw,84px)", fontWeight: 700, letterSpacing: "-0.04em" }}
            >
              Your obsessions,
              <br />
              <span
                className="inline-block px-2"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2.5px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)", transform: "rotate(-1.5deg)" }}
              >
                turned into XP.
              </span>
            </h1>

            <p className="anim-fadeUp delay-200 mt-7 max-w-[480px] text-[18px] font-medium leading-[1.5] text-ink-muted">
              Track what you&apos;re deep in. Earn XP only for things you actually
              did. Keep a streak that survives a bad week — no guilt, no leaderboards.
            </p>

            <div className="anim-fadeUp delay-300 mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/auth/signup"
                className="brutal-btn h-[54px] px-7 text-[16px]"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Try Hyperfix free <Plus size={18} strokeWidth={3} />
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
            <HeroFixationDemo />
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
  "LOG IT", "GO DEEP", "EARN XP", "KEEP THE STREAK", "NO GUILT",
  "PROOF OF ACTION", "BRAIN BURSTS", "LEVEL UP", "OWN YOUR OBSESSION",
];

function Ticker() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {TICKER_ITEMS.map((t, i) => (
        <span key={i} className="flex items-center font-mono text-[13px] font-bold uppercase tracking-widest" style={{ color: "var(--bg)" }}>
          <span className="px-5">{t}</span>
          <span style={{ color: "var(--yellow)" }}>★</span>
        </span>
      ))}
    </div>
  );
}

const DEMO_FIX: { name: string; spark: string; intensity: number }[] = [
  { name: "Japanese vocab", spark: "started with one anime at 2am", intensity: 5 },
  { name: "Sourdough starters", spark: "named him Gerald, obviously", intensity: 3 },
  { name: "90s skateboarding", spark: "down a YouTube rabbit hole", intensity: 4 },
  { name: "Roman aqueducts", spark: "one Wikipedia tab became forty", intensity: 4 },
];

function HeroFixationDemo() {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [xp, setXp] = useState(120);
  const [live, setLive] = useState(true);
  const fix = DEMO_FIX[i];

  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => {
      if (done) {
        setDone(false);
        setI((p) => (p + 1) % DEMO_FIX.length);
      } else {
        setDone(true);
        setXp((x) => x + 10);
      }
    }, done ? 1700 : 2400);
    return () => clearTimeout(t);
  }, [done, live]);

  function log() { setLive(false); if (done) return; setDone(true); setXp((x) => x + 10); }
  function next() { setLive(false); setDone(false); setI((p) => (p + 1) % DEMO_FIX.length); }

  return (
    <div
      className="w-full p-5 sm:p-6"
      style={{ background: "var(--bg-elevated)", border: "3.5px solid var(--ink)", borderRadius: 8, boxShadow: "10px 10px 0 0 var(--ink)" }}
    >
      {/* header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5">
            <LogoMark size={16} color="var(--accent)" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Hyperfixations</span>
          </span>
          <h3 className="text-[22px] font-bold leading-tight text-ink" style={{ letterSpacing: "-0.02em" }}>
            {done ? "Logged. It's yours." : "What are you deep in?"}
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

      {/* fixation card */}
      <div
        className="mb-4 p-4 transition-colors"
        style={{
          background: done ? "var(--lime)" : "var(--bg-soft)",
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
            {done ? <Check size={11} strokeWidth={3} /> : <Zap size={11} strokeWidth={3} />}
            {done ? "Active · day 1" : "New fixation"}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((b) => (
              <span key={b} className="h-4 w-2" style={{ background: b <= fix.intensity ? "var(--accent)" : "transparent", border: "1.5px solid var(--ink)" }} />
            ))}
          </div>
        </div>
        <p className="text-[19px] font-bold leading-snug text-ink" style={{ letterSpacing: "-0.02em" }}>{fix.name}</p>
        <p className="mt-0.5 text-[13px] font-medium text-ink-muted">{fix.spark}</p>
      </div>

      {/* action */}
      {done ? (
        <button onClick={next} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--bg-elevated)", color: "var(--ink)" }}>
          <Plus size={16} strokeWidth={3} /> Log another
        </button>
      ) : (
        <button onClick={log} className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <Check size={18} strokeWidth={3} /> Log it — +10 XP
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
