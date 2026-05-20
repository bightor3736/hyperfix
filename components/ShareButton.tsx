"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  fixId: string;
  isPublic: boolean;
};

export function ShareButton({ fixId, isPublic }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleButtonClick() {
    if (!isPublic) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
      return;
    }
    setOpen((v) => !v);
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/fix/${fixId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
  }

  function handleDownloadCard() {
    window.open(`/api/card/${fixId}`, "_blank");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={handleButtonClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-medium transition-all duration-150"
        style={{
          background: "rgba(244,244,244,0.05)",
          border: "1px solid rgba(244,244,244,0.12)",
          color: "rgba(244,244,244,0.7)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#A855F7";
          (e.currentTarget as HTMLButtonElement).style.color = "#A855F7";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,244,244,0.12)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,244,244,0.7)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share card
      </button>

      {/* Tooltip for private fix */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap z-50"
          style={{
            background: "#161618",
            border: "1px solid rgba(244,244,244,0.12)",
            color: "rgba(244,244,244,0.7)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          Make fix public in settings to share
          <div
            className="absolute top-full left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid rgba(244,244,244,0.12)",
            }}
          />
        </div>
      )}

      {/* Dropdown */}
      {open && isPublic && (
        <div
          className="absolute bottom-full left-0 mb-2 rounded-2xl p-2 z-50 flex flex-col gap-1 min-w-[180px]"
          style={{
            background: "#161618",
            border: "1px solid rgba(244,244,244,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-colors text-left"
            style={{ color: copied ? "#A855F7" : "rgba(244,244,244,0.7)" }}
            onMouseEnter={(e) => !copied && ((e.currentTarget as HTMLButtonElement).style.background = "rgba(244,244,244,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied ✓
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy link
              </>
            )}
          </button>
          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-colors text-left"
            style={{ color: "rgba(244,244,244,0.7)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(244,244,244,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download card
          </button>
        </div>
      )}
    </div>
  );
}
