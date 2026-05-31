"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PAGE_BG = "var(--bg)";
const CARD_BG = "var(--bg)";
const BORDER = "var(--line)";
const TEAL = "var(--accent)";
const TEAL_BG = "var(--accent-soft)";
const TEAL_BD = "var(--accent)";
const MUTED = "var(--ink-muted)";

const MODES = [
  { id: "focus", label: "Focus", minutes: 25, desc: "Deep work sprint" },
  { id: "pomodoro", label: "Pomodoro", minutes: 25, desc: "25 min work · 5 min break" },
  { id: "ultradian", label: "Ultradian", minutes: 90, desc: "90 min peak · 20 min rest" },
  { id: "body-double", label: "Body-double", minutes: 50, desc: "Side-by-side focus" },
] as const;

type Mode = (typeof MODES)[number]["id"];

function CircleTimer({
  progress,
  size = 220,
  children,
}: {
  progress: number;
  size?: number;
  children: React.ReactNode;
}) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TEAL}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function TimerClient() {
  const [mode, setMode] = useState<Mode>("focus");
  const [totalSecs, setTotalSecs] = useState(MODES[0].minutes * 60);
  const [remaining, setRemaining] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedMode = MODES.find((m) => m.id === mode)!;

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    setPhase("work");
    const secs = selectedMode.minutes * 60;
    setTotalSecs(secs);
    setRemaining(secs);
  }, [selectedMode]);

  useEffect(() => {
    reset();
  }, [mode, reset]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setSessionCount((c) => c + 1);
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Hyperfix Timer", {
              body: phase === "work" ? "Work session done! Take a break." : "Break over. Back to work!",
            });
          }
          const breakSecs = mode === "pomodoro" ? 5 * 60 : mode === "ultradian" ? 20 * 60 : 0;
          if (breakSecs && phase === "work") {
            setPhase("break");
            setTotalSecs(breakSecs);
            return breakSecs;
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, mode]);

  function requestNotifications() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  function toggle() {
    if (!running) requestNotifications();
    setRunning((r) => !r);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = totalSecs > 0 ? remaining / totalSecs : 0;

  const focusToday = Math.round((sessionCount * selectedMode.minutes) / 60 * 10) / 10;

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
            Time Blindness Timer
          </h1>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: MUTED }}>
            Visual countdowns designed for the ADHD brain.
          </p>
        </div>

        {/* Mode picker */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            marginBottom: 28,
          }}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: `1px solid ${mode === m.id ? TEAL_BD : BORDER}`,
                background: mode === m.id ? TEAL_BG : "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 14, fontWeight: 600, color: mode === m.id ? TEAL : "var(--ink)", marginBottom: 2 }}>
                {m.label}
              </div>
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: MUTED }}>
                {m.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            padding: "36px 24px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            marginBottom: 20,
          }}
        >
          {/* Phase label */}
          {(mode === "pomodoro" || mode === "ultradian") && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: phase === "work" ? TEAL : "#F59E0B",
                background: phase === "work" ? TEAL_BG : "rgba(245,158,11,0.1)",
                border: `1px solid ${phase === "work" ? TEAL_BD : "rgba(245,158,11,0.25)"}`,
                borderRadius: 99,
                padding: "4px 14px",
              }}
            >
              {phase === "work" ? "FOCUS TIME" : "BREAK TIME"}
            </div>
          )}

          <CircleTimer progress={progress}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 42,
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {mm}:{ss}
            </span>
            <span style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED, marginTop: 4 }}>
              {selectedMode.label}
            </span>
          </CircleTimer>

          {/* Controls */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={toggle}
              style={{
                padding: "12px 36px",
                borderRadius: 12,
                border: running ? `1px solid ${TEAL_BD}` : "none",
                background: running ? "var(--accent-soft)" : TEAL,
                color: running ? TEAL : "var(--accent-ink)",
                fontFamily: "var(--font-instrument)",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              } as React.CSSProperties}
            >
              {running ? "Pause" : remaining === totalSecs ? "Start" : "Resume"}
            </button>
            <button
              onClick={reset}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                background: "transparent",
                color: MUTED,
                fontFamily: "var(--font-instrument)",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Session stats */}
        {sessionCount > 0 && (
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: TEAL }}>{sessionCount}</div>
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED, marginTop: 2 }}>Sessions today</div>
            </div>
            <div style={{ flex: 1, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: TEAL }}>{focusToday}h</div>
              <div style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED, marginTop: 2 }}>Focus time</div>
            </div>
          </div>
        )}

        {/* Tip */}
        <div
          style={{
            marginTop: 20,
            padding: "14px 18px",
            borderRadius: 12,
            background: TEAL_BG,
            border: `1px solid ${TEAL_BD}`,
            fontFamily: "var(--font-instrument)",
            fontSize: 13,
            color: "var(--ink-muted)",
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: TEAL }}>Time blindness tip:</strong> ADHD brains struggle to feel time passing.
          Visible countdowns like this create an external "time anchor." Use it before you feel the urge to check your phone.
        </div>
      </div>
    </div>
  );
}
