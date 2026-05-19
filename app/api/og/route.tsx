import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

const BG = "#080808";
const INK = "#F4F4F4";
const MUTED = "#525252";
const ACCENT = "#A3E635";
const SOFT = "#9A9A9A";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "What are you unwell about?";
  const sub = searchParams.get("sub") ?? "a hyperfixation tracker for people who can't shut up about their current obsession";
  const accent = searchParams.get("accent") ?? title;

  const accentIndex = title.toLowerCase().indexOf(accent.toLowerCase());
  const before = accentIndex > 0 ? title.slice(0, accentIndex) : title;
  const highlighted = accentIndex >= 0 ? title.slice(accentIndex) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "serif",
          color: INK,
          position: "relative",
        }}
      >
        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 700, lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
            hyperfix.app
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(244,244,244,0.08)", marginTop: 28 }} />

        {/* Headline */}
        <div
          style={{
            marginTop: 64,
            fontSize: accentIndex >= 0 && before.trim() ? 116 : 144,
            lineHeight: 0.94,
            letterSpacing: "-0.04em",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            maxWidth: 960,
          }}
        >
          {accentIndex > 0 ? (
            <>
              <span style={{ color: INK }}>{before.trim()}</span>
              <span style={{ color: ACCENT, fontStyle: "italic" }}>{highlighted}</span>
            </>
          ) : (
            <span style={{ color: ACCENT, fontStyle: "italic" }}>{title}</span>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "monospace",
            fontSize: 20,
            color: SOFT,
          }}
        >
          <span style={{ maxWidth: 700, lineHeight: 1.35 }}>{sub}</span>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 144, lineHeight: 0.85, color: ACCENT, letterSpacing: "-0.05em", opacity: 0.08 }}>
            hx
          </span>
        </div>
      </div>
    ),
    { width: SIZE.width, height: SIZE.height }
  );
}
