"use client";

import { useState } from "react";

const PAGE_BG = "var(--bg)";
const CARD_BG = "var(--bg)";
const BORDER = "var(--line)";
const TEAL = "var(--accent)";
const TEAL_BG = "var(--accent-soft)";
const TEAL_BD = "var(--accent)";
const MUTED = "var(--ink-muted)";

interface RSDEntry {
  id: string;
  trigger: string;
  content: string;
  intensity: number;
  reframe: string | null;
  created_at: string;
}

function intensityColor(n: number) {
  if (n <= 3) return "#60A5FA";
  if (n <= 6) return "#F59E0B";
  return "#F87171";
}

export function RSDClient({ initialEntries }: { initialEntries: RSDEntry[] }) {
  const [entries, setEntries] = useState<RSDEntry[]>(initialEntries);
  const [trigger, setTrigger] = useState("");
  const [content, setContent] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [reframe, setReframe] = useState("");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function submit() {
    if (!trigger.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/rsd/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: trigger.trim(), content: content.trim(), intensity, reframe: reframe.trim() || null }),
      });
      const data = await res.json();
      if (data.entry) {
        setEntries((prev) => [data.entry, ...prev]);
        setTrigger("");
        setContent("");
        setIntensity(5);
        setReframe("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
            RSD Journal
          </h1>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: MUTED }}>
            Private space to process rejection-sensitive moments and find reframes.
          </p>
        </div>

        {/* Entry form */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 28 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED, display: "block", marginBottom: 6 }}>
              WHAT WAS THE TRIGGER?
            </label>
            <input
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. Unanswered message, critical comment, being left out…"
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "var(--font-instrument)",
                fontSize: 14,
                color: "var(--ink)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED, display: "block", marginBottom: 6 }}>
              WHAT ARE YOU FEELING?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the emotional experience — no filter needed here…"
              rows={3}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "var(--font-instrument)",
                fontSize: 14,
                color: "var(--ink)",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Intensity slider */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED }}>INTENSITY</label>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: intensityColor(intensity) }}>
                {intensity}/10
              </span>
            </div>
            <div style={{ position: "relative", height: 6, borderRadius: 99, background: "var(--line)" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  borderRadius: 99,
                  background: intensityColor(intensity),
                  width: `${(intensity / 10) * 100}%`,
                }}
              />
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "var(--font-instrument)", fontSize: 12, color: MUTED, display: "block", marginBottom: 6 }}>
              REFRAME (optional)
            </label>
            <textarea
              value={reframe}
              onChange={(e) => setReframe(e.target.value)}
              placeholder="What's a more balanced way to see this? What would you tell a friend?"
              rows={2}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "var(--font-instrument)",
                fontSize: 14,
                color: "var(--ink)",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={submit}
            disabled={!trigger.trim() || !content.trim() || saving}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: trigger.trim() && content.trim() ? TEAL : "var(--line)",
              color: trigger.trim() && content.trim() ? "var(--accent-ink)" : MUTED,
              fontFamily: "var(--font-instrument)",
              fontSize: 14,
              fontWeight: 700,
              cursor: trigger.trim() && content.trim() ? "pointer" : "default",
            }}
          >
            {saving ? "Saving…" : "Record entry"}
          </button>
        </div>

        {/* Entry list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                fontFamily: "var(--font-instrument)",
                fontSize: 14,
                color: MUTED,
              }}
            >
              No entries yet. This journal is private — just for you.
            </div>
          )}
          {entries.map((entry) => {
            const isOpen = expanded === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => setExpanded(isOpen ? null : entry.id)}
                style={{
                  background: CARD_BG,
                  border: `1px solid ${isOpen ? TEAL_BD : BORDER}`,
                  borderRadius: 14,
                  padding: 18,
                  cursor: "pointer",
                  transition: "border 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isOpen ? 12 : 0 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-instrument)", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                      {entry.trigger}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: MUTED }}>
                      {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: intensityColor(entry.intensity),
                      background: `${intensityColor(entry.intensity)}18`,
                      border: `1px solid ${intensityColor(entry.intensity)}40`,
                      borderRadius: 99,
                      padding: "3px 10px",
                      flexShrink: 0,
                    }}
                  >
                    {entry.intensity}/10
                  </div>
                </div>

                {isOpen && (
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-instrument)",
                        fontSize: 13,
                        color: "var(--ink-muted)",
                        lineHeight: 1.6,
                        marginBottom: entry.reframe ? 12 : 0,
                        padding: "10px 12px",
                        background: "transparent",
                        borderRadius: 8,
                      }}
                    >
                      {entry.content}
                    </div>
                    {entry.reframe && (
                      <div
                        style={{
                          fontFamily: "var(--font-instrument)",
                          fontSize: 13,
                          color: TEAL,
                          lineHeight: 1.6,
                          padding: "10px 12px",
                          background: TEAL_BG,
                          border: `1px solid ${TEAL_BD}`,
                          borderRadius: 8,
                          marginTop: 8,
                        }}
                      >
                        💚 {entry.reframe}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
