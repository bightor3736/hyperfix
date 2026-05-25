"use client";

import { Download } from "react-iconly";

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
      <Download set="light" size={14} primaryColor="currentColor" />
      Export CSV
    </a>
  );
}
