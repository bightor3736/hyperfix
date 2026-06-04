"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Zap } from "lucide-react";

type Note = { id: string; body: string; created_at: string };

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/**
 * Brain Burst — low-friction thought capture scoped to one hyperfixation.
 * Get the idea/tab/rabbit-hole out of your head before it's gone. Lives in
 * the expanded fixation card, so it uses the light surface tokens.
 */
export function BrainBurst({
  fixationId,
  onXp,
}: {
  fixationId: string;
  onXp?: (xp: number) => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/fixations/${fixationId}/notes`)
      .then((r) => r.json())
      .then((d: { notes?: Note[] }) => { if (alive) setNotes(d.notes ?? []); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [fixationId]);

  async function save() {
    const text = draft.trim();
    if (!text || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fixations/${fixationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (res.ok) {
        const data = (await res.json()) as { note: Note; xp: number };
        setNotes((prev) => [data.note, ...prev]);
        if (data.xp) onXp?.(data.xp);
        setDraft("");
        inputRef.current?.focus();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--xp)" }}>
          <Zap size={11} strokeWidth={2.5} /> Brain burst
        </span>
        <span className="font-mono text-[10px] text-ink-faint">get it out of your head</span>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); save(); } }}
          placeholder="A thought, a tab, a rabbit hole…"
          maxLength={280}
          className="flex-1 rounded-xl px-3 py-2.5 font-sans text-[14px] text-ink bg-transparent outline-none"
          style={{ border: "1px solid var(--line)" }}
        />
        <button
          onClick={save}
          disabled={!draft.trim() || saving}
          className="press-pop flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-40"
          style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
          aria-label="Capture"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} strokeWidth={2} />}
        </button>
      </div>

      {/* Notes */}
      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 size={14} className="animate-spin text-ink-faint" />
        </div>
      ) : notes.length > 0 ? (
        <div className="space-y-1.5">
          {notes.slice(0, 8).map((n) => (
            <div key={n.id} className="rounded-xl px-3 py-2" style={{ background: "var(--bg-soft)" }}>
              <p className="font-sans text-[13px] text-ink leading-snug">{n.body}</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-ink-faint">{timeAgo(n.created_at)}</p>
            </div>
          ))}
          {notes.length > 8 && (
            <p className="text-center font-mono text-[10px] text-ink-faint pt-0.5">+{notes.length - 8} more</p>
          )}
        </div>
      ) : (
        <p className="font-sans text-[12px] text-ink-faint text-center py-1">
          Nothing captured yet. First burst earns XP.
        </p>
      )}
    </div>
  );
}
