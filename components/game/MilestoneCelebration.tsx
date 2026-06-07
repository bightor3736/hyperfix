"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/game/Confetti";
import { ShareStatsButton } from "@/components/game/ShareStatsButton";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";
import { Trophy, Flame, Zap } from "lucide-react";

/**
 * Full-screen celebration for the two highest-bragging moments: leveling up
 * (especially to a new tier name) and hitting a streak milestone. Both are
 * peak-dopamine — so the shareable flex card lives right here to close the
 * growth loop. Fired by MilestoneWatcher.
 */
export type Milestone =
  | { kind: "levelup"; levelName: string; levelNum: number }
  | { kind: "streak"; days: number };

export function MilestoneCelebration({
  milestone,
  displayName,
  streak,
  levelName,
  levelNum,
  xp,
  fixation,
  isPro = false,
  onClose,
}: {
  milestone: Milestone;
  displayName?: string;
  streak: number;
  levelName: string;
  levelNum: number;
  xp: number;
  fixation?: string;
  isPro?: boolean;
  onClose: () => void;
}) {
  const [fire, setFire] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFire(1), 180);
    return () => clearTimeout(t);
  }, []);

  const isLevel = milestone.kind === "levelup";
  const accent = isLevel ? "var(--xp)" : "var(--flame)";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5 anim-fadeIn"
      style={{ background: accent }}
      role="dialog"
      aria-modal="true"
    >
      <Confetti fireKey={fire} />

      <div
        className="relative w-full max-w-[380px] p-7 text-center anim-pop"
        style={{ background: "var(--bg-elevated)", border: "3.5px solid var(--ink)", borderRadius: 8, boxShadow: "10px 10px 0 0 var(--ink)" }}
      >
        {/* Badge */}
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center anim-wiggle"
          style={{ background: accent, border: "3px solid var(--ink)", borderRadius: 8, boxShadow: "3px 3px 0 0 var(--ink)" }}
        >
          {isLevel ? (
            <Trophy size={30} strokeWidth={2.5} style={{ color: "#fff" }} />
          ) : (
            <Flame size={30} strokeWidth={2.5} style={{ color: "#fff" }} fill="#fff" />
          )}
        </div>

        <p className="brutal-tag mx-auto mb-4" style={{ background: "var(--ink)", color: "var(--bg)" }}>
          {isLevel ? "Level up" : "Streak milestone"}
        </p>

        {isLevel ? (
          <>
            <p className="font-mono text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--xp)" }}>
              Level {milestone.levelNum}
            </p>
            <p
              className="mt-1 leading-none text-ink"
              style={{ fontWeight: 800, letterSpacing: "-0.04em", fontSize: "clamp(30px,9vw,46px)" }}
            >
              {milestone.levelName}
            </p>
          </>
        ) : (
          <>
            <p className="tabular-nums leading-none text-ink" style={{ fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(56px,16vw,84px)" }}>
              {milestone.days}
            </p>
            <p className="mt-1 font-mono text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--flame)" }}>
              day streak
            </p>
          </>
        )}

        <p className="mt-5 text-[15px] font-medium leading-snug text-ink-muted">
          {isLevel
            ? "You leveled up. Show the world what your brain's been up to."
            : "You keep showing up. That's the whole game — flex it."}
        </p>

        {/* Share loop — peak bragging moment */}
        <div className="mt-6 flex justify-center">
          <ShareStatsButton
            name={displayName}
            streak={streak}
            level={levelName}
            levelNum={levelNum}
            xp={xp}
            hits={0}
            fixation={fixation}
          />
        </div>

        {/* Upgrade nudge — only non-Pro, only at the bigger level-up moment.
            Sell on the dopamine high, never mid-task. */}
        {!isPro && isLevel && (
          <div
            className="mt-6 p-4 text-left"
            style={{ background: "var(--yellow)", border: "2.5px solid var(--ink)", borderRadius: 7 }}
          >
            <p className="inline-flex items-center gap-1.5 text-[14px] font-bold text-ink">
              <Zap size={14} strokeWidth={3} fill="var(--ink)" /> Level up faster
            </p>
            <p className="mt-1 text-[12px] font-medium leading-snug" style={{ color: "var(--ink)", opacity: 0.75 }}>
              Power-Up earns 1.5× XP on every start, plus 5 streak freezes a month so a bad week never costs you.
            </p>
            <ProCheckoutButton
              className="brutal-btn mt-3 w-full py-2.5 text-[13px]"
              style={{ background: "var(--ink)", color: "var(--bg)", borderRadius: 6 }}
            >
              Power up <Zap size={14} strokeWidth={3} />
            </ProCheckoutButton>
          </div>
        )}

        <button onClick={onClose} className="mt-4 text-[13px] font-medium text-ink-faint transition-opacity hover:opacity-80">
          Keep going
        </button>
      </div>
    </div>
  );
}
