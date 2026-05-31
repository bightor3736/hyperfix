import { ImageResponse } from "next/og";
import { getTrackItem } from "@/lib/track-data";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

const BG = "var(--bg)";
const INK = "#F4F4F4";
const MUTED = "#525252";
const ACCENT = "#5EEAD4";
const SOFT = "#9A9A9A";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = getTrackItem(slug);

  const name = item?.name ?? "Hyperfix";
  const sub = item
    ? `${item.trackingCount.toLocaleString()}+ people tracking · avg ${item.avgDays}d run · hyperfix.app`
    : "a hyperfixation tracker for people who can't shut up about their current obsession";

  // Shrink headline if name is long
  const fontSize = name.length > 18 ? 116 : name.length > 12 ? 144 : 168;

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
            /track/{slug}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(244,244,244,0.08)", marginTop: 28 }} />

        {/* Eyebrow */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          Hyperfixation Tracker for
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 24,
            fontSize,
            lineHeight: 0.94,
            letterSpacing: "-0.04em",
            fontWeight: 500,
            display: "flex",
            color: ACCENT,
            fontStyle: "italic",
            maxWidth: 1056,
          }}
        >
          {name}
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
          <span style={{ maxWidth: 800, lineHeight: 1.35 }}>{sub}</span>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 144, lineHeight: 0.85, color: ACCENT, letterSpacing: "-0.05em", opacity: 0.08 }}>
            hx
          </span>
        </div>
      </div>
    ),
    { width: SIZE.width, height: SIZE.height }
  );
}
