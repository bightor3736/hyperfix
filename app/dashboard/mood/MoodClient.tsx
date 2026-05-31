"use client";

import { useState } from "react";

const PAGE_BG = "#070708";
const CARD_BG = "#0F1011";
const BORDER = "rgba(255,255,255,0.07)";
const TEAL = "#5EEAD4";
const TEAL_BG = "rgba(94,234,212,0.08)";
const TEAL_BD = "rgba(94,234,212,0.20)";
const MUTED = "rgba(255,255,255,0.45)";

interface MoodLog {
  id: string;
  date: string;
  energy: number;
  focus: number;
  mood: number;
  note: string | null;
  created_at: string;
}

interface Props {
  today: MoodLog | null;
  history: MoodLog[];
}

function SliderField({
  label,
  emoji,
  value,
  onChange,
  color,
}: {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: "#fff" }}>
          {emoji} {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 700,
            color,
          }}
        >
          {value}/10
        </span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            borderRadius: 99,
            background: color,
            width: `${(value / 10) * 100}%`,
            transition: "width 0.15s",
          }}
        />
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            margin: 0,
          }}
        />
      </div>
    </div>
  );
}

function heatColor(val: number | undefined) {
  if (val === undefined) return "rgba(255,255,255,0.04)";
  const pct = (val - 1) / 9;
  if (pct < 0.25) return "#EF4444";
  if (pct < 0.5) return "#F59E0B";
  if (pct < 0.75) return "#60A5FA";
  return "#5EEAD4";
}

export function MoodClient({ today, history }: Props) {
  const [energy, setEnergy] = useState(today?.energy ?? 5);
  const [focus, setFocus] = useState(today?.focus ?? 5);
  const [mood, setMood] = useState(today?.mood ?? 5);
  const [note, setNote] = useState(today?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/mood/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ energy, focus, mood, note: note.trim() || null }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    const entry = history.find((h) => h.date === key);
    return { key, entry };
  });

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
            Mood Log
          </h1>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: MUTED }}>
            Track your energy, focus, and mood daily to spot patterns.
          </p>
        </div>

        {/* Today's log */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: "24px 24px 20px",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontWeight: 600, color: MUTED }}>
              TODAY — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
            {today && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: TEAL, background: TEAL_BG, border: `1px solid ${TEAL_BD}`, borderRadius: 99, padding: "2px 10px" }}>
                Logged ✓
              </span>
            )}
          </div>

          <SliderField label="Energy" emoji="⚡" value={energy} onChange={setEnergy} color="#F59E0B" />
          <SliderField label="Focus" emoji="🎯" value={focus} onChange={setFocus} color="#60A5FA" />
          <SliderField label="Mood" emoji="💚" value={mood} onChange={setMood} color={TEAL} />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note — what's shaping today? (optional)"
            rows={2}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "10px 12px",
              fontFamily: "var(--font-instrument)",
              fontSize: 13,
              color: "#fff",
              resize: "none",
              outline: "none",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={save}
            disabled={saving}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 12,
              border: "none",
              background: saved ? "rgba(94,234,212,0.15)" : TEAL,
              color: saved ? TEAL : "#070708",
              fontFamily: "var(--font-instrument)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {saved ? "Saved ✓" : saving ? "Saving…" : today ? "Update today's log" : "Log today"}
          </button>
        </div>

        {/* 30-day heatmap */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontFamily: "var(--font-instrument)", fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 16 }}>
            30-DAY MOOD HEATMAP
          </h2>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {last30.map(({ key, entry }) => {
              const avg = entry ? Math.round((entry.energy + entry.focus + entry.mood) / 3) : undefined;
              return (
                <div
                  key={key}
                  title={entry ? `${key}: avg ${avg}/10` : key}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: heatColor(avg),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: avg ? "rgba(255,255,255,0.7)" : "transparent",
                    cursor: "default",
                    border: `1px solid rgba(255,255,255,0.04)`,
                  }}
                >
                  {avg ?? ""}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {[
              { color: "#EF4444", label: "Low (1-3)" },
              { color: "#F59E0B", label: "Okay (4-5)" },
              { color: "#60A5FA", label: "Good (6-7)" },
              { color: TEAL, label: "Great (8-10)" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: MUTED }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
