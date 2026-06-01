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

  // optional 2-minute timer
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
    // nudge to a different generic-feeling phrasing by appending a space variant
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
      className="relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-7"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <Confetti fireKey={confettiKey} />

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--energy)" }}>
            <BrickWall size={12} strokeWidth={2} /> Beat the Wall
          </p>
          <h2 className="font-display text-ink leading-[1.05]" style={{ fontSize: "clamp(20px,3.6vw,28px)" }}>
            {phase === "done" ? "Wall broken." : phase === "step" ? "Just do this part." : "What are you avoiding?"}
          </h2>
        </div>
        {total > 0 && (
          <div className="shrink-0 text-right">
            <p className="font-display text-[22px] leading-none text-ink tabular-nums">{total}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-faint mt-0.5">walls broken</p>
          </div>
        )}
      </div>

      {/* IDLE */}
      {phase === "idle" && (
        <>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && breakItDown()}
            placeholder="e.g. reply to that email I've avoided for a week"
            maxLength={200}
            className="w-full rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[15px] text-ink outline-none transition-all focus:border-[var(--energy)]"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          />
          <button
            onClick={breakItDown}
            disabled={!task.trim()}
            className="press-pop mt-3 w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all hover:opacity-95 disabled:opacity-40"
            style={{ background: "var(--energy)", color: "#fff" }}
          >
            Shrink it down <ArrowRight size={17} strokeWidth={2.5} />
          </button>
          <p className="mt-3 text-center font-mono text-[10px] text-ink-faint">
            We don&apos;t reward finishing. We reward starting — that&apos;s the wall.
          </p>
        </>
      )}

      {/* STEP */}
      {phase === "step" && (
        <div className="anim-pop">
          <div className="rounded-[var(--radius-lg)] p-5 mb-4" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">Your 2-minute first step</p>
            <p className="font-display text-ink leading-snug" style={{ fontSize: "clamp(18px,3vw,24px)" }}>{step}</p>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setRunning((r) => !r)}
                className="press-pop inline-flex items-center gap-2 px-3 py-2 rounded-full font-mono text-[12px] tabular-nums"
                style={{ background: "var(--energy-soft)", color: "var(--energy)", border: "1px solid var(--energy)" }}
              >
                {running ? <Pause size={13} strokeWidth={2.5} /> : <Play size={13} strokeWidth={2.5} fill="currentColor" />}
                {mm}:{ss}
              </button>
              <button onClick={reroll} className="press-pop inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-faint hover:text-ink transition-colors">
                <RefreshCw size={12} strokeWidth={1.5} /> different step
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={started}
              disabled={saving}
              className="press-pop flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all hover:opacity-95 disabled:opacity-50"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.5} />}
              I started it
            </button>
            <button
              onClick={reset}
              disabled={saving}
              className="press-pop px-4 py-3.5 rounded-[var(--radius-lg)] font-sans text-[13px] font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--bg)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === "done" && (
        <div className="anim-pop">
          <div className="rounded-[var(--radius-lg)] p-5 mb-4 text-center" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
            <p className="font-display text-ink" style={{ fontSize: "clamp(18px,3vw,24px)" }}>
              You started{name ? `, ${name}` : ""}. That was the whole battle.
            </p>
            <p className="anim-floatUp font-display text-[22px] mt-1" style={{ color: "var(--xp)" }}>+{WALL_XP} XP</p>
          </div>
          <button
            onClick={reset}
            className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all hover:opacity-95"
            style={{ background: "var(--energy)", color: "#fff" }}
          >
            <BrickWall size={17} strokeWidth={2.5} /> Break another wall
          </button>
        </div>
      )}
    </div>
  );
}
