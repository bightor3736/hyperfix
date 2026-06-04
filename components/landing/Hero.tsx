"use client";

import { useState, useEffect } from "react";
import { LogoMark } from "@/components/Logo";
import { Check, RefreshCw, Clock, Flame, Footprints, MessageCircle, Leaf, Coffee, type LucideIcon } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft tri-pastel wash — mint→sky→lavender, teal-leaning to stay on brand.
         Low alpha so it reads on both light and dark canvases. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(45,212,191,0.12) 0%, rgba(96,165,250,0.07) 38%, rgba(167,139,250,0.06) 64%, transparent 88%)",
        }}
      />

      {/* ── Center column — template-style: serif headline, single button ── */}
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center px-6 pt-16 text-center sm:px-10 sm:pt-20 lg:pt-28">

        {/* Headline — serif (Fraunces), balanced, template scale */}
        <h1
          className="anim-fadeUp font-display leading-[1.05] tracking-tight text-ink text-balance"
          style={{ fontSize: "clamp(40px,6vw,68px)" }}
        >
          Your ADHD, <span className="text-game-gradient">on your side</span> for once.
        </h1>

        <p className="anim-fadeUp delay-100 mt-6 max-w-[520px] text-[18px] leading-[1.6]" style={{ color: "var(--ink-muted)" }}>
          Track your hyperfixations. Earn XP only for things you actually did.
          Keep a streak that survives a bad week — no guilt, no leaderboards.
        </p>

        {/* Single primary button, template-style */}
        <a
          href="/auth/signup"
          className="anim-fadeUp delay-200 press-pop mt-8 inline-flex h-[52px] items-center rounded-full px-8 text-[15px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          Try Hyperfix free
        </a>

        {/* Trust line */}
        <p className="anim-fadeUp delay-300 mt-5 text-[13px]" style={{ color: "var(--ink-faint)" }}>
          Free to start · no credit card · live in 60 seconds
        </p>
      </div>

      {/* ── Product visual ────────────────────────────────────────── */}
      {/* The Dreelio move: one large warm-framed product screenshot floating below the CTA */}
      <div className="relative mx-auto mt-16 max-w-[960px] px-6 sm:mt-20 sm:px-10">
        {/* subtle warm under-glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -bottom-8 top-8 rounded-[40px] blur-3xl opacity-40"
          style={{ background: "radial-gradient(55% 50% at 50% 40%, rgba(20,184,166,0.16), transparent 72%)" }}
        />
        <div
          className="anim-fadeUp delay-500 relative overflow-hidden rounded-[28px] p-3"
          style={{
            background: "var(--bg-soft)",
            border: "1px solid rgba(97,74,68,0.14)",
            boxShadow: "0 4px 8px rgba(26,22,21,0.05), 0 32px 80px -24px rgba(26,22,21,0.14)",
          }}
        >
          {/* top bar — fake OS chrome */}
          <div
            className="mb-3 flex items-center gap-2 px-2"
          >
            <span className="h-3 w-3 rounded-full" style={{ background: "rgba(97,74,68,0.18)" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "rgba(97,74,68,0.18)" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "rgba(97,74,68,0.18)" }} />
            <div
              className="mx-auto h-6 w-48 rounded-full text-center text-[11px] font-medium leading-6"
              style={{ background: "rgba(97,74,68,0.10)", color: "var(--ink-faint)" }}
            >
              hyperfix.app/dashboard
            </div>
          </div>
          <HeroDopamineDemo />
        </div>
      </div>

      {/* spacing below the card before next section */}
      <div className="h-20 sm:h-28" />
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

  function reroll() { setLive(false); setDone(false); setI((p) => (p + 1) % DEMO_HITS.length); }
  function complete() { setLive(false); if (done) return; setDone(true); setCount((c) => Math.min(3, c + 1)); }

  return (
    <div
      className="w-full rounded-[20px] p-6"
      style={{ background: "var(--bg-elevated)", border: "1px solid rgba(97,74,68,0.10)" }}
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
          <h3 className="font-sans text-[24px] font-semibold leading-tight" style={{ color: "var(--ink)" }}>
            {done ? "That beat the scroll." : "Do this. Right now."}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="rounded-full transition-all duration-300"
                style={{ width: 8, height: 8, background: d < count ? "var(--accent)" : "rgba(97,74,68,0.18)" }}
              />
            ))}
          </div>
          <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-faint)" }}>{count}/3 today</p>
        </div>
      </div>

      {/* activity card */}
      <div
        className="mb-4 rounded-[16px] p-5 transition-colors duration-300"
        style={{
          background: done ? "#e8f7ef" : "var(--bg-soft)",
          border: `1px solid ${done ? "rgba(28,184,124,0.25)" : "rgba(97,74,68,0.12)"}`,
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ background: "var(--bg-elevated)", border: "1px solid rgba(97,74,68,0.14)", color: "var(--ink-muted)" }}
          >
            <hit.icon size={11} strokeWidth={2} />
            {hit.cat}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>
              <Clock size={11} strokeWidth={1.5} /> {hit.min} min
            </span>
            <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
              +{hit.xp} XP
            </span>
          </div>
        </div>
        <p className="font-sans text-[20px] font-semibold leading-snug" style={{ color: "var(--ink)" }}>{hit.label}</p>
      </div>

      {/* actions */}
      {done ? (
        <button
          onClick={reroll}
          className="press-pop flex w-full items-center justify-center gap-2 rounded-[16px] py-3.5 font-sans text-[15px] font-semibold"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          <RefreshCw size={16} strokeWidth={2.5} /> Give me another
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={complete}
            className="press-pop flex flex-1 items-center justify-center gap-2 rounded-[16px] py-3.5 font-sans text-[15px] font-semibold"
            style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
          >
            <Check size={18} strokeWidth={2.5} /> I did it
          </button>
          <button
            onClick={reroll}
            className="press-pop flex items-center justify-center gap-2 rounded-[16px] px-5 py-3.5 font-sans text-[14px] font-medium"
            style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid rgba(97,74,68,0.18)" }}
          >
            <RefreshCw size={15} strokeWidth={1.5} /> Reroll
          </button>
        </div>
      )}

      {/* footer */}
      <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(97,74,68,0.12)" }}>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--flame)" }}>
          <Flame size={13} strokeWidth={2} fill="var(--flame)" /> 14-day streak
        </span>
        <span className="font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>Level 4 · Hooked</span>
      </div>
    </div>
  );
}
