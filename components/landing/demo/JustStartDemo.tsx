"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Zap, ArrowRight, Clock, Check } from "lucide-react";

/**
 * Coded, looping mock of the real "Just Start" flow:
 * name the task → shrink it to the smallest first move → tiny timer → "You started" +XP.
 * Mirrors components/start/JustStart.tsx styling so it reads as the real product.
 */

type Phase = "name" | "step" | "running" | "done";
const ORDER: Phase[] = ["name", "step", "running", "done"];
// How long each phase is shown (ms).
const HOLD: Record<Phase, number> = { name: 2200, step: 2400, running: 3200, done: 2600 };

const TASK = "the email I've been dreading";
const STEP = "just open it and write one line";

const card: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid rgba(24,20,16,0.10)",
  borderRadius: 20,
  boxShadow: "0 14px 36px rgba(24,20,16,0.10)",
};
const fill: React.CSSProperties = { background: "rgba(24,20,16,0.04)" };
const ink = "#181410";
const muted = "rgba(24,20,16,0.60)";
const faint = "rgba(24,20,16,0.42)";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function JustStartDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("name");
  const [secs, setSecs] = useState(8);
  const idx = useRef(0);

  // Phase loop.
  useEffect(() => {
    if (reduce) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => {
      idx.current = (idx.current + 1) % ORDER.length;
      setPhase(ORDER[idx.current]);
    }, HOLD[phase]);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  // Countdown while running.
  useEffect(() => {
    if (phase !== "running") {
      setSecs(8);
      return;
    }
    const i = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 360);
    return () => clearInterval(i);
  }, [phase]);

  return (
    <div
      style={{
        ...card,
        width: "100%",
        maxWidth: 420,
        minHeight: 380,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 30, height: 30, borderRadius: 8, background: "#FF5A36", color: "#fff",
          }}
        >
          <Zap size={15} strokeWidth={2.5} />
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: ink }}>Just start</span>
      </div>

      <div style={{ position: "relative", flex: 1 }}>
        <AnimatePresence mode="wait">
          {phase === "name" && (
            <Step key="name">
              <Title>
                What are you{" "}
                <Italic>avoiding?</Italic>
              </Title>
              <div style={{ ...fill, borderRadius: 10, padding: "13px 16px", marginTop: 16, color: ink, fontSize: 14, fontWeight: 500 }}>
                {TASK}
                <Caret />
              </div>
              <PrimaryBtn>
                Let&apos;s start <ArrowRight size={15} strokeWidth={2.5} />
              </PrimaryBtn>
            </Step>
          )}

          {phase === "step" && (
            <Step key="step">
              <Label>Starting</Label>
              <Title small>{TASK}</Title>
              <p style={{ fontSize: 12, fontWeight: 600, color: muted, marginTop: 16 }}>
                What&apos;s the smallest first move?
              </p>
              <div style={{ ...fill, borderRadius: 10, padding: "11px 14px", marginTop: 8, color: ink, fontSize: 13, fontWeight: 500 }}>
                {STEP}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {[2, 5, 10, 25].map((m) => (
                  <div
                    key={m}
                    style={{
                      flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10,
                      fontSize: 13, fontWeight: 600,
                      background: m === 5 ? "#181410" : "rgba(24,20,16,0.04)",
                      color: m === 5 ? "#fff" : muted,
                    }}
                  >
                    {m}m
                  </div>
                ))}
              </div>
            </Step>
          )}

          {phase === "running" && (
            <Step key="running" center>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF5A36" }} className="live-dot" />
                Live — working on
              </span>
              <Title small center style={{ marginTop: 6 }}>{TASK}</Title>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "6px 12px", borderRadius: 9999, ...fill, fontSize: 12, fontWeight: 500, color: muted }}>
                <Clock size={11} strokeWidth={2.5} /> {STEP}
              </span>
              <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.05em", color: ink, marginTop: 18, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {fmt(secs)}
              </div>
            </Step>
          )}

          {phase === "done" && (
            <Step key="done" center>
              <motion.div
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                style={{
                  width: 60, height: 60, borderRadius: 18, background: "#FF5A36",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Check size={28} strokeWidth={2.5} color="#fff" />
              </motion.div>
              <Title center style={{ marginTop: 18 }}>You started.</Title>
              <p style={{ fontSize: 13, color: muted, marginTop: 6 }}>
                That was the hard part — and you did it.
              </p>
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16,
                  padding: "8px 16px", borderRadius: 9999,
                  background: "var(--xp, #A78BFA)", color: "#fff", fontSize: 13, fontWeight: 600,
                }}
              >
                <Zap size={13} strokeWidth={2.5} fill="#fff" /> +20 XP
              </span>
            </Step>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── small presentational helpers ── */

function Step({ children, center, ...rest }: { children: React.ReactNode; center?: boolean } & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: center ? "center" : "flex-start",
        justifyContent: "center",
        textAlign: center ? "center" : "left",
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function Title({ children, small, center, style }: { children: React.ReactNode; small?: boolean; center?: boolean; style?: React.CSSProperties }) {
  return (
    <h3 style={{ fontSize: small ? 20 : 26, fontWeight: 700, letterSpacing: "-0.02em", color: ink, lineHeight: 1.15, textAlign: center ? "center" : "left", ...style }}>
      {children}
    </h3>
  );
}

function Italic({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>
      {children}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint, marginBottom: 6 }}>
      {children}
    </p>
  );
}

function PrimaryBtn({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 14, width: "100%", padding: "13px 0", borderRadius: 10,
        background: "#FF5A36", color: "#fff", fontSize: 14, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}
    >
      {children}
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      style={{ display: "inline-block", width: 2, height: 15, marginLeft: 2, background: "#FF5A36", verticalAlign: "middle" }}
    />
  );
}
