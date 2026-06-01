"use client";

import { useState, useEffect, useRef } from "react";
import { OAuthButtons } from "./OAuthButtons";
import { LogoMark } from "@/components/Logo";
import { Zap, Check, RefreshCw, Clock, Flame, Sparkles, Footprints, MessageCircle, Leaf, Coffee, type LucideIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-20 md:grid-cols-[1fr_1fr] md:gap-14 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: "var(--energy-soft)", border: "1px solid var(--energy)" }}
          >
            <LogoMark size={13} color="var(--energy)" className="anim-twinkle" />
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--energy)" }}>
              Built for ADHD brains
            </span>
          </div>

          <h1 className="font-display leading-[1.02] tracking-tight text-ink" style={{ fontSize: "clamp(40px,5.5vw,68px)" }}>
            Your daily dopamine.
            <br />
            <span style={{ color: "var(--energy)" }}>On tap.</span>
          </h1>

          <p className="mt-6 max-w-[470px] text-[16px] leading-[1.6] text-ink-muted">
            One tap when you&apos;re bored or understimulated, and Hyperfix hands you a real
            dopamine hit that isn&apos;t your phone. Earn XP, build a streak, level up.
            It&apos;s the anti-doomscroll — a game your ADHD brain actually wants to play.
          </p>

          <div className="mt-9 w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[13px] text-ink-faint">
              Free to start.{" "}
              <span style={{ color: "var(--energy)" }}>No credit card.</span>
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {["Dopamine on tap", "Forgiving streaks", "XP & levels", "Focus rooms"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 font-mono text-[12px] text-ink-muted">
                <Check size={12} strokeWidth={2.5} style={{ color: "var(--energy)" }} />
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
  const [live, setLive] = useState(true); // autoplay until the visitor interacts
  const hit = DEMO_HITS[i];

  // Auto-loop the core loop so visitors see it move on its own.
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
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] p-6"
        style={{
          background: "radial-gradient(120% 120% at 0% 0%, var(--energy-soft) 0%, var(--bg-elevated) 55%)",
          border: "1px solid var(--line)",
        }}
      >
        {/* header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--energy)" }}>
              Dopamine Menu
            </p>
            <h3 className="font-display text-[24px] leading-tight text-ink">
              {done ? "That beat the scroll." : "Do this. Right now."}
            </h3>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="rounded-full"
                  style={{ width: 8, height: 8, background: d < count ? "var(--energy)" : "var(--line)" }}
                />
              ))}
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint">{count}/3 today</p>
          </div>
        </div>

        {/* card */}
        <div
          className="rounded-[22px] p-5 mb-4"
          style={{
            background: done ? "var(--accent-soft)" : "var(--bg)",
            border: `1px solid ${done ? "var(--accent)" : "var(--line)"}`,
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
            className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[22px] font-sans text-[15px] font-bold"
            style={{ background: "var(--energy)", color: "var(--accent-ink)" }}
          >
            <Zap size={18} strokeWidth={2.5} fill="var(--accent-ink)" /> Give me another
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={complete}
              className="press-pop flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[22px] font-sans text-[15px] font-bold"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              <Check size={18} strokeWidth={2.5} /> I did it
            </button>
            <button
              onClick={reroll}
              className="press-pop flex items-center justify-center gap-2 px-5 py-3.5 rounded-[22px] font-sans text-[14px] font-medium"
              style={{ background: "var(--bg-elevated)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
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
