import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/* Square format — works as sticker, social post, icon */
const SIZE = { width: 1080, height: 1080 };

const PAPER = "#080808";
const PAPER_DEEP = "#111113";
const INK = "#F4F4F4";
const INK_SOFT = "#9A9A9A";
const MUTED = "#525252";
const ACCENT = "#A3E635";

/* ─── 01: The Obsession Loop ───
   Concentric rings getting denser toward the center.
   Central dot = the fix. Outer rings = orbit of thought.
   Caption: "it pulls you in." */
function ObsessionLoop() {
  const cx = 540;
  const cy = 480;
  const radii = [360, 290, 220, 155, 95, 44];
  const opacities = [0.06, 0.12, 0.2, 0.35, 0.65, 1];
  const widths = [1, 1, 1.5, 2, 2.5, 3];

  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", position: "relative" }}>
      <svg width={1080} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {radii.map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth={widths[i]} opacity={opacities[i]} />
        ))}
        {/* tick at top of each ring */}
        {radii.slice(0, 5).map((r, i) => (
          <line key={`tick-${i}`} x1={cx} y1={cy - r - 6} x2={cx} y2={cy - r + 14} stroke={ACCENT} strokeWidth={1.5} opacity={opacities[i] + 0.1} />
        ))}
        {/* center dot */}
        <circle cx={cx} cy={cy} r={18} fill={ACCENT} />
        {/* tiny cross at center */}
        <line x1={cx - 9} y1={cy} x2={cx + 9} y2={cy} stroke={PAPER} strokeWidth={2.5} />
        <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} stroke={PAPER} strokeWidth={2.5} />
      </svg>

      {/* caption at bottom */}
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
            01 / 06 · the obsession loop
          </span>
          <div style={{ display: "flex", fontSize: 48, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 12 }}>
            <span>it pulls</span>
            <span style={{ color: ACCENT, fontStyle: "italic", marginLeft: 16 }}>you in.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, color: INK }}>
          <span>hyper</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 02: The Tally ───
   Raw tally marks filling a grid — days counted by hand.
   Caption: "count every day." */
function TheTally() {
  const groups: { x: number; y: number }[] = [];
  const cols = 7;
  const rows = 6;
  const gw = 108;
  const gh = 88;
  const startX = 80;
  const startY = 80;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      groups.push({ x: startX + c * gw + 50, y: startY + r * gh + 44 });
    }
  }

  const totalGroups = groups.length; /* 42 groups */

  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", fontFamily: "Georgia, serif", position: "relative" }}>
      <svg width={1080} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {groups.map((g, i) => {
          const isAccent = i >= totalGroups - 7;
          const color = isAccent ? ACCENT : INK;
          const baseOpacity = isAccent ? 0.9 : (i < totalGroups - 14 ? 0.12 : 0.35);
          const w = 32;
          const h = 44;

          return (
            <g key={i}>
              {/* 4 vertical marks */}
              <line x1={g.x} y1={g.y} x2={g.x} y2={g.y + h} stroke={color} strokeWidth={1.5} opacity={baseOpacity} />
              <line x1={g.x + w * 0.3} y1={g.y} x2={g.x + w * 0.3} y2={g.y + h} stroke={color} strokeWidth={1.5} opacity={baseOpacity} />
              <line x1={g.x + w * 0.6} y1={g.y} x2={g.x + w * 0.6} y2={g.y + h} stroke={color} strokeWidth={1.5} opacity={baseOpacity} />
              <line x1={g.x + w * 0.9} y1={g.y} x2={g.x + w * 0.9} y2={g.y + h} stroke={color} strokeWidth={1.5} opacity={baseOpacity} />
              {/* 5th diagonal strike */}
              <line x1={g.x - 4} y1={g.y + h * 0.85} x2={g.x + w * 0.9 + 6} y2={g.y + h * 0.15} stroke={color} strokeWidth={1.5} opacity={baseOpacity} />
            </g>
          );
        })}
      </svg>

      {/* overlay caption */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "56px 80px", background: "linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.9) 60%, transparent 100%)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
            02 / 06 · the tally
          </span>
          <div style={{ display: "flex", fontSize: 48, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 12 }}>
            <span>count</span>
            <span style={{ color: ACCENT, fontStyle: "italic", marginLeft: 16 }}>every day.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, color: INK }}>
          <span>hyper</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 03: The Signal ───
   Broadcast rings like a signal — hyperfixation as transmission.
   Caption: "it's always transmitting." */
function TheSignal() {
  const cx = 540;
  const cy = 540;

  return (
    <div style={{ width: "100%", height: "100%", background: PAPER_DEEP, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: "Georgia, serif" }}>
      <svg width={1080} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* signal arcs — top half only, like a wifi / broadcast icon */}
        {[380, 290, 200, 118].map((r, i) => (
          <path
            key={i}
            d={`M ${cx - r * 0.707} ${cy - r * 0.707} A ${r} ${r} 0 0 1 ${cx + r * 0.707} ${cy - r * 0.707}`}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2}
            opacity={0.12 + i * 0.18}
            strokeLinecap="round"
          />
        ))}
        {/* full rings behind */}
        {[440, 340, 240].map((r, i) => (
          <circle key={`full-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0.04 + i * 0.03} strokeDasharray="4 12" />
        ))}
        {/* center dot */}
        <circle cx={cx} cy={cy} r={22} fill={ACCENT} />
        <circle cx={cx} cy={cy} r={10} fill={PAPER} />
        {/* vertical axis */}
        <line x1={cx} y1={cx - 400} x2={cx} y2={cy - 24} stroke={ACCENT} strokeWidth={1.5} opacity={0.2} />
      </svg>

      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
            03 / 06 · the signal
          </span>
          <div style={{ display: "flex", fontSize: 48, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 12 }}>
            <span>always</span>
            <span style={{ color: ACCENT, fontStyle: "italic", marginLeft: 16 }}>transmitting.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, color: INK }}>
          <span>hyper</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 04: The Card ───
   A single fix card rendered as illustration — the product itself as art.
   Caption: "every fix gets a card." */
function TheCard() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", position: "relative" }}>
      {/* shadow card behind */}
      <div style={{
        position: "absolute",
        width: 560,
        height: 720,
        background: PAPER_DEEP,
        border: `1px solid rgba(244,244,244,0.06)`,
        borderTop: `3px solid rgba(163,230,53,0.3)`,
        transform: "rotate(6deg) translate(28px, 20px)",
        display: "flex",
      }} />
      {/* main card */}
      <div style={{
        width: 560,
        height: 720,
        background: "#0F0F0F",
        border: `1px solid rgba(244,244,244,0.12)`,
        borderTop: `3px solid ${ACCENT}`,
        display: "flex",
        flexDirection: "column",
        padding: 40,
        position: "relative",
        zIndex: 1,
      }}>
        {/* card header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT }}>anime · ongoing</span>
            <div style={{ fontSize: 42, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 12, lineHeight: 1.1, maxWidth: 340 }}>
              Frieren: Beyond Journey's End
            </div>
          </div>
          {/* watermark */}
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 88, fontWeight: 700, color: ACCENT, opacity: 0.08, letterSpacing: "-0.06em", lineHeight: 0.8 }}>
            hf
          </div>
        </div>

        {/* day counter */}
        <div style={{ display: "flex", marginTop: 48, alignItems: "flex-end", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 88, fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 0.85, color: INK }}>47</span>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, paddingBottom: 12 }}>days</span>
        </div>

        {/* intensity bar */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>intensity</span>
            <span style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.18em", color: ACCENT }}>8 / 10</span>
          </div>
          <div style={{ display: "flex", width: "100%", height: 6, background: "rgba(244,244,244,0.08)" }}>
            <div style={{ display: "flex", width: "80%", height: "100%", background: ACCENT }} />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: INK_SOFT, marginTop: 10 }}>deeply unwell</span>
        </div>

        {/* note */}
        <div style={{ display: "flex", marginTop: 32, paddingLeft: 16, borderLeft: `2px solid ${ACCENT}` }}>
          <span style={{ fontSize: 18, fontStyle: "italic", color: INK_SOFT, lineHeight: 1.45 }}>
            i cried twice and i'm not apologising for either instance
          </span>
        </div>

        {/* stat row */}
        <div style={{ display: "flex", marginTop: "auto", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>started</span>
            <span style={{ fontFamily: "monospace", fontSize: 16, color: INK_SOFT, marginTop: 4 }}>mar 2024</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>intensity</span>
            <span style={{ fontFamily: "monospace", fontSize: 16, color: INK_SOFT, marginTop: 4 }}>8 / 10</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>type</span>
            <span style={{ fontFamily: "monospace", fontSize: 16, color: INK_SOFT, marginTop: 4 }}>anime</span>
          </div>
        </div>
      </div>

      {/* caption */}
      <div style={{ position: "absolute", bottom: 56, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
            04 / 06 · the card
          </span>
          <div style={{ display: "flex", fontSize: 44, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 10 }}>
            <span>every fix gets</span>
            <span style={{ color: ACCENT, fontStyle: "italic", marginLeft: 14 }}>a card.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 05: The Fade ───
   Gradient bars dissolving from bright to nothing — the fix ending.
   Caption: "log it before it fades." */
function TheFade() {
  const bars = 22;
  const barW = 28;
  const barGap = 20;
  const totalW = bars * (barW + barGap) - barGap;
  const startX = (1080 - totalW) / 2;

  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: "Georgia, serif" }}>
      <svg width={1080} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {Array.from({ length: bars }).map((_, i) => {
          const progress = i / (bars - 1);
          const maxH = 520;
          const minH = 24;
          const h = maxH * (1 - progress) + minH * progress;
          const x = startX + i * (barW + barGap);
          const y = 540 - h / 2;
          /* color shifts from ACCENT to MUTED as bars fade */
          const opacity = 1 - progress * 0.88;
          const isAccent = progress < 0.35;

          return (
            <rect key={i} x={x} y={y} width={barW} height={h} fill={isAccent ? ACCENT : INK} opacity={opacity} />
          );
        })}
      </svg>

      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
            05 / 06 · the fade
          </span>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 44, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 12 }}>
            <span>log it before</span>
            <span style={{ color: ACCENT, fontStyle: "italic" }}>it fades.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, color: INK }}>
          <span>hyper</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
    </div>
  );
}

/* ─── 06: The Archive ───
   Stacked card silhouettes as divs — pure flex, no SVG text.
   Caption: "your history of obsession." */
function TheArchive() {
  const cards = [
    { rotate: "-12deg", top: 200, left: 250, opacity: 0.12 },
    { rotate: "-7deg", top: 220, left: 265, opacity: 0.22 },
    { rotate: "-3deg", top: 238, left: 278, opacity: 0.38 },
    { rotate: "2deg", top: 250, left: 290, opacity: 0.58 },
    { rotate: "6deg", top: 260, left: 305, opacity: 0.78 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: "Georgia, serif" }}>
      {/* shadow cards */}
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 400,
            height: 540,
            top: c.top,
            left: c.left,
            background: "#0C0C0C",
            border: `1px solid rgba(244,244,244,${c.opacity * 0.15})`,
            borderTop: `3px solid rgba(163,230,53,${c.opacity * 0.4})`,
            transform: `rotate(${c.rotate})`,
            opacity: c.opacity,
            display: "flex",
          }}
        />
      ))}

      {/* top card — detailed */}
      <div style={{
        position: "absolute",
        width: 400,
        height: 540,
        top: 248,
        left: 340,
        background: "#101010",
        border: `1px solid rgba(244,244,244,0.14)`,
        borderTop: `3px solid ${ACCENT}`,
        transform: "rotate(10deg)",
        display: "flex",
        flexDirection: "column",
        padding: 28,
      }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT }}>anime · ongoing</span>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 16, lineHeight: 1.1 }}>
          Frieren
        </div>
        <div style={{ display: "flex", marginTop: 36, alignItems: "flex-end", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 68, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.85, color: INK }}>47</span>
          <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, paddingBottom: 10 }}>days</span>
        </div>
        <div style={{ display: "flex", width: "100%", height: 4, background: "rgba(244,244,244,0.08)", marginTop: 24 }}>
          <div style={{ display: "flex", width: "80%", height: "100%", background: ACCENT }} />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: INK_SOFT, marginTop: 8 }}>deeply unwell</span>
      </div>

      {/* caption */}
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
            06 / 06 · the archive
          </span>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 44, letterSpacing: "-0.04em", fontWeight: 500, color: INK, marginTop: 12 }}>
            <span>your history</span>
            <span style={{ color: ACCENT, fontStyle: "italic" }}>of obsession.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, color: INK }}>
          <span>hyper</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
    </div>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);

  const elements: React.ReactElement[] = [
    <ObsessionLoop key={0} />,
    <TheTally key={1} />,
    <TheSignal key={2} />,
    <TheCard key={3} />,
    <TheFade key={4} />,
    <TheArchive key={5} />,
  ];

  const element = elements[Math.min(Math.max(n, 0), elements.length - 1)];
  return new ImageResponse(element, SIZE);
}
