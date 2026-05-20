"use client";

import { useState, useRef, useEffect } from "react";
import { Send, TickSquare, Download } from "react-iconly";

type Props = {
  fixId: string;
  isPublic: boolean;
  fixTitle?: string;
  days?: number;
  intensity?: number;
};

export function ShareButton({ fixId, isPublic, fixTitle, days, intensity }: Props) {
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

  function handleTwitterShare() {
    const url = `${window.location.origin}/fix/${fixId}`;
    const parts = [
      fixTitle && days ? `day ${days} of ${fixTitle}.` : null,
      intensity ? `intensity: ${intensity}/10.` : null,
      `i'm so normal 😭`,
      url,
    ].filter(Boolean);
    const text = parts.join(" ");
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
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
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#5EEAD4";
          (e.currentTarget as HTMLButtonElement).style.color = "#5EEAD4";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,244,244,0.12)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,244,244,0.7)";
        }}
      >
        <Send set="light" size={14} primaryColor="currentColor" />
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
          className="absolute bottom-full left-0 mb-2 rounded-2xl p-2 z-50 flex flex-col gap-1 min-w-[200px]"
          style={{
            background: "#161618",
            border: "1px solid rgba(244,244,244,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-colors text-left"
            style={{ color: copied ? "#5EEAD4" : "rgba(244,244,244,0.7)" }}
            onMouseEnter={(e) => !copied && ((e.currentTarget as HTMLButtonElement).style.background = "rgba(244,244,244,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            {copied ? (
              <>
                <TickSquare set="bold" size={14} primaryColor="currentColor" />
                Copied ✓
              </>
            ) : (
              <>
                <Send set="light" size={14} primaryColor="currentColor" />
                Copy link
              </>
            )}
          </button>

          <button
            onClick={handleTwitterShare}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-colors text-left"
            style={{ color: "rgba(244,244,244,0.7)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(244,244,244,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Post to X / Twitter
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-colors text-left"
            style={{ color: "rgba(244,244,244,0.7)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(244,244,244,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <Download set="light" size={14} primaryColor="currentColor" />
            Download card
          </button>
        </div>
      )}
    </div>
  );
}
