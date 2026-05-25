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

const TOTAL = 8;

const stages = [
  {
    n: "01",
    label: "the spark",
    h: "It catches.",
    sub: "one video. one sentence. one scene. you weren't looking for it. it found you. and now it's the only thing in the room.",
  },
  {
    n: "02",
    label: "the dive",
    h: "You go all the way in.",
    sub: "seventeen tabs. the wiki at 1am. the reddit thread from 2019. a documentary you didn't know existed. you are not done.",
  },
  {
    n: "03",
    label: "the integration",
    h: "It's your whole personality.",
    sub: "it's in your playlists. your notes app. your autocomplete. your recommendations changed. you've started a doc.",
  },
  {
    n: "04",
    label: "the peak",
    h: "You know everything.",
    sub: "you have opinions now. you've read the same thing three times and caught new details. you are the friend who knows.",
  },
  {
    n: "05",
    label: "the plateau",
    h: "The urgency shifted.",
    sub: "still here. still care. but you revisit instead of discover. it feels different. warmer. less frantic. settled.",
  },
  {
    n: "06",
    label: "the fade",
    h: "The tabs are still open.",
    sub: "the notes are still there. you haven't thought about it in days. something else is starting to feel interesting.",
  },
];

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
    <div style={{ display: "flex", border: `2px solid ${dark ? PAPER : INK}`, color: dark ? PAPER : INK, padding: "10px 20px", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
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

/* Progress bar — fills proportionally per stage */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div style={{ display: "flex", width: "100%", height: 4, background: "rgba(244,244,244,0.08)", marginTop: 40 }}>
      <div style={{ display: "flex", width: `${pct}%`, height: "100%", background: ACCENT }} />
    </div>
  );
}

function CoverSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex" }}>
        <Stamp>a hyperfixation tracker · 2026</Stamp>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 500 }}>
          <span>the</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>stages</span>
          <span>of a hyperfix.</span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 56 }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
          swipe →
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={1} />
      </div>
    </div>
  );
}

function StageSlide({ index }: { index: number }) {
  const stage = stages[index - 1];
  const bg = index % 2 === 1 ? PAPER : PAPER_DEEP;

  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      {/* HEADER: number tag + stage label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT }}>
            stage · {stage.n}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginTop: 10 }}>
            {stage.label}
          </span>
        </div>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 200, lineHeight: 0.78, fontWeight: 700, color: ACCENT, opacity: 0.10, letterSpacing: "-0.08em" }}>
          {stage.n}
        </span>
      </div>

      {/* Progress */}
      <ProgressBar step={index} total={stages.length} />

      {/* BODY */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ fontSize: 92, lineHeight: 1.0, letterSpacing: "-0.04em", fontWeight: 500, color: INK, maxWidth: 920 }}>
          {stage.h}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.45, fontStyle: "italic", color: INK_SOFT, maxWidth: 820, marginTop: 48, paddingLeft: 24, borderLeft: `2px solid ${ACCENT}` }}>
          {stage.sub}
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
    <div style={{ width: "100%", height: "100%", background: INK, color: PAPER, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex" }}>
        <Stamp dark>log every stage</Stamp>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, lineHeight: 0.92, letterSpacing: "-0.06em", fontWeight: 500 }}>
          <span>track the</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>whole arc.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
        <div style={{ fontSize: 30, color: "rgba(8,8,8,0.65)", maxWidth: 740, lineHeight: 1.4 }}>
          from the spark to the fade. every fix deserves a record.
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

const STAGE_QUERIES = [
  "spark fire discovery light",          // stage 1: the spark
  "research reading deep dive night",    // stage 2: the dive
  "personality identity self music",     // stage 3: the integration
  "knowledge expert confident focus",    // stage 4: the peak
  "warm cozy settled calm comfort",      // stage 5: the plateau
  "fading leaving window sunset ending", // stage 6: the fade
];

function PhotoStageSlide({ index, photoUrl }: { index: number; photoUrl: string | null }) {
  const stage = stages[index - 1];

  return (
    <div style={{ width: "100%", height: "100%", background: "#060606", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      )}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.78) 100%)", display: "flex" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT }}>stage · {stage.n}</span>
            <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginTop: 10 }}>{stage.label}</span>
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 200, lineHeight: 0.78, fontWeight: 700, color: ACCENT, opacity: 0.15, letterSpacing: "-0.08em" }}>{stage.n}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 32 }}>
          <div style={{ width: 48, height: 4, background: ACCENT, borderRadius: 2, display: "flex" }} />
          <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 600, color: INK, maxWidth: 920 }}>{stage.h}</div>
          <div style={{ fontSize: 28, lineHeight: 1.45, fontStyle: "italic", color: "rgba(244,244,244,0.6)", maxWidth: 820, paddingLeft: 24, borderLeft: `2px solid ${ACCENT}` }}>{stage.sub}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 36, letterSpacing: "-0.05em", fontWeight: 600, lineHeight: 1, color: INK }}>
              <span>hyper</span><span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED, alignSelf: "flex-end" }}>{String(index + 1).padStart(2, "0")} / {String(8).padStart(2, "0")}</span>
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

  if (usePhoto && n >= 1 && n <= 6) {
    const query = STAGE_QUERIES[n - 1] ?? "focus obsession";
    const photoUrl = await fetchPexelsPhoto(query, n - 1);
    return new ImageResponse(<PhotoStageSlide index={n} photoUrl={photoUrl} />, SIZE);
  }

  let element: React.ReactElement;
  if (n === 0) element = <CoverSlide />;
  else if (n >= 1 && n <= 6) element = <StageSlide index={n} />;
  else element = <CtaSlide />;

  return new ImageResponse(element, SIZE);
}
