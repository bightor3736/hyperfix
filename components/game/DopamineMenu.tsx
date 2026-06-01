"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, RefreshCw, Check, Loader2, Clock, BatteryLow, BatteryMedium, BatteryFull, type LucideIcon } from "lucide-react";
import {
  pickHit,
  xpFor,
  CATEGORY_META,
  type DopamineActivity,
  type Energy,
  type DopamineCategory,
} from "@/lib/dopamine/menu";
import { Confetti } from "./Confetti";

const ENERGY_OPTS: { value: Energy; label: string; icon: LucideIcon }[] = [
  { value: "low", label: "Low", icon: BatteryLow },
  { value: "med", label: "Some", icon: BatteryMedium },
  { value: "high", label: "Lots", icon: BatteryFull },
];

const DAILY_GOAL = 3;

export function DopamineMenu({ todayCount = 0, name }: { todayCount?: number; name?: string }) {
  const router = useRouter();
  const [energy, setEnergy] = useState<Energy>("low");
  const [category, setCategory] = useState<DopamineCategory | null>(null);
  const [activity, setActivity] = useState<DopamineActivity | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(todayCount);
  const [gainedXp, setGainedXp] = useState<number | null>(null);
  const [jackpot, setJackpot] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  function roll(opts?: { energy?: Energy; category?: DopamineCategory | null }) {
    setDone(false);
    setGainedXp(null);
    setJackpot(false);
    const e = opts?.energy ?? energy;
    const c = opts?.category !== undefined ? opts.category : category;
    setActivity((prev) => pickHit({ energy: e, category: c ?? undefined, exclude: prev?.id }));
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
        const data = (await res.json()) as { xp: number; jackpot?: boolean };
        setGainedXp(data.xp);
        setJackpot(Boolean(data.jackpot));
        setDone(true);
        setCount((c) => c + 1);
        setConfettiKey((k) => k + (data.jackpot ? 2 : 1));
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  const goalPct = Math.min(100, (count / DAILY_GOAL) * 100);

  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8"
      style={{
        background:
          "radial-gradient(120% 120% at 0% 0%, var(--energy-soft) 0%, var(--bg-elevated) 55%)",
        border: "1px solid var(--line)",
      }}
    >
      <Confetti fireKey={confettiKey} />

      {/* Header row: label + daily goal dots */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--energy)" }}>
            Dopamine Menu
          </p>
          <h2
            className="font-display leading-[1.05]"
            style={{ fontSize: "clamp(24px,4.5vw,36px)", color: done && jackpot ? "var(--xp)" : "var(--ink)" }}
          >
            {done
              ? jackpot
                ? "Jackpot! Triple XP."
                : `That beat the scroll${name ? `, ${name}` : ""}.`
              : activity
              ? "Do this. Right now."
              : `${name ? `${name}, b` : "B"}ored? Don't open the feed.`}
          </h2>
        </div>

        {/* Daily goal ring */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="flex items-center gap-1">
            {Array.from({ length: DAILY_GOAL }).map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: 8,
                  height: 8,
                  background: i < count ? "var(--energy)" : "var(--line)",
                  transform: i < count ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint">
            {count}/{DAILY_GOAL} today
          </p>
        </div>
      </div>

      {/* IDLE */}
      {!activity && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mr-1">Energy</span>
            {ENERGY_OPTS.map((opt) => {
              const on = energy === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setEnergy(opt.value)}
                  className="press-pop inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[12px] font-medium transition-all"
                  style={{
                    background: on ? "var(--energy)" : "var(--bg)",
                    color: on ? "#fff" : "var(--ink-muted)",
                    border: `1px solid ${on ? "var(--energy)" : "var(--line)"}`,
                  }}
                >
                  <Icon size={14} strokeWidth={2} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => roll()}
            className="press-pop anim-pulseGlow w-full flex items-center justify-center gap-2.5 py-4 rounded-[var(--radius-lg)] font-sans text-[16px] font-bold transition-all hover:opacity-95"
            style={{ background: "var(--energy)", color: "#fff" }}
          >
            <Zap size={20} strokeWidth={2.5} fill="#fff" />
            Give me a hit
          </button>
          <p className="mt-3 text-center font-mono text-[10px] text-ink-faint">
            One tap. A real dopamine hit that isn&apos;t your phone.
          </p>
        </>
      )}

      {/* ACTIVE */}
      {activity && (
        <ActiveCard
          activity={activity}
          done={done}
          saving={saving}
          gainedXp={gainedXp}
          jackpot={jackpot}
          onComplete={complete}
          onReroll={() => roll()}
        />
      )}

      {/* subtle progress bar at the very bottom */}
      <div className="mt-6 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${goalPct}%`, background: "linear-gradient(90deg, var(--energy), var(--flame))" }}
        />
      </div>
    </div>
  );
}

function ActiveCard({
  activity,
  done,
  saving,
  gainedXp,
  jackpot,
  onComplete,
  onReroll,
}: {
  activity: DopamineActivity;
  done: boolean;
  saving: boolean;
  gainedXp: number | null;
  jackpot: boolean;
  onComplete: () => void;
  onReroll: () => void;
}) {
  const cat = CATEGORY_META[activity.category];
  const CatIcon = cat.icon;

  return (
    <div className="anim-pop">
      <div
        className="rounded-[var(--radius-lg)] p-5 mb-4"
        style={{
          background: done ? (jackpot ? "var(--xp-soft)" : "var(--accent-soft)") : "var(--bg)",
          border: `1px solid ${done ? (jackpot ? "var(--xp)" : "var(--accent)") : "var(--line)"}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", color: cat.color }}
          >
            <CatIcon size={12} strokeWidth={2} /> {cat.label}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-faint">
              <Clock size={11} strokeWidth={1.5} />
              {activity.minutes} min
            </span>
            <span className="relative font-mono text-[12px] font-semibold tabular-nums" style={{ color: "var(--xp)" }}>
              +{xpFor(activity)} XP
              {done && gainedXp != null && (
                <span
                  className="anim-floatUp absolute -top-1 right-0 whitespace-nowrap font-display"
                  style={{ color: "var(--xp)", fontSize: jackpot ? 22 : 18 }}
                >
                  +{gainedXp}{jackpot ? " ×3!" : ""}
                </span>
              )}
            </span>
          </div>
        </div>

        <p className="font-display text-ink leading-snug" style={{ fontSize: "clamp(20px,3.6vw,28px)" }}>
          {activity.label}
        </p>
      </div>

      {done ? (
        <button
          onClick={onReroll}
          className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all hover:opacity-95"
          style={{ background: "var(--energy)", color: "#fff" }}
        >
          <Zap size={18} strokeWidth={2.5} fill="#fff" />
          Give me another
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={onComplete}
            disabled={saving}
            className="press-pop flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all hover:opacity-95 disabled:opacity-50"
            style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.5} />}
            I did it
          </button>
          <button
            onClick={onReroll}
            disabled={saving}
            className="press-pop flex items-center justify-center gap-2 px-5 py-3.5 rounded-[var(--radius-lg)] font-sans text-[14px] font-medium transition-all disabled:opacity-50"
            style={{ background: "var(--bg-elevated)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
          >
            <RefreshCw size={15} strokeWidth={1.5} />
            Reroll
          </button>
        </div>
      )}
    </div>
  );
}
