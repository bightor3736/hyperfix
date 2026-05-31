"use client";

import { useState } from "react";

const PAGE_BG = "var(--bg)";
const CARD_BG = "var(--bg)";
const BORDER = "var(--line)";
const TEAL = "var(--accent)";
const TEAL_BG = "var(--accent-soft)";
const TEAL_BD = "var(--accent)";
const MUTED = "var(--ink-muted)";

interface MedLog {
  id: string;
  medication: string;
  dose: string;
  taken_at: string;
  effect_rating: number | null;
  notes: string | null;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MedsClient({ todayLogs, historyLogs }: { todayLogs: MedLog[]; historyLogs: MedLog[] }) {
  const [today, setToday] = useState<MedLog[]>(todayLogs);
  const [medication, setMedication] = useState("");
  const [dose, setDose] = useState("");
  const [takenAt, setTakenAt] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [effectRating, setEffectRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function logDose() {
    if (!medication.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/meds/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication: medication.trim(),
          dose: dose.trim(),
          taken_at: new Date(takenAt).toISOString(),
          effect_rating: effectRating,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.log) {
        setToday((prev) => [...prev, data.log].sort((a, b) => a.taken_at.localeCompare(b.taken_at)));
        setMedication("");
        setDose("");
        setEffectRating(null);
        setNotes("");
      }
    } finally {
      setSaving(false);
    }
  }

  // Build 14-day grid from history
  const days14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    const dayLogs = historyLogs.filter((l) => l.taken_at.slice(0, 10) === key);
    return { key, dayLogs };
  });

  // Group today by medication
  const grouped = today.reduce<Record<string, MedLog[]>>((acc, l) => {
    acc[l.medication] = [...(acc[l.medication] || []), l];
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
            Medication Tracker
          </h1>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: MUTED }}>
            Log doses, track timing, see what's working.
          </p>
        </div>

        {/* Quick log */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 16 }}>LOG A DOSE</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>MEDICATION *</label>
              <input
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="e.g. Adderall XR"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontFamily: "var(--font-instrument)",
                  fontSize: 14,
                  color: "var(--ink)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>DOSE</label>
              <input
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g. 20mg"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontFamily: "var(--font-instrument)",
                  fontSize: 14,
                  color: "var(--ink)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>TAKEN AT</label>
              <input
                type="datetime-local"
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontFamily: "var(--font-instrument)",
                  fontSize: 13,
                  color: "var(--ink)",
                  outline: "none",
                  boxSizing: "border-box",
                  colorScheme: "light dark",
                }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-instrument)", fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>
                EFFECT {effectRating !== null ? `— ${effectRating}/10` : "(optional)"}
              </label>
              <div style={{ position: "relative", height: 40, display: "flex", alignItems: "center" }}>
                <div style={{ position: "relative", height: 6, borderRadius: 99, background: "var(--line)", flex: 1 }}>
                  {effectRating !== null && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        borderRadius: 99,
                        background: TEAL,
                        width: `${(effectRating / 10) * 100}%`,
                      }}
                    />
                  )}
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={effectRating ?? 5}
                    onMouseDown={() => { if (effectRating === null) setEffectRating(5); }}
                    onTouchStart={() => { if (effectRating === null) setEffectRating(5); }}
                    onChange={(e) => setEffectRating(Number(e.target.value))}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: "9px 12px",
              fontFamily: "var(--font-instrument)",
              fontSize: 14,
              color: "var(--ink)",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 16,
            }}
          />

          <button
            onClick={logDose}
            disabled={!medication.trim() || saving}
            style={{
              width: "100%",
              padding: 11,
              borderRadius: 12,
              border: "none",
              background: medication.trim() ? TEAL : "var(--line)",
              color: medication.trim() ? "var(--accent-ink)" : MUTED,
              fontFamily: "var(--font-instrument)",
              fontSize: 14,
              fontWeight: 700,
              cursor: medication.trim() ? "pointer" : "default",
            }}
          >
            {saving ? "Logging…" : "Log dose"}
          </button>
        </div>

        {/* Today's timeline */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 16 }}>TODAY'S TIMELINE</h2>
          {today.length === 0 ? (
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, color: MUTED, textAlign: "center", padding: "20px 0" }}>
              No doses logged today
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {today.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "transparent",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: TEAL,
                      background: TEAL_BG,
                      border: `1px solid ${TEAL_BD}`,
                      borderRadius: 8,
                      padding: "4px 10px",
                      flexShrink: 0,
                    }}
                  >
                    {formatTime(log.taken_at)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "var(--font-instrument)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{log.medication}</span>
                    {log.dose && <span style={{ fontFamily: "var(--font-instrument)", fontSize: 13, color: MUTED, marginLeft: 6 }}>{log.dose}</span>}
                  </div>
                  {log.effect_rating !== null && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{log.effect_rating}/10</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 14-day grid */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 16 }}>14-DAY HISTORY</h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {days14.map(({ key, dayLogs }) => (
              <div
                key={key}
                title={`${key}: ${dayLogs.length} dose${dayLogs.length !== 1 ? "s" : ""}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: dayLogs.length > 0 ? TEAL_BG : "var(--line)",
                    border: `1px solid ${dayLogs.length > 0 ? TEAL_BD : BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: dayLogs.length > 0 ? TEAL : MUTED,
                  }}
                >
                  {dayLogs.length || "·"}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: MUTED }}>
                  {formatDate(key + "T12:00:00")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
