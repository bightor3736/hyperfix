"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  REACTION_TYPES,
  normalizeReactionCounts,
  normalizeUserReactions,
  legacyEmojiToType,
  type ReactionType,
} from "@/lib/reactions";

type Props = {
  fixId: string;
  initialReactions: Record<string, number>;
  userReactions?: string[];
};

export function FixReactions({ fixId, initialReactions, userReactions = [] }: Props) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>(() =>
    normalizeReactionCounts(initialReactions),
  );
  const [active, setActive] = useState<Set<ReactionType>>(
    () => new Set(normalizeUserReactions(userReactions)),
  );
  const [loading, setLoading] = useState<Set<ReactionType>>(new Set());

  // Realtime: subscribe to fix_reactions inserts/deletes for this fix and update counts live.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`fix-reactions:${fixId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "fix_reactions", filter: `fix_id=eq.${fixId}` },
        (payload) => {
          const raw = (payload.new as { emoji?: string })?.emoji;
          if (!raw) return;
          const type = legacyEmojiToType(raw);
          if (!type) return;
          setCounts((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "fix_reactions", filter: `fix_id=eq.${fixId}` },
        (payload) => {
          const raw = (payload.old as { emoji?: string })?.emoji;
          if (!raw) return;
          const type = legacyEmojiToType(raw);
          if (!type) return;
          setCounts((prev) => ({ ...prev, [type]: Math.max(0, (prev[type] ?? 0) - 1) }));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fixId]);

  async function handleReaction(key: ReactionType) {
    if (loading.has(key)) return;

    const wasActive = active.has(key);
    setActive((prev) => {
      const next = new Set(prev);
      if (wasActive) next.delete(key);
      else next.add(key);
      return next;
    });
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] ?? 0) + (wasActive ? -1 : 1)),
    }));

    setLoading((prev) => new Set([...prev, key]));

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixId, emoji: key }),
      });

      if (res.ok) {
        const data = await res.json();
        setCounts(normalizeReactionCounts(data.counts ?? {}));
      } else {
        // Revert on error
        setActive((prev) => {
          const next = new Set(prev);
          if (wasActive) next.add(key);
          else next.delete(key);
          return next;
        });
        setCounts((prev) => ({
          ...prev,
          [key]: Math.max(0, (prev[key] ?? 0) + (wasActive ? 1 : -1)),
        }));
      }
    } catch {
      setActive((prev) => {
        const next = new Set(prev);
        if (wasActive) next.add(key);
        else next.delete(key);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [key]: Math.max(0, (prev[key] ?? 0) + (wasActive ? 1 : -1)),
      }));
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_TYPES.map(({ key, label, Icon }) => {
        const count = counts[key] ?? 0;
        const isActive = active.has(key);
        return (
          <button
            key={key}
            onClick={() => handleReaction(key)}
            aria-pressed={isActive}
            aria-label={label}
            className="inline-flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: isActive ? "rgba(94,234,212,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? "rgba(94,234,212,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: isActive ? "#5EEAD4" : "rgba(255,255,255,0.6)",
            }}
          >
            <Icon size={18} />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              {label}
            </span>
            {count > 0 && (
              <span
                className="font-mono text-[9px] tabular-nums"
                style={{ color: "rgba(94,234,212,0.7)" }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
