"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Check, Coffee, Brain } from "lucide-react";

type Mode = "focus" | "break";
const DURATIONS: Record<Mode, number[]> = {
  focus: [15, 25, 50],
  break: [5, 10, 15],
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const todayKey = () => `hyperfix_focus_${new Date().toISOString().slice(0, 10)}`;

export default function TimerPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [task, setTask] = useState("");
  const [sessions, setSessions] = useState(0);
  const [justFinished, setJustFinished] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore today's completed-session count.
  useEffect(() => {
    const stored = Number(localStorage.getItem(todayKey()) ?? "0");
    if (!Number.isNaN(stored)) setSessions(stored);
  }, []);

  const total = minutes * 60;
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;

  const finish = useCallback(() => {
    setRunning(false);
    setRemaining(0);
    if (mode === "focus") {
      setJustFinished(true);
      setTimeout(() => setJustFinished(false), 4000);
      // Persist + record the session (auto-completes the focus_session quest).
      setSessions((prev) => {
        const next = prev + 1;
        localStorage.setItem(todayKey(), String(next));
        return next;
      });
      fetch("/api/focus/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes }),
      }).catch(() => { /* offline is fine — local count still updates */ });
      // Chime
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880; gain.gain.value = 0.12;
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        osc.stop(ctx.currentTime + 0.6);
      } catch { /* no audio */ }
    }
  }, [mode, minutes]);

  // Timer loop
  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          finish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [running, finish]);

  function selectMode(m: Mode) {
    setMode(m);
    setRunning(false);
    const def = m === "focus" ? 25 : 5;
    setMinutes(def);
    setRemaining(def * 60);
    setJustFinished(false);
  }

  function selectMinutes(m: number) {
    setMinutes(m);
    setRemaining(m * 60);
    setRunning(false);
    setJustFinished(false);
  }

  function reset() {
    setRunning(false);
    setRemaining(minutes * 60);
    setJustFinished(false);
  }

  const accent = "#ffffff";
  const ringBg = "rgba(255,255,255,0.08)";
  const R = 130, C = 2 * Math.PI * R;

  return (
    <div className="min-h-screen pb-24 flex flex-col" style={{ background: "#000000" }}>

      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-10">

        {/* Header */}
        <p className="mb-1 uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>Focus timer</p>
        <h1 className="mb-6 text-center" style={{ fontWeight: 500, letterSpacing: "-0.04em", fontSize: "clamp(30px,5vw,44px)", lineHeight: 1, color: "#ffffff" }}>
          Lock <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>in</span>.
        </h1>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 mb-7" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}>
          {(["focus", "break"] as const).map((m) => (
            <button
              key={m}
              onClick={() => selectMode(m)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-sans text-[13px] font-semibold transition-all"
              style={{
                background: mode === m ? "#ffffff" : "transparent",
                color: mode === m ? "#000000" : "rgba(255,255,255,0.55)",
              }}
            >
              {m === "focus" ? <Brain size={14} strokeWidth={2} /> : <Coffee size={14} strokeWidth={2} />}
              {m === "focus" ? "Focus" : "Break"}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="relative mb-7" style={{ width: 300, height: 300 }}>
          <svg width={300} height={300} className="-rotate-90">
            <circle cx={150} cy={150} r={R} fill="none" stroke={ringBg} strokeWidth={14} />
            <circle
              cx={150} cy={150} r={R} fill="none" stroke={accent} strokeWidth={14} strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {justFinished ? (
              <>
                <Check size={48} strokeWidth={2.5} style={{ color: accent }} />
                <p className="mt-2 font-sans text-[15px] font-semibold" style={{ color: "#fff" }}>Session done!</p>
                <p className="mt-1 uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#A78BFA" }}>+XP earned</p>
              </>
            ) : (
              <>
                <span className="tabular-nums" style={{ fontWeight: 700, fontSize: 64, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>
                  {fmt(remaining)}
                </span>
                <p className="mt-2 uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>
                  {mode === "focus" ? "Deep work" : "Recharge"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Duration presets */}
        <div className="flex gap-2 mb-6">
          {DURATIONS[mode].map((m) => (
            <button
              key={m}
              onClick={() => selectMinutes(m)}
              className="px-4 py-2 rounded-xl font-sans text-[13px] font-semibold tabular-nums transition-all"
              style={{
                background: minutes === m ? "#ffffff" : "rgba(255,255,255,0.03)",
                color: minutes === m ? "#000000" : "rgba(255,255,255,0.55)",
                border: `1px solid ${minutes === m ? "#ffffff" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {m}m
            </button>
          ))}
        </div>

        {/* Task input */}
        {mode === "focus" && (
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What are you working on?"
            className="w-full max-w-sm rounded-2xl px-4 py-3 font-sans text-[14px] outline-none mb-6 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
          />
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="press-pop flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-sans text-[16px] font-bold transition-all"
            style={{
              background: running ? "rgba(255,255,255,0.08)" : "#ffffff",
              color: running ? "#ffffff" : "#000000",
              fontWeight: 600,
              minWidth: 160,
            }}
          >
            {running ? <Pause size={20} strokeWidth={2.5} fill="currentColor" /> : <Play size={20} strokeWidth={2.5} fill="currentColor" />}
            {running ? "Pause" : remaining === minutes * 60 ? "Start" : "Resume"}
          </button>
          <button
            onClick={reset}
            className="press-pop flex items-center justify-center rounded-2xl transition-all"
            style={{ width: 56, height: 56, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
          >
            <RotateCcw size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Today's sessions */}
        {sessions > 0 && (
          <div className="mt-7 inline-flex items-center gap-1.5 px-4 py-2 rounded-full uppercase"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}>
            <Brain size={12} strokeWidth={2} /> {sessions} focus session{sessions === 1 ? "" : "s"} today
          </div>
        )}
      </div>
    </div>
  );
}
