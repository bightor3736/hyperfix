"use client";

export function GraveyardExportButton() {
  return (
    <a
      href="/api/export/graveyard"
      download
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all hover:opacity-80"
      style={{
        background: "rgba(244,244,244,0.06)",
        border: "1px solid rgba(244,244,244,0.1)",
        color: "rgba(244,244,244,0.45)",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export CSV
    </a>
  );
}
