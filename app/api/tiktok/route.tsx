import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const LIME = "#A855F7";
const INK = "#0A0A0A";
const PAPER = "#F4F4F4";
const DIM = "rgba(244,244,244,0.35)";
const SOFT = "rgba(244,244,244,0.55)";

// ─── Deck 1: Signs ───────────────────────────────────────────────────────────

type SignsSlide =
  | { type: "cover" }
  | { type: "sign"; n: string; headline: string; body: string }
  | { type: "outro" };

const signsSlides: SignsSlide[] = [
  { type: "cover" },
  {
    type: "sign", n: "01",
    headline: "you looked it up once.",
    body: "now you know everything. seventeen tabs, the subreddit, the 2019 thread. you have opinions you didn't ask for.",
  },
  {
    type: "sign", n: "02",
    headline: "you're recommending it to people who didn't ask.",
    body: "you brought it up at dinner. sent the link with no context. texted the same person twice. the evangelism phase.",
  },
  {
    type: "sign", n: "03",
    headline: "you've reorganised your schedule around it.",
    body: "stayed up late. woke up early. pushed work to later. it isn't a hobby anymore. it's infrastructure.",
  },
  {
    type: "sign", n: "04",
    headline: "you're using it as emotional regulation.",
    body: "stressed? you know what helps. anxious? there's a chapter for that. it isn't just interesting. it's functional.",
  },
  {
    type: "sign", n: "05",
    headline: "you have opinions about the discourse.",
    body: "casting decisions. interpretation disputes. authorial intent. you've thought about it more than once and reached the same conclusion.",
  },
  {
    type: "sign", n: "06",
    headline: "you've created something about it.",
    body: "a note. a playlist. a voice memo at midnight where you talk for seven minutes about a character's motivations.",
  },
  {
    type: "sign", n: "07",
    headline: "you know when it's fading.",
    body: "the tabs close. the schedule resets. you feel it lifting before it's gone. the post-fix crash is coming.",
  },
  { type: "outro" },
];

// ─── Deck 2: POV Arc ─────────────────────────────────────────────────────────

type PovSlide =
  | { type: "pov-cover" }
  | { type: "pov-day"; day: string; headline: string; body: string }
  | { type: "pov-outro" };

const povSlides: PovSlide[] = [
  { type: "pov-cover" },
  {
    type: "pov-day", day: "day 1.",
    headline: "you think it's just interesting.",
    body: "you watched one video. read one post. you didn't know yet. you just thought it was interesting.",
  },
  {
    type: "pov-day", day: "day 3.",
    headline: "you have seventeen tabs open.",
    body: "the wiki. the subreddit. that 2019 forum thread that answers everything. you're doing research like it's your job.",
  },
  {
    type: "pov-day", day: "day 7.",
    headline: "your schedule moved around it.",
    body: "not on purpose. it just happened. sleep got shorter. the thing got longer. priorities quietly reshuffled themselves.",
  },
  {
    type: "pov-day", day: "day 14.",
    headline: "you're telling everyone.",
    body: "sent the link to three people. brought it up unprompted. texted someone twice. they said 'cool.' you're still thinking about it.",
  },
  {
    type: "pov-day", day: "day 21.",
    headline: "it's your emotional support system now.",
    body: "stressed? you know what helps. bad day? there's a playlist for that. it stopped being a hobby. it's infrastructure.",
  },
  {
    type: "pov-day", day: "day 30.",
    headline: "you feel it fading before it's gone.",
    body: "the tabs are still open but you're not reading them. the feeling is different. you're already looking for the next one.",
  },
  { type: "pov-outro" },
];

// ─── Deck 1 renders ──────────────────────────────────────────────────────────

function CoverSlide({ total }: { total: number }) {
  return (
    <div style={{ width: W, height: H, background: INK, display: "flex", flexDirection: "column", padding: "120px 96px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -300, right: -300, width: 1000, height: 1000, background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 65%)", borderRadius: "50%", display: "flex" }} />
      <span style={{ fontSize: 32, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex", marginBottom: "auto" }}>hyperfix</span>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 80 }}>
        <span style={{ fontSize: 140, fontWeight: 900, color: PAPER, letterSpacing: "-0.05em", lineHeight: 0.88, display: "flex" }}>signs</span>
        <span style={{ fontSize: 140, fontWeight: 900, color: PAPER, letterSpacing: "-0.05em", lineHeight: 0.88, display: "flex" }}>you&apos;re</span>
        <span style={{ fontSize: 140, fontWeight: 900, fontStyle: "italic", color: LIME, letterSpacing: "-0.05em", lineHeight: 0.88, display: "flex" }}>in one.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 36, color: SOFT, lineHeight: 1.4, display: "flex" }}>the hyperfixation checklist. how many do you have right now?</span>
        <span style={{ fontSize: 26, color: DIM, letterSpacing: "0.04em", display: "flex" }}>1 of {total} · hyperfix.app</span>
      </div>
    </div>
  );
}

function SignSlide({ slide, index, total }: { slide: Extract<SignsSlide, { type: "sign" }>; index: number; total: number }) {
  return (
    <div style={{ width: W, height: H, background: INK, display: "flex", flexDirection: "column", padding: "120px 96px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -200, left: -200, width: 800, height: 800, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)", borderRadius: "50%", display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "auto" }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex" }}>hyperfix</span>
        <span style={{ fontSize: 26, color: DIM, letterSpacing: "0.04em", display: "flex" }}>{index + 1} of {total}</span>
      </div>
      <div style={{ display: "flex", background: LIME, color: INK, fontSize: 28, fontWeight: 900, padding: "12px 32px", borderRadius: 999, alignSelf: "flex-start", letterSpacing: "0.04em", marginBottom: 48 }}>
        sign {slide.n}
      </div>
      <div style={{ fontSize: 88, fontWeight: 900, color: PAPER, letterSpacing: "-0.04em", lineHeight: 0.92, marginBottom: 64, display: "flex", flexWrap: "wrap" }}>
        {slide.headline}
      </div>
      <div style={{ fontSize: 40, color: SOFT, lineHeight: 1.5, borderLeft: `4px solid ${LIME}`, paddingLeft: 32, display: "flex", flexWrap: "wrap", marginBottom: "auto" }}>
        {slide.body}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid rgba(244,244,244,0.08)", paddingTop: 40 }}>
        <span style={{ fontSize: 26, color: DIM, letterSpacing: "0.04em", display: "flex" }}>hyperfix.app · track your obsessions</span>
      </div>
    </div>
  );
}

function OutroSlide() {
  return (
    <div style={{ width: W, height: H, background: INK, display: "flex", flexDirection: "column", padding: "120px 96px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 1200, height: 1200, background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 60%)", borderRadius: "50%", display: "flex" }} />
      <span style={{ fontSize: 32, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex", marginBottom: "auto" }}>hyperfix</span>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 64 }}>
        <span style={{ fontSize: 110, fontWeight: 900, color: PAPER, letterSpacing: "-0.05em", lineHeight: 0.9, display: "flex" }}>track it.</span>
        <span style={{ fontSize: 110, fontWeight: 900, fontStyle: "italic", color: LIME, letterSpacing: "-0.05em", lineHeight: 0.9, display: "flex" }}>count it.</span>
        <span style={{ fontSize: 110, fontWeight: 900, color: PAPER, letterSpacing: "-0.05em", lineHeight: 0.9, display: "flex" }}>mourn it.</span>
      </div>
      <div style={{ fontSize: 38, color: SOFT, lineHeight: 1.5, marginBottom: 72, display: "flex", flexWrap: "wrap" }}>
        log your hyperfixation. watch the day counter go up. build your graveyard of obsessions.
      </div>
      <div style={{ display: "flex", background: LIME, color: INK, fontSize: 36, fontWeight: 900, padding: "24px 60px", borderRadius: 999, alignSelf: "flex-start", letterSpacing: "0.01em" }}>
        hyperfix.app — join free ↗
      </div>
    </div>
  );
}

// ─── Deck 2 renders ──────────────────────────────────────────────────────────

function PovCoverSlide({ total }: { total: number }) {
  return (
    <div style={{ width: W, height: H, background: INK, display: "flex", flexDirection: "column", padding: "120px 96px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 900, height: 900, background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)", borderRadius: "50%", display: "flex" }} />
      <div style={{ position: "absolute", bottom: -300, left: -200, width: 700, height: 700, background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)", borderRadius: "50%", display: "flex" }} />
      <span style={{ fontSize: 32, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex", marginBottom: "auto" }}>hyperfix</span>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 72 }}>
        <span style={{ fontSize: 96, fontWeight: 900, fontStyle: "italic", color: LIME, letterSpacing: "-0.04em", lineHeight: 1, display: "flex" }}>POV:</span>
        <span style={{ fontSize: 116, fontWeight: 900, color: PAPER, letterSpacing: "-0.05em", lineHeight: 0.9, display: "flex" }}>you just</span>
        <span style={{ fontSize: 116, fontWeight: 900, color: PAPER, letterSpacing: "-0.05em", lineHeight: 0.9, display: "flex" }}>found a</span>
        <span style={{ fontSize: 116, fontWeight: 900, fontStyle: "italic", color: LIME, letterSpacing: "-0.05em", lineHeight: 0.9, display: "flex" }}>new thing.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 38, color: SOFT, lineHeight: 1.4, display: "flex" }}>a 30-day arc you already know by heart. swipe.</span>
        <span style={{ fontSize: 26, color: DIM, letterSpacing: "0.04em", display: "flex" }}>1 of {total} · hyperfix.app</span>
      </div>
    </div>
  );
}

function PovDaySlide({ slide, index, total }: { slide: Extract<PovSlide, { type: "pov-day" }>; index: number; total: number }) {
  return (
    <div style={{ width: W, height: H, background: INK, display: "flex", flexDirection: "column", padding: "120px 96px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -180, right: -180, width: 700, height: 700, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)", borderRadius: "50%", display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "auto" }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex" }}>hyperfix</span>
        <span style={{ fontSize: 26, color: DIM, letterSpacing: "0.04em", display: "flex" }}>{index + 1} of {total}</span>
      </div>
      <div style={{ display: "flex", marginBottom: 56 }}>
        <span style={{ fontSize: 72, fontWeight: 900, fontStyle: "italic", color: LIME, letterSpacing: "-0.04em", lineHeight: 1, display: "flex" }}>{slide.day}</span>
      </div>
      <div style={{ fontSize: 90, fontWeight: 900, color: PAPER, letterSpacing: "-0.04em", lineHeight: 0.92, marginBottom: 72, display: "flex", flexWrap: "wrap" }}>
        {slide.headline}
      </div>
      <div style={{ fontSize: 42, color: SOFT, lineHeight: 1.5, display: "flex", flexWrap: "wrap", marginBottom: "auto" }}>
        {slide.body}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid rgba(244,244,244,0.08)", paddingTop: 40 }}>
        <span style={{ fontSize: 26, color: DIM, letterSpacing: "0.04em", display: "flex" }}>hyperfix.app · track your obsessions</span>
      </div>
    </div>
  );
}

function PovOutroSlide() {
  return (
    <div style={{ width: W, height: H, background: INK, display: "flex", flexDirection: "column", padding: "120px 96px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "40%", left: "50%", width: 1100, height: 1100, background: "radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 60%)", borderRadius: "50%", display: "flex" }} />
      <span style={{ fontSize: 32, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex", marginBottom: "auto" }}>hyperfix</span>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 48 }}>
        <span style={{ fontSize: 68, fontWeight: 900, color: SOFT, letterSpacing: "-0.03em", lineHeight: 1.1, display: "flex", flexWrap: "wrap", marginBottom: 40 }}>
          discovery → obsession → evangelist → fade → graveyard.
        </span>
        <span style={{ fontSize: 96, fontWeight: 900, color: PAPER, letterSpacing: "-0.04em", lineHeight: 0.92, display: "flex" }}>you do</span>
        <span style={{ fontSize: 96, fontWeight: 900, color: PAPER, letterSpacing: "-0.04em", lineHeight: 0.92, display: "flex" }}>this</span>
        <span style={{ fontSize: 96, fontWeight: 900, fontStyle: "italic", color: LIME, letterSpacing: "-0.04em", lineHeight: 0.92, display: "flex" }}>every time.</span>
      </div>
      <div style={{ fontSize: 40, color: SOFT, lineHeight: 1.5, marginBottom: 56, display: "flex", flexWrap: "wrap" }}>
        might as well track it. what&apos;s yours right now? ↓
      </div>
      <div style={{ display: "flex", background: LIME, color: INK, fontSize: 36, fontWeight: 900, padding: "24px 60px", borderRadius: 999, alignSelf: "flex-start", letterSpacing: "0.01em" }}>
        hyperfix.app — free to join ↗
      </div>
    </div>
  );
}

// ─── Deck 3: Gradient Editorial ──────────────────────────────────────────────

const gradSlides = [
  {
    bg: "#070B14",
    glow1: { color: "rgba(168,85,247,0.22)", x: "80%", y: "-10%" },
    glow2: { color: "rgba(59,130,246,0.12)", x: "-10%", y: "80%" },
    accent: LIME,
    label: "POV:",
    headline: ["you just", "found a", "new thing."],
    body: "you don't know it yet. but you're already gone.",
    tag: null,
  },
  {
    bg: "#0E0A04",
    glow1: { color: "rgba(251,146,60,0.22)", x: "70%", y: "10%" },
    glow2: { color: "rgba(234,88,12,0.1)", x: "0%", y: "90%" },
    accent: "#FB923C",
    label: "day 1.",
    headline: ["you thought", "it was just", "interesting."],
    body: "one video. one post. that's all it took.",
    tag: null,
  },
  {
    bg: "#07080F",
    glow1: { color: "rgba(99,102,241,0.25)", x: "75%", y: "5%" },
    glow2: { color: "rgba(67,56,202,0.12)", x: "-5%", y: "75%" },
    accent: "#818CF8",
    label: "day 3.",
    headline: ["seventeen", "tabs.", "still going."],
    body: "the wiki. the subreddit. the 2019 thread that answers everything.",
    tag: null,
  },
  {
    bg: "#0B0714",
    glow1: { color: "rgba(168,85,247,0.22)", x: "80%", y: "0%" },
    glow2: { color: "rgba(126,34,206,0.1)", x: "10%", y: "85%" },
    accent: "#C084FC",
    label: "day 7.",
    headline: ["your", "schedule", "just moved."],
    body: "sleep got shorter. the thing got longer. it wasn't a decision.",
    tag: null,
  },
  {
    bg: "#04100E",
    glow1: { color: "rgba(20,184,166,0.22)", x: "75%", y: "5%" },
    glow2: { color: "rgba(15,118,110,0.1)", x: "-5%", y: "80%" },
    accent: "#2DD4BF",
    label: "day 14.",
    headline: ["you're", "telling", "everyone."],
    body: "they said 'cool.' you texted them again anyway.",
    tag: null,
  },
  {
    bg: "#0E0609",
    glow1: { color: "rgba(236,72,153,0.22)", x: "80%", y: "5%" },
    glow2: { color: "rgba(190,24,93,0.1)", x: "0%", y: "80%" },
    accent: "#F472B6",
    label: "day 21.",
    headline: ["it's your", "emotional", "support now."],
    body: "stressed? you know what helps. bad day? there's a playlist for that.",
    tag: null,
  },
  {
    bg: "#090A0C",
    glow1: { color: "rgba(100,116,139,0.18)", x: "60%", y: "10%" },
    glow2: { color: "rgba(71,85,105,0.08)", x: "10%", y: "70%" },
    accent: "rgba(244,244,244,0.45)",
    label: "day 30.",
    headline: ["you felt it", "leaving", "before it left."],
    body: "the tabs are still open. you're not reading them. something shifted.",
    tag: null,
  },
  {
    bg: "#050F05",
    glow1: { color: "rgba(168,85,247,0.2)", x: "50%", y: "40%" },
    glow2: { color: "rgba(101,163,13,0.1)", x: "10%", y: "10%" },
    accent: LIME,
    label: null,
    headline: ["you do", "this every", "time."],
    body: "track the whole arc. what's yours right now? ↓",
    tag: "hyperfix.app — free",
  },
];

function GradSlide({ slide, index }: { slide: typeof gradSlides[0]; index: number }) {
  const total = gradSlides.length;
  const isOutro = index === total - 1;

  return (
    <div style={{ width: W, height: H, background: slide.bg, display: "flex", flexDirection: "column", padding: "110px 88px", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: slide.glow1.y, left: slide.glow1.x, width: 900, height: 900, background: `radial-gradient(circle, ${slide.glow1.color} 0%, transparent 65%)`, borderRadius: "50%", display: "flex", transform: "translate(-50%, -50%)" }} />
      <div style={{ position: "absolute", top: slide.glow2.y, left: slide.glow2.x, width: 700, height: 700, background: `radial-gradient(circle, ${slide.glow2.color} 0%, transparent 65%)`, borderRadius: "50%", display: "flex", transform: "translate(-50%, -50%)" }} />

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "auto" }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: LIME, letterSpacing: "-0.03em", display: "flex" }}>hyperfix</span>
        {!isOutro && (
          <span style={{ fontSize: 22, color: "rgba(244,244,244,0.25)", letterSpacing: "0.06em", fontFamily: "monospace", display: "flex" }}>
            {index + 1}/{total}
          </span>
        )}
      </div>

      {/* Label */}
      {slide.label && (
        <span style={{ fontSize: 72, fontWeight: 900, fontStyle: "italic", color: slide.accent, letterSpacing: "-0.04em", lineHeight: 1, display: "flex", marginBottom: 32 }}>
          {slide.label}
        </span>
      )}

      {/* Headline — one word/phrase per line */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 56 }}>
        {slide.headline.map((line, i) => (
          <span
            key={i}
            style={{
              fontSize: 128,
              fontWeight: 900,
              color: i === slide.headline.length - 1 && !isOutro ? slide.accent : PAPER,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              display: "flex",
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <span style={{ fontSize: 38, color: "rgba(244,244,244,0.6)", lineHeight: 1.45, display: "flex", flexWrap: "wrap" }}>
          {slide.body}
        </span>

        {/* Outro CTA */}
        {isOutro && (
          <div style={{ display: "flex", background: LIME, color: "#0A0A0A", fontSize: 34, fontWeight: 900, padding: "20px 52px", borderRadius: 999, alignSelf: "flex-start", letterSpacing: "0.01em" }}>
            hyperfix.app — free ↗
          </div>
        )}
      </div>

      {/* Bottom tag */}
      {!isOutro && (
        <div style={{ display: "flex", marginTop: "auto", paddingTop: 40, borderTop: "1px solid rgba(244,244,244,0.07)" }}>
          <span style={{ fontSize: 22, color: "rgba(244,244,244,0.2)", letterSpacing: "0.04em", fontFamily: "monospace", display: "flex" }}>
            hyperfix.app · track your obsessions
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deck = parseInt(searchParams.get("deck") ?? "1", 10);

  let content: React.ReactElement;
  let filename: string;

  if (deck === 3) {
    const total = gradSlides.length;
    const n = Math.max(1, Math.min(total, parseInt(searchParams.get("n") ?? "1", 10)));
    filename = `hyperfix-grad-${n}.png`;
    content = <GradSlide slide={gradSlides[n - 1]} index={n - 1} />;
  } else if (deck === 2) {
    const total = povSlides.length;
    const n = Math.max(1, Math.min(total, parseInt(searchParams.get("n") ?? "1", 10)));
    const slide = povSlides[n - 1];
    filename = `hyperfix-pov-${n}.png`;
    if (slide.type === "pov-cover") {
      content = <PovCoverSlide total={total} />;
    } else if (slide.type === "pov-outro") {
      content = <PovOutroSlide />;
    } else {
      content = <PovDaySlide slide={slide} index={n - 1} total={total} />;
    }
  } else {
    const total = signsSlides.length;
    const n = Math.max(1, Math.min(total, parseInt(searchParams.get("n") ?? "1", 10)));
    const slide = signsSlides[n - 1];
    filename = `hyperfix-signs-${n}.png`;
    if (slide.type === "cover") {
      content = <CoverSlide total={total} />;
    } else if (slide.type === "outro") {
      content = <OutroSlide />;
    } else {
      content = <SignSlide slide={slide} index={n - 1} total={total} />;
    }
  }

  const response = new ImageResponse(content, { width: W, height: H });
  response.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  response.headers.set("Content-Type", "image/png");
  return response;
}
