import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const year = p.get("year") ?? "2025";
  const totalFixes = p.get("totalFixes") ?? "0";
  const totalDays = p.get("totalDays") ?? "0";
  const topCategory = p.get("topCategory") ?? "other";
  const avgIntensity = p.get("avgIntensity") ?? "0";
  const longestTitle = p.get("longestTitle") ?? "";
  const longestDays = p.get("longestDays") ?? "0";
  const quote = p.get("quote") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#080808",
          padding: "56px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top-right lime glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(94,234,212,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Bottom-left faint glow */}
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <span style={{ color: "#5EEAD4", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em" }}>hyper</span>
          <span style={{ color: "#F4F4F4", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em" }}>fix</span>
          <span style={{ color: "rgba(244,244,244,0.3)", fontWeight: 400, fontSize: 16, marginLeft: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            wrapped {year}
          </span>
        </div>

        {/* Main content row */}
        <div style={{ display: "flex", gap: 32, flex: 1 }}>
          {/* Left: stats grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <StatBox value={totalFixes} label="total fixes" />
              <StatBox value={`${totalDays}d`} label="days fixated" />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <StatBox value={topCategory} label="top category" small />
              <StatBox value={`${avgIntensity}/10`} label="avg intensity" />
            </div>
          </div>

          {/* Right: longest fix + quote */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 380 }}>
            {/* Longest fix card */}
            <div
              style={{
                background: "#111113",
                border: "1px solid rgba(244,244,244,0.07)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ color: "rgba(244,244,244,0.35)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                longest fix
              </span>
              <span
                style={{
                  color: "#F4F4F4",
                  fontSize: longestTitle.length > 30 ? 18 : 22,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {longestTitle || "—"}
              </span>
              <span style={{ color: "#5EEAD4", fontSize: 14, fontWeight: 600 }}>
                {longestDays} days
              </span>
            </div>

            {/* Quote */}
            <div
              style={{
                background: "rgba(94,234,212,0.05)",
                border: "1px solid rgba(94,234,212,0.15)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flex: 1,
              }}
            >
              <span style={{ color: "rgba(94,234,212,0.6)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                hyperfix says
              </span>
              <span style={{ color: "#F4F4F4", fontSize: 14, lineHeight: 1.5, fontStyle: "italic" }}>
                &ldquo;{quote}&rdquo;
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 24, borderTop: "1px solid rgba(244,244,244,0.07)", paddingTop: 16 }}>
          <span style={{ color: "rgba(244,244,244,0.2)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            hyperfix.app · track your obsessions
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

function StatBox({ value, label, small = false }: { value: string; label: string; small?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span style={{ color: "#5EEAD4", fontSize: small ? 26 : 40, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}
      </span>
      <span style={{ color: "rgba(244,244,244,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}
