import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 512, height: 512 };
const PAPER = "#080808";
const INK = "#F4F4F4";
const ACCENT = "#A855F7";
const MUTED = "#525252";

/* 1 — bordered monogram (current pick) */
function Logo1() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
      <div style={{ width: "100%", height: "100%", border: `6px solid ${ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 320, fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1 }}>
        <span style={{ color: INK }}>h</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 2 — stacked with accent rule */
function Logo2() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, position: "relative", display: "flex", flexDirection: "column", padding: 60, fontFamily: "Georgia, serif", fontWeight: 700 }}>
      <span style={{ color: INK, fontSize: 260, lineHeight: 0.85, letterSpacing: "-0.06em" }}>h</span>
      <span style={{ color: ACCENT, fontStyle: "italic", fontSize: 260, lineHeight: 0.85, letterSpacing: "-0.06em", marginTop: 16, marginLeft: 60 }}>f</span>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 36, height: 6, background: ACCENT, display: "flex" }} />
    </div>
  );
}

/* 3 — pure hf wordmark, no frame */
function Logo3() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 360, lineHeight: 1, letterSpacing: "-0.1em" }}>
      <span style={{ color: INK }}>h</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
    </div>
  );
}

/* 4 — fixation reticle (illustration) */
function Logo4() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: 400, height: 400, borderRadius: "50%", border: `2px solid ${INK}`, opacity: 0.15, position: "absolute", display: "flex" }} />
      <div style={{ width: 280, height: 280, borderRadius: "50%", border: `2px solid ${INK}`, opacity: 0.3, position: "absolute", display: "flex" }} />
      <div style={{ width: 160, height: 160, borderRadius: "50%", border: `3px solid ${ACCENT}`, position: "absolute", display: "flex" }} />
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: ACCENT, position: "absolute", display: "flex" }} />
    </div>
  );
}

/* 5 — accent backdrop, ink monogram (inverse) */
function Logo5() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 360, lineHeight: 1, letterSpacing: "-0.1em" }}>
      <span style={{ color: PAPER }}>h</span>
      <span style={{ color: PAPER, fontStyle: "italic" }}>f</span>
    </div>
  );
}

/* 6 — domain-style "h.f" with period as accent */
function Logo6() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 320, lineHeight: 1, letterSpacing: "-0.08em" }}>
      <span style={{ color: INK }}>h</span>
      <span style={{ color: ACCENT }}>.</span>
      <span style={{ color: INK, fontStyle: "italic" }}>f</span>
    </div>
  );
}

/* 7 — stamp / postmark style */
function Logo7() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `4px solid ${INK}`, padding: "40px 64px", gap: 16 }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT }}>currently · unwell</span>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 240, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.08em" }}>
          <span style={{ color: INK }}>h</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.3em", textTransform: "uppercase", color: MUTED }}>hyperfix · 2026</span>
      </div>
    </div>
  );
}

/* 8 — counter aesthetic: big "00" with hf */
function Logo8() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, position: "relative", display: "flex", flexDirection: "column", padding: 64, fontFamily: "Georgia, serif" }}>
      <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>day</span>
      <span style={{ color: ACCENT, fontSize: 280, fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.06em", fontVariantNumeric: "tabular-nums", marginTop: 8 }}>01</span>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 700, letterSpacing: "-0.05em" }}>
          <span style={{ color: INK }}>h</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>hyperfix.app</span>
      </div>
    </div>
  );
}

/* 9 — split square: half black / half accent with hf overlay */
function Logo9() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, position: "relative", display: "flex" }}>
      <div style={{ width: "50%", height: "100%", background: PAPER, display: "flex" }} />
      <div style={{ width: "50%", height: "100%", background: ACCENT, display: "flex" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 340, lineHeight: 1, letterSpacing: "-0.1em" }}>
        <span style={{ color: ACCENT }}>h</span>
        <span style={{ color: PAPER, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 10 — minimal hf with accent dot underneath (loading-state vibe) */
function Logo10() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, fontFamily: "Georgia, serif", fontWeight: 700 }}>
      <div style={{ display: "flex", fontSize: 280, lineHeight: 1, letterSpacing: "-0.08em" }}>
        <span style={{ color: INK }}>h</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: ACCENT, display: "flex" }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: INK, opacity: 0.3, display: "flex" }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: INK, opacity: 0.3, display: "flex" }} />
      </div>
    </div>
  );
}

/* 11 — bracket frame [ hf ] — dev/code aesthetic */
function Logo11() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 280, lineHeight: 1, letterSpacing: "-0.06em" }}>
      <span style={{ color: ACCENT, marginRight: 16 }}>[</span>
      <span style={{ color: INK }}>h</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      <span style={{ color: ACCENT, marginLeft: 16 }}>]</span>
    </div>
  );
}

/* 12 — vertical column wordmark */
function Logo12() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 180, lineHeight: 0.92, letterSpacing: "-0.06em" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: INK }}>h</span>
        <span style={{ color: INK }}>y</span>
        <span style={{ color: INK }}>p</span>
        <span style={{ color: INK }}>e</span>
        <span style={{ color: INK }}>r</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 13 — receipt / ticket shape */
function Logo13() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ width: "100%", background: INK, display: "flex", flexDirection: "column", padding: "32px 28px", gap: 18 }}>
        <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.3em", textTransform: "uppercase", color: MUTED }}>currently</span>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 220, lineHeight: 1, letterSpacing: "-0.08em" }}>
          <span style={{ color: PAPER }}>h</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 16, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
          <span>day · 047</span>
          <span>09/10</span>
        </div>
      </div>
    </div>
  );
}

/* 14 — big italic f, tiny h prefix */
function Logo14() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 40, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED, paddingBottom: 80 }}>h</span>
        <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontStyle: "italic", fontSize: 460, lineHeight: 0.8, letterSpacing: "-0.08em", color: ACCENT }}>f</span>
      </div>
    </div>
  );
}

/* 15 — circle seal */
function Logo15() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `4px solid ${ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 260, lineHeight: 1, letterSpacing: "-0.08em" }}>
        <span style={{ color: INK }}>h</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 16 — typographic spec lines (baseline + capline rules) */
function Logo16() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 320, lineHeight: 1, letterSpacing: "-0.08em" }}>
      <div style={{ position: "absolute", left: 48, right: 48, top: 110, height: 1, background: ACCENT, opacity: 0.4, display: "flex" }} />
      <div style={{ position: "absolute", left: 48, right: 48, bottom: 110, height: 1, background: ACCENT, opacity: 0.4, display: "flex" }} />
      <span style={{ color: INK }}>h</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
    </div>
  );
}

/* 17 — hashtag wordmark */
function Logo17() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 200, lineHeight: 1, letterSpacing: "-0.05em" }}>
      <span style={{ color: ACCENT, marginRight: 8 }}>#</span>
      <span style={{ color: INK }}>hyper</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
    </div>
  );
}

/* 18 — pure massive italic f (single letter mark) */
function Logo18() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontStyle: "italic", fontSize: 560, lineHeight: 0.85, letterSpacing: "-0.08em", color: ACCENT }}>
      f
    </div>
  );
}

/* 19 — highlighter: hf with fluorescent acid bar behind */
function Logo19() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", left: 64, right: 64, top: "44%", height: 180, background: ACCENT, opacity: 0.85, display: "flex" }} />
      <div style={{ position: "relative", display: "flex", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 320, lineHeight: 1, letterSpacing: "-0.08em" }}>
        <span style={{ color: PAPER }}>h</span>
        <span style={{ color: PAPER, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 20 — tape sticker: rotated label */
function Logo20() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: INK, padding: "40px 80px", transform: "rotate(-4deg)", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 260, lineHeight: 1, letterSpacing: "-0.08em" }}>
        <span style={{ color: PAPER }}>h</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 21 — tally marks counting up to hf */
function Logo21() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, padding: 48 }}>
      <div style={{ display: "flex", gap: 14 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 8, height: 80, background: ACCENT, display: "flex" }} />
        ))}
        <div style={{ width: 120, height: 8, background: ACCENT, transform: "rotate(-22deg)", marginLeft: -64, marginTop: 36, display: "flex" }} />
      </div>
      <div style={{ display: "flex", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 240, lineHeight: 1, letterSpacing: "-0.08em" }}>
        <span style={{ color: INK }}>h</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 22 — negative space: accent block with hf cut out (inverse using overlay trick) */
function Logo22() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ background: PAPER, padding: "32px 64px", display: "flex", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 260, lineHeight: 1, letterSpacing: "-0.08em" }}>
        <span style={{ color: ACCENT }}>h</span>
        <span style={{ color: INK, fontStyle: "italic" }}>f</span>
      </div>
    </div>
  );
}

/* 23 — h:f ratio / timestamp style */
function Logo23() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 320, lineHeight: 1, letterSpacing: "-0.06em", fontVariantNumeric: "tabular-nums" }}>
      <span style={{ color: INK }}>h</span>
      <span style={{ color: ACCENT, marginLeft: 6, marginRight: 6 }}>:</span>
      <span style={{ color: INK, fontStyle: "italic" }}>f</span>
    </div>
  );
}

/* 24 — chevron arrows wrapping hf */
function Logo24() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 240, lineHeight: 1, letterSpacing: "-0.06em" }}>
      <span style={{ color: ACCENT, marginRight: 18 }}>»</span>
      <span style={{ color: INK }}>h</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      <span style={{ color: ACCENT, marginLeft: 18 }}>«</span>
    </div>
  );
}

/* 25 — intensity bar chart aesthetic */
function Logo25() {
  const bars = [3, 5, 7, 9, 10, 8, 6];
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", padding: 56, justifyContent: "space-between" }}>
      <div style={{ display: "flex", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 180, lineHeight: 1, letterSpacing: "-0.06em" }}>
        <span style={{ color: INK }}>h</span>
        <span style={{ color: ACCENT, fontStyle: "italic" }}>f</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200 }}>
        {bars.map((v, i) => (
          <div key={i} style={{ width: 44, height: `${v * 10}%`, background: ACCENT, opacity: 0.4 + (v / 10) * 0.6, display: "flex" }} />
        ))}
      </div>
    </div>
  );
}

/* 26 — interlocking circles (cassette reel feel, also reads as "loop") */
function Logo26() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ width: 200, height: 200, borderRadius: "50%", border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 140, lineHeight: 1, color: INK }}>
        h
      </div>
      <div style={{ width: 200, height: 200, borderRadius: "50%", border: `4px solid ${ACCENT}`, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontStyle: "italic", fontSize: 140, lineHeight: 1, color: PAPER }}>
        f
      </div>
    </div>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);
  const logos = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8, Logo9, Logo10, Logo11, Logo12, Logo13, Logo14, Logo15, Logo16, Logo17, Logo18, Logo19, Logo20, Logo21, Logo22, Logo23, Logo24, Logo25, Logo26];
  const Pick = logos[n] ?? Logo1;
  return new ImageResponse(<Pick />, SIZE);
}
