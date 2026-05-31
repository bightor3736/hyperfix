import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import type { SatoriOptions } from "next/dist/compiled/@vercel/og/satori";

export const runtime = "edge";

type FontEntry = NonNullable<SatoriOptions["fonts"]>[number];

const W = 1080;
const H = 1920;
const BG = "var(--bg)";
const TEAL = "#5EEAD4";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.42)";
const FAINT = "rgba(244,244,244,0.14)";

const FONT_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3200" : "https://hyperfix.app");

let frauncesFont: ArrayBuffer | null = null;
let monoFont: ArrayBuffer | null = null;

async function getFonts() {
  if (frauncesFont && monoFont) return { frauncesFont, monoFont };
  [frauncesFont, monoFont] = await Promise.all([
    fetch(`${FONT_BASE}/fonts/Fraunces-600.ttf`, { cache: "no-store" }).then((r) => r.ok ? r.arrayBuffer() : null),
    fetch(`${FONT_BASE}/fonts/JetBrainsMono-700.ttf`, { cache: "no-store" }).then((r) => r.ok ? r.arrayBuffer() : null),
  ]);
  return { frauncesFont, monoFont };
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const year = p.get("year") ?? String(new Date().getFullYear());
  const totalFixes = p.get("totalFixes") ?? "0";
  const totalDays = p.get("totalDays") ?? "0";
  const topCategory = p.get("topCategory") ?? "other";
  const avgIntensity = p.get("avgIntensity") ?? "0";
  const longestTitle = p.get("longestTitle") ?? "";
  const longestDays = p.get("longestDays") ?? "0";
  const quote = p.get("quote") ?? "Another year of the brain doing brain things.";
  const name = p.get("name") ?? "";

  const { frauncesFont, monoFont } = await getFonts();
  const fonts: FontEntry[] = [];
  if (frauncesFont) fonts.push({ name: "Fraunces", data: frauncesFont, weight: 600, style: "normal" });
  if (monoFont) fonts.push({ name: "JetBrains Mono", data: monoFont, weight: 700, style: "normal" });

  const ff = frauncesFont ? "Fraunces" : "Georgia, serif";
  const mf = monoFont ? "JetBrains Mono" : "monospace";

  const titleSize = longestTitle.length > 40 ? 42 : longestTitle.length > 28 ? 52 : 62;

  return new ImageResponse(
    (
      <div
        style={{
          width: W, height: H,
          background: BG,
          display: "flex",
          flexDirection: "column",
          padding: "108px 96px 96px",
          position: "relative",
        }}
      >
        {/* Teal glow top-right */}
        <div style={{ position: "absolute", top: -240, right: -240, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,234,212,0.14) 0%, transparent 70%)", display: "flex" }} />
        {/* Bottom-left echo */}
        <div style={{ position: "absolute", bottom: -200, left: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,234,212,0.06) 0%, transparent 70%)", display: "flex" }} />

        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 80 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ fontFamily: mf, color: TEAL, fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em" }}>hyper</span>
            <span style={{ fontFamily: mf, color: INK, fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em" }}>fix</span>
          </div>
          <span style={{ fontFamily: mf, color: DIM, fontSize: 18, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            wrapped
          </span>
        </div>

        {/* Big year */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 72 }}>
          {name && (
            <span style={{ fontFamily: mf, color: DIM, fontSize: 22, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {name}
            </span>
          )}
          <span style={{ fontFamily: ff, color: "transparent", fontSize: 220, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 0.9, WebkitTextStroke: `2px rgba(244,244,244,0.2)` }}>
            {year}
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          <div style={{ flex: 1, background: "#111113", border: `1px solid ${FAINT}`, borderRadius: 20, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: ff, color: TEAL, fontSize: 64, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em" }}>{totalFixes}</span>
            <span style={{ fontFamily: mf, color: DIM, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>fixes</span>
          </div>
          <div style={{ flex: 1, background: "#111113", border: `1px solid ${FAINT}`, borderRadius: 20, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: ff, color: INK, fontSize: 64, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em" }}>{totalDays}</span>
            <span style={{ fontFamily: mf, color: DIM, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>days</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 56 }}>
          <div style={{ flex: 1, background: "#111113", border: `1px solid ${FAINT}`, borderRadius: 20, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: ff, color: INK, fontSize: 44, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>{topCategory}</span>
            <span style={{ fontFamily: mf, color: DIM, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>top category</span>
          </div>
          <div style={{ flex: 1, background: "#111113", border: `1px solid ${FAINT}`, borderRadius: 20, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: ff, color: INK, fontSize: 44, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>{avgIntensity}/10</span>
            <span style={{ fontFamily: mf, color: DIM, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>avg intensity</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: FAINT, marginBottom: 56, display: "flex" }} />

        {/* Longest fix */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 48 }}>
          <span style={{ fontFamily: mf, color: "rgba(94,234,212,0.55)", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            longest fix
          </span>
          <span style={{ fontFamily: ff, color: INK, fontSize: titleSize, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            {longestTitle || "—"}
          </span>
          <span style={{ fontFamily: mf, color: TEAL, fontSize: 28, fontWeight: 700, marginTop: 16, letterSpacing: "-0.01em" }}>
            {longestDays} days
          </span>
        </div>

        {/* Quote */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 16 }}>
          <div style={{ background: "rgba(94,234,212,0.05)", border: "1px solid rgba(94,234,212,0.14)", borderRadius: 20, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: mf, color: "rgba(94,234,212,0.5)", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              hyperfix says
            </span>
            <span style={{ fontFamily: ff, color: "rgba(244,244,244,0.75)", fontSize: 30, lineHeight: 1.35, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {quote.length > 90 ? quote.slice(0, 90) + "…" : quote}
            </span>
          </div>

          {/* Watermark */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingTop: 12 }}>
            <span style={{ fontFamily: mf, color: "rgba(244,244,244,0.18)", fontSize: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              hyperfix.app
            </span>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts }
  );
}
