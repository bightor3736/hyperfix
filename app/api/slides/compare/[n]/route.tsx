import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const TOTAL = 8;

const BG = "#080808";
const BG2 = "#0C0C0E";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.42)";
const DIM2 = "rgba(244,244,244,0.18)";
const TEAL = "#5EEAD4";
const RED = "#F87171";
const BORDER = "rgba(244,244,244,0.06)";

function GemMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="15" fill="#0A0B0D" />
      <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
      <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
      <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
      <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
      <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
      <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function TopBar({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <GemMark size={52} />
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
          <span style={{ color: INK }}>hyper</span>
          <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.18em", color: "rgba(244,244,244,0.25)", textTransform: "uppercase" }}>
        {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function Dots({ current }: { current: number }) {
  const dots = [];
  for (let i = 1; i <= TOTAL; i++) {
    dots.push(
      <div key={i} style={{
        width: i === current ? 28 : 7,
        height: 7,
        borderRadius: 4,
        background: i === current ? TEAL : "rgba(244,244,244,0.15)",
      }} />
    );
  }
  return <div style={{ display: "flex", gap: 7, alignItems: "center" }}>{dots}</div>;
}

function GhostText({ text }: { text: string }) {
  return (
    <div style={{
      position: "absolute", right: -40, bottom: 80,
      fontFamily: "sans-serif", fontSize: 340, fontWeight: 900,
      lineHeight: 1, color: TEAL, opacity: 0.035, letterSpacing: -20,
      userSelect: "none",
    }}>{text}</div>
  );
}

function Verdict({ bad }: { bad: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 22px",
      background: bad ? "rgba(248,113,113,0.08)" : "rgba(94,234,212,0.08)",
      border: `1px solid ${bad ? "rgba(248,113,113,0.25)" : "rgba(94,234,212,0.25)"}`,
      borderRadius: 100,
      alignSelf: "flex-start",
    }}>
      <div style={{ display: "flex", width: 8, height: 8, borderRadius: 4, background: bad ? RED : TEAL, flexShrink: 0 }} />
      <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: bad ? RED : TEAL }}>
        {bad ? "not quite" : "perfect"}
      </span>
    </div>
  );
}

// ─── slide 1 · cover ─────────────────────────────────────────────────
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 900, background: "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(94,234,212,0.10) 0%, transparent 70%)", display: "flex" }} />
      <TopBar n={1} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ display: "flex", padding: "12px 24px", border: "1px solid rgba(94,234,212,0.3)", borderRadius: 100, alignSelf: "flex-start", marginBottom: 60 }}>
          <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>
            honest review
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 80 }}>
          <span style={{ color: INK }}>every way</span>
          <span style={{ color: INK }}>to track</span>
          <span style={{ color: INK }}>your</span>
          <span style={{ color: TEAL }}>hyper-</span>
          <span style={{ color: TEAL }}>fixations</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {["notes app", "spreadsheet", "notion", "physical journal", "telling everyone", "not at all"].map((method, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 8, height: 8, borderRadius: 4, background: "rgba(244,244,244,0.2)", flexShrink: 0 }} />
              <span style={{ fontSize: 30, color: DIM, fontWeight: 500, letterSpacing: "-0.01em" }}>{method}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 28, color: DIM2, lineHeight: 1.45, maxWidth: 760, marginBottom: 64 }}>
          we tested all of them. spoiler: one wins by a lot.
        </span>
        <Dots current={1} />
      </div>
    </div>
  );
}

// ─── method slide template ────────────────────────────────────────────
function MethodSlide({
  n, ghostText, badge, title, subtitle, body, detail, verdict, bg = BG,
}: {
  n: number;
  ghostText: string;
  badge: string;
  title: string[];
  subtitle: string;
  body: string;
  detail?: string;
  verdict: boolean;
  bg?: string;
}) {
  return (
    <div style={{ width: W, height: H, background: bg, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostText text={ghostText} />
      <TopBar n={n} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <span style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,244,244,0.3)" }}>
            {badge}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 100, fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.05em", marginBottom: 36 }}>
          {title.map((line, i) => (
            <span key={i} style={{ color: INK }}>{line}</span>
          ))}
        </div>

        <div style={{ display: "flex", marginBottom: 56 }}>
          <Verdict bad={verdict} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", borderLeft: "3px solid rgba(244,244,244,0.08)", paddingLeft: 40, gap: 28, marginBottom: 56 }}>
          <span style={{ fontSize: 44, fontWeight: 600, color: INK, lineHeight: 1.28, letterSpacing: "-0.02em" }}>{body}</span>
          {detail && (
            <span style={{ fontSize: 34, fontWeight: 500, color: DIM, lineHeight: 1.35, letterSpacing: "-0.01em" }}>{detail}</span>
          )}
        </div>

        <div style={{ display: "flex", padding: "28px 40px", background: BORDER, border: "1px solid rgba(244,244,244,0.06)", borderRadius: 20 }}>
          <span style={{ fontSize: 30, fontWeight: 600, color: "rgba(244,244,244,0.35)", lineHeight: 1.35, fontStyle: "italic" }}>{subtitle}</span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={n} />
      </div>
    </div>
  );
}

// ─── slide 8 · cta ───────────────────────────────────────────────────
function Slide8() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(94,234,212,0.08) 0%, transparent 65%)", display: "flex" }} />
      <TopBar n={8} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ display: "flex", padding: "12px 24px", border: "1px solid rgba(94,234,212,0.3)", borderRadius: 100, alignSelf: "flex-start", marginBottom: 48 }}>
          <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>
            the winner
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 60 }}>
          <span style={{ color: INK }}>built for</span>
          <span style={{ color: INK }}>exactly</span>
          <span style={{ color: TEAL }}>this.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 64 }}>
          {[
            "name the fixation, give it a start date",
            "rate your intensity from 1 to 10",
            "log notes before your brain moves on",
            "watch it fade in real time",
            "keep a graveyard of every obsession",
            "built by someone who gets it",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 32, fontWeight: 600, color: INK, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <GemMark size={52} />
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
            <span style={{ color: DIM }}>.app</span>
          </div>
        </div>
        <div style={{ display: "flex", padding: "20px 44px", background: TEAL, borderRadius: 100, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: BG }}>free to use · link in bio</span>
        </div>
        <Dots current={8} />
      </div>
    </div>
  );
}

// ─── route ───────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  const methods = [
    {
      ghostText: "notes",
      badge: "method 01 · notes app",
      title: ["the notes", "app."],
      body: "47 untitled notes. one of them is definitely about your fixation. good luck finding it.",
      detail: "works for the first 10 minutes. then it becomes a graveyard of half-finished thoughts.",
      subtitle: "\"note to self: find that note i wrote about that thing\"",
      verdict: true,
      bg: BG2,
    },
    {
      ghostText: "xls",
      badge: "method 02 · spreadsheet",
      title: ["the spread-", "sheet."],
      body: "you spent 6 hours designing the perfect tracking system. columns for everything. you used it twice.",
      detail: "by week two the fixation is gone and the spreadsheet is still open in another tab.",
      subtitle: "\"i'll fill it in later\" — you, never",
      verdict: true,
      bg: BG,
    },
    {
      ghostText: "ntn",
      badge: "method 03 · notion",
      title: ["notion."],
      body: "same as the spreadsheet but you watched 3 YouTube tutorials first and the database has 9 views.",
      detail: "the template looks incredible. the content is one row from 5 months ago.",
      subtitle: "\"i just need to set up the linked database first\"",
      verdict: true,
      bg: BG2,
    },
    {
      ghostText: "jrnl",
      badge: "method 04 · physical journal",
      title: ["the", "journal."],
      body: "beautiful. tactile. gone. either you lost it, the fixation ended before you finished the page, or both.",
      detail: "there is no ctrl+f for paper. the entry from march is in a different notebook.",
      subtitle: "\"i definitely wrote this down somewhere\"",
      verdict: true,
      bg: BG,
    },
    {
      ghostText: "ppl",
      badge: "method 05 · telling everyone",
      title: ["telling", "everyone."],
      body: "technically a form of logging. very high bandwidth. your friends have started to not pick up.",
      detail: "even the ones who love you only want to hear about competitive yo-yo so many times.",
      subtitle: "\"so anyway, about that thing i was telling you about\"",
      verdict: true,
      bg: BG2,
    },
    {
      ghostText: "???",
      badge: "method 06 · not tracking it",
      title: ["not", "tracking", "it."],
      body: "the most popular method. then it's over, you can't remember the name, the details are gone.",
      detail: "you know you cared this much. you just can't prove it. not to anyone. not even yourself.",
      subtitle: "\"i was really into something in april. what was it\"",
      verdict: true,
      bg: BG,
    },
  ];

  let el: React.ReactElement;
  if (slide === 1) el = <Slide1 />;
  else if (slide >= 2 && slide <= 7) {
    const m = methods[slide - 2];
    el = (
      <MethodSlide
        n={slide}
        ghostText={m.ghostText}
        badge={m.badge}
        title={m.title}
        body={m.body}
        detail={m.detail}
        subtitle={m.subtitle}
        verdict={m.verdict}
        bg={m.bg}
      />
    );
  } else el = <Slide8 />;

  return new ImageResponse(el, { width: W, height: H });
}
