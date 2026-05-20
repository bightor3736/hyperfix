"use client";

import { useState, useRef } from "react";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

const NOTES: Record<number, string> = {
  1: "just a mild interest. probably fine.",
  2: "just a mild interest. probably fine.",
  3: "it's becoming a thing. i'm aware.",
  4: "it's becoming a thing. i'm aware.",
  5: "okay it's definitely a thing now.",
  6: "okay it's definitely a thing now.",
  7: "i cannot be stopped. please help.",
  8: "i cannot be stopped. please help.",
  9: "i am not okay. this is my life now.",
  10: "i am not okay. this is my life now.",
};

function StepPill({ n }: { n: string }) {
  return (
    <span
      className="font-mono text-[10px] font-bold shrink-0"
      style={{
        background: "#A855F7",
        color: "#0A0A0A",
        borderRadius: 999,
        padding: "3px 10px",
        letterSpacing: "0.06em",
      }}
    >
      {n}
    </span>
  );
}

export default function FixCalculator() {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(12);
  const [intensity, setIntensity] = useState(7);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayTitle = title.trim() || "your current obsession";
  const charsLeft = 80 - title.length;

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCoverUrl(URL.createObjectURL(file));
  }

  function removeCover() {
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCoverUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Controls */}
      <div
        className="rounded-[24px] border border-[rgba(244,244,244,0.07)] p-6 sm:p-8 space-y-6"
        style={{ background: "#111113" }}
      >
        {/* 01 — what is it */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <StepPill n="01" />
            <label htmlFor="fix-title" className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
              what is it?
            </label>
          </div>
          <input
            id="fix-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="the marauders, sabrina carpenter, roman concrete…"
            maxLength={80}
            className="w-full px-4 py-3.5 font-display text-lg text-[rgba(244,244,244,0.9)] placeholder:text-[rgba(244,244,244,0.25)] focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
            style={{
              background: "#1C1C1E",
              border: "1px solid rgba(244,244,244,0.08)",
              borderRadius: 12,
            }}
          />
          <p className={`mt-1.5 text-right font-mono text-[9px] tracking-widest tabular ${charsLeft < 15 ? "text-accent" : "text-[rgba(244,244,244,0.25)]"}`}>
            {charsLeft}
          </p>
        </div>

        {/* 02 — cover image */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <StepPill n="02" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
              cover image
              <span className="text-[rgba(244,244,244,0.2)] ml-1">(optional)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <div
                className="hover:opacity-80 transition-opacity px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] font-bold"
                style={{
                  background: "#1C1C1E",
                  border: "1px solid rgba(244,244,244,0.08)",
                  borderRadius: 999,
                }}
              >
                {coverUrl ? "change" : "upload cover"}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCover}
              />
            </label>
            {coverUrl && (
              <>
                <img
                  src={coverUrl}
                  alt="cover preview"
                  className="h-10 w-16 object-cover"
                  style={{ borderRadius: 8, border: "1px solid rgba(244,244,244,0.1)" }}
                />
                <button
                  onClick={removeCover}
                  className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] hover:text-accent transition-colors"
                >
                  remove
                </button>
              </>
            )}
          </div>
          {!coverUrl && (
            <p className="mt-2 font-mono text-[9px] text-[rgba(244,244,244,0.25)]">
              becomes the card background
            </p>
          )}
        </div>

        {/* 03 — days */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <StepPill n="03" />
              <label htmlFor="fix-days" className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
                how many days in?
              </label>
            </div>
            <span className="font-display tabular text-accent text-2xl leading-none">{days}</span>
          </div>
          <input
            id="fix-days"
            type="range"
            min={1}
            max={365}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full hyperfix-range"
          />
          <div className="flex justify-between mt-2 font-mono text-[9px] text-[rgba(244,244,244,0.25)]">
            <span>day 1</span>
            <span>day 365</span>
          </div>
        </div>

        {/* 04 — intensity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <StepPill n="04" />
              <label htmlFor="fix-intensity" className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
                intensity
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.7)] tabular">
              {intensity}/10
            </span>
          </div>
          <input
            id="fix-intensity"
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full hyperfix-range"
          />
          <div className="flex justify-between mt-2 font-mono text-[9px] text-[rgba(244,244,244,0.25)]">
            <span>mild interest</span>
            <span>not okay</span>
          </div>
        </div>

        {/* status note */}
        <p className="font-display italic text-[rgba(244,244,244,0.5)] text-sm leading-snug border-l-2 border-accent/40 pl-3">
          {NOTES[intensity]}
        </p>
      </div>

      {/* Live preview */}
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-accent pulse-dot text-[8px]">●</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
            live preview
          </span>
        </div>
        <TiltCard tiltLimit={12} scale={1.04} effect="gravitate">
          <HyperfixCard
            title={displayTitle}
            type="hyperfixation"
            day={days}
            intensity={intensity}
            user="@you"
            tilt=""
            started="just now"
            note={NOTES[intensity]}
            color="bg-paperDeep"
            coverUrl={coverUrl ?? undefined}
          />
        </TiltCard>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.3)] text-center max-w-xs">
          this is what it looks like when you log it
        </p>
      </div>
    </div>
  );
}
