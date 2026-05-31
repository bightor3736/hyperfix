"use client";

import { useState, useEffect, useRef } from "react";

const PAGE_BG = "var(--bg)";
const CARD_BG = "var(--bg)";
const BORDER = "var(--line)";
const TEAL = "var(--accent)";
const TEAL_BG = "var(--accent-soft)";
const TEAL_BD = "var(--accent)";
const MUTED = "var(--ink-muted)";

type Status = "inbox" | "doing" | "done" | "parked";
type Energy = "low" | "medium" | "high" | "any";

interface Task {
  id: string;
  content: string;
  status: Status;
  energy_required: Energy;
  created_at: string;
  completed_at: string | null;
}

const PLACEHOLDERS = [
  "What's rattling around in your head?",
  "Brain dump it here — no pressure…",
  "Something you don't want to forget?",
  "A task, a worry, an idea… anything",
  "Get it out of your head, into here",
];

const ENERGY_LABELS: Record<Energy, { label: string; color: string }> = {
  low: { label: "Low energy", color: "#60A5FA" },
  medium: { label: "Medium", color: "#F59E0B" },
  high: { label: "High energy", color: "#F87171" },
  any: { label: "Any energy", color: MUTED },
};

const STATUS_COLS: { status: Status; label: string; emoji: string }[] = [
  { status: "inbox", label: "Inbox", emoji: "📥" },
  { status: "doing", label: "Doing", emoji: "⚡" },
  { status: "done", label: "Done", emoji: "✓" },
  { status: "parked", label: "Parked", emoji: "⏸" },
];

export function BrainDumpClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [input, setInput] = useState("");
  const [energy, setEnergy] = useState<Energy>("any");
  const [saving, setSaving] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3500);
    return () => clearInterval(id);
  }, []);

  async function capture() {
    if (!input.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/brain-dump/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim(), energy_required: energy }),
      });
      const data = await res.json();
      if (data.task) setTasks((prev) => [data.task, ...prev]);
      setInput("");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: Status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    await fetch(`/api/brain-dump/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/brain-dump/${id}`, { method: "DELETE" });
  }

  const byStatus = (s: Status) => tasks.filter((t) => t.status === s);

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
            Brain Dump
          </h1>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: 14, color: MUTED }}>
            Clear your mental RAM. Capture everything, sort it later.
          </p>
        </div>

        {/* Capture box */}
        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) capture();
            }}
            placeholder={PLACEHOLDERS[phIdx]}
            rows={3}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "var(--font-instrument)",
              fontSize: 16,
              color: "var(--ink)",
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            {/* Energy selector */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["any", "low", "medium", "high"] as Energy[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setEnergy(e)}
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: 12,
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: `1px solid ${energy === e ? ENERGY_LABELS[e].color : BORDER}`,
                    background: energy === e ? `${ENERGY_LABELS[e].color}20` : "transparent",
                    color: energy === e ? ENERGY_LABELS[e].color : MUTED,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {ENERGY_LABELS[e].label}
                </button>
              ))}
            </div>

            <button
              onClick={capture}
              disabled={!input.trim() || saving}
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: 10,
                border: "none",
                background: input.trim() ? TEAL : "var(--line)",
                color: input.trim() ? "var(--accent-ink)" : MUTED,
                cursor: input.trim() ? "pointer" : "default",
                transition: "all 0.15s",
              }}
            >
              {saving ? "Saving…" : "Capture ⌘↵"}
            </button>
          </div>
        </div>

        {/* Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {STATUS_COLS.map(({ status, label, emoji }) => {
            const col = byStatus(status);
            return (
              <div key={status}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{emoji}</span>
                  <span style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontWeight: 600, color: MUTED }}>
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      padding: "1px 7px",
                      borderRadius: 20,
                      background: col.length > 0 ? TEAL_BG : "var(--line)",
                      color: col.length > 0 ? TEAL : MUTED,
                      border: `1px solid ${col.length > 0 ? TEAL_BD : BORDER}`,
                    }}
                  >
                    {col.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 60 }}>
                  {col.length === 0 && (
                    <div
                      style={{
                        borderRadius: 12,
                        border: `1px dashed ${BORDER}`,
                        padding: "20px 16px",
                        textAlign: "center",
                        fontFamily: "var(--font-instrument)",
                        fontSize: 12,
                        color: "var(--ink-faint)",
                      }}
                    >
                      Empty
                    </div>
                  )}
                  {col.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatus={updateStatus}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onStatus,
  onDelete,
}: {
  task: Task;
  onStatus: (id: string, s: Status) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const energy = ENERGY_LABELS[task.energy_required];

  const nextStatus: Record<Status, Status> = {
    inbox: "doing",
    doing: "done",
    done: "parked",
    parked: "inbox",
  };

  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "12px 14px",
        position: "relative",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-instrument)",
          fontSize: 13,
          color: task.status === "done" ? MUTED : "var(--ink)",
          lineHeight: 1.5,
          marginBottom: 8,
          textDecoration: task.status === "done" ? "line-through" : "none",
        }}
      >
        {task.content}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: energy.color,
            opacity: 0.8,
          }}
        >
          {task.energy_required !== "any" ? energy.label : ""}
        </span>

        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => onStatus(task.id, nextStatus[task.status])}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 8,
              border: `1px solid ${TEAL_BD}`,
              background: TEAL_BG,
              color: TEAL,
              cursor: "pointer",
            }}
          >
            →
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              background: "transparent",
              color: MUTED,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
