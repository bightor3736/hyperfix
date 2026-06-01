"use client";

import { useState, useEffect, useRef } from "react";
import { Timer, MessageSquare, X, Check, Play, Pause, RotateCcw } from "lucide-react";

type ProofType = "timer" | "note";

export interface ProofResult {
  type: ProofType;
  note?: string;
  timerSeconds?: number;
}

interface ProofModalProps {
  activityLabel: string;
  minutes: number;
  xp: number;
  onSubmit: (proof: ProofResult) => void;
  onCancel: () => void;
}

export function ProofModal({ activityLabel, minutes, xp, onSubmit, onCancel }: ProofModalProps) {
  const [tab, setTab] = useState<ProofType>("timer");
  const [note, setNote] = useState("");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetSeconds = minutes * 60;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= targetSeconds) {
            setRunning(false);
            setComplete(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return targetSeconds;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, targetSeconds]);

  function submit() {
    if (tab === "timer") {
      onSubmit({ type: "timer", timerSeconds: elapsed });
    } else {
      onSubmit({ type: "note", note: note.trim() });
    }
  }

  const canSubmit =
    tab === "timer" ? complete || elapsed >= 30 : note.trim().length >= 5;
  const pct = Math.min(100, (elapsed / targetSeconds) * 100);
  const remaining = targetSeconds - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="w-full max-w-[440px] rounded-[var(--radius-xl)] p-6"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="min-w-0 pr-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-1">
              Proof of action
            </p>
            <p className="font-display text-[18px] leading-snug text-ink line-clamp-2">
              {activityLabel}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="shrink-0 p-1.5 rounded-full transition-opacity hover:opacity-70"
            style={{ color: "var(--ink-muted)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div
          className="flex items-center gap-1 mb-5 p-1 rounded-xl"
          style={{ background: "var(--bg-soft)" }}
        >
          {(
            [
              { id: "timer" as ProofType, label: "Run timer", icon: Timer },
              { id: "note" as ProofType, label: "Write note", icon: MessageSquare },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-sans text-[12px] font-medium transition-all"
              style={{
                background: tab === id ? "var(--bg-elevated)" : "transparent",
                color: tab === id ? "var(--ink)" : "var(--ink-muted)",
                border: tab === id ? "1px solid var(--line)" : "1px solid transparent",
              }}
            >
              <Icon size={13} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        {/* Timer tab */}
        {tab === "timer" && (
          <div className="text-center">
            <p
              className="font-display tabular-nums text-ink mb-3 leading-none"
              style={{ fontSize: 56 }}
            >
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </p>
            <div
              className="h-2 rounded-full overflow-hidden mb-5"
              style={{ background: "var(--line)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--accent), var(--xp))",
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setRunning((r) => !r)}
                disabled={complete}
                className="press-pop inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold disabled:opacity-40"
                style={{ background: "var(--energy)", color: "var(--accent-ink)" }}
              >
                {running ? (
                  <Pause size={16} strokeWidth={2.5} />
                ) : (
                  <Play size={16} strokeWidth={2.5} />
                )}
                {complete ? "Done!" : running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
              </button>
              {elapsed > 0 && !running && (
                <button
                  onClick={() => {
                    setElapsed(0);
                    setComplete(false);
                  }}
                  className="p-3 rounded-[var(--radius-lg)] transition-opacity hover:opacity-70"
                  style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
                >
                  <RotateCcw size={15} strokeWidth={1.5} />
                </button>
              )}
            </div>
            {elapsed >= 30 && !complete && (
              <p className="mt-3 font-mono text-[10px] text-ink-faint">
                You showed up — that&apos;s enough. Claim early if you want.
              </p>
            )}
          </div>
        )}

        {/* Note tab */}
        {tab === "note" && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">
              What did you actually do?
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Did 10 push-ups in the kitchen. Barely counts but it counts."
              className="w-full resize-none rounded-[var(--radius-lg)] p-4 font-sans text-[14px] text-ink bg-transparent outline-none"
              style={{
                border: "1px solid var(--line)",
                minHeight: 110,
                lineHeight: 1.5,
              }}
              autoFocus
            />
            <p className="mt-1.5 font-mono text-[10px] text-ink-faint">
              {note.length} chars{note.trim().length < 5 ? " · a few more words" : ""}
            </p>
          </div>
        )}

        {/* Claim button */}
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="press-pop w-full flex items-center justify-center gap-2 py-3.5 mt-5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-30"
          style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
        >
          <Check size={18} strokeWidth={2.5} />
          Claim +{xp} XP
        </button>
      </div>
    </div>
  );
}
