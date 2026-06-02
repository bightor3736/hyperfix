"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Pill, Plus, Clock } from "lucide-react";

interface MedLog {
  id: string;
  medication: string;
  dose: string;
  taken_at: string;
  effect_rating: number | null;
  notes: string | null;
}

const today = () => new Date().toISOString().slice(0, 10);
const isToday = (iso: string) => iso.slice(0, 10) === today();

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function LogRow({ log }: { log: MedLog }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)]"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{ width: 36, height: 36, background: "var(--accent-soft)", color: "var(--accent)" }}
      >
        <Pill size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[14px] font-semibold text-ink truncate">
          {log.medication}
          {log.dose && <span className="font-normal text-ink-muted"> · {log.dose}</span>}
        </p>
        {log.notes && <p className="font-sans text-[12px] text-ink-muted truncate">{log.notes}</p>}
      </div>
      {log.effect_rating != null && (
        <span className="font-mono text-[10px] uppercase tracking-widest shrink-0" style={{ color: "var(--xp)" }}>
          {log.effect_rating}/10
        </span>
      )}
      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest shrink-0" style={{ color: "var(--ink-faint)" }}>
        <Clock size={11} strokeWidth={2} /> {timeLabel(log.taken_at)}
      </span>
    </div>
  );
}

export default function MedsPage() {
  const [logs, setLogs] = useState<MedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [medication, setMedication] = useState("");
  const [dose, setDose] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/meds")
      .then((r) => r.json())
      .then((d: { logs: MedLog[] }) => setLogs(d.logs ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!medication.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/meds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication: medication.trim(),
          dose: dose.trim() || undefined,
          effect_rating: rating ?? undefined,
          notes: notes.trim() || undefined,
        }),
      });
      if (res.ok) {
        const d = (await res.json()) as { log: MedLog };
        setLogs((prev) => [d.log, ...prev]);
        setMedication(""); setDose(""); setRating(null); setNotes("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  // Quick-repeat chips from previously logged medications.
  const recentMeds = Array.from(new Set(logs.map((l) => l.medication))).slice(0, 4);
  const todays = logs.filter((l) => isToday(l.taken_at));
  const earlier = logs.filter((l) => !isToday(l.taken_at));

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
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>Medication tracker</p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            Did you <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>take</span> them?
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Log every dose. Track what actually helps over time.
          </p>
          {todays.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest"
                style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(167,139,250,0.4)", color: "#a78bfa" }}
              >
                <Check size={11} strokeWidth={2.5} /> {todays.length} logged today
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>

        {/* Log form */}
        <form
          onSubmit={save}
          className="rounded-[var(--radius-xl)] p-6 sm:p-7 mb-5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-faint)" }}>Log a dose</p>

          {recentMeds.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {recentMeds.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMedication(m)}
                  className="press-pop inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[12px] font-medium transition-all"
                  style={{
                    background: medication === m ? "var(--accent-soft)" : "var(--bg-soft)",
                    color: medication === m ? "var(--accent)" : "var(--ink-muted)",
                    border: `1px solid ${medication === m ? "var(--accent)" : "var(--line)"}`,
                  }}
                >
                  <Pill size={11} strokeWidth={2} /> {m}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 mb-3">
            <input
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              placeholder="Medication"
              className="flex-1 rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            />
            <input
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Dose"
              className="w-28 rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            />
          </div>

          {/* Effect rating */}
          <div className="mb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>How well did it work? (optional)</p>
            <div className="flex gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRating(rating === v ? null : v)}
                  className="flex-1 rounded-lg font-sans text-[12px] font-semibold tabular-nums transition-all"
                  style={{
                    height: 32,
                    background: rating != null && v <= rating ? "var(--xp)" : "var(--bg-soft)",
                    color: rating != null && v <= rating ? "#fff" : "var(--ink-faint)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full rounded-[var(--radius-lg)] px-4 py-3 font-sans text-[14px] text-ink outline-none mb-4"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          />

          <button
            type="submit"
            disabled={!medication.trim() || saving}
            className="press-pop w-full flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-lg)] font-sans text-[15px] font-bold transition-all disabled:opacity-50"
            style={{
              background: saved ? "var(--xp)" : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              boxShadow: "0 6px 24px rgba(79,70,229,0.3)",
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
            {saving ? "Logging…" : saved ? "Logged!" : "Log it"}
          </button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="animate-spin text-ink-muted" />
          </div>
        ) : (
          <>
            {todays.length > 0 && (
              <div className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Today</p>
                <div className="space-y-2">
                  {todays.map((log) => <LogRow key={log.id} log={log} />)}
                </div>
              </div>
            )}
            {earlier.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Earlier</p>
                <div className="space-y-2">
                  {earlier.map((log) => (
                    <div key={log.id}>
                      <p className="font-mono text-[9px] uppercase tracking-widest mb-1.5 ml-1" style={{ color: "var(--ink-faint)" }}>{dayLabel(log.taken_at)}</p>
                      <LogRow log={log} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {logs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-center rounded-[var(--radius-lg)]" style={{ border: "1px dashed var(--line)" }}>
                <Pill size={28} strokeWidth={1} style={{ color: "var(--ink-faint)", marginBottom: 12 }} />
                <p className="font-sans text-[16px] font-semibold text-ink mb-1" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.02em" }}>No doses logged yet</p>
                <p className="font-sans text-[13px] text-ink-muted">Log your first dose above to start tracking.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
