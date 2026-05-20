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
      });

      const res = await fetch(`/api/wrapped/image?${params}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hyperfix-wrapped-${year}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#080808", color: "#F4F4F4" }}
    >
      {/* Lime radial glow from top center */}
      <div
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(94,234,212,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            hyperfix
          </span>
          <h1
            className="font-display font-medium leading-none tracking-tight"
            style={{
              fontSize: "clamp(5rem, 22vw, 10rem)",
              WebkitTextStroke: "1px rgba(244,244,244,0.3)",
              color: "transparent",
            }}
          >
            {year}
          </h1>
          <p
            className="font-sans text-xl sm:text-2xl -mt-2"
            style={{ color: "rgba(244,244,244,0.6)" }}
          >
            {viewerName === "you" ? "Your" : `${viewerName}'s`} year in obsessions.
          </p>
        </div>

        {/* Stat cards 2×2 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-6 sm:p-8 flex flex-col gap-2"
              style={{
                background: "#111113",
                border: "1px solid rgba(244,244,244,0.07)",
              }}
            >
              <span
                className="font-display leading-none tracking-tight"
                style={{
                  fontSize: "clamp(2rem, 7vw, 3.5rem)",
                  color: "#5EEAD4",
                }}
              >
                {card.value}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(244,244,244,0.4)" }}
              >
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
        <div
          className="rounded-2xl p-8 sm:p-10 flex flex-col gap-3"
          style={{
            background: "rgba(94,234,212,0.05)",
            border: "1px solid rgba(94,234,212,0.15)",
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(94,234,212,0.6)" }}
          >
            hyperfix says
          </span>
          <p
            className="font-display text-xl sm:text-2xl leading-snug"
            style={{ color: "#F4F4F4" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Share / download buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#5EEAD4", color: "#0A0A0A" }}
          >
            {copied ? "Copied!" : "Share my Wrapped →"}
          </button>
          <button
            onClick={handleTweet}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: "rgba(94,234,212,0.08)",
              border: "1px solid rgba(94,234,212,0.25)",
              color: "#5EEAD4",
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: "rgba(244,244,244,0.05)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.6)",
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
      </div>
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
    <div
      className="rounded-2xl p-6 sm:p-8 flex flex-col gap-4"
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
      }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "rgba(244,244,244,0.35)" }}
      >
        {badge}
      </span>
      <h2
        className="font-display leading-tight"
        style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)", color: "#F4F4F4" }}
      >
        {title}
      </h2>
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full"
          style={{
            background: "rgba(94,234,212,0.1)",
            border: "1px solid rgba(94,234,212,0.2)",
            color: "#5EEAD4",
          }}
        >
          {category}
        </span>
        <span
          className="font-mono text-[11px]"
          style={{ color: "rgba(244,244,244,0.5)" }}
        >
          {meta}
        </span>
      </div>
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "rgba(244,244,244,0.3)" }}
      >
        {dateRange}
      </span>
    </div>
  );
}
