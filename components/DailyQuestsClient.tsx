"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, ChevronRight, Plus, Flame, Timer, Sparkles, Zap, Trophy } from "lucide-react";
import type { Quest, QuestKind } from "@/lib/quests/generate";

const KIND_ICONS: Record<QuestKind, React.ReactNode> = {
  log_fixation:    <Plus size={14} strokeWidth={2} />,
  fixation_checkin: <Flame size={14} strokeWidth={2} />,
  deep_dive:       <Sparkles size={14} strokeWidth={2} />,
  brain_burst:     <Zap size={14} strokeWidth={2} />,
  focus_session:   <Timer size={14} strokeWidth={2} />,
};

const KIND_COLORS: Record<QuestKind, string> = {
  log_fixation:    "var(--accent)",
  fixation_checkin: "var(--flame)",
  deep_dive:       "var(--xp)",
  brain_burst:     "#FF9F0A",
  focus_session:   "#30D158",
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
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span
          className="flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: "var(--ink)" }}
        >
          <Trophy size={13} strokeWidth={2} style={{ color: "var(--xp)" }} />
          Today&apos;s Quests
        </span>
        <span
          className="text-[12px] font-medium tabular-nums px-2 py-0.5 rounded-full"
          style={{
            background: doneCount === quests.length && quests.length > 0 ? "var(--xp-soft)" : "var(--fill-soft)",
            color: doneCount === quests.length && quests.length > 0 ? "var(--xp)" : "var(--ink-faint)",
          }}
        >
          {doneCount}/{quests.length}
        </span>
      </div>

      {/* Apple grouped list */}
      <div
        className="overflow-hidden rounded-[var(--radius-lg)]"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
        }}
      >
        {quests.map((quest, i) => {
          const done = !!quest.completed_at;
          const isLoading = loading === quest.id;
          const kindColor = KIND_COLORS[quest.kind];

          return (
            <div
              key={quest.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
              style={{
                borderTop: i > 0 ? "1px solid var(--line)" : "none",
                background: done ? "var(--fill-faint)" : "transparent",
              }}
            >
              {/* Icon badge */}
              <span
                className="shrink-0 flex items-center justify-center rounded-[7px] h-7 w-7"
                style={{
                  background: done ? "var(--fill-soft)" : kindColor,
                  color: done ? "var(--ink-faint)" : "#fff",
                  opacity: done ? 0.7 : 1,
                }}
              >
                {KIND_ICONS[quest.kind]}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] font-medium"
                  style={{
                    color: done ? "var(--ink-faint)" : "var(--ink)",
                    textDecoration: done ? "line-through" : "none",
                  }}
                >
                  {quest.title}
                </p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--ink-faint)" }}>
                  {quest.description}
                </p>
              </div>

              {/* XP badge */}
              <span
                className="shrink-0 text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  background: done ? "var(--xp-soft)" : "var(--fill-soft)",
                  color: done ? "var(--xp)" : "var(--ink-faint)",
                }}
              >
                +{quest.xp_reward}
              </span>

              {/* Complete / chevron */}
              {done ? (
                <button
                  disabled
                  className="shrink-0 flex items-center justify-center rounded-full h-6 w-6"
                  style={{ background: "var(--xp)", color: "#fff" }}
                >
                  {isLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Check size={12} strokeWidth={2.5} />
                  )}
                </button>
              ) : (
                <Link
                  href={quest.href}
                  className="shrink-0 transition-opacity hover:opacity-70"
                  style={{ color: "var(--ink-faint)" }}
                  onClick={() => complete(quest)}
                >
                  <ChevronRight size={16} strokeWidth={1.75} />
                </Link>
              )}
            </div>
          );
        })}

        {quests.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[14px] font-medium" style={{ color: "var(--ink-faint)" }}>
              No quests yet — check back soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
