"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, ChevronRight, Plus, Flame, Timer, Sparkles, Zap, Trophy } from "lucide-react";
import type { Quest, QuestKind } from "@/lib/quests/generate";

const KIND_ICONS: Record<QuestKind, React.ReactNode> = {
  log_fixation: <Plus size={15} strokeWidth={1.5} />,
  fixation_checkin: <Flame size={15} strokeWidth={1.5} />,
  deep_dive: <Sparkles size={15} strokeWidth={1.5} />,
  brain_burst: <Zap size={15} strokeWidth={1.5} />,
  focus_session: <Timer size={15} strokeWidth={1.5} />,
};

export function DailyQuestsClient({ initialQuests }: { initialQuests: Quest[] }) {
  const [quests, setQuests] = useState(initialQuests);
  const [loading, setLoading] = useState<string | null>(null);

  async function complete(quest: Quest) {
    if (quest.completed_at || loading) return;
    setLoading(quest.id);
    setQuests((prev) =>
      prev.map((q) => q.id === quest.id ? { ...q, completed_at: new Date().toISOString() } : q)
    );
    try {
      await fetch("/api/quests/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId: quest.id }),
      });
    } catch {
      setQuests((prev) =>
        prev.map((q) => (q.id === quest.id ? { ...q, completed_at: null } : q))
      );
    } finally {
      setLoading(null);
    }
  }

  const doneCount = quests.filter((q) => q.completed_at).length;

  return (
    <div
      className="rounded-[var(--radius-xl)] overflow-hidden"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--line)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--xp)" }}
        >
          <Trophy size={11} strokeWidth={2} />
          Today&apos;s Quests
        </span>
        <span
          className="font-mono text-[10px] tabular-nums px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: doneCount === quests.length ? "var(--xp-soft)" : "var(--line)",
            color: doneCount === quests.length ? "var(--xp)" : "var(--ink-muted)",
          }}
        >
          {doneCount}/{quests.length}
        </span>
      </div>

      {/* Quest rows */}
      {quests.map((quest, i) => {
        const done = !!quest.completed_at;
        const isLoading = loading === quest.id;

        return (
          <div
            key={quest.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors"
            style={{
              borderBottom: i < quests.length - 1 ? "1px solid var(--line)" : "none",
              background: done ? "var(--xp-soft)" : "transparent",
            }}
          >
            {/* Checkbox */}
            <button
              onClick={() => complete(quest)}
              disabled={done || !!loading}
              className="shrink-0 flex items-center justify-center rounded-lg transition-all active:scale-90"
              style={{
                width: 28,
                height: 28,
                background: done ? "var(--xp)" : "var(--bg)",
                border: `1.5px solid ${done ? "var(--xp)" : "var(--line)"}`,
                cursor: done ? "default" : "pointer",
              }}
            >
              {isLoading ? (
                <Loader2 size={13} className="animate-spin" style={{ color: "var(--xp)" }} />
              ) : done ? (
                <Check size={13} strokeWidth={2.5} style={{ color: "#fff" }} />
              ) : null}
            </button>

            {/* Kind icon */}
            <span className="shrink-0" style={{ color: done ? "var(--xp)" : "var(--ink-faint)" }}>
              {KIND_ICONS[quest.kind]}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="font-sans text-[13px] font-medium"
                style={{
                  color: done ? "var(--xp)" : "var(--ink)",
                  textDecoration: done ? "line-through" : "none",
                  opacity: done ? 0.75 : 1,
                }}
              >
                {quest.title}
              </p>
              <p className="font-mono text-[10px] mt-0.5 truncate" style={{ color: "var(--ink-faint)" }}>
                {quest.description}
              </p>
            </div>

            {/* XP + arrow */}
            <div className="shrink-0 flex items-center gap-2">
              <span
                className="font-mono text-[10px] tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  background: done ? "rgba(124,58,237,0.12)" : "var(--line)",
                  color: done ? "var(--xp)" : "var(--ink-muted)",
                }}
              >
                +{quest.xp_reward} XP
              </span>
              {!done && (
                <Link
                  href={quest.href}
                  className="transition-colors"
                  style={{ color: "var(--ink-faint)" }}
                  onClick={() => complete(quest)}
                >
                  <ChevronRight size={14} strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
