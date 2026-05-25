"use client";

import { useState } from "react";
import Link from "next/link";
import { FixBannerUpload } from "@/components/FixBannerUpload";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

type Style = "paper" | "dark" | "minimal" | "photo";

const STYLES: { key: Style; label: string; desc: string }[] = [
  { key: "paper", label: "Paper", desc: "Cream paper, red day count, classic." },
  { key: "dark", label: "Dark", desc: "Black background, teal day count, moody." },
  { key: "minimal", label: "Minimal", desc: "Just the essentials, centered." },
  { key: "photo", label: "Photo", desc: "Your banner image as the full background." },
];

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

type Props = {
  fixId: string;
  userId: string;
  initialBannerUrl: string | null;
  initialCardStyle: Style | null;
  fixTitle: string;
};

export function CardEditor({ fixId, userId, initialBannerUrl, initialCardStyle, fixTitle }: Props) {
  const [style, setStyle] = useState<Style>(
    initialCardStyle ?? (initialBannerUrl ? "photo" : "paper")
  );
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBannerUrl);
  const [savedToast, setSavedToast] = useState(false);
  const { toast } = useToast();

  async function persistStyle(next: Style) {
    setStyle(next);
    try {
      const supabase = createClient();
      await supabase.from("fixes").update({ card_style: next }).eq("id", fixId);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 1500);
    } catch {
      // Non-fatal — preview still works
    }
  }
  const [downloading, setDownloading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // bust cache on banner change

  const previewUrl = `/api/share/${fixId}?style=${style}&_=${previewKey}`;

  async function handleDownload() {
    setDownloading(true);
    toast({ message: "Generating your card…", type: "info" });
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = fixTitle.replace(/\s+/g, "-").toLowerCase().slice(0, 40);
      a.download = `hyperfix-${safeTitle}-${style}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ message: "Card saved. Post it.", type: "success" });
    } catch {
      toast({ message: "Download failed.", type: "error" });
    } finally {
      setDownloading(false);
    }
  }

  function handleBannerChange(url: string | null) {
    setBannerUrl(url);
    setPreviewKey((k) => k + 1);
    if (url && style !== "photo") setStyle("photo");
    if (!url && style === "photo") setStyle("paper");
  }

  return (
    <div className="grid lg:grid-cols-[1fr,360px] gap-6 lg:gap-8">
      {/* Preview area */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(244,244,244,0.35)" }}>
          live preview
        </p>
        <div
          className="relative rounded-3xl overflow-hidden mx-auto"
          style={{
            maxWidth: 380,
            aspectRatio: "9 / 16",
            background: "#0F1011",
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${style}-${previewKey}`}
            src={previewUrl}
            alt={`${fixTitle} share card`}
            className="w-full h-full object-cover anim-fadeUp"
            style={{ display: "block" }}
          />
        </div>
        <div className="flex justify-center mt-5 gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: TEAL, color: "#0A1F1C" }}
          >
            {downloading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="anim-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Downloading…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </>
            )}
          </button>
          <Link
            href={`/dashboard/fix/${fixId}`}
            className="inline-flex items-center px-5 py-3 rounded-full font-sans text-sm transition-all hover:opacity-80"
            style={{
              background: "rgba(244,244,244,0.04)",
              border: "1px solid rgba(244,244,244,0.08)",
              color: "rgba(244,244,244,0.55)",
            }}
          >
            Back
          </Link>
        </div>
      </div>

      {/* Editor controls */}
      <div className="flex flex-col gap-6">
        {/* Style picker */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.35)" }}>
              template
            </p>
            {savedToast && (
              <span
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest anim-fadeUp"
                style={{ color: TEAL }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                saved
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((s) => {
              const isActive = style === s.key;
              const disabled = s.key === "photo" && !bannerUrl;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => !disabled && persistStyle(s.key)}
                  disabled={disabled}
                  className="text-left rounded-2xl p-3 transition-all disabled:opacity-40"
                  style={{
                    background: isActive ? "rgba(94,234,212,0.08)" : CARD_BG,
                    border: `1px solid ${isActive ? "rgba(94,234,212,0.4)" : CARD_BORDER}`,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  <p
                    className="font-sans text-sm font-semibold"
                    style={{ color: isActive ? TEAL : "#F4F4F4" }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-sans text-[11px] mt-1 leading-snug"
                    style={{ color: "rgba(244,244,244,0.4)" }}
                  >
                    {disabled ? "upload a banner first" : s.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Banner upload */}
        <div>
          <FixBannerUpload
            userId={userId}
            fixId={fixId}
            bannerUrl={bannerUrl}
            onChange={handleBannerChange}
          />
        </div>

        {/* Tips */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(94,234,212,0.04)",
            border: "1px solid rgba(94,234,212,0.15)",
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: TEAL }}>
            tip
          </p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.65)" }}>
            Upload a banner that captures the vibe (album art, scene from the show, character art). The Photo template uses it as the full background — most viral on TikTok &amp; IG stories.
          </p>
        </div>
      </div>
    </div>
  );
}
