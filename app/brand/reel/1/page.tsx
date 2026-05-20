/* Reel 1 — "What are you unwell about?" — hero typography reveal.
   9:16, ~15s loop. */
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  title: "Hyperfix — reel 1",
  robots: { index: false, follow: false },
};

const LIME = "#A855F7";
const LIME_DEEP = "#7CB205";
const INK = "#0A0A0A";
const PAPER = "#F4F4F4";
const DIM = "#9CA3AF";

export default function Reel1() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#3F3F46" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.92); }
          70%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.3); opacity: 0.6; }
        }
        .r1-lockup     { animation: fadeIn 0.6s ease-out 0.5s both; }
        .r1-l1         { animation: fadeIn 0.7s ease-out 2.0s both; }
        .r1-l2         { animation: popIn  0.7s cubic-bezier(.2,1.4,.4,1) 4.0s both; }
        .r1-l3         { animation: fadeIn 0.7s ease-out 6.0s both; }
        .r1-sub        { animation: fadeIn 0.8s ease-out 8.5s both; }
        .r1-cta        { animation: popIn  0.7s cubic-bezier(.2,1.4,.4,1) 10.5s both; }
        .r1-cursor     { animation: blink 0.9s steps(1) infinite; }
        .r1-pulse      { animation: pulseDot 1.4s ease-in-out infinite; }
      `}</style>
      <div
        id="reel"
        className={inter.className}
        style={{
          width: 1080,
          height: 1920,
          background: INK,
          color: PAPER,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* giant background numeral */}
        <span
          style={{
            position: "absolute",
            right: -40,
            bottom: -180,
            fontSize: 1300,
            fontWeight: 900,
            color: PAPER,
            opacity: 0.04,
            letterSpacing: -60,
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          47
        </span>

        {/* top lockup */}
        <div
          className="r1-lockup"
          style={{
            position: "absolute",
            top: 90,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <svg width={56} height={56} viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={INK} />
            <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={LIME} />
            <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={LIME_DEEP} />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>Hyperfix</span>
        </div>
        <div style={{ position: "absolute", top: 96, right: 80, display: "flex", alignItems: "center", gap: 12, color: DIM }}>
          <span
            className="r1-pulse"
            style={{ display: "block", width: 12, height: 12, borderRadius: 999, background: LIME }}
          />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
            live · waitlist
          </span>
        </div>

        {/* HEADLINE */}
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 80,
            right: 80,
            fontSize: 168,
            fontWeight: 900,
            letterSpacing: -10,
            lineHeight: 0.94,
          }}
        >
          <div className="r1-l1">What are you</div>
          <div style={{ marginTop: 14 }}>
            <span className="r1-l2" style={{ display: "inline-block", color: LIME }}>
              unwell
            </span>{" "}
            <span className="r1-l3" style={{ display: "inline-block" }}>about?</span>
            <span
              className="r1-cursor"
              style={{
                display: "inline-block",
                width: 26,
                height: 140,
                background: LIME,
                marginLeft: 14,
                verticalAlign: "-26px",
              }}
            />
          </div>
        </div>

        {/* SUBHEAD */}
        <div
          className="r1-sub"
          style={{
            position: "absolute",
            top: 1240,
            left: 80,
            right: 80,
            fontSize: 38,
            fontWeight: 500,
            color: DIM,
            lineHeight: 1.3,
            letterSpacing: -1,
          }}
        >
          A journal for the song on loop,
          <br />
          the fic you've re-read six times,
          <br />
          the character who rearranged your brain.
        </div>

        {/* CTA */}
        <div
          className="r1-cta"
          style={{
            position: "absolute",
            bottom: 160,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              background: LIME,
              color: INK,
              padding: "32px 48px",
              borderRadius: 999,
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: -1,
              boxShadow: `0 0 60px -10px ${LIME}aa`,
            }}
          >
            Join the waitlist →
          </div>
          <div style={{ textAlign: "right", color: DIM }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
              hyperfix.app
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
