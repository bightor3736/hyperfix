"use client";

import { useState, useEffect } from "react";
import { OAuthButtons } from "./OAuthButtons";
import { LogoMark } from "@/components/Logo";
import { Zap, Check, RefreshCw, Clock, Flame, Sparkles, Footprints, MessageCircle, Leaf, Coffee, type LucideIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Linear backdrop — faint product grid + one restrained accent glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div
          className="absolute -top-40 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full blur-[130px] opacity-40"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.40), transparent 70%)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-14 px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-16 md:grid-cols-[1.05fr_1fr] md:gap-12 lg:pt-20">
        <div className="flex flex-col justify-center">
          <div className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5">
            <LogoMark size={14} color="var(--accent)" />
            <span className="text-[12px] font-medium tracking-tight text-ink-muted">
              An ADHD app that works the way you do
            </span>
          </div>

          <h1 className="font-display leading-[1.02] tracking-tight text-ink" style={{ fontSize: "clamp(42px,6vw,76px)" }}>
            Your ADHD,
            <br />
            <span className="text-game-gradient">finally on your side.</span>
          </h1>

          <p className="mt-6 max-w-[470px] text-[17px] leading-[1.6] text-ink-muted">
            Track what you&apos;re fixated on. Earn XP for things you actually did — proof required.
            Shrink the tasks you keep avoiding. No leaderboards, no guilt, no streak you shatter in a bad week.
          </p>

          <div className="mt-8 w-full max-w-[380px]">
            <OAuthButtons />
            <p className="mt-4 text-[13px] text-ink-faint">
              Free to start. <span style={{ color: "var(--accent)" }}>No credit card.</span> 60 seconds.
            </p>
          </div>

          {/* honest, concrete trust line */}
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2">
            {["Hyperfixation log", "Proof of action", "Forgiving streaks"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                <Check size={13} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
                {f}
              </span>
            ))}
          </div>
        </div>

        <HeroDopamineDemo />
      </div>
    </section>
  );
}

const DEMO_HITS: { label: string; cat: string; icon: LucideIcon; min: number; xp: number }[] = [
  { label: "Do 10 wall push-ups. Go.", cat: "Move", icon: Footprints, min: 2, xp: 8 },
  { label: "Text someone you've been meaning to.", cat: "Connect", icon: MessageCircle, min: 3, xp: 8 },
  { label: "Reset one surface. Just one.", cat: "Reset", icon: Leaf, min: 8, xp: 12 },
  { label: "Put one song on and feel it fully.", cat: "Treat", icon: Coffee, min: 4, xp: 8 },
];

function HeroDopamineDemo() {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(1);
  const [live, setLive] = useState(true);
  const hit = DEMO_HITS[i];

  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => {
      if (done) {
        setDone(false);
        setI((p) => (p + 1) % DEMO_HITS.length);
      } else {
        setDone(true);
        setCount((c) => (c >= 3 ? 1 : c + 1));
      }
    }, done ? 1700 : 2400);
    return () => clearTimeout(t);
  }, [done, live]);

  function reroll() {
    setLive(false);
    setDone(false);
    setI((p) => (p + 1) % DEMO_HITS.length);
  }
  function complete() {
    setLive(false);
    if (done) return;
    setDone(true);
    setCount((c) => Math.min(3, c + 1));
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className="soft-card-lg relative w-full max-w-[420px] overflow-hidden rounded-[var(--radius-xl)] p-6"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        {/* header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
              Dopamine Menu
            </p>
            <h3 className="font-display text-[25px] leading-tight text-ink">
              {done ? "That beat the scroll." : "Do this. Right now."}
            </h3>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="rounded-full transition-all"
                  style={{ width: 8, height: 8, background: d < count ? "var(--accent)" : "var(--line)" }}
                />
              ))}
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint">{count}/3 today</p>
          </div>
        </div>

        {/* card */}
        <div
          className="rounded-[var(--radius-lg)] p-5 mb-4 transition-colors"
          style={{
            background: done ? "var(--pastel-green)" : "var(--bg-soft)",
            border: `1px solid ${done ? "transparent" : "var(--line)"}`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-ink-muted"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <hit.icon size={11} strokeWidth={2} />
              {hit.cat}
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
          <p className="font-display text-[22px] leading-snug text-ink">{hit.label}</p>
        </div>

        {/* actions */}
        {done ? (
          <button
            onClick={reroll}
            className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <Zap size={18} strokeWidth={2.5} fill="var(--accent-ink)" /> Give me another
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={complete}
              className="press-pop flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              <Check size={18} strokeWidth={2.5} /> I did it
            </button>
            <button
              onClick={reroll}
              className="press-pop flex items-center justify-center gap-2 px-5 py-3.5 rounded-[var(--radius-lg)] font-sans text-[14px] font-medium"
              style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              <RefreshCw size={15} strokeWidth={1.5} /> Reroll
            </button>
          </div>
        )}

        {/* footer stats */}
        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--flame)" }}>
            <Flame size={13} strokeWidth={2} fill="var(--flame)" /> 14-day streak
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--xp)" }}>
            <Sparkles size={13} strokeWidth={1.5} /> Level 4 · Hooked
          </span>
        </div>
      </div>
    </div>
  );
}
