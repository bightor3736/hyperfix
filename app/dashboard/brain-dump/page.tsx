"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Check, Trash2, ArrowRight, RotateCcw, Loader2, Inbox, Play, Archive, PauseCircle } from "lucide-react";

type Status = "inbox" | "doing" | "done" | "parked";

interface Item {
  id: string;
  text: string;
  status: Status;
  created_at: string;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  inbox:  { label: "Inbox",  color: "var(--ink-muted)",  bg: "var(--bg)",          border: "var(--line)" },
  doing:  { label: "Doing",  color: "var(--energy)",     bg: "var(--energy-soft)", border: "var(--energy)" },
  done:   { label: "Done",   color: "var(--xp)",         bg: "var(--xp-soft)",     border: "var(--xp)" },
  parked: { label: "Parked", color: "var(--ink-faint)",  bg: "var(--bg-soft)",     border: "var(--line)" },
};

const FILTERS: Array<{ key: Status | "all"; label: string }> = [
  { key: "all",    label: "All" },
  { key: "inbox",  label: "Inbox" },
  { key: "doing",  label: "Doing" },
  { key: "done",   label: "Done" },
  { key: "parked", label: "Parked" },
];

function StatusPill({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

function ItemCard({
  item,
  onMove,
  onDelete,
}: {
  item: Item;
  onMove: (id: string, status: Status) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function act(fn: () => Promise<void>, key: string) {
    setLoading(key);
    try { await fn(); } finally { setLoading(null); }
  }

  const isDone = item.status === "done";
  const isDoing = item.status === "doing";
  const isParked = item.status === "parked";
  const isInbox = item.status === "inbox";

  return (
    <div
      className="rounded-[var(--radius-lg)] overflow-hidden transition-all"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${isDoing ? "var(--energy)" : isDone ? "var(--xp)" : "var(--line)"}`,
        opacity: isDone ? 0.65 : 1,
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Done toggle */}
        <button
          onClick={() => act(() => onMove(item.id, isDone ? "inbox" : "done"), "done")}
          className="shrink-0 mt-0.5 flex items-center justify-center rounded-lg transition-all active:scale-90"
          style={{
            width: 24, height: 24,
            background: isDone ? "var(--xp)" : "var(--bg)",
            border: `1.5px solid ${isDone ? "var(--xp)" : "var(--line)"}`,
          }}
        >
          {loading === "done"
            ? <Loader2 size={11} className="animate-spin" style={{ color: "var(--xp)" }} />
            : isDone ? <Check size={11} strokeWidth={3} style={{ color: "#fff" }} /> : null}
        </button>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className="font-sans text-[14px] leading-snug"
            style={{
              color: isDone ? "var(--ink-faint)" : "var(--ink)",
              textDecoration: isDone ? "line-through" : "none",
            }}
          >
            {item.text}
          </p>
          <div className="mt-2">
            <StatusPill status={item.status} />
          </div>
        </div>
      </div>

      {/* Action row */}
      {!isDone && (
        <div
          className="flex items-center gap-1.5 px-3 pb-3 flex-wrap"
        >
          {isInbox && (
            <button
              onClick={() => act(() => onMove(item.id, "doing"), "doing")}
              disabled={loading !== null}
              className="press-pop inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-sans text-[11px] font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--energy)", color: "#fff" }}
            >
              {loading === "doing" ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} strokeWidth={2.5} fill="currentColor" />}
              Do this
            </button>
          )}
          {isDoing && (
            <button
              onClick={() => act(() => onMove(item.id, "inbox"), "inbox")}
              disabled={loading !== null}
              className="press-pop inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-sans text-[11px] font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              {loading === "inbox" ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} strokeWidth={1.5} />}
              Back to inbox
            </button>
          )}
          {!isParked && (
            <button
              onClick={() => act(() => onMove(item.id, "parked"), "parked")}
              disabled={loading !== null}
              className="press-pop inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-sans text-[11px] font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              {loading === "parked" ? <Loader2 size={11} className="animate-spin" /> : <PauseCircle size={11} strokeWidth={1.5} />}
              Park
            </button>
          )}
          {isParked && (
            <button
              onClick={() => act(() => onMove(item.id, "inbox"), "unpark")}
              disabled={loading !== null}
              className="press-pop inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-sans text-[11px] font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--bg-soft)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
            >
              {loading === "unpark" ? <Loader2 size={11} className="animate-spin" /> : <ArrowRight size={11} strokeWidth={1.5} />}
              Unpark
            </button>
          )}
          <button
            onClick={() => act(() => onDelete(item.id), "delete")}
            disabled={loading !== null}
            className="ml-auto press-pop p-1.5 rounded-lg transition-all disabled:opacity-50 hover:opacity-60"
            style={{ color: "var(--ink-faint)" }}
          >
            {loading === "delete" ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} strokeWidth={1.5} />}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrainDumpPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/brain-dump")
      .then((r) => r.json())
      .then((d: { items: Item[] }) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/brain-dump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (res.ok) {
        const d = (await res.json()) as { item: Item };
        setItems((prev) => [d.item, ...prev]);
        setText("");
        inputRef.current?.focus();
      }
    } finally {
      setAdding(false);
    }
  }

  async function move(id: string, status: Status) {
    const res = await fetch(`/api/brain-dump/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const d = (await res.json()) as { item: Item };
      setItems((prev) => prev.map((i) => (i.id === id ? d.item : i)));
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/brain-dump/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = {
    inbox: items.filter((i) => i.status === "inbox").length,
    doing: items.filter((i) => i.status === "doing").length,
    done:  items.filter((i) => i.status === "done").length,
    parked: items.filter((i) => i.status === "parked").length,
  };

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
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>
            Clear your head
          </p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            Brain <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>dump</span>.
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Get it out of your head. One task at a time.
          </p>
          {items.length > 0 && (
            <div className="flex gap-3 mt-5 flex-wrap">
              {(["inbox", "doing", "done", "parked"] as const).map((s) => (
                counts[s] > 0 && (
                  <div key={s} className="flex flex-col items-center rounded-2xl px-4 py-2.5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <span className="text-[18px] font-bold tabular-nums leading-none" style={{ color: "#fff", fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.03em" }}>{counts[s]}</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{s}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>

        {/* Quick add */}
        <form onSubmit={add} className="mb-4">
          <div
            className="flex items-center gap-2 rounded-[var(--radius-lg)] px-4 py-3"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <Inbox size={16} strokeWidth={1.5} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's rattling around in your head?"
              className="flex-1 bg-transparent font-sans text-[14px] text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              type="submit"
              disabled={!text.trim() || adding}
              className="press-pop shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-[12px] font-semibold transition-all disabled:opacity-40"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2.5} />}
              Dump it
            </button>
          </div>
        </form>

        {/* Filter tabs */}
        {items.length > 0 && (
          <div className="flex items-center gap-1 mb-4 p-1 rounded-xl overflow-x-auto" style={{ background: "var(--bg-soft)" }}>
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all"
                style={{
                  background: filter === key ? "var(--bg-elevated)" : "transparent",
                  color: filter === key ? "var(--ink)" : "var(--ink-muted)",
                  border: filter === key ? "1px solid var(--line)" : "1px solid transparent",
                }}
              >
                {label}
                {key !== "all" && counts[key as Status] > 0 && (
                  <span className="ml-1.5 font-sans text-[10px]" style={{ color: "var(--ink-faint)" }}>
                    {counts[key as Status]}
                  </span>
                )}
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
            <Archive size={28} strokeWidth={1} style={{ color: "var(--ink-faint)", marginBottom: 12 }} />
            <p className="font-sans text-[16px] font-semibold text-ink mb-1" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.02em" }}>
              {filter === "all" ? "Head empty. Good." : `Nothing ${filter}.`}
            </p>
            <p className="font-sans text-[13px] text-ink-muted">
              {filter === "all" ? "Type something above to dump it out of your brain." : `Switch tabs to see other items.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} onMove={move} onDelete={remove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
