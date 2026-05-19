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

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(163,230,53,0.14) 0%, transparent 70%)",
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
                  color: "#A3E635",
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
            background: "rgba(163,230,53,0.05)",
            border: "1px solid rgba(163,230,53,0.15)",
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(163,230,53,0.6)" }}
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

        {/* Share button */}
        <div className="flex justify-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#A3E635", color: "#0A0A0A" }}
          >
            {copied ? "Copied!" : "Share my Wrapped →"}
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
            background: "rgba(163,230,53,0.1)",
            border: "1px solid rgba(163,230,53,0.2)",
            color: "#A3E635",
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
