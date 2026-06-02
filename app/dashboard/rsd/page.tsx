"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Heart, ChevronDown, ChevronUp } from "lucide-react";

interface RsdEntry {
  id: string;
  trigger: string;
  content: string;
  intensity: number;
  reframe: string | null;
  created_at: string;
}

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function intensityColor(n: number) {
  if (n >= 8) return "#ef4444";
  if (n >= 5) return "var(--energy)";
  return "var(--accent)";
}

function EntryCard({ entry }: { entry: RsdEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-[var(--radius-lg)] overflow-hidden"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-start gap-3 p-4 text-left">
        <div
          className="flex flex-col items-center justify-center rounded-xl shrink-0"
          style={{ width: 40, height: 40, background: "var(--bg-soft)", border: "1px solid var(--line)" }}
        >
          <span className="text-[15px] font-bold tabular-nums leading-none" style={{ color: intensityColor(entry.intensity), fontFamily: "var(--font-landing-sans), Inter, sans-serif" }}>{entry.intensity}</span>
          <span className="font-mono text-[7px] uppercase tracking-widest mt-0.5" style={{ color: "var(--ink-faint)" }}>int</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[14px] font-semibold text-ink truncate">{entry.trigger}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--ink-faint)" }}>{dayLabel(entry.created_at)}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-ink-faint shrink-0 mt-1" /> : <ChevronDown size={16} className="text-ink-faint shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <p className="font-sans text-[13px] text-ink-muted leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          {entry.reframe && (
            <div className="rounded-[var(--radius-lg)] p-3" style={{ background: "var(--xp-soft)", border: "1px solid var(--xp)" }}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "var(--xp)" }}>Reframe</p>
              <p className="font-sans text-[13px] leading-relaxed" style={{ color: "var(--ink)" }}>{entry.reframe}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RsdPage() {
  const [entries, setEntries] = useState<RsdEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [trigger, setTrigger] = useState("");
  const [content, setContent] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [reframe, setReframe] = useState("");

  useEffect(() => {
    fetch("/api/rsd")
      .then((r) => r.json())
      .then((d: { entries: RsdEntry[] }) => setEntries(d.entries ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!trigger.trim() || !content.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/rsd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger: trigger.trim(),
          content: content.trim(),
          intensity,
          reframe: reframe.trim() || undefined,
        }),
      });
      if (res.ok) {
        const d = (await res.json()) as { entry: RsdEntry };
        setEntries((prev) => [d.entry, ...prev]);
        setTrigger(""); setContent(""); setIntensity(5); setReframe("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>

      {/* Dark hero */}
      <header
        className="relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse 80% 140% at 110% 65%, rgba(139,92,246,0.60) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 80%  at 85%  -5%, rgba(99,102,241,0.45) 0%, transparent 50%)",
            "linear-gradient(145deg, #1e1880 0%, #0f0d40 100%)",
          ].join(", "),
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 56px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px", opacity: 0.7 }} />
        <div className="relative z-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>RSD journal · private</p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            What <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>stung</span>?
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Name the trigger, feel it, then reframe it. Only you can see this.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>

        {/* Entry form */}
        <form
          onSubmit={save}
          className="rounded-[var(--radius-xl)] p-6 sm:p-7 mb-5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-faint)" }}>New entry</p>

          <input
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="What triggered it? (e.g. unanswered text)"
            className="w-full rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none mb-3"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's the story your brain is telling you?"
            rows={4}
            className="w-full resize-none rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none mb-4"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          />

          {/* Intensity */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>How intense?</span>
              <span className="font-display text-[20px] leading-none tabular-nums font-semibold" style={{ color: intensityColor(intensity), fontFamily: "var(--font-landing-sans), Inter, sans-serif" }}>{intensity}</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setIntensity(v)}
                  className="flex-1 rounded-lg transition-all"
                  style={{
                    height: 28,
                    background: v <= intensity ? intensityColor(intensity) : "var(--bg-soft)",
                    opacity: v <= intensity ? 1 : 0.4,
                    border: "1px solid var(--line)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>Reframe it (optional)</p>
            <textarea
              value={reframe}
              onChange={(e) => setReframe(e.target.value)}
              placeholder="What might actually be true? What would you tell a friend?"
              rows={2}
              className="w-full resize-none rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            />
          </div>

          <button
            type="submit"
            disabled={!trigger.trim() || !content.trim() || saving}
            className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-50"
            style={{
              background: saved ? "var(--xp)" : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              boxShadow: "0 6px 24px rgba(79,70,229,0.3)",
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} strokeWidth={2.5} /> : <Heart size={18} strokeWidth={2} />}
            {saving ? "Saving…" : saved ? "Saved" : "Save entry"}
          </button>
        </form>

        {/* History */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="animate-spin text-ink-muted" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center rounded-[var(--radius-lg)]" style={{ border: "1px dashed var(--line)" }}>
            <Heart size={28} strokeWidth={1} style={{ color: "var(--ink-faint)", marginBottom: 12 }} />
            <p className="font-sans text-[16px] font-semibold text-ink mb-1" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.02em" }}>Nothing here yet</p>
            <p className="font-sans text-[13px] text-ink-muted">When something stings, write it down. It helps.</p>
          </div>
        ) : (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Past entries</p>
            <div className="space-y-2">
              {entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
