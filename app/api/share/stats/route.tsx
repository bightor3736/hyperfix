import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1080, height: 1080 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export const alt = "My Hyperfix card";

// Neo-brutalist shareable flex card — the level name is the hero (the meme),
// streak + XP are the proof, and the current obsession is the relatable hook.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") ?? "").slice(0, 20);
  const streak = parseInt(searchParams.get("streak") ?? "0", 10) || 0;
  const level = (searchParams.get("level") ?? "Mildly Curious").slice(0, 28);
  const levelNum = parseInt(searchParams.get("levelNum") ?? "0", 10) || 0;
  const xp = parseInt(searchParams.get("xp") ?? "0", 10) || 0;
  const fixation = (searchParams.get("fixation") ?? "").slice(0, 40);

  const BG = "#FAF6F0";
  const INK = "#2B2440";
  const FAINT = "#6A6A6A";
  const CARD = "#FFFFFF";
  const BLUE = "#6957E8";
  const VIOLET = "#9B8AFB";
  const FLAME = "#F97E6D";

  // level name scales down as it gets longer so it always fills the block
  const lvl = level.toUpperCase();
  const lvlSize = lvl.length > 16 ? 92 : lvl.length > 10 ? 120 : 150;

  const Bracket = () => (
    <svg width="64" height="64" viewBox="0 0 32 32">
      <g fill={INK}>
        <rect x="3" y="3" width="3" height="8" /><rect x="3" y="3" width="8" height="3" />
        <rect x="26" y="3" width="3" height="8" /><rect x="21" y="3" width="8" height="3" />
        <rect x="3" y="21" width="3" height="8" /><rect x="3" y="26" width="8" height="3" />
        <rect x="26" y="21" width="3" height="8" /><rect x="21" y="26" width="8" height="3" />
      </g>
      <rect x="11.5" y="11.5" width="9" height="9" fill={BLUE} stroke={INK} strokeWidth="2.5" />
    </svg>
  );

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: BG, padding: 52, fontFamily: "sans-serif" }}>
        <div
          style={{
            display: "flex", flexDirection: "column", width: "100%", height: "100%",
            background: CARD, border: `6px solid ${INK}`, borderRadius: 16,
            boxShadow: `20px 20px 0 0 ${INK}`, padding: 56, justifyContent: "space-between",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Bracket />
              <span style={{ fontSize: 46, color: INK, fontWeight: 800, letterSpacing: "-0.04em" }}>hyperfix</span>
            </div>
            <div style={{ display: "flex", border: `4px solid ${INK}`, borderRadius: 999, padding: "10px 24px", background: BG }}>
              <span style={{ fontSize: 22, color: INK, fontWeight: 800, letterSpacing: "0.12em" }}>FIXATION REPORT</span>
            </div>
          </div>

          {/* Level hero */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, color: FAINT, fontWeight: 800, letterSpacing: "0.1em" }}>
              {(name ? `@${name}` : "MY BRAIN").toUpperCase()} · LEVEL {levelNum || ""}
            </span>
            <div
              style={{
                display: "flex", marginTop: 18, background: VIOLET, border: `6px solid ${INK}`,
                borderRadius: 20, boxShadow: `10px 10px 0 0 ${INK}`, padding: "28px 36px", alignSelf: "flex-start",
                maxWidth: "100%",
              }}
            >
              <span style={{ fontSize: lvlSize, color: "#fff", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {lvl}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24 }}>
            <Stat label="STREAK" value={`${streak}d`} color={FLAME} ink={INK} bg={BG} />
            <Stat label="TOTAL XP" value={xp.toLocaleString()} color={BLUE} ink={INK} bg={BG} />
          </div>

          {/* Current obsession */}
          {fixation ? (
            <div style={{ display: "flex", flexDirection: "column", background: "#FFC93F", border: `6px solid ${INK}`, borderRadius: 20, padding: "24px 32px" }}>
              <span style={{ fontSize: 24, color: INK, fontWeight: 800, letterSpacing: "0.1em" }}>CURRENTLY OBSESSED WITH</span>
              <span style={{ fontSize: 56, color: INK, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 4 }}>{fixation}</span>
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `4px solid ${INK}`, paddingTop: 28 }}>
            <span style={{ fontSize: 26, color: FAINT, fontWeight: 800, letterSpacing: "0.08em" }}>MADE WITH HYPERFIX</span>
            <span style={{ fontSize: 30, color: INK, fontWeight: 800, letterSpacing: "-0.02em" }}>hyperfix.app</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}

function Stat({ label, value, color, ink, bg }: { label: string; value: string; color: string; ink: string; bg: string }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", flex: 1, background: bg,
        border: `5px solid ${ink}`, borderRadius: 20, boxShadow: `8px 8px 0 0 ${ink}`, padding: 28,
      }}
    >
      <span style={{ fontSize: 24, color: ink, fontWeight: 800, letterSpacing: "0.14em" }}>{label}</span>
      <span style={{ fontSize: 92, color, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 6, lineHeight: 1 }}>{value}</span>
    </div>
  );
}
