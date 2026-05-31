"use client";

import { useEffect } from "react";
import { BANNER_PRESETS } from "@/lib/banner-presets";

const TEAL = "var(--accent)";
const BG = "var(--bg)";
const CARD = "var(--bg)";
const BORDER = "var(--line)";

type Props = {
  onSelect: (presetId: string) => void;
  onClose: () => void;
};

export function BannerGalleryPicker({ onSelect, onClose }: Props) {
  // Close on Escape, lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(7,7,8,0.85)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pick a banner preset"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: BG,
          border: `1px solid ${BORDER}`,
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div>
            <p
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--ink-muted)" }}
            >
              Banner gallery
            </p>
            <p
              className="font-display text-lg mt-0.5"
              style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
            >
              Pick a preset
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full w-9 h-9 flex items-center justify-center transition-all hover:opacity-80"
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              color: "var(--ink-muted)",
            }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BANNER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelect(preset.id);
                  onClose();
                }}
                className="group relative rounded-xl overflow-hidden transition-all"
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                }}
              >
                {/* Thumb — 3:1 aspect for 1500×500 */}
                <div
                  className="w-full transition-all group-hover:-translate-y-0.5"
                  style={{ aspectRatio: "3 / 1" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/banner-preset/${preset.id}`}
                    alt={preset.label}
                    loading="lazy"
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div
                  className="px-3 py-2 flex items-center justify-between transition-colors"
                  style={{ borderTop: `1px solid ${BORDER}` }}
                >
                  <span
                    className="font-sans text-xs font-medium transition-colors group-hover:text-[color:var(--teal)]"
                    style={
                      {
                        color: "var(--ink)",
                        ["--teal" as string]: TEAL,
                      } as React.CSSProperties
                    }
                  >
                    {preset.label}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: TEAL }}
                  >
                    pick
                  </span>
                </div>
                {/* Hover border glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ border: `1px solid ${TEAL}55` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <p
            className="font-mono text-[10px]"
            style={{ color: "var(--ink-faint)" }}
          >
            {BANNER_PRESETS.length} presets · 1500×500 · click to apply
          </p>
        </div>
      </div>
    </div>
  );
}
