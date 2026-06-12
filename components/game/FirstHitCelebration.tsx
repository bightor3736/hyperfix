"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Confetti } from "@/components/game/Confetti";
import { ShareStatsButton } from "@/components/game/ShareStatsButton";
import { Zap, Flame, ArrowRight } from "lucide-react";

/**
 * Full-screen "first hit" moment shown the very first time a new user logs a
 * hyperfixation. The dopamine payoff that earns the second-day return — and
 * the highest-intent moment to prompt a share, so the brutalist flex card
 * lives right here.
 */
export function FirstHitCelebration({
  fixationName,
  xp,
  levelName,
  displayName,
  onClose,
}: {
  fixationName: string;
  xp: number;
  levelName: string;
  displayName?: string;
  onClose: () => void;
}) {
  const [fire, setFire] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setFire(1), 180);
    let raf = 0;
    const start = performance.now();
    const dur = 700;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setCount(Math.round(p * xp));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const t2 = setTimeout(() => { raf = requestAnimationFrame(tick); }, 260);
    return () => { clearTimeout(t1); clearTimeout(t2); cancelAnimationFrame(raf); };
  }, [xp]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5 anim-fadeIn"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      role="dialog"
      aria-modal="true"
    >
      <Confetti fireKey={fire} />

      <div
        className="relative w-full max-w-[380px] p-7 text-center anim-pop"
        style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, boxShadow: "var(--shadow-xl)" }}
      >
        {/* Badge */}
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center anim-wiggle"
          style={{ background: "var(--xp)", borderRadius: 16 }}
        >
          <Zap size={30} strokeWidth={2.5} style={{ color: "#ffffff" }} fill="#ffffff" />
        </div>

        <p className="brutal-tag mx-auto mb-4" style={{ background: "#ffffff", color: "#000000" }}>
          Your first hit
        </p>

        {/* XP counter */}
        <p className="tabular-nums leading-none text-ink" style={{ fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(56px,16vw,84px)" }}>
          +{count}
        </p>
        <p className="mt-1 font-mono text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--xp)" }}>
          XP earned
        </p>

        {/* Fixation */}
        <div className="mt-6 p-4 text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Now tracking</p>
          <p className="mt-0.5 text-[18px] font-bold leading-snug text-ink" style={{ letterSpacing: "-0.02em" }}>{fixationName}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ background: "var(--xp)", color: "#ffffff", borderRadius: 999 }}>
            Level 1 · {levelName}
          </p>
        </div>

        {/* Tomorrow hook */}
        <p className="mt-5 inline-flex items-center justify-center gap-2 text-[14px] font-medium text-ink-muted">
          <Flame size={15} strokeWidth={2.5} style={{ color: "var(--flame)" }} fill="var(--flame)" />
          Come back tomorrow to start your streak.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          onClick={onClose}
          className="brutal-btn mt-6 w-full py-3.5 text-[15px]"
          style={{ background: "#ffffff", color: "#000000", fontWeight: 600, borderRadius: 10 }}
        >
          Take me in <ArrowRight size={17} strokeWidth={3} />
        </Link>

        {/* Share loop — the highest-intent share moment */}
        <div className="mt-3 flex justify-center">
          <ShareStatsButton
            name={displayName}
            streak={0}
            level={levelName}
            levelNum={1}
            xp={xp}
            hits={1}
            fixation={fixationName}
          />
        </div>

        <button onClick={onClose} className="mt-3 text-[13px] font-medium text-ink-faint transition-opacity hover:opacity-80">
          Log another first
        </button>
      </div>
    </div>
  );
}
