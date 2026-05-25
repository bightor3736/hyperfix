"use client";

import { useState } from "react";

type StatCard = {
  value: string;
  label: string;
};

type FixSummary = {
  title: string;
  category: string;
  days: number;
  startedAt: string;
  endedAt: string;
};

type MostIntenseSummary = FixSummary & {
  intensity: number;
};

type Props = {
  year: number;
  viewerName: string;
  statCards: StatCard[];
  longestFix: FixSummary;
  mostIntenseFix: MostIntenseSummary;
  quote: string;
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function WrappedClient({
  year,
  viewerName,
  statCards,
  longestFix,
  mostIntenseFix,
  quote,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTweet() {
    const totalFixes = statCards.find((s) => s.label === "total fixes")?.value ?? "0";
    const totalDays = statCards.find((s) => s.label === "days fixated")?.value ?? "0";
    const text = `my hyperfix wrapped ${year}: ${totalFixes} fixations, ${totalDays} days of being unwell. i'm so normal 😭 ${window.location.href}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  async function handleDownloadImage() {
    setDownloading(true);
    try {
      const totalFixes = statCards.find((s) => s.label === "total fixes")?.value ?? "0";
      const totalDays = statCards.find((s) => s.label === "days fixated")?.value ?? "0";
      const topCategory = statCards.find((s) => s.label === "top category")?.value ?? "other";
      const avgIntensity = statCards.find((s) => s.label === "avg intensity")?.value ?? "0";

      const params = new URLSearchParams({
        year: String(year),
        totalFixes,
        totalDays,
        topCategory,
        avgIntensity,
        longestTitle: longestFix.title,
        longestDays: String(longestFix.days),
        quote,
        name: viewerName !== "you" ? viewerName : "",
      });

      const res = await fetch(`/api/wrapped/image?${params}`);
      const blob = await res.blob();
      const filename = `hyperfix-wrapped-${year}.png`;

      if (
        navigator.share &&
        navigator.canShare?.({ files: [new File([blob], filename, { type: "image/png" })] })
      ) {
        await navigator.share({
          files: [new File([blob], filename, { type: "image/png" })],
          title: `My Hyperfix Wrapped ${year}`,
          text: `${totalFixes} fixations. ${totalDays} days of being unwell. hyperfix.app`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
      <main className="relative max-w-3xl mx-auto flex flex-col gap-6">
        {/* HERO with big year */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-12 anim-fadeUp" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)", border: `1px solid ${CARD_BORDER}` }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }} />
          <div className="relative">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5" style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}>
              hyperfix wrapped
            </span>
            <h1 className="font-display leading-none" style={{ fontSize: "clamp(80px, 22vw, 180px)", letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.35)", fontWeight: 600 }}>
              {year}
            </h1>
            <p className="mt-2 font-display anim-fadeUp delay-200" style={{ color: "#FFFFFF", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {viewerName === "you" ? "Your" : `${viewerName}'s`} year in obsessions.
            </p>
          </div>
        </div>

        {/* Stat cards 2×2 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col gap-2 anim-fadeUp"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: `${i * 60}ms` }}
            >
              <span className="relative font-display leading-none tabular-nums" style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)", color: TEAL, fontWeight: 600, letterSpacing: "-0.03em" }}>
                {card.value}
              </span>
              <span className="relative font-sans text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* Longest fix */}
        <FixHighlightCard
          badge="longest fix"
          title={longestFix.title}
          category={longestFix.category}
          meta={`${longestFix.days} days`}
          dateRange={`${longestFix.startedAt} → ${longestFix.endedAt}`}
        />

        {/* Most intense fix */}
        <FixHighlightCard
          badge="most intense"
          title={mostIntenseFix.title}
          category={mostIntenseFix.category}
          meta={`${mostIntenseFix.days} days · ${mostIntenseFix.intensity}/10`}
          dateRange={`${mostIntenseFix.startedAt} → ${mostIntenseFix.endedAt}`}
        />

        {/* Quote */}
        <div className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-10 flex flex-col gap-3" style={{ background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.18)" }}>
          <div className="relative">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-3" style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}>
              hyperfix says
            </span>
            <p className="font-display text-xl sm:text-2xl leading-snug" style={{ color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.01em" }}>
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Share / download buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
            style={{
              background: "#FFFFFF",
              color: "#0A0A0A",
              borderRadius: 999,
              boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px rgba(94,234,212,0.25)",
            }}
          >
            {copied ? "Copied!" : "Share my Wrapped →"}
          </button>
          <button
            onClick={handleTweet}
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-90"
            style={{
              background: "rgba(94,234,212,0.08)",
              border: "1px solid rgba(94,234,212,0.25)",
              color: TEAL,
              borderRadius: 999,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Post to X
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.7)",
              borderRadius: 999,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? "Generating…" : "Download image"}
          </button>
        </div>
      </main>
    </div>
  );
}

function FixHighlightCard({
  badge,
  title,
  category,
  meta,
  dateRange,
}: {
  badge: string;
  title: string;
  category: string;
  meta: string;
  dateRange: string;
}) {
  return (
    <div className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col gap-4" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      <div className="relative">
        <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-4" style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}>
          {badge}
        </span>
        <h2 className="font-display leading-tight mb-4" style={{ fontSize: "clamp(22px, 4.5vw, 32px)", color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <span className="font-sans text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}>
            {category}
          </span>
          <span className="font-sans text-sm tabular-nums" style={{ color: TEAL }}>
            {meta}
          </span>
        </div>
        <span className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {dateRange}
        </span>
      </div>
    </div>
  );
}
