"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Inbox, Check, Loader2 } from "lucide-react";

/**
 * Universal quick-capture. Opens with ⌘K / Ctrl+K (or the floating button).
 * Frictionless brain-dump in <10s — the core ADHD retention mechanic.
 */
export function QuickCapture() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setSaved(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  async function capture() {
    const content = value.trim();
    if (!content || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/brain-dump/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, energy_required: "any" }),
      });
      if (res.ok) {
        setValue("");
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 1600);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Floating button (desktop) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick capture (⌘K)"
        className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center gap-2 h-12 pl-4 pr-5 rounded-full shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
        style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
      >
        <Plus size={18} strokeWidth={2} />
        <span className="text-[13px] font-medium">Capture</span>
        <kbd
          className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          ⌘K
        </kbd>
      </button>

      {!open ? null : (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[18vh]"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden anim-fadeUp"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "var(--line)" }}>
              {saved ? (
                <Check size={18} className="text-accent shrink-0" strokeWidth={2} />
              ) : saving ? (
                <Loader2 size={18} className="text-ink-muted shrink-0 animate-spin" />
              ) : (
                <Inbox size={18} className="text-ink-faint shrink-0" strokeWidth={1.5} />
              )}
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") capture();
                }}
                placeholder={saved ? "Captured. Keep going…" : "What's in your head? Dump it here…"}
                className="flex-1 bg-transparent outline-none text-ink text-[15px] placeholder:text-ink-faint"
              />
              <kbd className="font-mono text-[10px] text-ink-faint">↵</kbd>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={capture}
                disabled={!value.trim() || saving}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-bg-soft disabled:opacity-40"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent-soft)" }}>
                  <Inbox size={15} className="text-accent" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">Save to Brain Dump</p>
                  <p className="text-xs text-ink-muted">Capture the thought now, sort it later.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/new");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-bg-soft"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent-soft)" }}>
                  <Sparkles size={15} className="text-accent" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">New fixation</p>
                  <p className="text-xs text-ink-muted">Start tracking something that took over.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
