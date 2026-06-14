"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, Trophy, Sparkles, Plus, Timer, Check } from "lucide-react";

/**
 * Coded mock of the real dashboard home (app/dashboard/DashboardHome.tsx):
 * the XP card with a level bar, the streak/level stat row, quick actions, and a
 * daily quest. XP ticks up and a quest checks off on a gentle loop. No video.
 */

const cardBg = "#FFFFFF";
const cardBorder = "1px solid rgba(24,20,16,0.10)";
const line = "1px solid rgba(24,20,16,0.10)";
const ink = "#181410";
const muted = "rgba(24,20,16,0.60)";
const faint = "rgba(24,20,16,0.42)";
const xp = "#6D5AE6";
const flame = "#F2541B";

const START_XP = 1240;
const NEXT_LEVEL = 1500;
const LEVEL_FLOOR = 1000;

export function DashboardDemo() {
  const reduce = useReducedMotion();
  const [points, setPoints] = useState(START_XP);
  const [questDone, setQuestDone] = useState(false);
  const tick = useRef(0);

  useEffect(() => {
    if (reduce) {
      setPoints(START_XP + 20);
      setQuestDone(true);
      return;
    }
    const i = setInterval(() => {
      tick.current += 1;
      // every cycle: bump XP by 20, then toggle the quest, then reset.
      const step = tick.current % 4;
      if (step === 1) setPoints((p) => p + 20);
      else if (step === 2) setQuestDone(true);
      else if (step === 0) {
        setPoints(START_XP);
        setQuestDone(false);
      }
    }, 1600);
    return () => clearInterval(i);
  }, [reduce]);

  const pct = Math.min(100, ((points - LEVEL_FLOOR) / (NEXT_LEVEL - LEVEL_FLOOR)) * 100);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        width: "100%",
        background: "linear-gradient(150deg, #F8F2E8 0%, #FBF7F1 100%)",
        border: cardBorder,
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 20px 48px rgba(24,20,16,0.10)",
        alignItems: "stretch",
      }}
    >
      {/* ── XP + level card ── */}
      <div style={{ flex: "2 1 320px", background: cardBg, border: cardBorder, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "18px 20px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: faint, marginBottom: 4 }}>
            Total XP
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", color: ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {points.toLocaleString()}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4, padding: "5px 10px", borderRadius: 9999, background: "rgba(109,90,230,0.12)", color: xp, fontSize: 11, fontWeight: 600 }}>
              <Trophy size={11} strokeWidth={2} /> Momentum
            </span>
          </div>

          {/* level progress */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: faint }}>Momentum</span>
              <span style={{ fontSize: 10, color: faint, fontVariantNumeric: "tabular-nums" }}>
                {(NEXT_LEVEL - points).toLocaleString()} XP to next
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 9999, background: "rgba(24,20,16,0.08)", overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 9999, background: xp }}
              />
            </div>
          </div>
        </div>

        {/* stat row */}
        <div style={{ display: "flex", borderTop: line }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0" }}>
            <Flame size={14} strokeWidth={2.5} fill="currentColor" color={flame} />
            <span style={{ fontSize: 13, fontWeight: 600, color: ink, fontVariantNumeric: "tabular-nums" }}>12</span>
            <span style={{ fontSize: 11, color: faint }}>streak</span>
          </div>
          <div style={{ width: 1, background: "rgba(24,20,16,0.10)", margin: "8px 0" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0" }}>
            <Sparkles size={14} strokeWidth={2} color={xp} />
            <span style={{ fontSize: 13, fontWeight: 600, color: ink }}>Momentum</span>
          </div>
        </div>
      </div>

      {/* ── right column: quick actions + quest ── */}
      <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <QuickTile icon={<Plus size={17} strokeWidth={2} color="#fff" />} bg="#FF5A36" label="Log fix" />
          <QuickTile icon={<Timer size={17} strokeWidth={2} color="#181410" />} bg="rgba(24,20,16,0.06)" label="Timer" />
        </div>

        {/* daily quest */}
        <div style={{ flex: 1, background: cardBg, border: cardBorder, borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: faint, marginBottom: 10 }}>
            Daily quest
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.span
              animate={{
                background: questDone ? xp : "transparent",
                borderColor: questDone ? xp : "rgba(24,20,16,0.25)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: 22, height: 22, borderRadius: 7, border: "1.5px solid",
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {questDone && <Check size={13} strokeWidth={3} color="#fff" />}
            </motion.span>
            <span style={{ fontSize: 13, fontWeight: 500, color: questDone ? faint : ink, textDecoration: questDone ? "line-through" : "none" }}>
              Start one thing today
            </span>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: xp }}>+20</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickTile({ icon, bg, label }: { icon: React.ReactNode; bg: string; label: string }) {
  return (
    <div style={{ flex: 1, background: cardBg, border: cardBorder, borderRadius: 14, padding: "14px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <span style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </span>
      <span style={{ fontSize: 11, fontWeight: 500, color: muted }}>{label}</span>
    </div>
  );
}
