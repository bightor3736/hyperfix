"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BrickWall, ArrowRight, Check, Loader2, RefreshCw, Play, Pause } from "lucide-react";
import { firstStepFor, WALL_XP } from "@/lib/walls/steps";
import { Confetti } from "./Confetti";

type Phase = "idle" | "step" | "done";

export function BeatTheWall({ wallsTotal = 0, name }: { wallsTotal?: number; name?: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [task, setTask] = useState("");
  const [step, setStep] = useState("");
  const [saving, setSaving] = useState(false);
  const [total, setTotal] = useState(wallsTotal);
  const [confettiKey, setConfettiKey] = useState(0);

  const [secs, setSecs] = useState(120);
  const [running, setRunning] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => setSecs((s) => (s <= 1 ? 0 : s - 1)), 1000);
      return () => { if (tick.current) clearInterval(tick.current); };
    }
  }, [running]);

  function breakItDown() {
    const t = task.trim();
    if (!t) return;
    setStep(firstStepFor(t));
    setPhase("step");
    setSecs(120);
    setRunning(false);
  }

  function reroll() {
    const variants = [
      firstStepFor(task + " "),
      "Set a 2-minute timer and do the smallest visible piece. Stop when it rings.",
      "Do the very first physical action — open it, pick it up, sit down with it. Nothing more.",
    ];
    const next = variants.find((v) => v !== step) ?? variants[0];
    setStep(next);
  }

  async function started() {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/walls/break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: task.trim(), firstStep: step }),
      });
      if (res.ok) {
        setPhase("done");
        setTotal((n) => n + 1);
        setConfettiKey((k) => k + 1);
        setRunning(false);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setPhase("idle");
    setTask("");
    setStep("");
    setSecs(120);
    setRunning(false);
  }

  const mm = String(Math.floor(secs / 60)).padStart(1, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-xl)]"
      style={{
        background: "linear-gradient(145deg, #fff5ed 0%, #fff9f5 45%, #fffefe 100%)",
        border: "1px solid rgba(249,115,22,0.16)",
        boxShadow: "0 4px 32px rgba(249,115,22,0.08), 0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <Confetti fireKey={confettiKey} />

      {/* Card header bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0">
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--flame, #f97316)" }}
        >
          <BrickWall size={11} strokeWidth={2} />
          Beat the Wall
        </span>
        {total > 0 && (
          <div className="text-right">
            <span className="font-display text-[18px] leading-none tabular-nums" style={{ color: "var(--ink)" }}>{total}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest ml-1.5" style={{ color: "var(--ink-faint)" }}>broken</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="px-6 pt-4 pb-6 sm:px-7 sm:pb-7">
        {/* Heading */}
        <h2
          className="font-display text-ink leading-[1.05] mb-4"
          style={{ fontSize: "clamp(22px,3.8vw,30px)" }}
        >
          {phase === "done" ? "Wall broken." : phase === "step" ? "Just do this part." : "What are you avoiding?"}
        </h2>

        {/* IDLE */}
        {phase === "idle" && (
          <>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && breakItDown()}
              placeholder="e.g. reply to that email I've avoided for a week"
              maxLength={200}
              className="w-full rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[15px] text-ink outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1.5px solid rgba(249,115,22,0.18)",
              }}
            />
            <button
              onClick={breakItDown}
              disabled={!task.trim()}
              className="press-pop mt-3 w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "#fff",
                boxShadow: "0 6px 24px rgba(249,115,22,0.32), 0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              Shrink it down <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* STEP */}
        {phase === "step" && (
          <div className="anim-pop">
            <div
              className="rounded-[var(--radius-lg)] p-5 mb-4"
              style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(249,115,22,0.16)" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>
                Your 2-minute first step
              </p>
              <p className="font-display text-ink leading-snug" style={{ fontSize: "clamp(18px,3vw,24px)" }}>{step}</p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setRunning((r) => !r)}
                  className="press-pop inline-flex items-center gap-2 px-3 py-2 rounded-full font-mono text-[12px] tabular-nums"
                  style={{
                    background: "rgba(249,115,22,0.10)",
                    color: "#f97316",
                    border: "1px solid rgba(249,115,22,0.25)",
                  }}
                >
                  {running ? <Pause size={13} strokeWidth={2.5} /> : <Play size={13} strokeWidth={2.5} fill="currentColor" />}
                  {mm}:{ss}
                </button>
                <button
                  onClick={reroll}
                  className="press-pop inline-flex items-center gap-1.5 font-mono text-[11px] transition-colors"
                  style={{ color: "var(--ink-faint)" }}
                >
                  <RefreshCw size={12} strokeWidth={1.5} /> different step
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={started}
                disabled={saving}
                className="press-pop flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-50"
                style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.5} />}
                I started it
              </button>
              <button
                onClick={reset}
                disabled={saving}
                className="press-pop px-4 py-3.5 rounded-[var(--radius-lg)] font-sans text-[13px] font-medium transition-all disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.7)", color: "var(--ink-muted)", border: "1.5px solid rgba(249,115,22,0.15)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div className="anim-pop">
            <div
              className="rounded-[var(--radius-lg)] p-5 mb-4 text-center"
              style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(249,115,22,0.25)" }}
            >
              <p className="font-display text-ink" style={{ fontSize: "clamp(18px,3vw,24px)" }}>
                You started{name ? `, ${name}` : ""}. That was the whole battle.
              </p>
              <p className="anim-floatUp font-display text-[22px] mt-1" style={{ color: "var(--xp)" }}>+{WALL_XP} XP</p>
            </div>
            <button
              onClick={reset}
              className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "#fff",
                boxShadow: "0 6px 24px rgba(249,115,22,0.32)",
              }}
            >
              <BrickWall size={17} strokeWidth={2.5} /> Break another wall
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
