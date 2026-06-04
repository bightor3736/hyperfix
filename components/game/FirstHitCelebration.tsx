"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Confetti } from "@/components/game/Confetti";
import { Zap, Flame, ArrowRight } from "lucide-react";

/**
 * Full-screen "first hit" moment shown the very first time a new user logs a
 * hyperfixation during onboarding. This is the dopamine payoff that earns the
 * second-day return: a real reward + a reason to come back tomorrow.
 */
export function FirstHitCelebration({
  fixationName,
  xp,
  levelName,
  onClose,
}: {
  fixationName: string;
  xp: number;
  levelName: string;
  onClose: () => void;
}) {
  const [fire, setFire] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fire confetti shortly after mount, then tick the XP counter up.
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
      style={{
        background: [
          "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(139,92,246,0.45) 0%, transparent 60%)",
          "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(45,212,191,0.30) 0%, transparent 60%)",
          "linear-gradient(160deg, #1e1880 0%, #0f0d40 100%)",
        ].join(", "),
      }}
      role="dialog"
      aria-modal="true"
    >
      <Confetti fireKey={fire} />

      <div className="relative w-full max-w-[380px] text-center">
        {/* Badge */}
        <div className="anim-pop mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "rgba(94,234,212,0.14)", border: "1px solid rgba(94,234,212,0.4)" }}>
          <Zap size={34} strokeWidth={2} style={{ color: "#5eead4" }} fill="#5eead4" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(167,139,250,0.9)" }}>
          Your first hit
        </p>

        {/* XP counter */}
        <p
          className="tabular-nums leading-none"
          style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(56px,16vw,80px)", color: "#fff" }}
        >
          +{count}
        </p>
        <p className="mt-1 font-mono text-[12px] uppercase tracking-widest" style={{ color: "#5eead4" }}>
          XP earned
        </p>

        {/* Fixation name */}
        <div className="mt-6 rounded-2xl px-4 py-3.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            now tracking
          </p>
          <p className="font-sans text-[17px] font-semibold leading-snug" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
            {fixationName}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(167,139,250,0.9)" }}>
            Level 1 · {levelName}
          </p>
        </div>

        {/* Tomorrow hook */}
        <p className="mt-5 inline-flex items-center justify-center gap-2 font-sans text-[14px]" style={{ color: "rgba(255,255,255,0.65)" }}>
          <Flame size={15} strokeWidth={2.5} style={{ color: "#ff7a59" }} fill="#ff7a59" />
          Come back tomorrow to start your streak.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          onClick={onClose}
          className="press-pop mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-sans text-[15px] font-bold transition-all hover:-translate-y-px"
          style={{ background: "#5eead4", color: "#0f0d40", boxShadow: "0 12px 32px -8px rgba(94,234,212,0.5)" }}
        >
          Take me in
          <ArrowRight size={17} strokeWidth={2.5} />
        </Link>

        <button
          onClick={onClose}
          className="mt-3 font-sans text-[13px] transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Log another first
        </button>
      </div>
    </div>
  );
}
