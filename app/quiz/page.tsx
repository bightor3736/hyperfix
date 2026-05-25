"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ---- TOKENS ---------------------------------------------------------------
const PAGE_BG = "#070708";
const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

// ---- ARCHETYPES -----------------------------------------------------------
type Letter = "A" | "B" | "C" | "D" | "E" | "F";

type Archetype = {
  letter: Letter;
  slug: string;
  name: string;
  short: string;
  zinger: string;
  color: string;
};

const ARCHETYPES: Record<Letter, Archetype> = {
  A: {
    letter: "A",
    slug: "spiraler",
    name: "The Spiraler",
    short: "Spiraler",
    zinger:
      "You don't have a hyperfixation. You have an emotional crisis with a name and a ship tag.",
    color: "#EC4899",
  },
  B: {
    letter: "B",
    slug: "lore-goblin",
    name: "The Lore Goblin",
    short: "Lore Goblin",
    zinger:
      "Three hours into a video essay. Two tabs into the wiki. You will explain this to someone tonight, unprompted.",
    color: "#A78BFA",
  },
  C: {
    letter: "C",
    slug: "loop-witch",
    name: "The Loop Witch",
    short: "Loop Witch",
    zinger:
      "One song. Forty-seven listens. You're not okay, but the bridge is doing something to you.",
    color: "#5EEAD4",
  },
  D: {
    letter: "D",
    slug: "rewatcher",
    name: "The Rewatcher",
    short: "Rewatcher",
    zinger:
      "You know the lines before they say them. You watch anyway. It's a comfort. It's a personality.",
    color: "#F59E0B",
  },
  E: {
    letter: "E",
    slug: "collector",
    name: "The Collector",
    short: "Collector",
    zinger:
      "Every book on the shelf. Every achievement in the game. The list is the love language.",
    color: "#10B981",
  },
  F: {
    letter: "F",
    slug: "real-person-enjoyer",
    name: "The Real Person Enjoyer",
    short: "Real Person Enjoyer",
    zinger:
      "You know their tour dates, their interview tics, their childhood best friend's name. You are normal about this. (You are not.)",
    color: "#D72638",
  },
};

// ---- QUESTIONS ------------------------------------------------------------
type Question = {
  prompt: string;
  options: { label: string; letter: Letter }[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "What's your phone screen time report most full of?",
    options: [
      { label: "AO3, Tumblr, deep fic-reading apps", letter: "A" },
      { label: "YouTube video essays and Wikipedia", letter: "B" },
      { label: "Spotify, on repeat, the same song", letter: "C" },
      { label: "Netflix, for the eighth rewatch", letter: "D" },
    ],
  },
  {
    prompt: "Pick your worst behavior:",
    options: [
      { label: "I have listened to this 47-second section 412 times.", letter: "C" },
      { label: "I have read this fic six times. Each time it broke me in a new spot.", letter: "A" },
      { label: "I quote it. In conversation. Daily. People have noticed.", letter: "D" },
      { label: "I've corrected someone's lore in public, in writing, with citations.", letter: "B" },
    ],
  },
  {
    prompt: "Your search history this week is mostly:",
    options: [
      { label: "100% completion guide chapter by chapter", letter: "E" },
      { label: "when does [artist] tour 2026 north america", letter: "F" },
      { label: "[character name] x reader masterlist 2024", letter: "A" },
      { label: "hidden meaning of [scene] explained", letter: "B" },
    ],
  },
  {
    prompt: "How does a fixation usually start?",
    options: [
      { label: "A single scene wrecks me and i need to read about it forever", letter: "A" },
      { label: "One song gets hooks in my brain that won't let go", letter: "C" },
      { label: "I see one interview clip and now i know their whole life", letter: "F" },
      { label: "I rewatch a comfort thing and now i'm in again", letter: "D" },
    ],
  },
  {
    prompt: "Your friends would describe your obsession style as:",
    options: [
      { label: "Encyclopedic, won't shut up about the lore", letter: "B" },
      { label: "Completionist, has to finish every side quest", letter: "E" },
      { label: "Emotionally devastated, articulate about it", letter: "A" },
      { label: "Parasocial, knows tour dates by heart", letter: "F" },
    ],
  },
  {
    prompt: "What's the dream Hyperfix feature?",
    options: [
      { label: "A 'days since I last rewatched' counter", letter: "D" },
      { label: "A shelf of every thing I've ever completed", letter: "E" },
      { label: "An intensity meter that goes to 11", letter: "C" },
      { label: "A timeline of every lore detail I've collected", letter: "B" },
    ],
  },
];

// ---- ICONS ----------------------------------------------------------------
function ArrowLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShareIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="font-display text-[20px] leading-none" style={{ letterSpacing: "-0.03em", color: "#F4F4F4" }}>
      hyper<span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
    </span>
  );
}

// ---- LOGIC ----------------------------------------------------------------
function computeWinner(answers: Letter[]): { winner: Letter; counts: Record<Letter, number> } {
  const counts: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  for (const a of answers) counts[a]++;
  const letters: Letter[] = ["A", "B", "C", "D", "E", "F"];
  let winner: Letter = "A";
  let max = -1;
  for (const l of letters) {
    if (counts[l] > max) {
      max = counts[l];
      winner = l;
    }
  }
  return { winner, counts };
}

// ---- COMPONENT ------------------------------------------------------------
export default function QuizPage() {
  const [step, setStep] = useState(0); // 0..5 = questions, 6 = results
  const [answers, setAnswers] = useState<Letter[]>([]);

  const total = QUESTIONS.length;
  const isResults = step >= total;

  const result = useMemo(() => {
    if (!isResults) return null;
    const { winner, counts } = computeWinner(answers);
    return { archetype: ARCHETYPES[winner], counts };
  }, [isResults, answers]);

  function pick(letter: Letter) {
    const next = [...answers, letter];
    setAnswers(next);
    setStep(step + 1);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
  }

  function back() {
    if (step === 0) return;
    setAnswers(answers.slice(0, -1));
    setStep(step - 1);
  }

  return (
    <main className="min-h-screen text-ink" style={{ background: PAGE_BG }}>
      {/* NAV */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.65)" }}>
          <ArrowLeft />
          <span className="font-sans text-sm">back to home</span>
        </Link>
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>
        <div className="w-[120px] hidden sm:block" />
        <Link
          href="/join"
          className="sm:hidden font-sans text-xs font-semibold px-3 py-1.5"
          style={{ background: "#FFFFFF", color: "#0A0A0A", borderRadius: 999 }}
        >
          Join
        </Link>
      </nav>

      {/* Subtle teal bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(94,234,212,0.08) 0%, rgba(94,234,212,0.02) 35%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 sm:px-10 py-12 sm:py-20">
        {!isResults ? (
          <QuizBody
            step={step}
            total={total}
            question={QUESTIONS[step]}
            onPick={pick}
            onBack={back}
          />
        ) : result ? (
          <Results archetype={result.archetype} counts={result.counts} onReset={reset} />
        ) : null}
      </div>
    </main>
  );
}

// ---- QUIZ BODY ------------------------------------------------------------
function QuizBody({
  step,
  total,
  question,
  onPick,
  onBack,
}: {
  step: number;
  total: number;
  question: Question;
  onPick: (l: Letter) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="block transition-all"
            style={{
              width: i === step ? 22 : 8,
              height: 8,
              borderRadius: 999,
              background: i <= step ? TEAL : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      <div className="mb-3 font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
        <span className="tabular-nums">
          {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h1
        className="font-display text-center mb-10 sm:mb-14"
        style={{
          fontSize: "clamp(28px, 4.5vw, 44px)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          maxWidth: "42rem",
        }}
      >
        {question.prompt}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(opt.letter)}
            className="group text-left p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: CARD_BG,
              border: `1px solid ${CARD_BORDER}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TEAL;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = CARD_BORDER;
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="font-mono text-[11px] tabular-nums mt-0.5 shrink-0"
                style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-sans text-[15px] leading-snug" style={{ color: "rgba(244,244,244,0.92)" }}>
                {opt.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="mt-10 flex items-center gap-2 font-sans text-sm transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <ArrowLeft />
          previous question
        </button>
      )}
    </div>
  );
}

// ---- RESULTS --------------------------------------------------------------
function Results({
  archetype,
  counts,
  onReset,
}: {
  archetype: Archetype;
  counts: Record<Letter, number>;
  onReset: () => void;
}) {
  const letters: Letter[] = ["A", "B", "C", "D", "E", "F"];
  const sorted = letters
    .map((l) => ({ letter: l, count: counts[l], a: ARCHETYPES[l] }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  async function saveAsImage() {
    try {
      const res = await fetch(`/api/quiz/${archetype.slug}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hyperfix-${archetype.slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(`/api/quiz/${archetype.slug}`, "_blank");
    }
  }

  function shareToX() {
    const text = `i took the hyperfix quiz and i'm ${archetype.name} (this is so accurate it's embarrassing) hyperfix.app/quiz`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
        your result
      </div>

      <h1
        className="font-display text-center"
        style={{
          fontSize: "clamp(36px, 7vw, 64px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        You&apos;re {archetype.name}
      </h1>

      <p className="mt-5 max-w-xl text-center font-sans text-[16px] sm:text-[17px] leading-relaxed" style={{ color: "rgba(244,244,244,0.7)" }}>
        {archetype.zinger}
      </p>

      {/* Result card mock */}
      <div className="mt-12 w-full max-w-[360px]">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            aspectRatio: "1080 / 1350",
            background: "#F4EFE6",
            color: "#111",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="absolute inset-0 p-7 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "rgba(0,0,0,0.5)" }}>
                hyperfix.app/quiz
              </span>
              <span
                className="block"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: archetype.color,
                }}
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: "rgba(0,0,0,0.55)" }}>
                hyperfixer type
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(28px, 6vw, 42px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {archetype.name}
              </div>
              <div className="mt-4 font-sans text-[13px] leading-snug" style={{ color: "rgba(0,0,0,0.7)" }}>
                {archetype.zinger}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: "rgba(0,0,0,0.45)" }}>
                breakdown
              </div>
              {sorted.map((row) => (
                <div key={row.letter} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: row.a.color,
                      }}
                    />
                    <span className="font-sans text-[12px]" style={{ color: "rgba(0,0,0,0.78)" }}>
                      {row.a.short}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] tabular-nums" style={{ color: "rgba(0,0,0,0.55)" }}>
                    {row.count}/6
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <button
          type="button"
          onClick={saveAsImage}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: TEAL, color: "#0A0A0A", borderRadius: 999 }}
        >
          <DownloadIcon />
          Save as image
        </button>
        <button
          type="button"
          onClick={shareToX}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "transparent",
            color: "#F4F4F4",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 999,
          }}
        >
          <ShareIcon />
          Share to X
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 font-sans text-sm transition-opacity hover:opacity-80"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        take it again
      </button>

      <Link
        href="/join"
        className="mt-12 flex items-center gap-2 font-sans text-[15px] font-medium transition-opacity hover:opacity-80"
        style={{ color: TEAL }}
      >
        Start tracking your obsession
        <ArrowRight />
      </Link>
    </div>
  );
}
