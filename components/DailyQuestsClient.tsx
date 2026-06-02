"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, ChevronRight, Inbox, Timer, Activity, Pill, BookOpen, LayoutDashboard } from "lucide-react";
import type { Quest, QuestKind } from "@/lib/quests/generate";

const KIND_ICONS: Record<QuestKind, React.ReactNode> = {
  check_in: <LayoutDashboard size={15} strokeWidth={1.5} />,
  brain_dump: <Inbox size={15} strokeWidth={1.5} />,
  focus_session: <Timer size={15} strokeWidth={1.5} />,
  mood_log: <Activity size={15} strokeWidth={1.5} />,
  med_log: <Pill size={15} strokeWidth={1.5} />,
  rsd_entry: <BookOpen size={15} strokeWidth={1.5} />,
};

export function DailyQuestsClient({ initialQuests }: { initialQuests: Quest[] }) {
  const [quests, setQuests] = useState(initialQuests);
  const [loading, setLoading] = useState<string | null>(null);

  async function complete(quest: Quest) {
    if (quest.completed_at || loading) return;
    setLoading(quest.id);

    // Optimistic
    setQuests((prev) =>
      prev.map((q) =>
        q.id === quest.id ? { ...q, completed_at: new Date().toISOString() } : q
      )
    );

    try {
      await fetch("/api/quests/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId: quest.id }),
      });
    } catch {
      // Revert on failure
      setQuests((prev) =>
        prev.map((q) => (q.id === quest.id ? { ...q, completed_at: null } : q))
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--line)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {quests.map((quest, i) => {
        const done = !!quest.completed_at;
        const isLoading = loading === quest.id;

        return (
          <div
            key={quest.id}
            className="flex items-center gap-4 px-4 py-3.5 transition-colors"
            style={{
              borderBottom: i < quests.length - 1 ? "1px solid var(--line)" : "none",
              background: done ? "var(--accent-soft)" : "transparent",
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
                background: done ? "var(--accent)" : "var(--bg)",
                border: `1.5px solid ${done ? "var(--accent)" : "var(--line)"}`,
                cursor: done ? "default" : "pointer",
              }}
            >
              {isLoading ? (
                <Loader2 size={13} className="text-accent animate-spin" />
              ) : done ? (
                <Check size={13} strokeWidth={2.5} className="text-white" />
              ) : null}
            </button>

            {/* Kind icon */}
            <span
              className="shrink-0"
              style={{ color: done ? "var(--accent)" : "var(--ink-faint)" }}
            >
              {KIND_ICONS[quest.kind]}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="font-sans text-[13px] font-medium"
                style={{
                  color: done ? "var(--accent)" : "var(--ink)",
                  textDecoration: done ? "line-through" : "none",
                  opacity: done ? 0.8 : 1,
                }}
              >
                {quest.title}
              </p>
              <p className="font-mono text-[10px] text-ink-faint mt-0.5 truncate">
                {quest.description}
              </p>
            </div>

            {/* XP + arrow */}
            <div className="shrink-0 flex items-center gap-2">
              <span
                className="font-mono text-[10px] tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  background: done ? "var(--xp-soft)" : "var(--line)",
                  color: done ? "var(--xp)" : "var(--ink-muted)",
                }}
              >
                +{quest.xp_reward} XP
              </span>
              {!done && (
                <Link
                  href={quest.href}
                  className="text-ink-faint hover:text-accent transition-colors"
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
