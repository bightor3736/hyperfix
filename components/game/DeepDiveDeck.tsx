"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, Sparkles, Pencil, ArrowRight } from "lucide-react";
import { DEEP_DIVE_PROMPTS, promptByKey } from "@/lib/deepdive/prompts";

type Insight = { id: string; prompt_key: string; body: string };

const XP_PER = 8;

/**
 * Deep Dive — a deck of reflection prompts about one hyperfixation.
 * Surfaces the next unanswered prompt first; answering earns XP once.
 * Lives inside an expanded fixation card, so it uses the light surface tokens.
 */
export function DeepDiveDeck({
  fixationId,
  onXp,
}: {
  fixationId: string;
  onXp?: (xp: number) => void;
}) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  // Which prompt is in the composer. Defaults to the next unanswered one.
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/fixations/${fixationId}/insights`)
      .then((r) => r.json())
      .then((d: { insights?: Insight[] }) => {
        if (alive) setInsights(d.insights ?? []);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fixationId]);

  const answered = new Map(insights.map((i) => [i.prompt_key, i]));
  const total = DEEP_DIVE_PROMPTS.length;
  const done = insights.length;
  const pct = Math.round((done / total) * 100);

  // The prompt shown in the composer: explicit selection, else first unanswered.
  const nextUnanswered = DEEP_DIVE_PROMPTS.find((p) => !answered.has(p.key));
  const composerKey = activeKey ?? nextUnanswered?.key ?? null;
  const composer = composerKey ? promptByKey(composerKey) : undefined;
  const editing = composerKey ? answered.get(composerKey) : undefined;

  function openPrompt(key: string) {
    setActiveKey(key);
    setDraft(answered.get(key)?.body ?? "");
  }

  async function save() {
    if (!composer || !draft.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fixations/${fixationId}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt_key: composer.key, body: draft.trim() }),
      });
      if (res.ok) {
        const data = (await res.json()) as { insight: Insight; xp: number; awarded: boolean };
        setInsights((prev) => {
          const without = prev.filter((i) => i.prompt_key !== data.insight.prompt_key);
          return [...without, data.insight];
        });
        if (data.awarded && data.xp) onXp?.(data.xp);
        setDraft("");
        setActiveKey(null);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={16} className="animate-spin text-ink-faint" />
      </div>
    );
  }

  const allDone = done === total;

  return (
    <div className="space-y-3">
      {/* Header + progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            <Sparkles size={11} strokeWidth={2.5} /> Deep dive
          </span>
          <span className="font-mono text-[10px] tabular-nums text-ink-faint">
            {done} / {total} · +{XP_PER} XP each
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--accent), var(--energy))" }}
          />
        </div>
      </div>

      {/* Composer — the active prompt */}
      {composer && (
        <div className="rounded-[var(--radius-lg)] p-3.5" style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}>
          <p className="text-[15px] font-semibold text-ink leading-snug" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.02em" }}>
            {composer.question}
          </p>
          <p className="mt-0.5 font-sans text-[12px] text-ink-muted">{composer.hint}</p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={composer.placeholder}
            className="mt-2.5 w-full resize-none rounded-xl px-3 py-2.5 font-sans text-[14px] text-ink bg-transparent outline-none transition-all"
            style={{ border: "1px solid var(--line)", minHeight: 64 }}
            maxLength={600}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={save}
              disabled={!draft.trim() || saving}
              className="press-pop inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans text-[12px] font-bold transition-all disabled:opacity-40"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} strokeWidth={2.5} />}
              {editing ? "Update" : `Save — +${XP_PER} XP`}
            </button>
            {editing && (
              <span className="font-mono text-[10px] text-ink-faint">editing — no extra XP</span>
            )}
            {activeKey && nextUnanswered && activeKey !== nextUnanswered.key && (
              <button
                onClick={() => { setActiveKey(null); setDraft(""); }}
                className="ml-auto font-sans text-[12px] text-ink-muted transition-opacity hover:opacity-70"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* All-done celebration */}
      {allDone && !activeKey && (
        <div className="rounded-[var(--radius-lg)] px-3.5 py-3 text-center" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
          <p className="font-sans text-[13px] font-semibold" style={{ color: "var(--accent)" }}>
            You&apos;ve mapped this one out. 🧠
          </p>
          <p className="font-sans text-[12px] text-ink-muted mt-0.5">
            Tap any answer below to revisit it.
          </p>
        </div>
      )}

      {/* Answered list */}
      {done > 0 && (
        <div className="space-y-1.5">
          {DEEP_DIVE_PROMPTS.filter((p) => answered.has(p.key)).map((p) => {
            const ins = answered.get(p.key)!;
            const isOpen = composerKey === p.key;
            return (
              <button
                key={p.key}
                onClick={() => openPrompt(p.key)}
                className="w-full flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/[0.02]"
                style={{ border: "1px solid var(--line)", opacity: isOpen ? 0.5 : 1 }}
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)" }}>
                  <Check size={10} strokeWidth={3} style={{ color: "var(--accent-ink)" }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-[12px] font-medium text-ink-muted">{p.question}</span>
                  <span className="block font-sans text-[13px] text-ink line-clamp-2">{ins.body}</span>
                </span>
                <Pencil size={12} strokeWidth={2} className="mt-0.5 shrink-0 text-ink-faint" />
              </button>
            );
          })}
        </div>
      )}

      {/* Nudge toward the next prompt when one is in the composer but more remain */}
      {!allDone && composer && done > 0 && composerKey === nextUnanswered?.key && (
        <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          {total - done} more to go <ArrowRight size={11} strokeWidth={2} />
        </p>
      )}
    </div>
  );
}
