"use client";

import { useState } from "react";

const EMOJIS = ["💀", "🎵", "📖", "💜", "🔁", "😭"];

type Props = {
  fixId: string;
  initialReactions: Record<string, number>;
  userReactions?: string[];
};

export function FixReactions({ fixId, initialReactions, userReactions = [] }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>(initialReactions);
  const [active, setActive] = useState<Set<string>>(new Set(userReactions));
  const [loading, setLoading] = useState<Set<string>>(new Set());

  async function handleReaction(emoji: string) {
    if (loading.has(emoji)) return;

    // Optimistic update
    const wasActive = active.has(emoji);
    setActive((prev) => {
      const next = new Set(prev);
      if (wasActive) next.delete(emoji);
      else next.add(emoji);
      return next;
    });
    setCounts((prev) => ({
      ...prev,
      [emoji]: Math.max(0, (prev[emoji] ?? 0) + (wasActive ? -1 : 1)),
    }));

    setLoading((prev) => new Set([...prev, emoji]));

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixId, emoji }),
      });

      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts ?? {});
      } else {
        // Revert on error
        setActive((prev) => {
          const next = new Set(prev);
          if (wasActive) next.add(emoji);
          else next.delete(emoji);
          return next;
        });
        setCounts((prev) => ({
          ...prev,
          [emoji]: Math.max(0, (prev[emoji] ?? 0) + (wasActive ? 1 : -1)),
        }));
      }
    } catch {
      // Revert on error
      setActive((prev) => {
        const next = new Set(prev);
        if (wasActive) next.add(emoji);
        else next.delete(emoji);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] ?? 0) + (wasActive ? 1 : -1)),
      }));
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(emoji);
        return next;
      });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {EMOJIS.map((emoji) => {
        const count = counts[emoji] ?? 0;
        const isActive = active.has(emoji);
        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-mono transition-all duration-150 hover:scale-105 active:scale-95"
            style={
              isActive
                ? {
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    color: "#A855F7",
                  }
                : {
                    background: "rgba(244,244,244,0.06)",
                    border: "1px solid rgba(244,244,244,0.1)",
                    color: "rgba(244,244,244,0.5)",
                  }
            }
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span className="text-xs tabular-nums">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
