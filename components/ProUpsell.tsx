"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PRO_FEATURES } from "@/lib/pro-features";

const WHITE = "#ffffff";

function FeatureList() {
  return (
    <div className="flex flex-col gap-3">
      {PRO_FEATURES.map((f) => (
        <div key={f.name} className="flex items-start gap-3">
          <span className="shrink-0 leading-none mt-0.5 inline-flex" style={{ color: WHITE }} aria-hidden>
            <f.Icon size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold" style={{ color: "var(--ink)" }}>
              {f.name}
            </p>
            <p className="font-sans text-[12px] leading-snug mt-0.5" style={{ color: "var(--ink-muted)" }}>
              {f.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Full-page upsell — use on Pro-gated routes (e.g. analytics). */
export function ProUpsellWall({ heading, blurb }: { heading?: string; blurb?: string }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="rounded-3xl p-8 sm:p-10" style={{ background: "var(--bg)", border: `1px solid ${WHITE}33` }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: WHITE }}>
          Hyperfix Pro
        </p>
        <h1 className="font-display text-2xl font-medium mb-2" style={{ color: "var(--ink)" }}>
          {heading ?? "Unlock this with Pro"}
        </h1>
        <p className="font-sans text-sm mb-7 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          {blurb ?? "Pro turns Hyperfix into your personal obsession HQ. Here's everything you get:"}
        </p>
        <div className="mb-8">
          <FeatureList />
        </div>
        <Link
          href="/pricing"
          className="inline-block w-full text-center px-6 py-3.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: WHITE, color: "var(--bg)" }}
        >
          Upgrade to Pro →
        </Link>
      </div>
    </div>
  );
}

/** Modal upsell — pop up when a non-Pro user taps a Pro control. */
export function ProUpsellModal({
  open,
  onClose,
  feature,
}: {
  open: boolean;
  onClose: () => void;
  feature?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-7 max-h-[88vh] overflow-y-auto anim-fadeUp"
        style={{ background: "var(--bg)", border: `1px solid ${WHITE}33` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-1">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: WHITE }}>
            Hyperfix Pro
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mt-1 -mr-1 w-7 h-7 flex items-center justify-center rounded-full transition-all hover:opacity-70"
            style={{ color: "var(--ink-muted)" }}
          >
            ✕
          </button>
        </div>
        <h2 className="font-display text-xl font-medium mb-2" style={{ color: "var(--ink)" }}>
          {feature ? `${feature} is a Pro feature` : "This is a Pro feature"}
        </h2>
        <p className="font-sans text-sm mb-6 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          Upgrade to unlock it — plus everything else Pro gives you:
        </p>
        <div className="mb-7">
          <FeatureList />
        </div>
        <Link
          href="/pricing"
          className="block w-full text-center px-6 py-3.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: WHITE, color: "var(--bg)" }}
        >
          Upgrade to Pro →
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="block w-full text-center mt-2 py-2 font-sans text-[13px] transition-colors hover:opacity-80"
          style={{ color: "var(--ink-faint)" }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
