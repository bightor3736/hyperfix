import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — r/ADHDwomen post",
  robots: { index: false, follow: false },
};

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap", variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-sans" });

const TEAL   = "#5EEAD4";
const PAGE_BG     = "var(--bg)";
const CARD_BG     = "var(--bg)";
const FAINT       = "rgba(255,255,255,0.06)";
const DIM         = "rgba(244,244,244,0.35)";
const DIMMER      = "rgba(244,244,244,0.22)";

const CAT: Record<string, string> = {
  music:    "#F472B6",
  show:     "#60A5FA",
  book:     "#FB923C",
  film:     "#FBBF24",
  fanfic:   "#F97316",
  musical:  "#34D399",
  other:    "#A78BFA",
};

// Real phases, documented. Very r/ADHDwomen.
const PHASES = [
  {
    year: "2021",
    fixes: [
      { title: "One Direction discography",  cat: "music",  days: 94,  ended: true  },
      { title: "Normal People",              cat: "book",   days: 38,  ended: true  },
      { title: "Fleabag",                    cat: "show",   days: 61,  ended: true  },
    ],
  },
  {
    year: "2022",
    fixes: [
      { title: "Mitski (all of it)",          cat: "music",  days: 112, ended: true  },
      { title: "Heartstopper",                cat: "show",   days: 55,  ended: true  },
      { title: "Taylor Swift — Midnights",    cat: "music",  days: 203, ended: true  },
    ],
  },
  {
    year: "2023",
    fixes: [
      { title: "The Bear (s1 rewatch loop)",  cat: "show",   days: 29,  ended: true  },
      { title: "Succession finale",           cat: "show",   days: 44,  ended: true  },
      { title: "Yellowjackets",               cat: "show",   days: 67,  ended: true  },
    ],
  },
  {
    year: "2024",
    fixes: [
      { title: "Chappell Roan",               cat: "music",  days: 88,  ended: true  },
      { title: "Interview With the Vampire",  cat: "show",   days: 71,  ended: true  },
    ],
  },
  {
    year: "2025",
    fixes: [
      { title: "Taylor Swift — TTPD",         cat: "music",  days: 139, ended: false },
      { title: "Severance s2",                cat: "show",   days: 34,  ended: false },
    ],
  },
];

const totalDays = PHASES.flatMap(p => p.fixes).reduce((s, f) => s + f.days, 0);
const totalFixes = PHASES.flatMap(p => p.fixes).length;
const longestFix = PHASES.flatMap(p => p.fixes).reduce((m, f) => f.days > m.days ? f : m);

export default function Reddit5() {
  return (
    <div
      className={`${fraunces.variable} ${sans.variable}`}
      style={{ width: 1080, height: 1920, background: PAGE_BG, position: "relative", overflow: "hidden", color: "#F4F4F4" }}
    >
      {/* background blooms */}
      <div style={{ position: "absolute", top: -180, right: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(244,114,182,0.07) 0%, transparent 65%)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(94,234,212,0.06) 0%, transparent 65%)" }} />

      <div style={{ padding: "72px 80px" }}>

        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="30" height="30" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="14" fill={CARD_BG} />
              <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
              <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.02em" }}>hyperfix</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: DIMMER }}>
            hyperfix.app
          </span>
        </div>

        {/* headline */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(244,114,182,0.7)", marginBottom: 12 }}>
            my hyperfixation history, documented
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#F4F4F4", marginBottom: 10 }}>
            every phase<br />
            <span style={{ color: DIM }}>i&apos;ve survived.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, color: "rgba(244,244,244,0.5)", lineHeight: 1.5 }}>
            i kept a log. turns out i&apos;m extremely predictable.
          </p>
        </div>

        {/* stats row */}
        <div style={{ display: "flex", gap: 0, marginBottom: 44, border: `1px solid ${FAINT}`, borderRadius: 16, overflow: "hidden" }}>
          {[
            { label: "total days lost", value: totalDays.toLocaleString() },
            { label: "phases logged",   value: String(totalFixes) },
            { label: "longest phase",   value: `${longestFix.days}d` },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1,
              padding: "20px 24px",
              background: CARD_BG,
              borderRight: i < 2 ? `1px solid ${FAINT}` : "none",
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.04em", lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: DIMMER, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {PHASES.map((phase) => (
            <div key={phase.year}>
              {/* year label */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: TEAL, letterSpacing: "-0.01em" }}>
                  {phase.year}
                </span>
                <div style={{ flex: 1, height: 1, background: FAINT }} />
              </div>

              {/* fix rows */}
              <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${FAINT}`, borderRadius: 14, overflow: "hidden" }}>
                {phase.fixes.map((fix, i) => {
                  const color = CAT[fix.cat] ?? TEAL;
                  return (
                    <div
                      key={fix.title}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 20px",
                        background: CARD_BG,
                        borderBottom: i < phase.fixes.length - 1 ? `1px solid ${FAINT}` : "none",
                      }}
                    >
                      {/* color dot */}
                      <div style={{ width: 7, height: 7, borderRadius: 999, background: fix.ended ? color : color, opacity: fix.ended ? 0.45 : 1, flexShrink: 0 }} />

                      {/* title */}
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: fix.ended ? "rgba(244,244,244,0.42)" : "rgba(244,244,244,0.85)", flex: 1, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {fix.title}
                      </p>

                      {/* active pill or day count */}
                      {!fix.ended ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: TEAL, background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.22)", borderRadius: 999, padding: "2px 8px" }}>
                            active
                          </span>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: TEAL, letterSpacing: "-0.03em" }}>
                            {fix.days}d
                          </span>
                        </div>
                      ) : (
                        <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "rgba(244,244,244,0.22)", letterSpacing: "-0.02em", flexShrink: 0 }}>
                          {fix.days}d
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 48, paddingTop: 36, borderTop: `1px solid ${FAINT}` }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.02em" }}>
              track yours.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(244,244,244,0.4)", marginTop: 3 }}>
              free. link in comments.
            </p>
          </div>
          <div style={{ borderRadius: 999, padding: "14px 28px", background: "#F472B6", boxShadow: "0 0 40px rgba(244,114,182,0.3)" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--bg)" }}>hyperfix.app</span>
          </div>
        </div>

      </div>
    </div>
  );
}
