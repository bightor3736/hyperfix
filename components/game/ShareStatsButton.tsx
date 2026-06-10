"use client";

import { useState } from "react";
import { Share2, Download, X, Loader2, Check } from "lucide-react";
import { track } from "@/lib/analytics/client";

type Props = {
  name?: string;
  streak: number;
  level: string;
  levelNum?: number;
  xp: number;
  hits: number;
  /** current hyperfixation — the relatable hook on the card */
  fixation?: string;
};

export function ShareStatsButton({ name, streak, level, levelNum, xp, hits, fixation }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams({
    name: name ?? "",
    streak: String(streak),
    level,
    levelNum: String(levelNum ?? ""),
    xp: String(xp),
    hits: String(hits),
    fixation: fixation ?? "",
  });
  const imgUrl = `/api/share/stats?${params.toString()}`;

  const caption = fixation
    ? `Level ${levelNum || ""}: ${level} on Hyperfix. Currently obsessed with ${fixation}. ${streak}-day streak. hyperfix.app`
    : `Level ${levelNum || ""}: ${level} on Hyperfix — ${streak}-day streak and counting. hyperfix.app`;

  async function nativeShare() {
    setBusy(true);
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const file = new File([blob], "hyperfix-card.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        track("share", { surface: "native", levelNum: levelNum ?? 0 });
        await navigator.share({ files: [file], title: "My Hyperfix card", text: caption });
      } else {
        track("share", { surface: "download", levelNum: levelNum ?? 0 });
        download(blob);
      }
    } catch {
      /* cancelled / unsupported */
    } finally {
      setBusy(false);
    }
  }

  async function downloadCard() {
    setBusy(true);
    track("share", { surface: "download", levelNum: levelNum ?? 0 });
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
    a.download = "hyperfix-card.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyText() {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="brutal-btn inline-flex items-center gap-2 px-4 py-2 text-[13px]"
        style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 16 }}
      >
        <Share2 size={14} strokeWidth={2.5} />
        Share my card
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(43,36,64,0.6)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden anim-pop"
            style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--line-strong)", borderRadius: 16, boxShadow: "var(--shadow-xl)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1.5px solid var(--line-strong)" }}>
              <p className="text-[15px] font-bold text-ink">Share your card</p>
              <button onClick={() => setOpen(false)} className="text-ink-faint transition-colors hover:text-ink">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt="Your Hyperfix card"
                className="w-full"
                style={{ border: "1.5px solid var(--line-strong)", borderRadius: 16 }}
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={nativeShare}
                  disabled={busy}
                  className="brutal-btn flex-1 py-3 text-[14px] disabled:opacity-50"
                  style={{ background: "var(--accent)", color: "#fff", borderRadius: 16 }}
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} strokeWidth={2.5} />}
                  Share
                </button>
                <button
                  onClick={downloadCard}
                  disabled={busy}
                  className="brutal-btn px-4 py-3 text-[13px] disabled:opacity-50"
                  style={{ background: "var(--bg-elevated)", color: "var(--ink)", borderRadius: 16 }}
                >
                  <Download size={15} strokeWidth={2.5} />
                </button>
              </div>

              <button
                onClick={copyText}
                className="mt-3 flex w-full items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-faint transition-colors hover:text-accent"
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
