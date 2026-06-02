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
import { ProofModal, type ProofResult } from "./ProofModal";

const ENERGY_OPTS: { value: Energy; label: string; icon: LucideIcon }[] = [
  { value: "low", label: "Low", icon: BatteryLow },
  { value: "med", label: "Some", icon: BatteryMedium },
  { value: "high", label: "Lots", icon: BatteryFull },
];

const DAILY_GOAL = 3;

// Dark theme constants — self-contained so this card always reads on the dark bg
const T = {
  label:   "rgba(167,139,250,0.85)",
  heading: "#ffffff",
  muted:   "rgba(255,255,255,0.55)",
  faint:   "rgba(255,255,255,0.30)",
  line:    "rgba(255,255,255,0.10)",
  pill:    "rgba(255,255,255,0.08)",
  pillOn:  "rgba(139,92,246,0.30)",
  dot:     "rgba(255,255,255,0.18)",
  dotOn:   "#a78bfa",
  track:   "rgba(255,255,255,0.10)",
};

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
  const [showProof, setShowProof] = useState(false);

  function roll(opts?: { energy?: Energy; category?: DopamineCategory | null }) {
    setDone(false);
    setGainedXp(null);
    setJackpot(false);
    const e = opts?.energy ?? energy;
    const c = opts?.category !== undefined ? opts.category : category;
    setActivity((prev) => pickHit({ energy: e, category: c ?? undefined, exclude: prev?.id }));
  }

  function requestProof() {
    if (!activity || saving || done) return;
    setShowProof(true);
  }

  async function complete(proof?: ProofResult) {
    if (!activity || saving) return;
    setShowProof(false);
    setSaving(true);
    try {
      const res = await fetch("/api/dopamine/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: activity.id, proof: proof ?? null }),
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
      className="relative overflow-hidden rounded-[var(--radius-xl)]"
      style={{
        background: [
          "radial-gradient(ellipse 80% 100% at 100% 20%, rgba(139,92,246,0.45) 0%, transparent 55%)",
          "radial-gradient(ellipse 50% 70% at 0%   80%, rgba(99,102,241,0.30) 0%, transparent 50%)",
          "linear-gradient(160deg, #1a1580 0%, #0f0d40 100%)",
        ].join(", "),
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 12px 48px rgba(15,13,64,0.50), 0 2px 8px rgba(0,0,0,0.20)",
      }}
    >
      <Confetti fireKey={confettiKey} />

      {showProof && activity && (
        <ProofModal
          activityLabel={activity.label}
          minutes={activity.minutes}
          xp={xpFor(activity)}
          onSubmit={(proof) => complete(proof)}
          onCancel={() => setShowProof(false)}
        />
      )}

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 px-6 pt-5 pb-6 sm:px-8 sm:pb-8">

        {/* Top bar: label + daily dots */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: T.label }}
          >
            <Zap size={10} strokeWidth={2.5} fill="currentColor" />
            Dopamine Menu
          </span>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: DAILY_GOAL }).map((_, i) => (
                <span
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: 7, height: 7,
                    background: i < count ? T.dotOn : T.dot,
                    transform: i < count ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: T.faint }}>
              {count}/{DAILY_GOAL} today
            </p>
          </div>
        </div>

        {/* Heading */}
        <h2
          className="font-display leading-[1.0] mb-5"
          style={{
            fontSize: "clamp(26px,5vw,40px)",
            color: done && jackpot ? "#c084fc" : T.heading,
          }}
        >
          {done
            ? jackpot
              ? "Jackpot! Triple XP."
              : `That beat the scroll${name ? `, ${name}` : ""}.`
            : activity
            ? "Do this. Right now."
            : `${name ? `${name}, b` : "B"}ored? Don't open the feed.`}
        </h2>

        {/* IDLE */}
        {!activity && (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {ENERGY_OPTS.map((opt) => {
                const on = energy === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setEnergy(opt.value)}
                    className="press-pop inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-sans text-[12px] font-medium transition-all"
                    style={{
                      background: on ? T.pillOn : T.pill,
                      color: on ? "#fff" : T.muted,
                      border: `1.5px solid ${on ? "rgba(139,92,246,0.6)" : T.line}`,
                    }}
                  >
                    <Icon size={13} strokeWidth={2} />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => roll()}
              className="press-pop w-full flex items-center justify-center gap-2.5 rounded-[var(--radius-lg)] font-sans font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                color: "#fff",
                fontSize: 18,
                padding: "20px 24px",
                boxShadow: "0 8px 40px rgba(139,92,246,0.55), 0 2px 8px rgba(0,0,0,0.20)",
                letterSpacing: "-0.01em",
              }}
            >
              <Zap size={22} strokeWidth={2.5} fill="#fff" />
              Give me a hit
            </button>
          </>
        )}

        {/* ACTIVE */}
        {activity && (
          <DarkActiveCard
            activity={activity}
            done={done}
            saving={saving}
            gainedXp={gainedXp}
            jackpot={jackpot}
            onComplete={requestProof}
            onReroll={() => roll()}
          />
        )}

        {/* Progress bar */}
        <div className="mt-6 h-1 rounded-full overflow-hidden" style={{ background: T.track }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${goalPct}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
          />
        </div>
      </div>
    </div>
  );
}

function DarkActiveCard({
  activity, done, saving, gainedXp, jackpot, onComplete, onReroll,
}: {
  activity: DopamineActivity; done: boolean; saving: boolean;
  gainedXp: number | null; jackpot: boolean;
  onComplete: () => void; onReroll: () => void;
}) {
  const cat = CATEGORY_META[activity.category];
  const CatIcon = cat.icon;

  return (
    <div className="anim-pop">
      <div
        className="rounded-[var(--radius-lg)] p-5 mb-4"
        style={{
          background: done
            ? jackpot ? "rgba(192,132,252,0.15)" : "rgba(99,102,241,0.15)"
            : "rgba(255,255,255,0.07)",
          border: `1.5px solid ${done
            ? jackpot ? "rgba(192,132,252,0.4)" : "rgba(99,102,241,0.4)"
            : "rgba(255,255,255,0.10)"}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)", color: cat.color }}
          >
            <CatIcon size={12} strokeWidth={2} /> {cat.label}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Clock size={11} strokeWidth={1.5} />
              {activity.minutes} min
            </span>
            <span className="relative font-mono text-[12px] font-semibold tabular-nums" style={{ color: "#c084fc" }}>
              +{xpFor(activity)} XP
              {done && gainedXp != null && (
                <span
                  className="anim-floatUp absolute -top-1 right-0 whitespace-nowrap font-display"
                  style={{ color: "#c084fc", fontSize: jackpot ? 22 : 18 }}
                >
                  +{gainedXp}{jackpot ? " ×3!" : ""}
                </span>
              )}
            </span>
          </div>
        </div>

        <p className="font-display leading-snug" style={{ fontSize: "clamp(20px,3.6vw,28px)", color: "#fff" }}>
          {activity.label}
        </p>
      </div>

      {done ? (
        <button
          onClick={onReroll}
          className="press-pop w-full flex items-center justify-center gap-2 py-4 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(139,92,246,0.50)",
          }}
        >
          <Zap size={18} strokeWidth={2.5} fill="#fff" />
          Give me another
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={onComplete}
            disabled={saving}
            className="press-pop flex-1 flex items-center justify-center gap-2 py-4 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-50"
            style={{ background: "#fff", color: "#1e1880" }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.5} />}
            I did it
          </button>
          <button
            onClick={onReroll}
            disabled={saving}
            className="press-pop flex items-center justify-center gap-2 px-5 py-4 rounded-[var(--radius-lg)] font-sans text-[14px] font-medium transition-all disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <RefreshCw size={15} strokeWidth={1.5} />
            Reroll
          </button>
        </div>
      )}
    </div>
  );
}
