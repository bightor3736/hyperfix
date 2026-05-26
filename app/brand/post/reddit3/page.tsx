import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — Reddit post v3",
  robots: { index: false, follow: false },
};

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap", variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-sans" });

const TEAL       = "#5EEAD4";
const RED        = "#E63946";
const ORANGE     = "#FB923C";
const PAGE_BG    = "#070708";
const CARD_BG    = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const DIM        = "rgba(255,255,255,0.40)";
const DIMMER     = "rgba(255,255,255,0.22)";
const FAINT      = "rgba(255,255,255,0.06)";

const CAT_COLORS: Record<string, string> = {
  anime:   "#A78BFA",
  music:   "#F472B6",
  show:    "#60A5FA",
  film:    "#FBBF24",
  musical: "#34D399",
  fanfic:  "#F97316",
};

const ACTIVE = [
  { title: "Jujutsu Kaisen",  cat: "anime",  days: 43, intensity: 9,  status: "Obsessed" },
  { title: "Chappell Roan",   cat: "music",  days: 71, intensity: 8,  status: "Deep" },
  { title: "The Last of Us",  cat: "show",   days: 19, intensity: 7,  status: "Active" },
];

const BURIED = [
  { title: "One Direction",               cat: "music",   days: 847, year: "2012 – 2015" },
  { title: "Hamilton",                    cat: "musical", days: 203, year: "2016" },
  { title: "BBC Sherlock",                cat: "show",    days: 156, year: "2017" },
  { title: "Twilight (all of it)",        cat: "film",    days: 94,  year: "2018" },
  { title: "Avatar: The Last Airbender", cat: "show",    days: 67,  year: "2020" },
  { title: "Mitski discography",          cat: "music",   days: 112, year: "2022" },
];

function intColor(n: number) {
  if (n >= 8) return RED;
  if (n >= 6) return ORANGE;
  return TEAL;
}
function intRGB(n: number) {
  if (n >= 8) return "230,57,70";
  if (n >= 6) return "251,146,60";
  return "94,234,212";
}

function FixCard({ title, cat, days, intensity, status }: typeof ACTIVE[0]) {
  const color = intColor(intensity);
  const rgb = intRGB(intensity);
  const catColor = CAT_COLORS[cat] ?? TEAL;

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
      }}
    >
      {/* banner */}
      <div
        className="relative w-full"
        style={{
          height: 96,
          background: `linear-gradient(135deg, ${catColor}28 0%, ${catColor}0A 55%, ${CARD_BG} 100%)`,
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 40%, rgba(15,16,17,0.88) 100%)" }}
        />
        {/* day count top-left */}
        <div className="absolute top-2.5 left-3 flex items-baseline gap-1">
          <span
            className="tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "#F4F4F4",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {days}
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: "rgba(244,244,244,0.65)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            days
          </span>
        </div>
        {/* intensity chip */}
        <div
          className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5"
          style={{
            background: "rgba(7,7,8,0.6)",
            border: `1px solid rgba(${rgb},0.4)`,
            color,
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 600 }}>
            {intensity}<span style={{ opacity: 0.5 }}>/10</span>
          </span>
        </div>
      </div>

      {/* body */}
      <div className="p-4">
        {/* pills */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5"
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: `${catColor}14`,
              color: catColor,
              border: `1px solid ${catColor}33`,
            }}
          >
            {cat}
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5"
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: `rgba(${rgb},0.08)`,
              color,
              border: `1px solid rgba(${rgb},0.25)`,
            }}
          >
            {status}
          </span>
        </div>

        {/* title — serif */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            color: "#F4F4F4",
            marginBottom: 12,
          }}
        >
          {title}
        </h3>

        {/* day count big */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span
            className="tabular-nums leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 600,
              color: "#F4F4F4",
              letterSpacing: "-0.04em",
            }}
          >
            {days}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: DIM }}>
            days deep
          </span>
        </div>

        {/* intensity bar */}
        <div style={{ marginBottom: 4 }}>
          <div className="flex justify-between items-center mb-1.5">
            <span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: DIMMER }}>intensity</span>
            <span style={{ fontFamily: "monospace", fontSize: 9, color, letterSpacing: "0.06em" }}>
              {intensity >= 9 ? "send help" : intensity >= 7 ? "deeply unwell" : "tracking it"}
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${intensity * 10}%`,
                background: color,
                boxShadow: `0 0 8px rgba(${rgb},0.6)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedditPost3() {
  return (
    <main
      className={`min-h-screen flex items-start justify-center ${fraunces.variable} ${sans.variable}`}
      style={{ background: "#1A1A1D", padding: "40px 20px" }}
    >
      <div
        style={{
          width: 390,
          background: PAGE_BG,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* status bar */}
        <div
          style={{
            height: 44,
            background: PAGE_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
          className={sans.className}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#F4F4F4" }}>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="3" width="2.5" height="9" rx="1" fill="white" opacity="0.4" />
              <rect x="4" y="2" width="2.5" height="10" rx="1" fill="white" opacity="0.6" />
              <rect x="8" y="0.5" width="2.5" height="11.5" rx="1" fill="white" opacity="0.8" />
              <rect x="12" y="0" width="2.5" height="12" rx="1" fill="white" />
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <rect x="0.5" y="0.5" width="12" height="11" rx="2" stroke="white" strokeOpacity="0.5" />
              <rect x="2" y="2" width="8" height="8" rx="1" fill="white" />
              <rect x="13" y="4" width="1.5" height="4" rx="0.75" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        <div className={`${fraunces.variable} ${sans.variable}`} style={{ padding: "0 16px 32px" }}>

          {/* header */}
          <div className="flex items-center justify-between py-3 mb-1">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 64 64">
                <rect width="64" height="64" rx="14" fill={CARD_BG} />
                <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
                <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.02em" }}>
                hyperfix
              </span>
            </div>
            <div
              className="rounded-full px-4 py-1.5"
              style={{ background: "#FFFFFF", color: "#0A0A0A" }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600 }}>+ New fix</span>
            </div>
          </div>

          {/* greeting */}
          <div className="mb-4">
            <p style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(94,234,212,0.55)", marginBottom: 4 }}>
              good evening
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "#F4F4F4", lineHeight: 1.05, marginBottom: 4 }}>
              viktor.
            </h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              3 active fixations. it&apos;s giving chaos.
            </p>
          </div>

          {/* stats row */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { label: "check-in run", value: "14", unit: "days", color: TEAL },
              { label: "active fixes", value: "3",  unit: "",     color: "#F4F4F4" },
              { label: "peak intensity", value: "9", unit: "/10", color: RED },
              { label: "this week",    value: "5",  unit: "days", color: "#F4F4F4" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3.5"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <p style={{ fontFamily: "monospace", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
                  {s.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="tabular-nums leading-none"
                    style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em", color: s.color }}
                  >
                    {s.value}
                  </span>
                  {s.unit && (
                    <span style={{ fontFamily: "monospace", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: DIM }}>
                      {s.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* active fixes */}
          <div className="flex flex-col gap-3 mb-5">
            {ACTIVE.map((fix) => (
              <FixCard key={fix.title} {...fix} />
            ))}
          </div>

          {/* graveyard section */}
          <div>
            <p style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
              Graveyard
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${FAINT}` }}>
              {BURIED.map((fix, i) => {
                const catColor = CAT_COLORS[fix.cat] ?? TEAL;
                return (
                  <div
                    key={fix.title}
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: i < BURIED.length - 1 ? `1px solid ${FAINT}` : "none", background: CARD_BG }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span style={{ fontSize: 13, flexShrink: 0 }}>🪦</span>
                      <div className="min-w-0">
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                          {fix.title}
                        </p>
                        <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>
                          {fix.cat} · {fix.year}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.22)", letterSpacing: "-0.02em", flexShrink: 0 }}>
                      {fix.days}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
