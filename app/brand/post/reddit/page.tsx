import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  title: "Hyperfix — Reddit post",
  robots: { index: false, follow: false },
};

const TEAL  = "#5EEAD4";
const INK   = "#070708";
const CARD  = "#0F1011";
const PAPER = "#F4F4F4";
const DIM   = "rgba(244,244,244,0.38)";
const FAINT = "rgba(244,244,244,0.06)";

const STAGES = [
  {
    n: "01",
    title: "i just think it's interesting.",
    sub: "totally normal. completely fine.",
    dim: true,
  },
  {
    n: "02",
    title: "i know everything about this.",
    sub: "watched every interview. read every wiki page.",
    dim: true,
  },
  {
    n: "03",
    title: "my entire personality now.",
    sub: "you HAVE to watch/read/listen to this.",
    dim: false,
    teal: false,
  },
  {
    n: "04",
    title: "i can't explain why i'm crying.",
    sub: "it just means so much to me okay.",
    dim: false,
    teal: false,
  },
  {
    n: "05",
    title: "it's over and i'm in mourning.",
    sub: "nothing will ever be this good again.",
    dim: false,
    teal: true,
  },
];

export default function RedditPost() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#3F3F46", padding: 40 }}
    >
      <div
        id="post"
        className={inter.className}
        style={{
          width: 1080,
          height: 1080,
          background: INK,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px 64px",
        }}
      >
        {/* ambient bloom */}
        <div style={{
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${TEAL}12 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 56,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="36" height="36" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="12" fill={CARD} />
              <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
              <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
            </svg>
            <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", color: PAPER }}>
              Hyperfix
            </span>
          </div>
          <span style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: DIM,
            fontFamily: "monospace",
          }}>
            the 5 stages
          </span>
        </div>

        {/* headline */}
        <div style={{ marginBottom: 44 }}>
          <span style={{
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: PAPER,
          }}>
            every hyperfix,{" "}
            <span style={{ color: TEAL }}>every time.</span>
          </span>
        </div>

        {/* stages list */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 0 }}>
          {STAGES.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                padding: "20px 0",
                borderBottom: i < STAGES.length - 1 ? `1px solid ${FAINT}` : "none",
              }}
            >
              {/* number */}
              <span style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: s.teal ? TEAL : DIM,
                fontFamily: "monospace",
                minWidth: 28,
                opacity: s.dim ? 0.5 : 1,
              }}>
                {s.n}
              </span>

              {/* left bar */}
              <div style={{
                width: 3,
                height: 52,
                borderRadius: 999,
                background: s.teal ? TEAL : s.dim ? "rgba(244,244,244,0.1)" : "rgba(244,244,244,0.2)",
                flexShrink: 0,
              }} />

              {/* text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: s.dim ? DIM : s.teal ? TEAL : PAPER,
                  lineHeight: 1.1,
                }}>
                  {s.title}
                </span>
                <span style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "rgba(244,244,244,0.25)",
                  letterSpacing: "-0.01em",
                }}>
                  {s.sub}
                </span>
              </div>

              {/* stage indicator dots */}
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: j <= i
                        ? s.teal
                          ? TEAL
                          : s.dim
                            ? "rgba(244,244,244,0.2)"
                            : "rgba(244,244,244,0.55)"
                        : "rgba(244,244,244,0.06)",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 32,
          paddingTop: 24,
          borderTop: `1px solid ${FAINT}`,
        }}>
          <span style={{
            fontSize: 16,
            color: DIM,
            letterSpacing: "-0.01em",
          }}>
            log it. count it. mourn it.
          </span>
          <span style={{
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: TEAL,
          }}>
            hyperfix.app
          </span>
        </div>
      </div>
    </main>
  );
}
