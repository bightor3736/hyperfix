import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1350 };
const TOTAL = 6;

const BG = "#080808";
const INK = "#F4F4F4";
const INK_DIM = "rgba(244,244,244,0.45)";
const TEAL = "#5EEAD4";
const CARD_BG = "#101012";
const BORDER = "rgba(244,244,244,0.07)";

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
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}

function LogoLockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <GemMark size={52} />
      <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
        <span style={{ color: INK }}>hyper</span>
        <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
      </div>
    </div>
  );
}

function Dots({ current }: { current: number }) {
  const dots = [];
  for (let i = 1; i <= TOTAL; i++) {
    dots.push(
      <div
        key={i}
        style={{
          width: i === current ? 24 : 8,
          height: 8,
          borderRadius: 4,
          background: i === current ? TEAL : "rgba(244,244,244,0.18)",
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {dots}
    </div>
  );
}

function TopBar({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <LogoLockup />
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 15,
          letterSpacing: "0.18em",
          color: "rgba(244,244,244,0.3)",
          textTransform: "uppercase",
        }}
      >
        {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function Slide1() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        display: "flex",
        flexDirection: "column",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <TopBar n={1} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            letterSpacing: "0.28em",
            color: TEAL,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          a thread
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 130,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: INK,
          }}
        >
          <span>what is</span>
          <span style={{ color: TEAL }}>a hyper-</span>
          <span style={{ color: TEAL }}>fixation?</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span
          style={{
            fontSize: 24,
            color: INK_DIM,
            lineHeight: 1.45,
            maxWidth: 600,
            marginBottom: 48,
          }}
        >
          if you know, you know. if you don&apos;t, you probably know someone who does.
        </span>
        <Dots current={1} />
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        display: "flex",
        flexDirection: "column",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <TopBar n={2} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 15,
            letterSpacing: "0.22em",
            color: TEAL,
            textTransform: "uppercase",
            marginBottom: 56,
          }}
        >
          the reality check
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "36px 40px",
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
            }}
          >
            <span style={{ fontSize: 18, color: INK_DIM, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>
              normal people
            </span>
            <span style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              discover a new interest, enjoy it casually, move on
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "36px 40px",
              background: CARD_BG,
              border: `1.5px solid ${TEAL}`,
              borderRadius: 16,
            }}
          >
            <span style={{ fontSize: 18, color: TEAL, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>
              me
            </span>
            <span style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              restructure my entire life around it for 3 weeks then ghost it completely
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto", paddingTop: 40 }}>
        <Dots current={2} />
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        display: "flex",
        flexDirection: "column",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <TopBar n={3} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 128,
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.05em",
          }}
        >
          <span style={{ color: INK }}>your</span>
          <span style={{ color: INK }}>brain</span>
          <span style={{ color: TEAL }}>locks.</span>
          <span style={{ color: TEAL }}>on.</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
            paddingLeft: 28,
            borderLeft: `2px solid rgba(94,234,212,0.3)`,
            gap: 24,
          }}
        >
          <span style={{ fontSize: 28, color: INK_DIM, lineHeight: 1.4 }}>
            intrusive thoughts at 2am
          </span>
          <span style={{ fontSize: 28, color: INK_DIM, lineHeight: 1.4 }}>
            you bring it up unprompted
          </span>
          <span style={{ fontSize: 28, color: INK_DIM, lineHeight: 1.4 }}>
            you&apos;ve explained it to 4 people who didn&apos;t ask
          </span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto", paddingTop: 40 }}>
        <Dots current={3} />
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        display: "flex",
        flexDirection: "column",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <TopBar n={4} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 15,
            letterSpacing: "0.22em",
            color: "rgba(244,244,244,0.35)",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          common with ADHD + autism
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 116,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
          }}
        >
          <span style={{ color: INK }}>not a</span>
          <span style={{ color: INK }}>flaw.</span>
          <span style={{ color: TEAL }}>a feature.</span>
        </div>

        <span
          style={{
            fontSize: 28,
            color: INK_DIM,
            lineHeight: 1.45,
            maxWidth: 760,
            marginTop: 52,
          }}
        >
          your brain found signal in the noise and it&apos;s holding on for dear life. that&apos;s not broken — that&apos;s pattern recognition in overdrive.
        </span>
      </div>

      <div style={{ display: "flex", marginTop: "auto", paddingTop: 40 }}>
        <Dots current={4} />
      </div>
    </div>
  );
}

function Slide5() {
  const intensity = 0.72;
  const barWidth = Math.round(820 * intensity);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        display: "flex",
        flexDirection: "column",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <TopBar n={5} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 72 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 15,
            letterSpacing: "0.22em",
            color: TEAL,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          log it while it lasts
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            marginBottom: 56,
          }}
        >
          <span style={{ color: INK }}>track</span>
          <span style={{ color: INK }}>every</span>
          <span style={{ color: TEAL }}>one.</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            padding: "40px 44px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: INK, letterSpacing: "-0.03em" }}>Severance</span>
              <span style={{ fontSize: 18, color: INK_DIM, marginTop: 6, fontFamily: "monospace", letterSpacing: "0.08em" }}>TV SHOW</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span style={{ fontSize: 48, fontWeight: 900, color: TEAL, lineHeight: 1, letterSpacing: "-0.04em" }}>47</span>
              <span style={{ fontSize: 14, color: INK_DIM, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>days</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: INK_DIM, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>intensity</span>
              <span style={{ fontSize: 14, color: TEAL, letterSpacing: "0.12em", fontFamily: "monospace" }}>72%</span>
            </div>
            <div
              style={{
                display: "flex",
                height: 8,
                background: "rgba(244,244,244,0.08)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: barWidth,
                  height: "100%",
                  background: TEAL,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 18px",
                background: "rgba(94,234,212,0.12)",
                border: `1px solid rgba(94,234,212,0.25)`,
                borderRadius: 100,
              }}
            >
              <span style={{ fontSize: 14, color: TEAL, fontFamily: "monospace", letterSpacing: "0.08em" }}>active</span>
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 18px",
                background: "rgba(244,244,244,0.05)",
                border: `1px solid rgba(244,244,244,0.1)`,
                borderRadius: 100,
              }}
            >
              <span style={{ fontSize: 14, color: INK_DIM, fontFamily: "monospace", letterSpacing: "0.08em" }}>obsessed</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto", paddingTop: 40 }}>
        <Dots current={5} />
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <GemMark size={96} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 48,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: "0.3em",
              color: INK_DIM,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            link in bio
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.05em",
              textAlign: "center",
              fontFamily: "Georgia, serif",
            }}
          >
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: TEAL, fontStyle: "italic" }}>fix.app</span>
          </div>
        </div>

        <span
          style={{
            fontSize: 26,
            color: INK_DIM,
            textAlign: "center",
            maxWidth: 680,
            lineHeight: 1.45,
            marginTop: 52,
          }}
        >
          track every hyperfixation you&apos;ve ever had. build a graveyard for the ones that faded.
        </span>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            padding: "18px 40px",
            background: TEAL,
            borderRadius: 100,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: BG,
              letterSpacing: "0.04em",
            }}
          >
            free to use
          </span>
        </div>
      </div>

      <div style={{ display: "flex", position: "absolute", bottom: 72 }}>
        <Dots current={6} />
      </div>
    </div>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  let element: React.ReactElement;
  if (slide === 1) element = <Slide1 />;
  else if (slide === 2) element = <Slide2 />;
  else if (slide === 3) element = <Slide3 />;
  else if (slide === 4) element = <Slide4 />;
  else if (slide === 5) element = <Slide5 />;
  else element = <Slide6 />;

  return new ImageResponse(element, SIZE);
}
