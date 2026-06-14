"use client";

import { useState } from "react";

type State = "idle" | "generating" | "success" | "error";

type Props = {
  fixId: string;
  isPublic: boolean;
  title: string;
  days: number;
  intensity: number;
};

const TEAL = "var(--accent)";

export function ShareFixationCard({ fixId, isPublic, title, days, intensity }: Props) {
  const [state, setState] = useState<State>("idle");

  async function handleExport() {
    if (!isPublic) return;
    setState("generating");
    try {
      const res = await fetch(`/api/share/${fixId}`);
      if (!res.ok) throw new Error("card generation failed");
      const blob = await res.blob();
      const filename = `hyperfix-${title.slice(0, 32).replace(/\s+/g, "-").toLowerCase()}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: `Day ${days} of ${title}`,
            text: `currently unwell about ${title} — day ${days}, intensity ${intensity}/10. tracked on hyperfix.app`,
          });
        } catch {
          // user cancelled — silent
          setState("idle");
          return;
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }

      setState("success");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--line)",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Mini card preview — dark Hyperfix style */}
        <div
          className="shrink-0 rounded-xl overflow-hidden relative"
          style={{
            width: 56,
            height: 100,
            background: "linear-gradient(180deg, var(--bg) 0%, #07090A 100%)",
            border: "1px solid var(--accent-soft)",
            boxShadow: "0 0 18px var(--accent-soft)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Bloom */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(60% 50% at 50% 110%, var(--accent) 0%, transparent 70%)",
            }}
          />
          <div style={{ flex: 1, padding: "5px 6px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
            <div style={{ width: "70%", height: 2, background: "var(--line)", borderRadius: 20 }} />
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 11, fontWeight: 700, color: TEAL, lineHeight: 1, letterSpacing: "-0.04em" }}>
                {days > 999 ? "999+" : days}
              </div>
              <div style={{ fontSize: 4, color: "var(--ink-muted)", fontFamily: "monospace", marginTop: 1, letterSpacing: "0.15em" }}>DAYS</div>
            </div>
            <div style={{ display: "flex", gap: 1.5 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 2,
                    borderRadius: 1,
                    background: i < Math.round(intensity / 2) ? TEAL : "var(--line)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text + CTA */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--ink-muted)" }}>
            share card
          </p>
          <p className="font-sans text-sm mb-3" style={{ color: "var(--ink-muted)", lineHeight: 1.45 }}>
            {state === "success"
              ? "Card shared — go post it."
              : state === "error"
              ? "Something went wrong. Try again."
              : "Share a 1080×1920 card to TikTok, Instagram, or anywhere."}
          </p>
          <button
            onClick={handleExport}
            disabled={state === "generating" || !isPublic}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: state === "success" ? "var(--accent)" : state === "error" ? "rgba(225,29,72,0.15)" : TEAL,
              color: state === "success" ? TEAL : state === "error" ? "#F87171" : "var(--bg)",
              border: state === "success"
                ? "1px solid var(--accent-soft)"
                : state === "error"
                ? "1px solid rgba(225,29,72,0.3)"
                : "1px solid transparent",
            }}
          >
            {state === "generating" && (
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            {state === "idle" && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            {state === "success" && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {state === "generating" ? "Generating…" : state === "success" ? "Shared" : state === "error" ? "Try again" : isPublic ? "Share card" : "Make public to share"}
          </button>
        </div>
      </div>
    </div>
  );
}
