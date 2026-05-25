import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1350 };

const PAPER = "#080808";
const PAPER_DEEP = "#111113";
const INK = "#F4F4F4";
const INK_SOFT = "#9A9A9A";
const MUTED = "#525252";
const ACCENT = "#5EEAD4";

const signs = [
  { n: "01", h: "You looked it up once.", sub: "now you know everything. seventeen tabs, the subreddit, the 2019 thread. you have opinions you didn't ask for." },
  { n: "02", h: "You're recommending it unprompted.", sub: "you brought it up at dinner. sent the link with no context. texted the same person twice because you forgot." },
  { n: "03", h: "You have takes on the discourse.", sub: "casting decisions. interpretation disputes. authorial intent. you've reached the same conclusion twice." },
  { n: "04", h: "Your schedule reorganised itself.", sub: "stayed up late. woke up early. pushed work to later because you wanted one more chapter. not a hobby anymore." },
  { n: "05", h: "You're using it to regulate.", sub: "stressed? you know what helps. anxious? there's a chapter for that. it isn't just interesting. it's functional." },
  { n: "06", h: "You made something about it.", sub: "a note. a thread. a playlist. a voice memo at midnight where you talk for seven minutes about a character's motivations." },
  { n: "07", h: "You can feel it fading.", sub: "the tabs close. the schedule resets. you pick up something you hadn't touched in weeks. log it before the details go." },
];

const TOTAL = 9;

/* ───── shared chrome ───── */

function Wordmark({ dark = false, size = 44 }: { dark?: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: size, letterSpacing: "-0.05em", fontWeight: 600, lineHeight: 1, color: dark ? PAPER : INK }}>
      <span>hyper</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
    </div>
  );
}

function Stamp({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        border: `2px solid ${dark ? PAPER : INK}`,
        color: dark ? PAPER : INK,
        padding: "10px 20px",
        fontSize: 18,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}
    >
      {children}
    </div>
  );
}

function FooterBar({ index, dark = false }: { index: number; dark?: boolean }) {
  const fg = dark ? "rgba(8,8,8,0.5)" : MUTED;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Wordmark dark={dark} size={40} />
        <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: fg, marginTop: 10 }}>
          hyperfix.app
        </span>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: fg, fontVariantNumeric: "tabular-nums" }}>
        {String(index).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ───── slides ───── */

/* The layout uses a strict three-row grid: HEADER (top) / BODY (middle) / FOOTER (bottom)
   with explicit heights so nothing overlaps. Padding = 80px. */

function Frame({ bg, children, dark = false, index }: { bg: string; children: React.ReactNode; dark?: boolean; index: number }) {
  return (
    <div style={{ width: "100%", height: "100%", background: bg, position: "relative", display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif" }}>
      {children}
      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={index} dark={dark} />
      </div>
    </div>
  );
}

function CoverSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, position: "relative", display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      {/* HEADER */}
      <div style={{ display: "flex" }}>
        <Stamp>a hyperfixation tracker · 2026</Stamp>
      </div>

      {/* BODY — anchored to middle-bottom of headline area */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 168, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 500, color: INK }}>
          <span>signs</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>you're in</span>
          <span>a hyperfix.</span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 60 }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
          swipe →
        </span>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={1} />
      </div>
    </div>
  );
}

function SignSlide({ index }: { index: number }) {
  const sign = signs[index - 1];
  const bg = index % 2 === 1 ? PAPER : PAPER_DEEP;

  /* layout:
     - top: number tag (height ~30)
     - gap
     - middle: heading + subtitle stacked, with explicit max-widths and line clamps
     - bottom: footer (auto)
     The big watermark "0X" is small, anchored to top-right with controlled size,
     so it can never sit behind the headline. */

  return (
    <div style={{ width: "100%", height: "100%", background: bg, position: "relative", display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      {/* HEADER ROW: tag left, watermark number right (same row, no overlap) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, paddingTop: 14 }}>
          sign · {sign.n}
        </span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 200, lineHeight: 0.78, fontWeight: 700, color: ACCENT, opacity: 0.12, letterSpacing: "-0.08em" }}>
          {sign.n}
        </span>
      </div>

      {/* BODY: heading + subtitle, fixed gap, no overlap */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 500, color: INK, maxWidth: 920 }}>
          {sign.h}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.4, fontStyle: "italic", color: INK_SOFT, maxWidth: 820, marginTop: 48, paddingLeft: 24, borderLeft: `2px solid ${ACCENT}` }}>
          {sign.sub}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "auto", display: "flex", paddingTop: 40 }}>
        <FooterBar index={index + 1} />
      </div>
    </div>
  );
}

function CtaSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: INK, color: PAPER, position: "relative", display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex" }}>
        <Stamp dark>join the waitlist</Stamp>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 160, lineHeight: 0.92, letterSpacing: "-0.06em", fontWeight: 500, color: PAPER }}>
          <span>log your</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>obsession.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
        <div style={{ fontSize: 30, color: "rgba(8,8,8,0.7)", maxWidth: 740, lineHeight: 1.4 }}>
          count the days. share the card. mourn it when it ends.
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 26, letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT, marginTop: 48 }}>
          hyperfix.app →
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={TOTAL} dark />
      </div>
    </div>
  );
}

async function fetchPexelsPhoto(query: string, seed: number): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape&size=large`,
      { headers: { Authorization: apiKey } }
    );
    if (!res.ok) return null;
    const data = await res.json() as { photos: { src: { large2x: string; large: string } }[] };
    const photos = data.photos ?? [];
    if (!photos.length) return null;
    const photo = photos[seed % photos.length];
    return photo.src.large2x ?? photo.src.large ?? null;
  } catch {
    return null;
  }
}

// Per-sign Pexels queries matched to each sign's theme
const SIGN_QUERIES = [
  "reading books research studying",       // sign 1: looked it up once
  "friends talking conversation sharing",  // sign 2: recommending unprompted
  "night late studying desk lamp",         // sign 3: schedule reorganised
  "calm meditation regulation breath",     // sign 4: using it to regulate
  "thinking ideas brainstorming notes",    // sign 5: opinions on discourse
  "journal writing creating notebook",     // sign 6: made something about it
  "window rain ending sunset fading",      // sign 7: can feel it fading
];

function PhotoSignSlide({ index, photoUrl }: { index: number; photoUrl: string | null }) {
  const sign = signs[index - 1];

  return (
    <div style={{ width: "100%", height: "100%", background: "#060606", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      )}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.75) 100%)", display: "flex" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT }}>sign · {sign.n}</span>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 200, lineHeight: 0.78, fontWeight: 700, color: ACCENT, opacity: 0.15, letterSpacing: "-0.08em" }}>{sign.n}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 36 }}>
          <div style={{ width: 48, height: 4, background: ACCENT, borderRadius: 2, display: "flex" }} />
          <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 600, color: INK, maxWidth: 920 }}>{sign.h}</div>
          <div style={{ fontSize: 30, lineHeight: 1.4, fontStyle: "italic", color: "rgba(244,244,244,0.65)", maxWidth: 820, paddingLeft: 24, borderLeft: `2px solid ${ACCENT}` }}>{sign.sub}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, lineHeight: 1, color: INK }}>
                <span>hyper</span><span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED, marginTop: 8 }}>hyperfix.app</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED, alignSelf: "flex-end" }}>{String(index + 1).padStart(2, "0")} / {String(9).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);
  const usePhoto = new URL(req.url).searchParams.get("photo") === "1";

  if (usePhoto && n >= 1 && n <= 7) {
    const query = SIGN_QUERIES[n - 1] ?? "focus obsession";
    const photoUrl = await fetchPexelsPhoto(query, n - 1);
    return new ImageResponse(<PhotoSignSlide index={n} photoUrl={photoUrl} />, SIZE);
  }

  let element: React.ReactElement;
  if (n === 0) element = <CoverSlide />;
  else if (n >= 1 && n <= 7) element = <SignSlide index={n} />;
  else element = <CtaSlide />;

  return new ImageResponse(element, SIZE);
}
