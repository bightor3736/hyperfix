"use client";

import { useState, useEffect, useRef } from "react";
import { OAuthButtons } from "./OAuthButtons";
import { LogoMark } from "@/components/Logo";
import { Check, RefreshCw, Clock, Flame, Footprints, MessageCircle, Leaf, Coffee, type LucideIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop — faint product grid + a single soft glow rising from the top.
          One light source, not a symmetric blob field. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div
          className="absolute -top-48 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle at 50% 40%, rgba(20,184,166,0.30), rgba(52,211,153,0.10) 45%, transparent 72%)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.45), transparent)" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-x-12 gap-y-16 px-6 pb-20 pt-12 sm:px-10 sm:pb-28 sm:pt-16 md:grid-cols-[1.04fr_0.96fr] lg:pt-24">
        <div className="flex flex-col">
          {/* Eyebrow — a small live signal, not a marketing slogan. */}
          <div className="glass mb-7 inline-flex w-fit items-center gap-2.5 rounded-full py-1.5 pl-2 pr-3.5">
            <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "var(--accent-soft)" }}>
              <span className="h-1.5 w-1.5 rounded-full anim-pulseDot" style={{ background: "var(--accent)", color: "var(--accent)" }} />
            </span>
            <span className="text-[12.5px] font-medium tracking-tight text-ink-muted">
              Built for brains that run on dopamine
            </span>
          </div>

          <h1 className="font-display tracking-[-0.02em] text-ink" style={{ fontSize: "clamp(44px,6.2vw,78px)", lineHeight: 1.02 }}>
            Your ADHD,
            <br />
            <span className="text-game-gradient">on your side</span> for once.
          </h1>

          <p className="mt-7 max-w-[460px] text-[17px] leading-[1.62] text-ink-muted">
            Hyperfix turns your hyperfixations into momentum. Earn XP only for things you
            actually did, shrink the tasks you keep avoiding, and keep a streak that survives a bad week.
          </p>

          <div className="mt-9 w-full max-w-[380px]">
            <OAuthButtons />
            <p className="mt-3.5 text-[13px] text-ink-faint">
              Free to start · no card · live in under a minute.
            </p>
          </div>

          {/* Trust line — written like a person, not a checkbox row. */}
          <p className="mt-10 max-w-[440px] text-[13.5px] leading-relaxed text-ink-faint">
            No leaderboards. No guilt-trips. No streak you shatter the moment life gets loud —
            <span className="text-ink-muted"> just your own pace, tracked honestly.</span>
          </p>
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
    <div className="relative flex items-center justify-center">
      {/* a faint pedestal glow so the card feels lit, not floating in a void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-6 top-10 rounded-[40px] blur-3xl"
        style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(20,184,166,0.12), transparent 70%)" }}
      />
      <div
        className="soft-card-lg relative w-full max-w-[420px] overflow-hidden rounded-[var(--radius-xl)] p-6"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        {/* header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5">
              <LogoMark size={13} color="var(--accent)" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                Dopamine Menu
              </p>
            </div>
            <h3 className="font-display text-[25px] leading-tight text-ink">
              {done ? "That beat the scroll." : "Do this. Right now."}
            </h3>
          </div>
          <div className="flex shrink-0 flex-col items-center">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="rounded-full transition-all duration-300"
                  style={{ width: 8, height: 8, background: d < count ? "var(--accent)" : "var(--line-strong)" }}
                />
              ))}
            </div>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">{count}/3 today</p>
          </div>
        </div>

        {/* card */}
        <div
          className="mb-4 rounded-[var(--radius-lg)] p-5 transition-colors duration-300"
          style={{
            background: done ? "var(--pastel-green)" : "var(--bg-soft)",
            border: `1px solid ${done ? "transparent" : "var(--line)"}`,
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"
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
            className="press-pop flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] py-3.5 font-sans text-[15px] font-bold"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <RefreshCw size={16} strokeWidth={2.5} /> Give me another
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={complete}
              className="press-pop flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-lg)] py-3.5 font-sans text-[15px] font-bold"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              <Check size={18} strokeWidth={2.5} /> I did it
            </button>
            <button
              onClick={reroll}
              className="press-pop flex items-center justify-center gap-2 rounded-[var(--radius-lg)] px-5 py-3.5 font-sans text-[14px] font-medium"
              style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              <RefreshCw size={15} strokeWidth={1.5} /> Reroll
            </button>
          </div>
        )}

        {/* footer — a quiet streak line, no fake bragging */}
        <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--flame)" }}>
            <Flame size={13} strokeWidth={2} fill="var(--flame)" /> 14-day streak
          </span>
          <span className="font-mono text-[11px] text-ink-faint">Level 4 · Hooked</span>
        </div>
      </div>
    </div>
  );
}
