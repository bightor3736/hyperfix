"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, RefreshCw, Check, Loader2, Clock, Flame } from "lucide-react";
import {
  pickHit,
  xpFor,
  CATEGORY_META,
  type DopamineActivity,
  type Energy,
} from "@/lib/dopamine/menu";

const ENERGY_OPTS: { value: Energy; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "med", label: "Some" },
  { value: "high", label: "Lots" },
];

export function DopamineButton({ todayCount = 0 }: { todayCount?: number }) {
  const router = useRouter();
  const [energy, setEnergy] = useState<Energy>("low");
  const [activity, setActivity] = useState<DopamineActivity | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(todayCount);
  const [gainedXp, setGainedXp] = useState<number | null>(null);

  function roll(nextEnergy?: Energy) {
    setDone(false);
    setGainedXp(null);
    const e = nextEnergy ?? energy;
    setActivity((prev) => pickHit({ energy: e, exclude: prev?.id }));
  }

  async function complete() {
    if (!activity || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dopamine/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: activity.id }),
      });
      if (res.ok) {
        const data = (await res.json()) as { xp: number };
        setGainedXp(data.xp);
        setDone(true);
        setCount((c) => c + 1);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  // Idle state — the big button
  if (!activity) {
    return (
      <div
        className="rounded-2xl p-6 sm:p-7"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
              Understimulated?
            </p>
            <h2 className="font-display text-ink leading-tight" style={{ fontSize: "clamp(22px,4vw,30px)" }}>
              Don&apos;t reach for the feed.
            </h2>
          </div>
          {count > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
              <Flame size={13} strokeWidth={2} className="text-accent" />
              <span className="font-mono text-[11px] text-accent">{count} today</span>
            </div>
          )}
        </div>

        {/* Energy picker */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint shrink-0">
            Energy
          </span>
          {ENERGY_OPTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEnergy(opt.value)}
              className="px-3 py-1 rounded-full font-mono text-[11px] transition-all"
              style={{
                background: energy === opt.value ? "var(--accent)" : "var(--bg)",
                color: energy === opt.value ? "var(--invert-ink)" : "var(--ink-muted)",
                border: `1px solid ${energy === opt.value ? "var(--accent)" : "var(--line)"}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => roll()}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-sans text-[15px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
        >
          <Zap size={18} strokeWidth={2} />
          Give me a hit
        </button>
      </div>
    );
  }

  // Active state — showing a suggestion
  const cat = CATEGORY_META[activity.category];

  return (
    <div
      className="rounded-2xl p-6 sm:p-7 anim-fadeUp"
      style={{
        background: done ? "var(--accent-soft)" : "var(--bg-elevated)",
        border: `1px solid ${done ? "var(--accent)" : "var(--line)"}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
            style={{ background: "var(--bg)", border: "1px solid var(--line)", color: cat.color }}
          >
            <span>{cat.emoji}</span> {cat.label}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-faint">
            <Clock size={11} strokeWidth={1.5} />
            {activity.minutes} min
          </span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-accent">
          +{xpFor(activity)} XP
        </span>
      </div>

      <p className="font-display text-ink leading-snug mb-6" style={{ fontSize: "clamp(20px,3.5vw,28px)" }}>
        {activity.label}
      </p>

      {done ? (
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-sans text-[14px] font-medium text-accent">
            <Check size={16} strokeWidth={2.5} />
            Nice. {gainedXp ? `+${gainedXp} XP` : ""} — that beat the scroll.
          </p>
          <button
            onClick={() => roll()}
            className="font-mono text-[11px] text-accent hover:opacity-80 transition-opacity"
          >
            Another →
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={complete}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-sans text-[14px] font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2} />}
            I did it
          </button>
          <button
            onClick={() => roll()}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-sans text-[13px] font-medium transition-all hover:bg-bg active:scale-[0.97] disabled:opacity-50"
            style={{ background: "var(--bg)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
          >
            <RefreshCw size={14} strokeWidth={1.5} />
            Reroll
          </button>
        </div>
      )}
    </div>
  );
}
