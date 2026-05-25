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

export function ShareFixationCard({ fixId, isPublic, title, days, intensity }: Props) {
  const [state, setState] = useState<State>("idle");

  async function handleExport() {
    if (!isPublic) return;
    setState("generating");
    try {
      const res = await fetch(`/api/share/${fixId}`);
      if (!res.ok) throw new Error("card generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename = `hyperfix-${title.slice(0, 32).replace(/\s+/g, "-").toLowerCase()}.png`;

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], filename, { type: "image/png" })] })
      ) {
        await navigator.share({
          files: [new File([blob], filename, { type: "image/png" })],
          title: `Day ${days} of ${title}`,
          text: `currently unwell about ${title} — day ${days}, intensity ${intensity}/10. tracked on hyperfix.app`,
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      }

      URL.revokeObjectURL(url);
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
        background: "rgba(244,239,230,0.04)",
        border: "1px solid rgba(244,239,230,0.1)",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Mini card preview */}
        <div
          className="shrink-0 rounded-xl overflow-hidden"
          style={{
            width: 52,
            height: 92,
            background: "#F4EFE6",
            border: "1px solid rgba(244,239,230,0.2)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ height: 3, background: "#D72638", width: "100%", flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "4px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ width: "60%", height: 3, background: "rgba(17,17,17,0.15)", borderRadius: 2 }} />
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 9, fontWeight: 700, color: "#D72638", lineHeight: 1 }}>
                {days > 999 ? "999+" : days}
              </div>
              <div style={{ fontSize: 4, color: "rgba(17,17,17,0.4)", fontFamily: "monospace", marginTop: 1 }}>DAYS</div>
            </div>
            <div style={{ display: "flex", gap: 1 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 2,
                    borderRadius: 1,
                    background: i < Math.round(intensity / 2) ? "#0D9488" : "rgba(17,17,17,0.12)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text + CTA */}
        <div style={{ flex: 1 }}>
          <p className="font-mono text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(244,239,230,0.45)" }}>
            export card
          </p>
          <p className="font-sans text-sm mb-3" style={{ color: "rgba(244,244,244,0.7)", lineHeight: 1.45 }}>
            {state === "success"
              ? "Card exported — go post it."
              : state === "error"
              ? "Something went wrong. Try again."
              : "Download a 1080×1920 card to share on TikTok, Instagram, or anywhere."}
          </p>
          <button
            onClick={handleExport}
            disabled={state === "generating"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-150"
            style={{
              background: state === "success" ? "#0D9488" : state === "error" ? "rgba(215,38,56,0.8)" : "#D72638",
              color: "#fff",
              border: "none",
              cursor: state === "generating" ? "wait" : "pointer",
              opacity: state === "generating" ? 0.75 : 1,
            }}
          >
            {state === "generating" && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            {state === "idle" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            {state === "success" && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {state === "generating" ? "Generating…" : state === "success" ? "Exported!" : state === "error" ? "Try again" : "Export card"}
          </button>
        </div>
      </div>
    </div>
  );
}
