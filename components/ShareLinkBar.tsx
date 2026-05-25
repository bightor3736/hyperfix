"use client";

import { useState } from "react";

export function ShareLinkBar({ fixId }: { fixId: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/fix/${fixId}` : `/fix/${fixId}`;

  async function handleCopy() {
    const fullUrl = `${window.location.origin}/fix/${fixId}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3 anim-fadeUp"
      style={{
        background: "rgba(94,234,212,0.04)",
        border: "1px solid rgba(94,234,212,0.15)",
        animationDelay: "55ms",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span className="font-mono text-[11px] truncate flex-1" style={{ color: "rgba(94,234,212,0.6)" }}>
        {url}
      </span>
      <button
        onClick={handleCopy}
        className="shrink-0 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full transition-all hover:opacity-80 active:scale-95"
        style={
          copied
            ? { background: "rgba(94,234,212,0.15)", border: "1px solid rgba(94,234,212,0.35)", color: "#5EEAD4" }
            : { background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.10)", color: "rgba(244,244,244,0.45)" }
        }
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
