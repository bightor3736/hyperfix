import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  title: "Hyperfix — Reddit photo post",
  robots: { index: false, follow: false },
};

const TEAL   = "#5EEAD4";
const INK    = "var(--bg)";
const CARD   = "var(--bg)";
const PAPER  = "#F4F4F4";
const DIM    = "rgba(244,244,244,0.38)";
const FAINT  = "rgba(244,244,244,0.06)";
const DIMMER = "rgba(244,244,244,0.13)";

const ACTIVE = [
  { title: "Jujutsu Kaisen",   cat: "anime",  days: 43, dots: 9 },
  { title: "Chappell Roan",    cat: "music",  days: 71, dots: 8 },
  { title: "The Last of Us",   cat: "show",   days: 19, dots: 7 },
];

const BURIED = [
  { title: "One Direction",                cat: "music",    days: 847, year: "2012 – 2015" },
  { title: "Hamilton",                     cat: "musical",  days: 203, year: "2016" },
  { title: "BBC Sherlock",                 cat: "show",     days: 156, year: "2017" },
  { title: "Twilight (all of it)",         cat: "film",     days: 94,  year: "2018" },
  { title: "Avatar: The Last Airbender",  cat: "show",     days: 67,  year: "2020" },
  { title: "Mitski discography",           cat: "music",    days: 112, year: "2022" },
];

function IntensityDots({ filled, total = 10 }: { filled: number; total?: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: i < filled ? TEAL : DIMMER,
          }}
        />
      ))}
    </div>
  );
}

export default function RedditPost2() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#2A2A2E", padding: 40 }}
    >
      {/* phone frame */}
      <div
        style={{
          width: 430,
          background: "#111113",
          borderRadius: 48,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {/* status bar */}
        <div
          style={{
            height: 52,
            background: INK,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: PAPER, fontFamily: inter.className }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 3 }}>
              {[3, 4, 5].map(h => <div key={h} style={{ width: 3, height: h, background: PAPER, borderRadius: 1 }} />)}
            </div>
            <div style={{ width: 15, height: 11, border: `1.5px solid ${PAPER}`, borderRadius: 2, position: "relative" }}>
              <div style={{ position: "absolute", right: -4, top: "50%", width: 2, height: 5, background: PAPER, borderRadius: 1, transform: "translateY(-50%)" }} />
              <div style={{ width: "70%", height: "100%", background: PAPER, borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* app header */}
        <div
          style={{
            background: INK,
            padding: "12px 24px 16px",
            borderBottom: `1px solid ${FAINT}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
          className={inter.className}
        >
          <svg width="28" height="28" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="12" fill={CARD} />
            <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
            <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
          </svg>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: PAPER }}>
            Hyperfix
          </span>
        </div>

        {/* scroll content */}
        <div style={{ background: INK }} className={inter.className}>

          {/* greeting */}
          <div style={{ padding: "20px 24px 4px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: PAPER }}>
              hey, you 👋
            </div>
            <div style={{ fontSize: 13, color: DIM, marginTop: 2 }}>
              3 active · 6 in the graveyard
            </div>
          </div>

          {/* active section */}
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: DIM,
              marginBottom: 10,
              fontFamily: "monospace",
            }}>
              Active
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACTIVE.map((fix) => (
                <div
                  key={fix.title}
                  style={{
                    background: CARD,
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: `1px solid ${FAINT}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: PAPER, letterSpacing: "-0.02em" }}>
                        {fix.title}
                      </div>
                      <div style={{ fontSize: 11, color: DIM, marginTop: 2, fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {fix.cat}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: TEAL, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        {fix.days}
                      </div>
                      <div style={{ fontSize: 10, color: DIM, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        days
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <IntensityDots filled={fix.dots} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* graveyard section */}
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: DIM,
              marginBottom: 10,
              fontFamily: "monospace",
            }}>
              Graveyard
            </div>

            <div style={{
              background: CARD,
              borderRadius: 14,
              border: `1px solid ${FAINT}`,
              overflow: "hidden",
            }}>
              {BURIED.map((fix, i) => (
                <div
                  key={fix.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 16px",
                    borderBottom: i < BURIED.length - 1 ? `1px solid ${FAINT}` : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14 }}>🪦</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: DIM, letterSpacing: "-0.01em" }}>
                        {fix.title}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(244,244,244,0.2)", marginTop: 1, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                        {fix.cat} · {fix.year}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(244,244,244,0.22)", letterSpacing: "-0.02em" }}>
                      {fix.days}d
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* bottom padding */}
          <div style={{ height: 36 }} />
        </div>

        {/* home indicator */}
        <div style={{
          background: INK,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: 120, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 999 }} />
        </div>
      </div>
    </main>
  );
}
