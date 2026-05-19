import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;

// ── content packs ─────────────────────────────────────────────────────────
export const PACKS: Pack[] = [
  {
    slides: [
      { eyebrow: "you might be hyperfixated if…", headline: "you've watched the same 3-minute scene more times than you've eaten meals this week", sub: null },
      { eyebrow: null, headline: "you've started four group chats about the same thing and muted yourself in two of them", sub: null },
      { eyebrow: null, headline: "you know more about a fictional character than you know about your own relatives", sub: "the lore goes deeper every day" },
      { eyebrow: "track it. honor it.", headline: "hyperfix.app", sub: "a journal for whatever is currently running your life  ↓  link in bio", cta: true },
    ],
    caption: "if you felt this you are so perceived 💚 #hyperfixation #adhd #adhdtiktok #fandom #relatable #audhd #foryoupage",
  },
  {
    slides: [
      { eyebrow: "types of hyperfixation 🧠", headline: "which one are you in right now?", sub: "swipe →" },
      { eyebrow: "the fandom era", headline: "you have opinions about a fictional person that would concern your therapist", sub: "day: unknown. you stopped counting." },
      { eyebrow: "the song loop", headline: "same 3 minutes. 300 times. you don't make the rules.", sub: "shazamed it day one. now you could perform it acoustically." },
      { eyebrow: "there's a tracker for this now", headline: "hyperfix.app", sub: "waitlist open — join before launch  ↓  link in bio", cta: true },
    ],
    caption: "the song loop one is so personal to me 🎵 #hyperfixation #adhd #audhd #adhdthings #foryou #relatable",
  },
  {
    slides: [
      { eyebrow: "POV:", headline: "your hyperfixation just ended", sub: null },
      { eyebrow: null, headline: "you don't know who you are without it", sub: "the personality was borrowed" },
      { eyebrow: null, headline: "you're already waiting for the next one to save you", sub: "grief is valid here" },
      { eyebrow: "the graveyard lives on at", headline: "hyperfix.app", sub: "log it. count the days. write the eulogy.  ↓  link in bio", cta: true },
    ],
    caption: "post-fix depression is so real 💔 #hyperfixation #adhd #audhd #comingdown #relatable #adhdtiktok",
  },
  {
    slides: [
      { eyebrow: "the stages of a hyperfixation", headline: "stage 1: mild interest", sub: "(this lasts approximately 4 minutes)" },
      { eyebrow: null, headline: "stage 2: 'wait this is actually really interesting'", sub: "(the last rational thought you will have)" },
      { eyebrow: null, headline: "stage 3: your entire personality is now this one thing", sub: "you have reorganised your room around it" },
      { eyebrow: "there's a tracker for this now", headline: "hyperfix.app", sub: "first access dropping soon — join the waitlist  ↓", cta: true },
    ],
    caption: "stage 2 → 3 has zero warning time 😭 #hyperfixation #adhdthings #audhd #relatable #foryoupage #neurodivergent",
  },
  {
    slides: [
      { eyebrow: "things people with hyperfixations say:", headline: "\"okay so I know you haven't seen it but just listen\"", sub: null },
      { eyebrow: null, headline: "\"I'm not obsessed I just think about it constantly\"", sub: "(these are the same thing)" },
      { eyebrow: null, headline: "\"I can stop whenever I want\"", sub: "day 47 of the same song on loop" },
      { eyebrow: "a home for your current obsession", headline: "hyperfix.app", sub: "waitlist is open. join now.  ↓  link in bio", cta: true },
    ],
    caption: "the second one is genuinely how I gaslit myself for months 💀 #hyperfixation #adhd #audhd #fandom #relatable",
  },
  {
    slides: [
      { eyebrow: "ADHD brains 🧠", headline: "don't have hobbies", sub: "we have hyperfixations that consume us for 6 weeks then disappear forever" },
      { eyebrow: null, headline: "you don't just like things. you need to know everything about them immediately.", sub: "the interest → obsession pipeline is zero seconds" },
      { eyebrow: null, headline: "and then one day it's just… gone", sub: "no explanation. no closure. you just wake up normal." },
      { eyebrow: "track the cycle. honor the obsession.", headline: "hyperfix.app", sub: "the waitlist is open  ↓", cta: true },
    ],
    caption: "the pipeline is a straight vertical drop ⬇️ #adhdtiktok #hyperfixation #audhd #neurodivergent #relatable",
  },
];

interface Slide { eyebrow: string | null; headline: string; sub: string | null; cta?: boolean }
interface Pack  { slides: Slide[]; caption: string }

// ── style helpers ──────────────────────────────────────────────────────────

function fontSize(headline: string) {
  return headline.length > 80 ? 60 : headline.length > 55 ? 70 : headline.length > 35 ? 80 : 92;
}

// ─────────────────────────────────────────────────────────────────────────
// STYLE 1 — "Zine"
// Warm cream background, editorial black text, lime accents, geometry
// ─────────────────────────────────────────────────────────────────────────
function ZineSlide({ slide, n, total }: { slide: Slide; n: number; total: number }) {
  const isCta = !!slide.cta;
  const fs = fontSize(slide.headline);

  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: isCta ? "#a3e635" : "#F2EDE4",
        display: "flex", flexDirection: "column",
        padding: "90px 80px",
        fontFamily: "serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Large outlined circle — top right */}
      <div style={{
        position: "absolute", top: -110, right: -110,
        width: 500, height: 500, borderRadius: "50%",
        border: `3px solid ${isCta ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.07)"}`,
        display: "flex",
      }} />
      {/* Medium circle — bottom left */}
      <div style={{
        position: "absolute", bottom: -180, left: -140,
        width: 420, height: 420, borderRadius: "50%",
        border: `2px solid ${isCta ? "rgba(0,0,0,0.08)" : "rgba(163,230,53,0.35)"}`,
        display: "flex",
      }} />
      {/* Lime filled dot */}
      <div style={{
        position: "absolute", top: 310, right: 100,
        width: 48, height: 48, borderRadius: "50%",
        background: isCta ? "rgba(0,0,0,0.2)" : "#a3e635",
        display: "flex",
      }} />
      {/* Small dot cluster */}
      <div style={{ position: "absolute", bottom: 320, right: 90, width: 14, height: 14, borderRadius: "50%", background: isCta ? "rgba(0,0,0,0.15)" : "rgba(163,230,53,0.6)", display: "flex" }} />
      <div style={{ position: "absolute", bottom: 355, right: 115, width: 8, height: 8, borderRadius: "50%", background: isCta ? "rgba(0,0,0,0.1)" : "rgba(163,230,53,0.35)", display: "flex" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
        <span style={{ color: isCta ? "#010201" : "#0A0A0A", fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em" }}>hyperfix</span>
        <span style={{ color: isCta ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.25)", fontSize: 26, fontFamily: "monospace" }}>{n}/{total}</span>
      </div>

      {/* Lime rule */}
      <div style={{ height: 4, background: isCta ? "rgba(0,0,0,0.2)" : "#a3e635", marginTop: 56, marginBottom: 56, display: "flex", borderRadius: 2 }} />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 36 }}>
        {slide.eyebrow && (
          <span style={{ color: isCta ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.4)", fontSize: 27, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1.5 }}>
            {slide.eyebrow}
          </span>
        )}
        <span style={{ color: isCta ? "#010201" : "#0A0A0A", fontSize: fs, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.03em" }}>
          {slide.headline}
        </span>
        {slide.sub && (
          <span style={{ color: isCta ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.4)", fontSize: 36, lineHeight: 1.5, fontFamily: "monospace" }}>
            {slide.sub}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 40 }}>
        {isCta ? (
          <>
            <div style={{ flex: 1, height: 3, background: "rgba(0,0,0,0.2)", display: "flex", borderRadius: 2 }} />
            <span style={{ color: "rgba(0,0,0,0.5)", fontSize: 28, fontFamily: "monospace", fontWeight: 700 }}>hyperfix.app</span>
          </>
        ) : n < total ? (
          <span style={{ color: "rgba(0,0,0,0.18)", fontSize: 26, fontFamily: "monospace" }}>swipe →</span>
        ) : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STYLE 2 — "Orbit"
// Deep dark background, large overlapping ring geometry, glowing accents
// ─────────────────────────────────────────────────────────────────────────
function OrbitSlide({ slide, n, total }: { slide: Slide; n: number; total: number }) {
  const isCta = !!slide.cta;
  const fs = fontSize(slide.headline);

  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: isCta ? "#a3e635" : "#06060E",
        display: "flex", flexDirection: "column",
        padding: "90px 80px",
        fontFamily: "serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ring 1 — large, top right */}
      <div style={{
        position: "absolute", top: -200, right: -180,
        width: 720, height: 720, borderRadius: "50%",
        border: `1.5px solid ${isCta ? "rgba(0,0,0,0.12)" : "rgba(163,230,53,0.18)"}`,
        display: "flex",
      }} />
      {/* Ring 2 — medium, offset lower right */}
      <div style={{
        position: "absolute", top: 180, right: -220,
        width: 480, height: 480, borderRadius: "50%",
        border: `1px solid ${isCta ? "rgba(0,0,0,0.08)" : "rgba(163,230,53,0.1)"}`,
        display: "flex",
      }} />
      {/* Ring 3 — large, bottom left */}
      <div style={{
        position: "absolute", bottom: -300, left: -250,
        width: 800, height: 800, borderRadius: "50%",
        border: `1.5px solid ${isCta ? "rgba(0,0,0,0.1)" : "rgba(163,230,53,0.12)"}`,
        display: "flex",
      }} />
      {/* Small ring — floating centre-left */}
      <div style={{
        position: "absolute", top: "42%", left: 60,
        width: 120, height: 120, borderRadius: "50%",
        border: `1.5px solid ${isCta ? "rgba(0,0,0,0.15)" : "rgba(163,230,53,0.25)"}`,
        display: "flex",
      }} />
      {/* Filled dot */}
      <div style={{ position: "absolute", top: "44%", left: 103, width: 34, height: 34, borderRadius: "50%", background: isCta ? "rgba(0,0,0,0.2)" : "#a3e635", display: "flex" }} />
      {/* Mini dots */}
      <div style={{ position: "absolute", top: 240, left: 90, width: 10, height: 10, borderRadius: "50%", background: isCta ? "rgba(0,0,0,0.15)" : "rgba(163,230,53,0.5)", display: "flex" }} />
      <div style={{ position: "absolute", bottom: 280, right: 110, width: 7, height: 7, borderRadius: "50%", background: isCta ? "rgba(0,0,0,0.12)" : "rgba(163,230,53,0.4)", display: "flex" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: isCta ? "#010201" : "#a3e635", fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em" }}>hyperfix</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i + 1 === n ? 28 : 8, height: 8, borderRadius: 4, background: i + 1 === n ? (isCta ? "#010201" : "#a3e635") : (isCta ? "rgba(0,0,0,0.2)" : "rgba(163,230,53,0.2)"), display: "flex" }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 40 }}>
        {slide.eyebrow && (
          <span style={{ color: isCta ? "rgba(0,0,0,0.5)" : "rgba(163,230,53,0.7)", fontSize: 26, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1.5 }}>
            {slide.eyebrow}
          </span>
        )}
        <span style={{ color: isCta ? "#010201" : "#F4F4F4", fontSize: fs, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
          {slide.headline}
        </span>
        {slide.sub && (
          <span style={{ color: isCta ? "rgba(0,0,0,0.5)" : "rgba(244,244,244,0.4)", fontSize: 36, fontFamily: "monospace", lineHeight: 1.5 }}>
            {slide.sub}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
        {isCta ? (
          <span style={{ color: "rgba(0,0,0,0.45)", fontSize: 28, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.04em" }}>hyperfix.app</span>
        ) : n < total ? (
          <span style={{ color: "rgba(244,244,244,0.1)", fontSize: 26, fontFamily: "monospace" }}>swipe →</span>
        ) : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STYLE 3 — "Color Pop"
// Each slide gets its own bold background; CTA is always lime.
// Large color blocks, maximalist use of space.
// ─────────────────────────────────────────────────────────────────────────
function ColorPopSlide({ slide, n, total }: { slide: Slide; n: number; total: number }) {
  const isCta = !!slide.cta;
  const fs = fontSize(slide.headline);

  // Per-slide palettes: [bg, text, accent, blockColor]
  const palettes = [
    { bg: "#a3e635", text: "#010201", accent: "#010201",  block: "rgba(0,0,0,0.08)"  }, // lime
    { bg: "#010201", text: "#F4F4F4", accent: "#a3e635",  block: "rgba(163,230,53,0.07)" }, // dark
    { bg: "#0D0D1A", text: "#F4F4F4", accent: "#a3e635",  block: "rgba(163,230,53,0.06)" }, // deep dark
    { bg: "#a3e635", text: "#010201", accent: "#010201",  block: "rgba(0,0,0,0.1)"  }, // lime CTA
  ];

  const p = isCta ? palettes[3] : palettes[(n - 1) % 3];

  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: p.bg,
        display: "flex", flexDirection: "column",
        fontFamily: "serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top color block strip */}
      <div style={{ width: "100%", height: 12, background: p.accent === p.text ? "rgba(255,255,255,0.15)" : p.accent, display: "flex" }} />

      {/* Large decorative corner block */}
      <div style={{
        position: "absolute", bottom: -60, right: -60,
        width: 420, height: 420,
        background: p.block,
        borderRadius: 60,
        display: "flex",
        transform: "rotate(15deg)",
      }} />
      {/* Second rotated block */}
      <div style={{
        position: "absolute", top: -80, left: -80,
        width: 300, height: 300,
        background: p.block,
        borderRadius: 48,
        display: "flex",
        transform: "rotate(-12deg)",
      }} />

      {/* Main content area */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "80px 80px 70px", position: "relative" }}>
        {/* Wordmark + counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "auto" }}>
          <span style={{ color: p.accent, fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em" }}>hyperfix</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: i + 1 === n ? p.accent : "transparent",
                border: `2px solid ${i + 1 === n ? p.accent : `${p.accent}40`}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: i + 1 === n ? p.bg : `${p.accent}80`, fontSize: 14, fontFamily: "monospace", fontWeight: 700 }}>{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centered content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 40 }}>
          {slide.eyebrow && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 3, background: p.accent, display: "flex", borderRadius: 2 }} />
              <span style={{ color: `${p.text}80`, fontSize: 25, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {slide.eyebrow}
              </span>
            </div>
          )}
          <span style={{ color: p.text, fontSize: fs, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.03em" }}>
            {slide.headline}
          </span>
          {slide.sub && (
            <span style={{ color: `${p.text}60`, fontSize: 36, fontFamily: "monospace", lineHeight: 1.5 }}>
              {slide.sub}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: isCta ? "center" : "flex-start", alignItems: "center", paddingTop: 30 }}>
          {isCta ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 60, height: 3, background: p.accent === p.text ? "rgba(0,0,0,0.25)" : p.accent, display: "flex", borderRadius: 2 }} />
              <span style={{ color: p.text, fontSize: 30, fontFamily: "monospace", fontWeight: 800, opacity: 0.6 }}>hyperfix.app</span>
              <div style={{ width: 60, height: 3, background: p.accent === p.text ? "rgba(0,0,0,0.25)" : p.accent, display: "flex", borderRadius: 2 }} />
            </div>
          ) : n < total ? (
            <span style={{ color: `${p.text}25`, fontSize: 26, fontFamily: "monospace" }}>swipe →</span>
          ) : null}
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ width: "100%", height: 8, background: p.block, display: "flex" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STYLE 4 — "Illustrated"
// Jewel-tone dark backgrounds, giant Twemoji centrepiece, glow rings +
// sparkle dots, soft divider — every slide feels like an illustrated card.
// ─────────────────────────────────────────────────────────────────────────

// Per-pack emoji sets (4 slides each)
const PACK_EMOJI: string[][] = [
  ["🧠", "💬", "📚", "💚"],
  ["🔭", "🎬", "🎵", "💚"],
  ["👁️", "💔", "🌙", "💚"],
  ["⚗️", "💡", "🌀", "💚"],
  ["💭", "🔁", "⏰", "💚"],
  ["⚡", "🌊", "🍃", "💚"],
];

// Per-slide jewel-tone backgrounds (cycles per slide index within pack)
const JEWEL_BGS = ["#0D0B1E", "#0B1A18", "#1A0B14"];

function IllustratedSlide({
  slide, n, total, emoji,
}: {
  slide: Slide; n: number; total: number; emoji: string;
}) {
  const isCta = !!slide.cta;
  const fs = fontSize(slide.headline);
  const bg = isCta ? "#a3e635" : JEWEL_BGS[(n - 1) % JEWEL_BGS.length];
  const ink = isCta ? "#010201" : "#F4F4F4";
  const acc = isCta ? "#010201" : "#a3e635";
  const muted = isCta ? "rgba(0,0,0,0.45)" : "rgba(244,244,244,0.38)";

  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: bg,
        display: "flex", flexDirection: "column",
        padding: "80px 76px 72px",
        fontFamily: "serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow blob behind emoji (dark slides only) */}
      {!isCta && (
        <div style={{
          position: "absolute",
          top: 120, left: "50%", marginLeft: -260,
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,230,53,0.09) 0%, transparent 68%)",
          display: "flex",
        }} />
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 52 }}>
        <span style={{ color: acc, fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em" }}>
          hyperfix
        </span>
        {/* pill progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === n ? 32 : 8, height: 8, borderRadius: 4,
              background: i + 1 === n ? acc : `${acc}28`,
              display: "flex",
            }} />
          ))}
        </div>
      </div>

      {/* ── Illustration area ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 430, flexShrink: 0, position: "relative",
      }}>
        {/* Outer ring */}
        {!isCta && (
          <div style={{
            position: "absolute",
            width: 400, height: 400, borderRadius: "50%",
            border: "1.5px solid rgba(163,230,53,0.18)",
            display: "flex",
          }} />
        )}
        {/* Inner soft glow disc */}
        {!isCta && (
          <div style={{
            position: "absolute",
            width: 290, height: 290, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(163,230,53,0.13) 0%, transparent 75%)",
            display: "flex",
          }} />
        )}

        {/* Sparkle dots scattered around the emoji */}
        {!isCta && (
          <>
            <div style={{ position: "absolute", top: 18,  right: 108, width: 16, height: 16, borderRadius: "50%", background: "rgba(163,230,53,0.7)", display: "flex" }} />
            <div style={{ position: "absolute", top: 80,  left:  72, width: 10, height: 10, borderRadius: "50%", background: "rgba(163,230,53,0.45)", display: "flex" }} />
            <div style={{ position: "absolute", bottom: 40, right: 76, width: 12, height: 12, borderRadius: "50%", background: "rgba(163,230,53,0.5)", display: "flex" }} />
            <div style={{ position: "absolute", bottom: 20, left:  96, width:  7, height:  7, borderRadius: "50%", background: "rgba(163,230,53,0.3)", display: "flex" }} />
            <div style={{ position: "absolute", top: 30,  left: 130, width:  6, height:  6, borderRadius: "50%", background: "rgba(163,230,53,0.25)", display: "flex" }} />
          </>
        )}

        {/* The emoji itself */}
        <span style={{ fontSize: 210, lineHeight: 1 }}>{emoji}</span>
      </div>

      {/* ── Divider ── */}
      <div style={{
        height: 2, borderRadius: 1,
        background: isCta ? "rgba(0,0,0,0.15)" : "rgba(163,230,53,0.22)",
        display: "flex", marginTop: 44, marginBottom: 44,
      }} />

      {/* ── Text content ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 28 }}>
        {slide.eyebrow && (
          <span style={{
            color: isCta ? muted : "rgba(163,230,53,0.65)",
            fontSize: 24, fontFamily: "monospace",
            textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1.4,
          }}>
            {slide.eyebrow}
          </span>
        )}
        <span style={{ color: ink, fontSize: fs, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.025em" }}>
          {slide.headline}
        </span>
        {slide.sub && (
          <span style={{ color: muted, fontSize: 33, fontFamily: "monospace", lineHeight: 1.55 }}>
            {slide.sub}
          </span>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: isCta ? "center" : "flex-end", paddingTop: 28 }}>
        {isCta ? (
          <span style={{ color: muted, fontSize: 26, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.04em" }}>
            hyperfix.app
          </span>
        ) : n < total ? (
          <span style={{ color: `${acc}22`, fontSize: 24, fontFamily: "monospace" }}>swipe →</span>
        ) : null}
      </div>
    </div>
  );
}

// ── route ──────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const packIdx  = Math.abs(parseInt(searchParams.get("pack") ?? "0")) % PACKS.length;
  const slideNum = Math.max(1, Math.min(parseInt(searchParams.get("n") ?? "1"), PACKS[packIdx].slides.length));
  const total    = PACKS[packIdx].slides.length;
  const slide    = PACKS[packIdx].slides[slideNum - 1];

  // Style auto-assigned per pack: 0,3→Zine | 1,4→Orbit | 2,5→ColorPop
  // Override with ?style=1|2|3|4  (4 = Illustrated)
  const styleOverride = searchParams.get("style");
  const styleIdx = styleOverride
    ? parseInt(styleOverride, 10)
    : (packIdx % 3) + 1;

  const emoji = PACK_EMOJI[packIdx]?.[slideNum - 1] ?? "💚";
  const props = { slide, n: slideNum, total };

  const jsx =
    styleIdx === 2 ? <OrbitSlide {...props} /> :
    styleIdx === 3 ? <ColorPopSlide {...props} /> :
    styleIdx === 4 ? <IllustratedSlide {...props} emoji={emoji} /> :
                     <ZineSlide {...props} />;

  return new ImageResponse(jsx, { width: W, height: H });
}
