"use client";

import { useState } from "react";

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const PRO_THRESHOLD = 3;

export function ReferralCard({
  referralCode,
  referralCount,
}: {
  referralCode: string;
  referralCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://hyperfix.app/join?ref=${referralCode}`;
  const progress = Math.min(referralCount, PRO_THRESHOLD);
  const isPro = referralCount >= PRO_THRESHOLD;

  function copyLink() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function share() {
    if (navigator.share) {
      navigator.share({
        title: "hyperfix — track your obsessions",
        text: "track your hyperfixations on hyperfix — count the days, build your graveyard 🪦",
        url: referralUrl,
      });
    } else {
      copyLink();
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-7 anim-fadeUp"
      style={{
        background: CARD_BG,
        border: isPro
          ? `1px solid rgba(94,234,212,0.35)`
          : `1px solid ${CARD_BORDER}`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
      />

      {/* Teal glow if pro unlocked */}
      {isPro && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(94,234,212,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span
              className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-3"
              style={{
                background: "rgba(94,234,212,0.10)",
                color: TEAL,
                border: "1px solid rgba(94,234,212,0.22)",
              }}
            >
              {isPro ? "✦ Pro unlocked" : "invite friends"}
            </span>
            <h2
              className="font-display"
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              {isPro ? "you earned Pro." : "refer 3 friends,\nget Pro free."}
            </h2>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 pt-1 shrink-0">
            {Array.from({ length: PRO_THRESHOLD }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: i < progress ? TEAL : "rgba(255,255,255,0.12)",
                  boxShadow: i < progress ? "0 0 8px rgba(94,234,212,0.5)" : "none",
                  transition: "background 0.3s, box-shadow 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress text */}
        <p className="font-sans text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
          {isPro
            ? "unlimited fixes, AI eulogies, Pro badge. you did it."
            : referralCount === 0
              ? "share your link. when 3 friends join, you unlock Pro at launch."
              : `${referralCount} of 3 friends joined. ${PRO_THRESHOLD - referralCount} more to go.`}
        </p>

        {/* Link box */}
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-4 font-mono text-xs truncate"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span className="truncate flex-1">{referralUrl}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="flex-1 font-sans text-sm font-semibold py-3 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: copied ? TEAL : "#FFFFFF",
              color: "#0A0A0A",
            }}
          >
            {copied ? "copied ✓" : "copy link"}
          </button>
          <button
            onClick={share}
            className="flex-1 font-sans text-sm font-medium py-3 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            share
          </button>
        </div>
      </div>
    </div>
  );
}
