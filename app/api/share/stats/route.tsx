import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1080, height: 1080 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export const alt = "My Hyperfix stats";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") ?? "").slice(0, 24);
  const streak = parseInt(searchParams.get("streak") ?? "0", 10) || 0;
  const level = (searchParams.get("level") ?? "Mildly Curious").slice(0, 28);
  const xp = parseInt(searchParams.get("xp") ?? "0", 10) || 0;
  const hits = parseInt(searchParams.get("hits") ?? "0", 10) || 0;

  // Brand + game palette
  const BG = "#f7f4ec";
  const INK = "#1b1a17";
  const MUTED = "#6b6659";
  const FAINT = "#b1aa9a";
  const LINE = "#e2dccc";
  const CARD = "#ffffff";
  const ENERGY = "#7c5cff";
  const XP = "#f59e0b";
  const FLAME = "#ff6b35";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: BG,
          backgroundImage: `radial-gradient(900px 600px at 0% 0%, #ece7ff 0%, ${BG} 55%)`,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                width: 18,
                height: 18,
                borderRadius: 999,
                background: ENERGY,
              }}
            />
            <span style={{ fontSize: 30, color: INK, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Hyperfix
            </span>
          </div>
          <span style={{ fontSize: 22, color: MUTED }}>your daily dopamine, on tap</span>
        </div>

        {/* Hero streak */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={FLAME} stroke={FLAME} strokeWidth="1.5">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span style={{ fontSize: 26, color: FLAME, fontWeight: 700, letterSpacing: "0.18em" }}>
              {name ? `${name.toUpperCase()}'S STREAK` : "CURRENT STREAK"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 8 }}>
            <span style={{ fontSize: 300, color: INK, lineHeight: 1, letterSpacing: "-0.05em", fontWeight: 800 }}>
              {streak}
            </span>
            <span style={{ fontSize: 60, color: FLAME, fontWeight: 800, letterSpacing: "-0.02em" }}>
              day{streak === 1 ? "" : "s"}
            </span>
          </div>
          <span style={{ fontSize: 30, color: MUTED, marginTop: 16 }}>
            chose dopamine over the doomscroll.
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 24 }}>
          <Stat label="LEVEL" value={level} valueColor={ENERGY} card={CARD} line={LINE} faint={FAINT} small />
          <Stat label="TOTAL XP" value={xp.toLocaleString()} valueColor={XP} card={CARD} line={LINE} faint={FAINT} />
          <Stat label="DOPAMINE HITS" value={String(hits)} valueColor={FLAME} card={CARD} line={LINE} faint={FAINT} />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
          <span style={{ fontSize: 26, color: INK, fontWeight: 600 }}>hyperfix.app</span>
        </div>
      </div>
    ),
    size
  );
}

function Stat({
  label,
  value,
  valueColor,
  card,
  line,
  faint,
  small,
}: {
  label: string;
  value: string;
  valueColor: string;
  card: string;
  line: string;
  faint: string;
  small?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: card,
        border: `1px solid ${line}`,
        borderRadius: 28,
        padding: 28,
      }}
    >
      <span style={{ fontSize: 20, color: faint, letterSpacing: "0.16em", fontWeight: 700 }}>{label}</span>
      <span
        style={{
          fontSize: small ? 40 : 56,
          color: valueColor,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginTop: 10,
        }}
      >
        {value}
      </span>
    </div>
  );
}
