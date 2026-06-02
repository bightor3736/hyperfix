"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Zap, Target, Smile } from "lucide-react";

interface MoodLog {
  id: string;
  energy: number;
  focus: number;
  mood: number;
  notes: string | null;
  logged_at: string;
  date: string;
}

function ScaleSlider({
  label,
  icon: Icon,
  value,
  onChange,
  color,
}: {
  label: string;
  icon: typeof Zap;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
          <Icon size={12} strokeWidth={2} />
          {label}
        </span>
        <span className="font-display text-[22px] leading-none tabular-nums font-semibold" style={{ color, fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.03em" }}>
          {value}
        </span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="flex-1 rounded-lg transition-all"
            style={{
              height: 32,
              background: v <= value ? color : "var(--line)",
              opacity: v <= value ? (0.4 + (v / value) * 0.6) : 0.3,
              transform: v === value ? "scaleY(1.15)" : "scaleY(1)",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>Low</span>
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>High</span>
      </div>
    </div>
  );
}

function HistoryRow({ log }: { log: MoodLog }) {
  const date = new Date(log.logged_at);
  const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div
      className="flex items-center gap-4 px-4 py-3.5 rounded-[var(--radius-lg)]"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <div className="text-right shrink-0" style={{ minWidth: 80 }}>
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>{label}</p>
      </div>
      <div className="flex gap-4 flex-1">
        {[
          { label: "Energy", value: log.energy, color: "var(--energy)" },
          { label: "Focus",  value: log.focus,  color: "var(--accent)" },
          { label: "Mood",   value: log.mood,   color: "var(--xp)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-[16px] font-bold tabular-nums leading-none" style={{ color, fontFamily: "var(--font-landing-sans), Inter, sans-serif" }}>{value}</span>
            <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>{label}</span>
          </div>
        ))}
      </div>
      {log.notes && (
        <p className="flex-1 font-sans text-[12px] text-ink-muted truncate hidden sm:block">{log.notes}</p>
      )}
    </div>
  );
}

const today = new Date().toISOString().slice(0, 10);

export default function MoodPage() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [energy, setEnergy] = useState(5);
  const [focus,  setFocus]  = useState(5);
  const [mood,   setMood]   = useState(5);
  const [notes,  setNotes]  = useState("");

  const todayLog = logs.find((l) => l.date === today);

  useEffect(() => {
    fetch("/api/mood")
      .then((r) => r.json())
      .then((d: { logs: MoodLog[] }) => {
        const ls = d.logs ?? [];
        setLogs(ls);
        const t = ls.find((l) => l.date === today);
        if (t) { setEnergy(t.energy); setFocus(t.focus); setMood(t.mood); setNotes(t.notes ?? ""); }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ energy, focus, mood, notes: notes.trim() || undefined }),
      });
      if (res.ok) {
        const d = (await res.json()) as { log: MoodLog };
        setLogs((prev) => {
          const filtered = prev.filter((l) => l.date !== today);
          return [d.log, ...filtered];
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>Daily check-in</p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            How are you <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>actually</span>?
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Track your energy, focus, and mood. Patterns tell you things you forget.
          </p>
          {todayLog && (
            <div className="flex items-center gap-2 mt-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest"
                style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(167,139,250,0.4)", color: "#a78bfa" }}
              >
                <Check size={11} strokeWidth={2.5} /> Logged today
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>

        {/* Check-in form */}
        <form
          onSubmit={save}
          className="rounded-[var(--radius-xl)] p-6 sm:p-8 mb-5"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--line)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: "var(--ink-faint)" }}>
            {todayLog ? "Update today's check-in" : "Today's check-in"}
          </p>

          <div className="space-y-8">
            <ScaleSlider label="Energy" icon={Zap}    value={energy} onChange={setEnergy} color="var(--energy)" />
            <ScaleSlider label="Focus"  icon={Target}  value={focus}  onChange={setFocus}  color="var(--accent)" />
            <ScaleSlider label="Mood"   icon={Smile}   value={mood}   onChange={setMood}   color="var(--xp)" />
          </div>

          <div className="mt-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything on your mind? (optional)"
              rows={2}
              className="w-full resize-none rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none transition-all"
              style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="press-pop mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-50"
            style={{
              background: saved ? "var(--xp)" : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              boxShadow: saved ? "0 6px 24px rgba(124,58,237,0.3)" : "0 6px 24px rgba(79,70,229,0.3)",
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} strokeWidth={2.5} /> : null}
            {saving ? "Saving…" : saved ? "Saved!" : todayLog ? "Update" : "Log it"}
          </button>
        </form>

        {/* History */}
        {!loading && logs.filter((l) => l.date !== today).length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Recent</p>
            <div className="space-y-2">
              {logs.filter((l) => l.date !== today).map((log) => (
                <HistoryRow key={log.id} log={log} />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="animate-spin text-ink-muted" />
          </div>
        )}
      </div>
    </div>
  );
}
