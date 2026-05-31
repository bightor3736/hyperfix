"use client";

import { useState } from "react";
import { Share2, Download, X, Loader2, Check } from "lucide-react";

type Props = {
  name?: string;
  streak: number;
  level: string;
  xp: number;
  hits: number;
};

export function ShareStatsButton({ name, streak, level, xp, hits }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams({
    name: name ?? "",
    streak: String(streak),
    level,
    xp: String(xp),
    hits: String(hits),
  });
  const imgUrl = `/api/share/stats?${params.toString()}`;

  async function nativeShare() {
    setBusy(true);
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const file = new File([blob], "hyperfix-stats.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Hyperfix streak",
          text: `${streak}-day streak on Hyperfix 🔥 — chose dopamine over the doomscroll. hyperfix.app`,
        });
      } else {
        download(blob);
      }
    } catch {
      /* user cancelled or unsupported */
    } finally {
      setBusy(false);
    }
  }

  async function downloadCard() {
    setBusy(true);
    try {
      const res = await fetch(imgUrl);
      download(await res.blob());
    } finally {
      setBusy(false);
    }
  }

  function download(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hyperfix-stats.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyText() {
    await navigator.clipboard.writeText(
      `${streak}-day streak on Hyperfix 🔥 — chose dopamine over the doomscroll. hyperfix.app`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="press-pop inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans text-[13px] font-medium transition-all hover:opacity-90"
        style={{ background: "var(--energy-soft)", color: "var(--energy)", border: "1px solid var(--energy)" }}
      >
        <Share2 size={14} strokeWidth={2} />
        Share my stats
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[var(--radius-xl)] overflow-hidden anim-pop"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
              <p className="font-sans text-[14px] font-semibold text-ink">Share your streak</p>
              <button onClick={() => setOpen(false)} className="text-ink-faint hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt="Your Hyperfix stats card"
                className="w-full rounded-2xl"
                style={{ border: "1px solid var(--line)" }}
              />

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={nativeShare}
                  disabled={busy}
                  className="press-pop flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold transition-all hover:opacity-95 disabled:opacity-50"
                  style={{ background: "var(--energy)", color: "#fff" }}
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} strokeWidth={2.5} />}
                  Share
                </button>
                <button
                  onClick={downloadCard}
                  disabled={busy}
                  className="press-pop flex items-center justify-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] font-sans text-[13px] font-medium transition-all disabled:opacity-50"
                  style={{ background: "var(--bg)", color: "var(--ink-muted)", border: "1px solid var(--line)" }}
                >
                  <Download size={15} strokeWidth={1.5} />
                </button>
              </div>

              <button
                onClick={copyText}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 font-mono text-[11px] text-ink-faint hover:text-accent transition-colors"
              >
                {copied ? <Check size={12} className="text-accent" /> : null}
                {copied ? "Caption copied" : "Copy caption text"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
