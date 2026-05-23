import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1080;

const BG = "#080808";
const BG2 = "#0C0C0E";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.4)";
const DIM2 = "rgba(244,244,244,0.12)";
const TEAL = "#5EEAD4";
const TEAL_DARK = "#0D9488";
const CARD = "#101012";
const CARD2 = "#141416";
const BORDER = "rgba(244,244,244,0.07)";

function GemMark({ size = 32 }: { size?: number }) {
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

function IntensityBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = value >= 9 ? TEAL : value >= 6 ? "#34D399" : "#6EE7B7";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: "0.15em", textTransform: "uppercase", color: DIM }}>intensity</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 800, color }}>
          {value}<span style={{ fontSize: 16, color: DIM, fontWeight: 500 }}>/10</span>
        </span>
      </div>
      <div style={{ display: "flex", height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${TEAL_DARK}, ${color})`, borderRadius: 4 }} />
      </div>
    </div>
  );
}

const fixations: Record<string, {
  name: string;
  category: string;
  days: number;
  intensity: number;
  note: string;
  tag: string;
}> = {
  severance: {
    name: "Severance",
    category: "TV show",
    days: 47,
    intensity: 9,
    note: "rewatched the ending 6 times trying to figure out what it means",
    tag: "currently active",
  },
  mitski: {
    name: "Mitski",
    category: "artist",
    days: 312,
    intensity: 10,
    note: "i don't think this one ever goes away",
    tag: "permanent",
  },
  minecraft: {
    name: "Minecraft",
    category: "game",
    days: 61,
    intensity: 10,
    note: "built an entire medieval city. alone. did not sleep",
    tag: "recurring",
  },
  hozier: {
    name: "Hozier",
    category: "artist",
    days: 89,
    intensity: 9,
    note: "unreal unearth has not left my playlist since october",
    tag: "currently active",
  },
  thelastofus: {
    name: "The Last of Us",
    category: "TV / game",
    days: 38,
    intensity: 9,
    note: "finished the game, started the show, read every theory, still not over it",
    tag: "fading",
  },
  gilmoregirls: {
    name: "Gilmore Girls",
    category: "TV show",
    days: 52,
    intensity: 8,
    note: "my 4th full rewatch. still on lorelai's side about everything",
    tag: "recurring",
  },
  tswift: {
    name: "The Tortured Poets Department",
    category: "album",
    days: 71,
    intensity: 10,
    note: "listened to the anthology version 23 times in the first week",
    tag: "currently active",
  },
  sourdough: {
    name: "sourdough",
    category: "hobby",
    days: 14,
    intensity: 8,
    note: "named the starter. bought 3 books. made 2 loaves. stopped.",
    tag: "rip",
  },
};

const tagColors: Record<string, { bg: string; text: string }> = {
  "currently active": { bg: "rgba(94,234,212,0.12)", text: TEAL },
  "permanent": { bg: "rgba(94,234,212,0.18)", text: TEAL },
  "recurring": { bg: "rgba(52,211,153,0.1)", text: "#34D399" },
  "fading": { bg: "rgba(244,244,244,0.06)", text: DIM },
  "rip": { bg: "rgba(244,244,244,0.04)", text: "rgba(244,244,244,0.25)" },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const fix = fixations[slug] ?? fixations["severance"];
  const tag = tagColors[fix.tag] ?? tagColors["currently active"];

  const dayLabel = fix.days === 1 ? "day" : "days";

  return new ImageResponse(
    (
      <div style={{
        width: W, height: H, background: BG,
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif",
        position: "relative",
      }}>
        {/* subtle glow */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(94,234,212,0.06) 0%, transparent 60%)", display: "flex" }} />

        {/* top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "52px 64px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GemMark size={32} />
            <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.04em" }}>
              <span style={{ color: "rgba(244,244,244,0.3)" }}>hyper</span>
              <span style={{ color: "rgba(94,234,212,0.4)", fontStyle: "italic" }}>fix</span>
            </div>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.16em", color: "rgba(244,244,244,0.2)", textTransform: "uppercase" }}>
            my fixations
          </span>
        </div>

        {/* main card */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "40px 64px 52px", justifyContent: "center", gap: 0 }}>

          {/* category */}
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,244,244,0.25)", marginBottom: 20 }}>
            {fix.category}
          </span>

          {/* name */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 24 }}>
            <span style={{
              fontSize: fix.name.length > 20 ? 72 : 88,
              fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9, color: INK,
            }}>
              {fix.name}
            </span>
            {/* tag */}
            <div style={{ display: "flex", padding: "10px 20px", background: tag.bg, borderRadius: 100, flexShrink: 0, marginTop: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: tag.text, letterSpacing: "0.04em" }}>{fix.tag}</span>
            </div>
          </div>

          {/* day counter */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 48 }}>
            <span style={{ fontSize: 120, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color: TEAL }}>{fix.days}</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: DIM, letterSpacing: "-0.02em" }}>{dayLabel}</span>
          </div>

          {/* divider */}
          <div style={{ display: "flex", height: 1, background: BORDER, marginBottom: 40 }} />

          {/* intensity */}
          <div style={{ display: "flex", marginBottom: 40 }}>
            <div style={{ flex: 1 }}>
              <IntensityBar value={fix.intensity} />
            </div>
          </div>

          {/* note card */}
          <div style={{ display: "flex", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "28px 32px" }}>
            <div style={{ display: "flex", width: 3, background: "rgba(94,234,212,0.25)", borderRadius: 2, marginRight: 24, flexShrink: 0 }} />
            <span style={{ fontSize: 28, fontWeight: 500, color: DIM, lineHeight: 1.4, letterSpacing: "-0.01em", fontStyle: "italic" }}>
              "{fix.note}"
            </span>
          </div>

        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
