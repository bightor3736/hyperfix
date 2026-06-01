"use client";

import { useState, useEffect } from "react";
import { OAuthButtons } from "./OAuthButtons";
import { LogoMark } from "@/components/Logo";
import { Zap, Check, RefreshCw, Clock, Flame, Sparkles, Star, Footprints, MessageCircle, Leaf, Coffee, type LucideIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Linear-style gradient glow backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-16 h-[460px] w-[460px] rounded-full blur-[110px] opacity-60 anim-floatY"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.55), transparent 70%)" }}
        />
        <div
          className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-[110px] opacity-45 anim-driftX"
          style={{ background: "radial-gradient(circle, rgba(255,126,73,0.32), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[340px] w-[340px] rounded-full blur-[110px] opacity-40"
          style={{ background: "radial-gradient(circle, rgba(94,106,210,0.40), transparent 70%)" }}
        />
        {/* faint top hairline glow, very Linear */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,92,255,0.4), transparent)" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-14 px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-16 md:grid-cols-[1.05fr_1fr] md:gap-12 lg:pt-20">
        <div className="flex flex-col justify-center">
          <div
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <LogoMark size={14} color="var(--accent)" />
            <span className="text-[12px] font-medium tracking-tight text-ink-muted">
              Built for ADHD brains
            </span>
          </div>

          <h1 className="font-display leading-[1.02] tracking-tight text-ink" style={{ fontSize: "clamp(42px,6vw,76px)" }}>
            Your ADHD,
            <br />
            <span style={{ color: "var(--accent)" }}>finally on your side.</span>
          </h1>

          <p className="mt-6 max-w-[480px] text-[17px] leading-[1.6] text-ink-muted">
            Track your hyperfixations, earn XP for real actions — not just ticking a box —
            and beat the tasks your brain keeps avoiding. A warm, forgiving game that&apos;s
            yours alone. No leaderboards, no guilt.
          </p>

          <div className="mt-8 w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[13px] text-ink-faint">
              Free to start. <span style={{ color: "var(--accent)" }}>No credit card.</span>
            </p>
          </div>

          {/* warm star-rating social proof */}
          <div className="mt-9 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={15} strokeWidth={0} fill="var(--flame)" />
              ))}
            </div>
            <span className="text-[13px] text-ink-muted">
              Loved by people who&apos;ve quit every other app
            </span>
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
