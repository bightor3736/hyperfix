"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Send, TickSquare, Download } from "react-iconly";
import { useToast } from "@/components/Toast";

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Spinner({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" style={{ opacity: 0.3 }} />
      <path d="M12 2a10 10 0 0 1 10 10">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

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
  const [downloading, setDownloading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
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
    toast({ message: "Link copied", type: "success" });
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
  }

  async function handleDownloadCard() {
    setDownloading("card");
    try {
      const res = await fetch(`/api/card/${fixId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hyperfix-${fixTitle?.replace(/\s+/g, "-").toLowerCase() ?? fixId}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
      setOpen(false);
    }
  }

  async function handleDownloadStory() {
    setDownloading("story");
    try {
      const res = await fetch(`/api/share/${fixId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Try native share first (mobile) — best UX
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], "story.png", { type: "image/png" })] })
      ) {
        const file = new File([blob], `hyperfix-${fixId}-story.png`, { type: "image/png" });
        try {
          await navigator.share({
            files: [file],
            title: fixTitle ? `Day ${days} of ${fixTitle}` : "My hyperfix",
            text: fixTitle && days ? `day ${days} of ${fixTitle}. tracked on hyperfix.app` : "tracked on hyperfix.app",
          });
          URL.revokeObjectURL(url);
          setOpen(false);
          setDownloading(null);
          return;
        } catch {
          // user cancelled — fall through to download
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = `hyperfix-${fixTitle?.replace(/\s+/g, "-").toLowerCase() ?? fixId}-story.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ message: "Saved as Story", type: "success" });
    } catch {
      toast({ message: "Download failed.", type: "error" });
    } finally {
      setDownloading(null);
      setOpen(false);
    }
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

  const menuItems = (
    <>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-3 px-4 py-3 sm:py-2.5 rounded-xl font-mono text-sm sm:text-xs transition-colors text-left w-full"
        style={{ color: copied ? "var(--accent)" : "var(--ink)" }}
      >
        {copied ? (
          <>
            <TickSquare set="bold" size={16} primaryColor="currentColor" />
            Copied ✓
          </>
        ) : (
          <>
            <Send set="light" size={16} primaryColor="currentColor" />
            Copy link
          </>
        )}
      </button>

      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-3 px-4 py-3 sm:py-2.5 rounded-xl font-mono text-sm sm:text-xs transition-colors text-left w-full"
        style={{ color: "var(--ink)" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Post to X / Twitter
      </button>

      <button
        onClick={handleDownloadCard}
        disabled={!!downloading}
        className="flex items-center gap-3 px-4 py-3 sm:py-2.5 rounded-xl font-mono text-sm sm:text-xs transition-colors text-left w-full disabled:opacity-50"
        style={{ color: downloading === "card" ? "var(--accent)" : "var(--ink)" }}
      >
        {downloading === "card" ? <Spinner size={16} /> : <Download set="light" size={16} primaryColor="currentColor" />}
        Download card
      </button>

      <button
        onClick={handleDownloadStory}
        disabled={!!downloading}
        className="flex items-center gap-3 px-4 py-3 sm:py-2.5 rounded-xl font-mono text-sm sm:text-xs transition-colors text-left w-full disabled:opacity-50"
        style={{ color: downloading === "story" ? "var(--accent)" : "var(--ink)" }}
      >
        {downloading === "story" ? <Spinner size={16} /> : <InstagramIcon size={15} />}
        Share as Story (9:16)
      </button>
    </>
  );

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={handleButtonClick}
        disabled={!!downloading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-medium transition-all duration-150"
        style={{
          background: "var(--line)",
          border: "1px solid var(--line)",
          color: downloading ? "var(--ink-muted)" : "var(--ink-muted)",
          cursor: downloading ? "not-allowed" : undefined,
        }}
      >
        {downloading ? <Spinner size={14} /> : <Send set="light" size={14} primaryColor="currentColor" />}
        Share card
      </button>

      {/* Tooltip for private fix */}
      {showTooltip && (
        <div
          className="absolute top-full right-0 mt-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap z-50"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            color: "var(--ink-muted)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          Make fix public in settings to share
        </div>
      )}

      {/* Desktop dropdown */}
      {open && isPublic && (
        <div
          className="hidden sm:flex absolute top-full right-0 mt-2 rounded-2xl p-2 z-50 flex-col gap-1 min-w-[220px]"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {menuItems}
        </div>
      )}

      {/* Mobile bottom sheet (portal to body) */}
      {open && isPublic && mounted &&
        createPortal(
          <div
            className="sm:hidden fixed inset-0 z-[100] flex flex-col justify-end"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="rounded-t-3xl p-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] flex flex-col gap-1 anim-slideUp"
              style={{
                background: "var(--bg)",
                borderTop: "1px solid var(--line)",
                boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
              }}
            >
              <div className="flex justify-center pt-2 pb-3">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--ink-faint)" }} />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest px-4 pb-2" style={{ color: "var(--ink-muted)" }}>
                Share this fix
              </p>
              {menuItems}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
