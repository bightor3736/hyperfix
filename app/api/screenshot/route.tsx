import { ImageResponse } from "next/og";

export const runtime = "edge";

const W = 1440;
const H = 900;
const INK = "#0A0A0A";
const CARD = "#111113";
const LIME = "#A3E635";
const PAPER = "#F4F4F4";
const DIM = "rgba(244,244,244,0.35)";
const SOFT = "rgba(244,244,244,0.55)";
const BORDER = "rgba(244,244,244,0.07)";
const PILL_BG = "rgba(244,244,244,0.06)";
const PILL_BORDER = "rgba(244,244,244,0.1)";
const PILL_TEXT = "rgba(244,244,244,0.4)";

const FIXES = [
  {
    title: "One Piece",
    category: "anime",
    days: 73,
    start: "Jan 15, 2025",
    end: "Mar 29, 2025",
    eulogy: "watched 400 episodes in 10 weeks. no regrets.",
  },
  {
    title: "Sourdough baking",
    category: "hobby",
    days: 34,
    start: "Nov 3, 2024",
    end: "Dec 7, 2024",
    eulogy: null,
  },
  {
    title: "True crime podcasts",
    category: "podcast",
    days: 91,
    start: "Jul 20, 2024",
    end: "Oct 19, 2024",
    eulogy: "it was research. it was definitely research.",
  },
  {
    title: "Stardew Valley",
    category: "gaming",
    days: 47,
    start: "Mar 2, 2025",
    end: "Apr 18, 2025",
    eulogy: null,
  },
  {
    title: "Learning Japanese",
    category: "language",
    days: 28,
    start: "Sep 1, 2024",
    end: "Sep 29, 2024",
    eulogy: "i know how to say thank you. that's it.",
  },
  {
    title: "every Taylor Swift album ranked and re-ranked",
    category: "music",
    days: 19,
    start: "Feb 10, 2025",
    end: "Mar 1, 2025",
    eulogy: null,
  },
];

const CARD_W = 400;
const CARD_H = 230;
const GAP = 28;
const PAD_X = 64;
const PAD_Y = 52;

function Card({ fix }: { fix: typeof FIXES[0] }) {
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flexShrink: 0,
      }}
    >
      {/* Category + ended pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "4px 10px",
            borderRadius: 999,
            background: PILL_BG,
            border: `1px solid ${PILL_BORDER}`,
            color: PILL_TEXT,
            display: "flex",
          }}
        >
          {fix.category}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(163,230,53,0.08)",
            border: "1px solid rgba(163,230,53,0.2)",
            color: "rgba(163,230,53,0.6)",
            display: "flex",
          }}
        >
          ended
        </span>
      </div>

      {/* Title */}
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: PAPER,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {fix.title}
      </span>

      {/* Day count */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: LIME,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            {fix.days}
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: LIME,
              display: "flex",
            }}
          >
            days
          </span>
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: DIM,
            display: "flex",
          }}
        >
          {fix.start} → {fix.end}
        </span>
      </div>

      {/* Eulogy */}
      {fix.eulogy ? (
        <span
          style={{
            fontSize: 12,
            fontStyle: "italic",
            color: "rgba(163,230,53,0.7)",
            lineHeight: 1.5,
            paddingLeft: 10,
            borderLeft: "2px solid rgba(163,230,53,0.25)",
            display: "flex",
            marginTop: "auto",
          }}
        >
          {fix.eulogy}
        </span>
      ) : (
        <span
          style={{
            fontSize: 12,
            fontStyle: "italic",
            color: "rgba(244,244,244,0.2)",
            display: "flex",
            marginTop: "auto",
          }}
        >
          No eulogy written.
        </span>
      )}
    </div>
  );
}

export async function GET() {
  const row1 = FIXES.slice(0, 3);
  const row2 = FIXES.slice(3, 6);

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: INK,
          display: "flex",
          flexDirection: "column",
          padding: `${PAD_Y}px ${PAD_X}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />

        {/* Top bar: logo + url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: LIME,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            hyperfix
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: DIM,
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            hyperfix.app/dashboard/graveyard
          </span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 8 }}>
          <span
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: PAPER,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            Graveyard
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(244,244,244,0.25)",
              display: "flex",
            }}
          >
            RIP · 6 fixes
          </span>
        </div>
        <span
          style={{
            fontSize: 15,
            fontStyle: "italic",
            color: "rgba(244,244,244,0.35)",
            letterSpacing: "-0.01em",
            display: "flex",
            marginBottom: 28,
          }}
        >
          The things that used to run your life.
        </span>

        {/* Row 1 */}
        <div style={{ display: "flex", gap: GAP, marginBottom: GAP }}>
          {row1.map((fix) => (
            <Card key={fix.title} fix={fix} />
          ))}
        </div>

        {/* Row 2 */}
        <div style={{ display: "flex", gap: GAP }}>
          {row2.map((fix) => (
            <Card key={fix.title} fix={fix} />
          ))}
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
