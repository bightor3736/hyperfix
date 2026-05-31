"use client";

import { useState, useRef } from "react";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
        background: "var(--accent)",
        color: "var(--bg)",
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
        className="relative overflow-hidden rounded-[24px] border border-[var(--line)] p-6 sm:p-8 space-y-6"
        style={{ background: "var(--bg)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
        />
        {/* 01 — what is it */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <StepPill n="01" />
            <label htmlFor="fix-title" className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
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
            className="w-full px-4 py-3.5 font-display text-lg text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
            style={{
              background: "transparent",
              border: "1px solid var(--line)",
              borderRadius: 12,
            }}
          />
          <p className={`mt-1.5 text-right font-mono text-[9px] tracking-widest tabular ${charsLeft < 15 ? "text-accent" : "text-[var(--ink-faint)]"}`}>
            {charsLeft}
          </p>
        </div>

        {/* 02 — cover image */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <StepPill n="02" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
              cover image
              <span className="text-[var(--ink-faint)] ml-1">(optional)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <div
                className="hover:opacity-80 transition-opacity px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] font-bold"
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
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
                  style={{ borderRadius: 8, border: "1px solid var(--line)" }}
                />
                <button
                  onClick={removeCover}
                  className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] hover:text-accent transition-colors"
                >
                  remove
                </button>
              </>
            )}
          </div>
          {!coverUrl && (
            <p className="mt-2 font-mono text-[9px] text-[var(--ink-faint)]">
              becomes the card background
            </p>
          )}
        </div>

        {/* 03 — days */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <StepPill n="03" />
              <label htmlFor="fix-days" className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
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
          <div className="flex justify-between mt-2 font-mono text-[9px] text-[var(--ink-faint)]">
            <span>day 1</span>
            <span>day 365</span>
          </div>
        </div>

        {/* 04 — intensity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <StepPill n="04" />
              <label htmlFor="fix-intensity" className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
                intensity
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] tabular">
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
          <div className="flex justify-between mt-2 font-mono text-[9px] text-[var(--ink-faint)]">
            <span>mild interest</span>
            <span>not okay</span>
          </div>
        </div>

        {/* status note */}
        <p className="font-display italic text-[var(--ink-muted)] text-sm leading-snug border-l-2 border-accent/40 pl-3">
          {NOTES[intensity]}
        </p>
      </div>

      {/* Live preview */}
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-accent pulse-dot text-[8px]">●</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
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
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)] text-center max-w-xs">
          this is what it looks like when you log it
        </p>
      </div>
    </div>
  );
}
