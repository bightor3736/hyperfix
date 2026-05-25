import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const TOTAL = 7;

const BG = "#F8F5F0";
const INK = "#111111";
const DIM = "rgba(17,17,17,0.45)";
const FAINT = "rgba(17,17,17,0.1)";
const ACCENT = "#5EEAD4";
const ACCENT_DARK = "#0D9488";
const RED = "#D72638";
const CARD_TEXT = "#042F2E";

function GemMark({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="15" fill="#0A0B0D" />
      <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
      <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
      <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
      <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
      <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
      <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function TopBar({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <GemMark size={44} />
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
          <span style={{ color: INK }}>hyper</span>
          <span style={{ color: ACCENT_DARK, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.18em", color: "rgba(17,17,17,0.25)", textTransform: "uppercase" }}>
        {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function Dots({ current }: { current: number }) {
  const dots = [];
  for (let i = 1; i <= TOTAL; i++) {
    dots.push(
      <div key={i} style={{
        width: i === current ? 28 : 7,
        height: 7,
        borderRadius: 4,
        background: i === current ? ACCENT_DARK : "rgba(17,17,17,0.15)",
      }} />
    );
  }
  return <div style={{ display: "flex", gap: 7, alignItems: "center" }}>{dots}</div>;
}

function UnwellBar({ score, color }: { score: number; color: string }) {
  const bars = [];
  for (let i = 1; i <= 10; i++) {
    bars.push(
      <div key={i} style={{
        flex: 1,
        height: 18,
        borderRadius: 4,
        background: i <= score ? color : FAINT,
      }} />
    );
  }
  return <div style={{ display: "flex", gap: 6, width: "100%" }}>{bars}</div>;
}

// ─── slide 1 · cover ─────────────────────────────────────────────────
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={1} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ display: "flex", padding: "12px 28px", background: RED, borderRadius: 100, alignSelf: "flex-start", marginBottom: 56 }}>
          <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff" }}>
            ranked
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 72 }}>
          <span style={{ color: INK }}>rating</span>
          <span style={{ color: INK }}>my</span>
          <span style={{ color: ACCENT_DARK }}>current</span>
          <span style={{ color: ACCENT_DARK }}>fixations</span>
        </div>

        <span style={{ fontSize: 40, color: DIM, lineHeight: 1.4, maxWidth: 820 }}>
          based on how unwell they've made me.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 32 }}>
        <span style={{ fontSize: 32, color: "rgba(17,17,17,0.35)", lineHeight: 1.4 }}>
          drop yours in the comments 👇
        </span>
        <Dots current={1} />
      </div>
    </div>
  );
}

// ─── fixation card slide ──────────────────────────────────────────────
function FixSlide({
  n,
  emoji,
  title,
  subtitle,
  started,
  dayCount,
  crimes,
  score,
  scoreLabel,
  accentColor,
  verdict,
}: {
  n: number;
  emoji: string;
  title: string;
  subtitle: string;
  started: string;
  dayCount: string;
  crimes: string[];
  score: number;
  scoreLabel: string;
  accentColor: string;
  verdict: string;
}) {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={n} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 32, marginTop: 80, marginBottom: 44 }}>
        <span style={{ fontSize: 90, lineHeight: 1 }}>{emoji}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 60, fontWeight: 900, color: INK, lineHeight: 0.95, letterSpacing: "-0.04em" }}>{title}</span>
          <span style={{ fontFamily: "monospace", fontSize: 22, color: DIM, letterSpacing: "0.04em" }}>{subtitle}</span>
        </div>
      </div>

      {/* Day badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
        <div style={{ display: "flex", padding: "10px 24px", background: accentColor, borderRadius: 100 }}>
          <span style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>
            {dayCount}
          </span>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 20, color: DIM, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {started}
        </span>
      </div>

      {/* Crimes list */}
      <div style={{ display: "flex", flexDirection: "column", background: "rgba(17,17,17,0.04)", border: "1.5px solid rgba(17,17,17,0.08)", borderRadius: 28, padding: "44px 48px", gap: 28, marginBottom: 44 }}>
        <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: DIM }}>
          crimes committed
        </span>
        {crimes.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <span style={{ fontSize: 26, lineHeight: 1.3, color: accentColor, flexShrink: 0, marginTop: 2 }}>→</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: INK, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{c}</span>
          </div>
        ))}
      </div>

      {/* Unwell score */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.18em", textTransform: "uppercase", color: DIM }}>
            unwell scale
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 800, color: accentColor }}>
            {score}/10
          </span>
        </div>
        <UnwellBar score={score} color={accentColor} />
        <span style={{ fontSize: 28, fontWeight: 700, color: accentColor, letterSpacing: "-0.01em" }}>{scoreLabel}</span>
      </div>

      {/* Verdict */}
      <div style={{ display: "flex", background: accentColor, borderRadius: 20, padding: "26px 36px", marginBottom: 32 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: score >= 8 ? "#fff" : CARD_TEXT, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {verdict}
        </span>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={n} />
      </div>
    </div>
  );
}

// ─── slide 8 · CTA ───────────────────────────────────────────────────
function Slide8() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={7} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 110, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 60 }}>
          <span style={{ color: INK }}>what's</span>
          <span style={{ color: INK }}>yours</span>
          <span style={{ color: ACCENT_DARK }}>rated?</span>
        </div>

        <span style={{ fontSize: 38, color: DIM, lineHeight: 1.5, maxWidth: 800, marginBottom: 60 }}>
          track your fixations on hyperfix.app — name it, rate it, log how deep you are, keep a graveyard of the ones that faded.
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 72 }}>
          {[
            "free to use, no catch",
            "share your day count as a card",
            "prove to people how unwell you are",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: ACCENT_DARK, flexShrink: 0 }} />
              <span style={{ fontSize: 34, fontWeight: 600, color: INK, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <GemMark size={48} />
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: ACCENT_DARK, fontStyle: "italic" }}>fix</span>
            <span style={{ color: DIM }}>.app</span>
          </div>
        </div>
        <div style={{ display: "flex", padding: "22px 48px", background: ACCENT_DARK, borderRadius: 100, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>free — link in bio</span>
        </div>
        <Dots current={7} />
      </div>
    </div>
  );
}

// ─── route ───────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  const slides = [
    null, // 1 = cover
    {
      emoji: "🎵",
      title: "Espresso",
      subtitle: "Sabrina Carpenter",
      started: "started 4 months ago",
      dayCount: "Day 127",
      crimes: [
        "listened to it 400+ times. tracked it.",
        "analyzed every single lyric",
        "convinced 11 people it's song of the year",
      ],
      score: 9,
      scoreLabel: "critically unwell. no regrets.",
      accentColor: "#D4A017",
      verdict: "this song lives rent-free and i've renewed the lease indefinitely.",
    },
    {
      emoji: "📺",
      title: "Severance",
      subtitle: "Apple TV+",
      started: "started 2 months ago",
      dayCount: "Day 61",
      crimes: [
        "made a spreadsheet of lore theories",
        "dreamed about the severed floor twice",
        "explained MDR to people who did not ask",
      ],
      score: 10,
      scoreLabel: "fully severed. both halves obsessed.",
      accentColor: "#4B6BFB",
      verdict: "i would genuinely consider working at lumon if the break room wasn't a thing.",
    },
    {
      emoji: "🌊",
      title: "Chappell Roan",
      subtitle: "the whole discography",
      started: "started 6 months ago",
      dayCount: "Day 183",
      crimes: [
        "memorized every b-side and demo",
        "made 3 separate playlists",
        "played Good Luck Babe on repeat for an entire week",
      ],
      score: 10,
      scoreLabel: "never recovering. don't want to.",
      accentColor: RED,
      verdict: "she handed me her whole world and i moved in. no plans to leave.",
    },
    {
      emoji: "🎮",
      title: "Baldur's Gate 3",
      subtitle: "Larian Studios",
      started: "started 3 months ago",
      dayCount: "Day 94",
      crimes: [
        "200+ hours. on my 3rd playthrough.",
        "emotionally attached to a fictional bard",
        "looked up voice actor interviews at 1am",
      ],
      score: 9,
      scoreLabel: "the camp is my home now.",
      accentColor: "#7C3AED",
      verdict: "i have a real life but astarion needed me so here we are.",
    },
    {
      emoji: "💀",
      title: "The one from 2019",
      subtitle: "you know the one",
      started: "started 5 years ago",
      dayCount: "Day 1,826",
      crimes: [
        "never actually left. just pretended.",
        "still have the playlist. still play it.",
        "tells people i'm 'over it'. lying.",
      ],
      score: 11,
      scoreLabel: "11/10. transcended the scale.",
      accentColor: INK,
      verdict: "some fixations don't end. they just become part of your personality.",
    },
  ];

  let el: React.ReactElement;
  if (slide === 1) el = <Slide1 />;
  else if (slide === 7) el = <Slide8 />;
  else {
    const s = slides[slide - 1];
    if (!s) el = <Slide8 />;
    else
      el = (
        <FixSlide
          n={slide}
          emoji={s.emoji}
          title={s.title}
          subtitle={s.subtitle}
          started={s.started}
          dayCount={s.dayCount}
          crimes={s.crimes}
          score={s.score}
          scoreLabel={s.scoreLabel}
          accentColor={s.accentColor}
          verdict={s.verdict}
        />
      );
  }

  return new ImageResponse(el, { width: W, height: H });
}
