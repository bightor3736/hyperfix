import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD Slides",
  robots: { index: false, follow: false },
};

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-display",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const TEAL = "#5EEAD4";
const PINK = "#F472B6";
const ORANGE = "#FB923C";
const BG = "#070708";
const PHONE_BG = "#0D0F10";
const CARD = "#141618";

// ── Logo mark ──────────────────────────────────────────────────────────────

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#0F1011" />
      <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
      <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
    </svg>
  );
}

// ── Phone frame ─────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 400,
        height: 800,
        background: PHONE_BG,
        borderRadius: 54,
        border: "2.5px solid rgba(255,255,255,0.14)",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        boxShadow:
          "0 30px 100px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.09) inset",
      }}
    >
      {/* Dynamic island */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 110,
          height: 30,
          background: "#000",
          borderRadius: 22,
          zIndex: 20,
        }}
      />
      {/* Status bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 26px 8px",
          zIndex: 15,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          9:41
        </span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="rgba(255,255,255,0.6)">
            <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
            <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.5" />
            <rect x="9" y="2.5" width="2.5" height="8.5" rx="0.5" />
            <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" />
          </svg>
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="22"
              height="11"
              rx="3"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.2"
            />
            <rect x="22.5" y="3.5" width="3" height="5" rx="1.2" fill="rgba(255,255,255,0.4)" />
            <rect x="2" y="2" width="18" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
      </div>
      {/* Screen content */}
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, bottom: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ── Brain mascot ─────────────────────────────────────────────────────────────

function Brain({
  mood = "happy",
  accent = TEAL,
  width = 280,
}: {
  mood?: "happy" | "excited" | "sad" | "chill";
  accent?: string;
  width?: number;
}) {
  const h = Math.round(width * 1.18);
  return (
    <svg width={width} height={h} viewBox="0 0 280 330" fill="none">
      {/* Glow behind */}
      <ellipse cx="140" cy="150" rx="120" ry="108" fill={accent} opacity="0.07" />

      {/* Body blob */}
      <path
        d="M140 52 C215 52 245 95 245 152 C245 210 210 248 140 248 C70 248 35 210 35 152 C35 95 65 52 140 52Z"
        fill="#131B1A"
        stroke={accent}
        strokeWidth="2.8"
      />

      {/* Top brain bumps */}
      <path
        d="M88 75 Q108 50 128 68"
        stroke={accent}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M152 68 Q172 50 192 75"
        stroke={accent}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M140 60 L140 82" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />

      {/* Brain fold lines */}
      <path
        d="M62 122 Q101 104 140 120 Q179 136 218 122"
        stroke={accent}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M57 160 Q100 143 140 160 Q180 177 223 160"
        stroke={accent}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eyes */}
      <circle cx="110" cy="170" r="15" fill="white" />
      <circle cx={mood === "chill" ? 113 : 112} cy="172" r="9.5" fill="#070708" />
      <circle cx={mood === "chill" ? 115 : 114} cy="169" r="3.5" fill="white" />

      <circle cx="170" cy="170" r="15" fill="white" />
      <circle cx={mood === "chill" ? 173 : 172} cy="172" r="9.5" fill="#070708" />
      <circle cx={mood === "chill" ? 175 : 174} cy="169" r="3.5" fill="white" />

      {/* Chill squint overlay */}
      {mood === "chill" && (
        <>
          <rect x="97" y="172" width="26" height="8" rx="4" fill="#131B1A" />
          <rect x="157" y="172" width="26" height="8" rx="4" fill="#131B1A" />
        </>
      )}

      {/* Mouth */}
      {mood === "happy" && (
        <path
          d="M110 198 Q140 218 170 198"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === "excited" && (
        <>
          <ellipse cx="140" cy="204" rx="21" ry="14" fill="white" opacity="0.95" />
          <ellipse cx="140" cy="207" rx="14" ry="9" fill="#070708" />
          <text x="224" y="88" fontSize="30" fill={accent}>
            ✦
          </text>
          <text x="24" y="94" fontSize="24" fill={accent}>
            ✦
          </text>
          <text x="236" y="188" fontSize="20" fill={accent}>
            ✦
          </text>
          <text x="16" y="192" fontSize="16" fill={accent}>
            ✦
          </text>
        </>
      )}
      {mood === "sad" && (
        <>
          <path
            d="M110 208 Q140 194 170 208"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="116" cy="192" rx="5" ry="7" fill="#60A5FA" opacity="0.75" />
        </>
      )}
      {mood === "chill" && (
        <path
          d="M118 200 Q140 214 162 200"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Arms */}
      <rect x="12" y="135" width="26" height="60" rx="13" fill="#131B1A" stroke={accent} strokeWidth="2.2" />
      <rect x="242" y="135" width="26" height="60" rx="13" fill="#131B1A" stroke={accent} strokeWidth="2.2" />

      {/* Legs */}
      <rect x="89" y="240" width="40" height="60" rx="20" fill="#131B1A" stroke={accent} strokeWidth="2.2" />
      <rect x="151" y="240" width="40" height="60" rx="20" fill="#131B1A" stroke={accent} strokeWidth="2.2" />
    </svg>
  );
}

// ── Phone screen mockups ─────────────────────────────────────────────────────

function LogScreen() {
  const cats = ["song", "show", "fanfic", "film", "game"];
  return (
    <div
      style={{
        padding: "16px 20px",
        fontFamily: "var(--font-sans)",
        color: "#F4F4F4",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <LogoMark size={24} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          hyperfix
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginBottom: 18,
          lineHeight: 1.2,
        }}
      >
        What&apos;s consuming you?
      </p>
      {/* Title field */}
      <div
        style={{
          background: CARD,
          border: `1.5px solid rgba(94,234,212,0.38)`,
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "rgba(244,244,244,0.38)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          title
        </p>
        <p style={{ fontSize: 16, fontWeight: 500 }}>Severance s2</p>
      </div>
      {/* Category pills */}
      <p
        style={{
          fontSize: 11,
          color: "rgba(244,244,244,0.38)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}
      >
        category
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        {cats.map((c) => (
          <span
            key={c}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "5px 13px",
              borderRadius: 999,
              background:
                c === "show" ? "rgba(94,234,212,0.14)" : "rgba(255,255,255,0.05)",
              border:
                c === "show"
                  ? "1px solid rgba(94,234,212,0.42)"
                  : "1px solid rgba(255,255,255,0.08)",
              color: c === "show" ? TEAL : "rgba(244,244,244,0.48)",
            }}
          >
            {c}
          </span>
        ))}
      </div>
      {/* Intensity mini */}
      <div
        style={{
          background: CARD,
          borderRadius: 12,
          padding: "11px 14px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 7,
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(244,244,244,0.32)" }}>mild</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>7 / 10</span>
          <span style={{ fontSize: 10, color: "rgba(244,244,244,0.32)" }}>send help</span>
        </div>
        <div
          style={{
            height: 7,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "70%",
              height: "100%",
              background: `linear-gradient(90deg, ${TEAL}, #F59E0B)`,
              borderRadius: 999,
            }}
          />
        </div>
      </div>
      {/* CTA */}
      <div
        style={{
          background: TEAL,
          borderRadius: 14,
          padding: "14px 0",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            fontWeight: 700,
            color: "#0A1F1C",
          }}
        >
          Start the count →
        </span>
      </div>
    </div>
  );
}

function DayCounterScreen() {
  return (
    <div
      style={{ padding: "14px 20px", fontFamily: "var(--font-sans)", color: "#F4F4F4" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <LogoMark size={24} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          hyperfix
        </span>
      </div>
      <div
        style={{
          background: CARD,
          borderRadius: 18,
          padding: "18px 18px",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              background: "rgba(244,114,182,0.12)",
              border: "1px solid rgba(244,114,182,0.3)",
              color: PINK,
            }}
          >
            music
          </span>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              background: "rgba(94,234,212,0.10)",
              border: "1px solid rgba(94,234,212,0.28)",
              color: TEAL,
            }}
          >
            active
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            marginBottom: 16,
          }}
        >
          Chappell Roan
        </p>
        <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 88,
              fontWeight: 700,
              color: TEAL,
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            88
          </p>
          <p
            style={{
              fontSize: 11,
              color: "rgba(244,244,244,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginTop: 6,
            }}
          >
            days and counting
          </p>
        </div>
      </div>
      {/* Heatmap dots */}
      <div
        style={{
          background: CARD,
          borderRadius: 14,
          padding: "13px 16px",
          marginBottom: 10,
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: "rgba(244,244,244,0.38)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          check-in heatmap
        </p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background:
                  i < 38
                    ? i % 5 === 0
                      ? "rgba(94,234,212,0.28)"
                      : "rgba(94,234,212,0.58)"
                    : "rgba(94,234,212,0.12)",
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          background: "rgba(94,234,212,0.09)",
          border: "1px solid rgba(94,234,212,0.26)",
          borderRadius: 12,
          padding: "11px 0",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: TEAL }}>
          ✓ Checked in today
        </span>
      </div>
    </div>
  );
}

function IntensityScreen() {
  return (
    <div
      style={{ padding: "14px 20px", fontFamily: "var(--font-sans)", color: "#F4F4F4" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <LogoMark size={24} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          hyperfix
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginBottom: 20,
          lineHeight: 1.2,
        }}
      >
        How bad is it today?
      </p>
      {/* Big number */}
      <div
        style={{
          background: CARD,
          borderRadius: 22,
          padding: "22px 18px 18px",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 96,
              fontWeight: 700,
              color: ORANGE,
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            9
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 38,
              fontWeight: 600,
              color: "rgba(244,244,244,0.28)",
            }}
          >
            /10
          </span>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: ORANGE,
            background: "rgba(251,146,60,0.12)",
            border: "1px solid rgba(251,146,60,0.32)",
            borderRadius: 999,
            padding: "4px 14px",
          }}
        >
          send help
        </span>
      </div>
      {/* Slider */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(244,244,244,0.32)" }}>1 · mild</span>
          <span style={{ fontSize: 10, color: "rgba(244,244,244,0.32)" }}>
            10 · send help
          </span>
        </div>
        <div
          style={{
            height: 10,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 999,
            position: "relative",
          }}
        >
          <div
            style={{
              width: "90%",
              height: "100%",
              background:
                "linear-gradient(90deg, #22C55E 0%, #EAB308 55%, #EF4444 100%)",
              borderRadius: 999,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "90%",
              transform: "translate(-50%,-50%)",
              width: 22,
              height: 22,
              background: ORANGE,
              borderRadius: 999,
              border: "2.5px solid white",
              boxShadow: "0 2px 12px rgba(251,146,60,0.7)",
            }}
          />
        </div>
      </div>
      {/* Weekly bar chart */}
      <div
        style={{ background: CARD, borderRadius: 14, padding: "13px 16px" }}
      >
        <p
          style={{
            fontSize: 10,
            color: "rgba(244,244,244,0.38)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          this week
        </p>
        <div
          style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 50 }}
        >
          {[5, 7, 7, 8, 8, 9, 9].map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${v * 5}px`,
                background:
                  i === 6
                    ? ORANGE
                    : i >= 4
                    ? "rgba(251,146,60,0.5)"
                    : "rgba(251,146,60,0.25)",
                borderRadius: "4px 4px 2px 2px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EulogyScreen() {
  return (
    <div
      style={{ padding: "14px 20px", fontFamily: "var(--font-sans)", color: "#F4F4F4" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <LogoMark size={24} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          hyperfix
        </span>
      </div>
      {/* Fix tile */}
      <div
        style={{
          background: CARD,
          borderRadius: 14,
          padding: "13px 16px",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", gap: 7, marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              background: "rgba(251,146,60,0.12)",
              border: "1px solid rgba(251,146,60,0.3)",
              color: ORANGE,
            }}
          >
            book
          </span>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(244,244,244,0.45)",
            }}
          >
            day 47
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Normal People
        </p>
      </div>
      {/* Eulogy modal */}
      <div
        style={{
          background: CARD,
          borderRadius: 20,
          padding: "18px 18px",
          border: "1px solid rgba(244,114,182,0.22)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 18 }}>🪦</span>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Write the eulogy
          </p>
        </div>
        <div
          style={{
            background: "#0F1011",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 14,
            border: "1px solid rgba(244,114,182,0.16)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "rgba(244,244,244,0.72)",
              fontStyle: "italic",
              lineHeight: 1.65,
            }}
          >
            &ldquo;she carried me through a really dark winter. i&apos;ll never not love her.&rdquo;
          </p>
        </div>
        <div
          style={{
            background: PINK,
            borderRadius: 12,
            padding: "12px 0",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>
            End the fixation
          </span>
        </div>
      </div>
      {/* Graveyard hint */}
      <div
        style={{
          marginTop: 12,
          background: "rgba(244,114,182,0.06)",
          border: "1px solid rgba(244,114,182,0.16)",
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 15 }}>🪦</span>
        <p style={{ fontSize: 12, color: "rgba(244,244,244,0.48)" }}>
          Filed to your graveyard forever
        </p>
      </div>
    </div>
  );
}

function ShareScreen() {
  return (
    <div
      style={{ padding: "14px 20px", fontFamily: "var(--font-sans)", color: "#F4F4F4" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <LogoMark size={24} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          hyperfix
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}
      >
        Share this era
      </p>
      {/* Card preview */}
      <div
        style={{
          background: "linear-gradient(145deg, #0A1C1A 0%, #0F2722 100%)",
          border: `1px solid rgba(94,234,212,0.22)`,
          borderRadius: 22,
          padding: "22px 20px",
          marginBottom: 14,
          boxShadow: "0 0 50px rgba(94,234,212,0.07)",
        }}
      >
        <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
          <span
            style={{
              fontSize: 10,
              padding: "2px 9px",
              borderRadius: 999,
              background: "rgba(94,234,212,0.10)",
              border: "1px solid rgba(94,234,212,0.26)",
              color: TEAL,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            music
          </span>
          <span
            style={{
              fontSize: 10,
              padding: "2px 9px",
              borderRadius: 999,
              background: "rgba(94,234,212,0.10)",
              border: "1px solid rgba(94,234,212,0.26)",
              color: TEAL,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            active
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            color: "#F4F4F4",
            marginBottom: 10,
            letterSpacing: "-0.01em",
          }}
        >
          Taylor Swift — TTPD
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 64,
              fontWeight: 700,
              color: TEAL,
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            139
          </span>
          <span style={{ fontSize: 14, color: "rgba(244,244,244,0.38)" }}>days</span>
        </div>
        <div
          style={{
            height: 5,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 999,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: "82%",
              height: "100%",
              background: TEAL,
              borderRadius: 999,
              opacity: 0.55,
            }}
          />
        </div>
        <p
          style={{
            fontSize: 10,
            color: "rgba(244,244,244,0.3)",
            fontFamily: "monospace",
            letterSpacing: "0.07em",
          }}
        >
          hyperfix.app
        </p>
      </div>
      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{
            flex: 1,
            background: TEAL,
            borderRadius: 13,
            padding: "13px 0",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0A1F1C" }}>
            Download card
          </span>
        </div>
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 13,
            padding: "13px 0",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,244,244,0.65)" }}>
            Copy link
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Footer logo bar ───────────────────────────────────────────────────────────

function FooterLogo() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 52,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <LogoMark size={22} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(244,244,244,0.35)",
          letterSpacing: "-0.02em",
        }}
      >
        hyperfix.app
      </span>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AdhdSlides() {
  const fontCls = `${fraunces.variable} ${sans.variable}`;
  const slideBase: React.CSSProperties = {
    width: 1080,
    height: 1920,
    background: BG,
    position: "relative",
    overflow: "hidden",
    color: "#F4F4F4",
  };
  const eyebrow = (text: string, color: string): React.CSSProperties => ({
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color,
    marginBottom: 22,
  });

  return (
    <div className={fontCls} style={{ background: "#020202", display: "flex", flexDirection: "column", gap: 6 }}>

      {/* ════════════ SLIDE 1 — Log It ════════════ */}
      <div style={slideBase}>
        <div style={{ position: "absolute", top: -220, right: -80, width: 750, height: 750, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(94,234,212,0.11) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(244,114,182,0.06) 0%, transparent 65%)" }} />

        {/* Top text */}
        <div style={{ position: "absolute", top: 88, left: 80, right: 80, textAlign: "center" }}>
          <p style={eyebrow("built for adhd brains", "rgba(94,234,212,0.72)")}>built for adhd brains</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.04, color: "#F4F4F4" }}>
            Your ADHD brain<br />
            just found its<br />
            <span style={{ color: TEAL }}>new obsession.</span>
          </h1>
        </div>

        {/* Phone + mascot */}
        <div style={{ position: "absolute", top: 548, left: 55, display: "flex", alignItems: "flex-start", gap: 24 }}>
          <PhoneFrame><LogScreen /></PhoneFrame>
          <div style={{ marginTop: 80 }}>
            <Brain mood="excited" accent={TEAL} width={295} />
          </div>
        </div>

        {/* Bottom text */}
        <div style={{ position: "absolute", bottom: 108, left: 80, right: 80, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#F4F4F4" }}>
            Log it before<br />
            <span style={{ color: "rgba(244,244,244,0.4)" }}>the next one hits.</span>
          </h2>
        </div>
        <FooterLogo />
      </div>

      {/* ════════════ SLIDE 2 — Day Counter ════════════ */}
      <div style={slideBase}>
        <div style={{ position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)", width: 900, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(94,234,212,0.09) 0%, transparent 65%)" }} />

        <div style={{ position: "absolute", top: 88, left: 80, right: 80, textAlign: "center" }}>
          <p style={eyebrow("day counter", "rgba(94,234,212,0.72)")}>day counter</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#F4F4F4" }}>
            You don&apos;t do<br />
            &ldquo;casual&rdquo;<br />
            <span style={{ color: "rgba(244,244,244,0.35)" }}>interests.</span>
          </h1>
        </div>

        <div style={{ position: "absolute", top: 568, left: 55, display: "flex", alignItems: "flex-start", gap: 28 }}>
          <PhoneFrame><DayCounterScreen /></PhoneFrame>
          <div style={{ marginTop: 50 }}>
            <Brain mood="chill" accent={TEAL} width={290} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 108, left: 80, right: 80, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#F4F4F4" }}>
            Count every<br />
            <span style={{ color: TEAL }}>obsessed day.</span>
          </h2>
        </div>
        <FooterLogo />
      </div>

      {/* ════════════ SLIDE 3 — Intensity ════════════ */}
      <div style={slideBase}>
        <div style={{ position: "absolute", top: -180, right: -60, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(251,146,60,0.10) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(239,68,68,0.07) 0%, transparent 65%)" }} />

        <div style={{ position: "absolute", top: 88, left: 80, right: 80, textAlign: "center" }}>
          <p style={eyebrow("intensity meter", "rgba(251,146,60,0.78)")}>intensity meter</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#F4F4F4" }}>
            Rate the<br />
            spiral.<br />
            <span style={{ color: ORANGE }}>1 to 10.</span>
          </h1>
        </div>

        <div style={{ position: "absolute", top: 558, left: 55, display: "flex", alignItems: "flex-start", gap: 28 }}>
          <PhoneFrame><IntensityScreen /></PhoneFrame>
          <div style={{ marginTop: 90 }}>
            <Brain mood="excited" accent={ORANGE} width={285} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 108, left: 80, right: 80, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 54, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.14, color: "#F4F4F4" }}>
            From &ldquo;mildly into it&rdquo;<br />
            <span style={{ color: ORANGE }}>to &ldquo;send help.&rdquo;</span>
          </h2>
        </div>
        <FooterLogo />
      </div>

      {/* ════════════ SLIDE 4 — Eulogy ════════════ */}
      <div style={slideBase}>
        <div style={{ position: "absolute", bottom: -180, right: -80, width: 750, height: 750, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(244,114,182,0.10) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: -100, left: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 65%)" }} />

        <div style={{ position: "absolute", top: 88, left: 80, right: 80, textAlign: "center" }}>
          <p style={eyebrow("eulogies & graveyard", "rgba(244,114,182,0.75)")}>eulogies &amp; graveyard</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 74, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.04, color: "#F4F4F4" }}>
            Every obsession<br />
            deserves a<br />
            <span style={{ color: PINK }}>proper goodbye.</span>
          </h1>
        </div>

        <div style={{ position: "absolute", top: 558, left: 55, display: "flex", alignItems: "flex-start", gap: 28 }}>
          <PhoneFrame><EulogyScreen /></PhoneFrame>
          <div style={{ marginTop: 100 }}>
            <Brain mood="sad" accent={PINK} width={285} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 108, left: 80, right: 80, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 54, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.14, color: "#F4F4F4" }}>
            Write the eulogy.<br />
            <span style={{ color: "rgba(244,244,244,0.4)" }}>Cry a little. Move on.</span>
          </h2>
        </div>
        <FooterLogo />
      </div>

      {/* ════════════ SLIDE 5 — Share & CTA ════════════ */}
      <div style={slideBase}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 1100, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(94,234,212,0.09) 0%, transparent 65%)" }} />

        <div style={{ position: "absolute", top: 88, left: 80, right: 80, textAlign: "center" }}>
          <p style={eyebrow("share cards", "rgba(94,234,212,0.72)")}>share cards</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 80, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#F4F4F4" }}>
            Share the era<br />
            with people<br />
            <span style={{ color: TEAL }}>who get it.</span>
          </h1>
        </div>

        <div style={{ position: "absolute", top: 558, left: 55, display: "flex", alignItems: "flex-start", gap: 28 }}>
          <PhoneFrame><ShareScreen /></PhoneFrame>
          <div style={{ marginTop: 60 }}>
            <Brain mood="happy" accent={TEAL} width={285} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 108, left: 80, right: 80, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 58, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#F4F4F4", marginBottom: 36 }}>
            Free. 30 seconds.<br />
            <span style={{ color: TEAL }}>Day one starts now.</span>
          </h2>
          <div style={{ display: "inline-flex", background: TEAL, borderRadius: 999, padding: "20px 60px", boxShadow: "0 0 70px rgba(94,234,212,0.32)" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "#0A1F1C" }}>
              hyperfix.app
            </span>
          </div>
        </div>
        <FooterLogo />
      </div>

    </div>
  );
}
