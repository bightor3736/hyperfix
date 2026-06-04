"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Zap,
  Flame,
  Archive,
  Check,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { DeepDiveDeck } from "@/components/game/DeepDiveDeck";
import { FirstHitCelebration } from "@/components/game/FirstHitCelebration";
import { levelForPoints } from "@/lib/gamification/levels";

type Status = "active" | "fading" | "archived";

interface Fixation {
  id: string;
  name: string;
  description: string | null;
  status: Status;
  intensity: number;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86400000);
}

function IntensityBar({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={onChange ? () => onChange(v) : undefined}
          className="w-5 h-5 rounded-[4px] transition-all"
          style={{
            background: v <= value ? "var(--energy)" : "var(--line)",
            cursor: onChange ? "pointer" : "default",
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    active: { label: "Active", color: "var(--energy)", bg: "var(--energy-soft)" },
    fading: { label: "Fading", color: "var(--ink-muted)", bg: "var(--bg-soft)" },
    archived: { label: "Done", color: "var(--ink-faint)", bg: "var(--bg)" },
  }[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-widest"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
    >
      {cfg.label}
    </span>
  );
}

function FixationCard({
  fix,
  onCheckin,
  onStatusChange,
  onDelete,
  onXp,
}: {
  fix: Fixation;
  onCheckin: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: Status) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onXp: (xp: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deepOpen, setDeepOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const days = daysSince(fix.started_at);

  async function act(fn: () => Promise<void>, key: string) {
    setLoading(key);
    try {
      await fn();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      className="rounded-[var(--radius-lg)] overflow-hidden transition-all"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${fix.status === "active" ? "var(--line)" : "var(--line)"}`,
        opacity: fix.status === "archived" ? 0.6 : 1,
      }}
    >
      {/* Header row */}
      <button
        className="w-full flex items-start gap-4 p-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <StatusBadge status={fix.status} />
            <span className="font-mono text-[10px] text-ink-faint">
              {days === 0 ? "today" : `${days}d`}
            </span>
          </div>
          <p className="text-[17px] leading-snug text-ink truncate font-semibold" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.025em" }}>{fix.name}</p>
          {fix.description && (
            <p className="font-sans text-[13px] text-ink-muted mt-1 line-clamp-1">{fix.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <IntensityBar value={fix.intensity} />
          {open ? (
            <ChevronUp size={14} strokeWidth={2} className="text-ink-faint" />
          ) : (
            <ChevronDown size={14} strokeWidth={2} className="text-ink-faint" />
          )}
        </div>
      </button>

      {/* Expanded area */}
      {open && (
      <div style={{ borderTop: "1px solid var(--line)" }}>
      {fix.status !== "archived" && (
        <div
          className="px-4 flex flex-wrap items-center gap-2"
          style={{ paddingTop: 12 }}
        >
          <button
            onClick={() => act(() => onCheckin(fix.id), "checkin")}
            disabled={loading !== null}
            className="press-pop inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-[12px] font-medium transition-all disabled:opacity-50"
            style={{ background: "var(--energy)", color: "var(--accent-ink)" }}
          >
            {loading === "checkin" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Zap size={13} strokeWidth={2.5} />
            )}
            Still fixating +5 XP
          </button>

          {fix.status === "active" && (
            <button
              onClick={() => act(() => onStatusChange(fix.id, "fading"), "fading")}
              disabled={loading !== null}
              className="press-pop inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-[12px] font-medium transition-all disabled:opacity-50"
              style={{
                background: "var(--bg-soft)",
                color: "var(--ink-muted)",
                border: "1px solid var(--line)",
              }}
            >
              {loading === "fading" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Flame size={13} strokeWidth={1.5} />
              )}
              Fading
            </button>
          )}

          {fix.status === "fading" && (
            <button
              onClick={() => act(() => onStatusChange(fix.id, "active"), "reactivate")}
              disabled={loading !== null}
              className="press-pop inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-[12px] font-medium transition-all disabled:opacity-50"
              style={{
                background: "var(--bg-soft)",
                color: "var(--ink-muted)",
                border: "1px solid var(--line)",
              }}
            >
              {loading === "reactivate" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RotateCcw size={13} strokeWidth={1.5} />
              )}
              Back in
            </button>
          )}

          <button
            onClick={() => act(() => onStatusChange(fix.id, "archived"), "archive")}
            disabled={loading !== null}
            className="press-pop inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-[12px] font-medium transition-all disabled:opacity-50"
            style={{
              background: "var(--bg-soft)",
              color: "var(--ink-muted)",
              border: "1px solid var(--line)",
            }}
          >
            {loading === "archive" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Archive size={13} strokeWidth={1.5} />
            )}
            Done with it +15 XP
          </button>

          <button
            onClick={() => act(() => onDelete(fix.id), "delete")}
            disabled={loading !== null}
            className="ml-auto press-pop p-2 rounded-xl transition-all disabled:opacity-50 hover:opacity-70"
            style={{ color: "var(--ink-faint)" }}
            title="Delete"
          >
            {loading === "delete" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <X size={13} strokeWidth={2} />
            )}
          </button>
        </div>
      )}

      {/* Deep dive toggle */}
      <div className="px-4 pt-3 pb-4">
        <button
          onClick={() => setDeepOpen((d) => !d)}
          className="press-pop w-full inline-flex items-center gap-2 px-3 py-2.5 rounded-xl font-sans text-[12px] font-medium transition-all"
          style={{
            background: deepOpen ? "var(--accent-soft)" : "transparent",
            color: deepOpen ? "var(--accent)" : "var(--ink-muted)",
            border: `1px solid ${deepOpen ? "var(--accent)" : "var(--line)"}`,
          }}
        >
          <Sparkles size={13} strokeWidth={2.5} />
          {deepOpen ? "Hide deep dive" : "Deep dive — learn about it, earn XP"}
        </button>

        {deepOpen && (
          <div className="mt-3">
            <DeepDiveDeck fixationId={fix.id} onXp={onXp} />
          </div>
        )}
      </div>
      </div>
      )}
    </div>
  );
}

function AddForm({ onAdd, defaultOpen }: { onAdd: (f: Fixation, xp: number) => void; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/fixations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, intensity }),
      });
      if (res.ok) {
        const data = (await res.json()) as { fixation: Fixation; xp: number };
        onAdd(data.fixation, data.xp);
        setName("");
        setDescription("");
        setIntensity(3);
        setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--line)" }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 font-sans text-[14px] text-ink-muted hover:text-ink transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          Log a new fixation
        </button>
      ) : (
        <form onSubmit={submit} className="p-4 space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-1.5 block">
              What are you fixating on?
            </label>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Japanese vocabulary, 90s skateboarding, sourdough starters"
              className="w-full px-3.5 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] text-ink bg-transparent outline-none"
              style={{ border: "1px solid var(--line)" }}
              required
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-1.5 block">
              Notes (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What started it? What are you consuming? Any goals?"
              className="w-full resize-none px-3.5 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] text-ink bg-transparent outline-none"
              style={{ border: "1px solid var(--line)", minHeight: 72 }}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2 block">
              Intensity
            </label>
            <IntensityBar value={intensity} onChange={setIntensity} />
            <p className="mt-1.5 font-mono text-[10px] text-ink-faint">
              {["", "mild interest", "building fast", "can't stop thinking", "consuming everything", "all I do"][intensity]}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="press-pop flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold transition-all disabled:opacity-40"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
              Log it — +10 XP
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-3 rounded-[var(--radius-lg)] transition-opacity hover:opacity-70"
              style={{ color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function FixationsPage() {
  const [fixations, setFixations] = useState<Fixation[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  // Auto-open the create form when arriving from /dashboard/new (?new=1).
  const [autoOpen] = useState(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "1"
  );
  // Coming straight from onboarding — the first logged fixation gets a
  // full-screen "first hit" celebration instead of just a toast.
  const [welcome] = useState(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("welcome") === "1"
  );
  const [celebration, setCelebration] = useState<{ name: string; xp: number; levelName: string } | null>(null);

  useEffect(() => {
    fetch("/api/fixations")
      .then((r) => r.json())
      .then((d: { fixations: Fixation[] }) => setFixations(d.fixations ?? []))
      .finally(() => setLoading(false));
  }, []);

  function showXp(xp: number) {
    if (!xp) return;
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 2500);
  }

  function handleAdd(fixation: Fixation, xp: number) {
    const isFirst = fixations.length === 0;
    setFixations((prev) => [fixation, ...prev]);
    // First fixation of an onboarding session → big celebration. Otherwise toast.
    if (welcome && isFirst) {
      setCelebration({ name: fixation.name, xp, levelName: levelForPoints(0).level.name });
    } else {
      showXp(xp);
    }
  }

  async function handleCheckin(id: string) {
    const res = await fetch(`/api/fixations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkin: true }),
    });
    if (res.ok) {
      const data = (await res.json()) as { xp: number };
      showXp(data.xp);
    }
  }

  async function handleStatusChange(id: string, status: Status) {
    const res = await fetch(`/api/fixations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = (await res.json()) as { fixation: Fixation; xp: number };
      setFixations((prev) => prev.map((f) => (f.id === id ? data.fixation : f)));
      showXp(data.xp);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/fixations/${id}`, { method: "DELETE" });
    if (res.ok) setFixations((prev) => prev.filter((f) => f.id !== id));
  }

  const filtered = fixations.filter((f) => {
    if (filter === "active") return f.status !== "archived";
    if (filter === "archived") return f.status === "archived";
    return true;
  });

  const active = fixations.filter((f) => f.status === "active").length;
  const fading = fixations.filter((f) => f.status === "fading").length;
  const done = fixations.filter((f) => f.status === "archived").length;

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      {/* First-hit celebration (onboarding) */}
      {celebration && (
        <FirstHitCelebration
          fixationName={celebration.name}
          xp={celebration.xp}
          levelName={celebration.levelName}
          onClose={() => setCelebration(null)}
        />
      )}

      {/* XP toast */}
      {xpToast !== null && (
        <div
          className="fixed top-6 right-6 z-50 anim-floatUp font-display text-[28px] pointer-events-none"
          style={{ color: "var(--energy)" }}
        >
          +{xpToast} XP
        </div>
      )}

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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px", opacity: 0.7,
          }}
        />
        <div className="relative z-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>
            Personal log
          </p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            Hyper
            <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>
              fixations
            </span>
            .
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Log what you&apos;re deep in. Check in daily. Archive when it fades.
          </p>
          {fixations.length > 0 && (
            <div className="flex gap-3 mt-5">
              {[
                { label: "Active", value: active },
                { label: "Fading", value: fading },
                { label: "Done", value: done },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-2xl px-4 py-2.5"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: "#fff", fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.03em" }}>{value}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>

        {/* Add form */}
        <div className="mb-4">
          <AddForm onAdd={handleAdd} defaultOpen={autoOpen} />
        </div>

        {/* Filter tabs */}
        {fixations.length > 0 && (
          <div className="flex items-center gap-1 mb-4 p-1 rounded-xl" style={{ background: "var(--bg-soft)" }}>
            {(["all", "active", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all"
                style={{
                  background: filter === f ? "var(--bg-elevated)" : "transparent",
                  color: filter === f ? "var(--ink)" : "var(--ink-muted)",
                  border: filter === f ? "1px solid var(--line)" : "1px solid transparent",
                }}
              >
                {f === "all" ? "All" : f === "active" ? "In progress" : "Done"}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-ink-muted" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center rounded-[var(--radius-lg)]"
            style={{ border: "1px dashed var(--line)" }}
          >
            <p className="text-[18px] text-ink mb-2 font-semibold" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.03em" }}>Nothing here yet.</p>
            <p className="font-sans text-[13px] text-ink-muted">
              {filter === "archived"
                ? "Mark fixations as done and they'll show up here."
                : "Log what you're deep in and earn XP just for showing up."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => (
              <FixationCard
                key={f.id}
                fix={f}
                onCheckin={handleCheckin}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onXp={showXp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
