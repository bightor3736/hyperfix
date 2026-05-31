import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — r/ADHD post",
  robots: { index: false, follow: false },
};

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap", variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-sans" });

const TEAL        = "#5EEAD4";
const RED         = "#E63946";
const ORANGE      = "#FB923C";
const PAGE_BG     = "var(--bg)";
const CARD_BG     = "var(--bg)";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const FAINT       = "rgba(255,255,255,0.06)";
const DIM         = "rgba(255,255,255,0.38)";

const CAT_COLORS: Record<string, string> = {
  anime:   "#A78BFA",
  music:   "#F472B6",
  show:    "#60A5FA",
  film:    "#FBBF24",
  musical: "#34D399",
  fanfic:  "#F97316",
  book:    "#FB923C",
  game:    "#818CF8",
};

const ACTIVE = [
  { title: "Jujutsu Kaisen",  cat: "anime", days: 43, intensity: 9 },
  { title: "Chappell Roan",   cat: "music", days: 71, intensity: 8 },
  { title: "The Last of Us",  cat: "show",  days: 19, intensity: 7 },
];

const BURIED = [
  { title: "One Direction",              cat: "music",   days: 847, year: "2012–2015" },
  { title: "Hamilton",                   cat: "musical", days: 203, year: "2016"      },
  { title: "BBC Sherlock",               cat: "show",    days: 156, year: "2017"      },
  { title: "Twilight (all of it)",       cat: "film",    days: 94,  year: "2018"      },
  { title: "Avatar: The Last Airbender", cat: "show",    days: 67,  year: "2020"      },
  { title: "Mitski discography",         cat: "music",   days: 112, year: "2022"      },
  { title: "Stranger Things",            cat: "show",    days: 48,  year: "2022"      },
  { title: "Dungeons & Dragons",         cat: "game",    days: 139, year: "2023"      },
];

function intColor(n: number) { return n >= 8 ? RED : n >= 6 ? ORANGE : TEAL; }
function intRGB(n: number)   { return n >= 8 ? "230,57,70" : n >= 6 ? "251,146,60" : "94,234,212"; }

export default function RedditPost4() {
  return (
    <div
      className={`${fraunces.variable} ${sans.variable}`}
      style={{ width: 1080, height: 1920, background: PAGE_BG, position: "relative", overflow: "hidden" }}
    >
      {/* blooms */}
      <div style={{ position: "absolute", top: -200, left: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(94,234,212,0.06) 0%, transparent 65%)" }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 65%)" }} />

      <div style={{ padding: "72px 80px 72px" }}>

        {/* logo */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="14" fill={CARD_BG} />
              <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
              <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.02em" }}>hyperfix</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,244,244,0.3)" }}>
            hyperfix.app
          </span>
        </div>

        {/* headline */}
        <div className="mb-10">
          <p style={{ fontFamily: "monospace", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(94,234,212,0.6)", marginBottom: 10 }}>
            my adhd brain, tracked
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 58, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#F4F4F4", marginBottom: 8 }}>
            3 active.<br />
            <span style={{ color: "rgba(244,244,244,0.35)" }}>8 in the ground.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, color: "rgba(244,244,244,0.45)", lineHeight: 1.5 }}>
            every obsession i&apos;ve had for the last 3 years, logged.
          </p>
        </div>

        {/* active section */}
        <div className="mb-8">
          <p style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(244,244,244,0.32)", marginBottom: 14 }}>
            currently unwell about
          </p>
          <div className="flex flex-col gap-3">
            {ACTIVE.map((fix) => {
              const color = intColor(fix.intensity);
              const rgb = intRGB(fix.intensity);
              const catColor = CAT_COLORS[fix.cat] ?? TEAL;
              return (
                <div key={fix.title} className="flex items-center gap-4 px-5 py-4 rounded-2xl" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  {/* cat dot */}
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: catColor, flexShrink: 0 }} />

                  {/* title + cat */}
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {fix.title}
                    </p>
                    <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(244,244,244,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                      {fix.cat}
                    </p>
                  </div>

                  {/* intensity bar */}
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${fix.intensity * 10}%`, background: color, borderRadius: 999, boxShadow: `0 0 8px rgba(${rgb},0.5)` }} />
                    </div>
                    <p style={{ fontFamily: "monospace", fontSize: 9, color, textAlign: "right", marginTop: 3, letterSpacing: "0.04em" }}>
                      {fix.intensity >= 9 ? "send help" : fix.intensity >= 7 ? "unwell" : "deep"}
                    </p>
                  </div>

                  {/* day count */}
                  <div style={{ textAlign: "right", flexShrink: 0, minWidth: 48 }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "#F4F4F4", lineHeight: 1, letterSpacing: "-0.04em" }}>
                      {fix.days}
                    </p>
                    <p style={{ fontFamily: "monospace", fontSize: 9, color: DIM, textTransform: "uppercase", letterSpacing: "0.06em" }}>days</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* graveyard section */}
        <div className="mb-10">
          <p style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(244,244,244,0.32)", marginBottom: 14 }}>
            the graveyard — rip 🪦
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${FAINT}` }}>
            {BURIED.map((fix, i) => {
              const catColor = CAT_COLORS[fix.cat] ?? TEAL;
              return (
                <div key={fix.title} className="flex items-center justify-between px-5 py-3.5" style={{ background: CARD_BG, borderBottom: i < BURIED.length - 1 ? `1px solid ${FAINT}` : "none" }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: catColor, opacity: 0.4, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "rgba(244,244,244,0.4)", letterSpacing: "-0.01em" }}>
                        {fix.title}
                      </p>
                      <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(244,244,244,0.18)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>
                        {fix.year}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "rgba(244,244,244,0.2)", letterSpacing: "-0.02em" }}>
                    {fix.days}d
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* footer CTA */}
        <div className="flex items-center justify-between pt-8" style={{ borderTop: `1px solid ${FAINT}` }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#F4F4F4", letterSpacing: "-0.02em" }}>
              track your own.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(244,244,244,0.4)", marginTop: 2 }}>
              free. link in bio or comments.
            </p>
          </div>
          <div className="rounded-full px-7 py-3.5" style={{ background: TEAL, boxShadow: `0 0 40px rgba(94,234,212,0.25)` }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--bg)" }}>hyperfix.app</span>
          </div>
        </div>

      </div>
    </div>
  );
}
