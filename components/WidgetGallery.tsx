"use client";

// Six dark widgets styled like iOS system apps — each displaying hyperfixation data.

const LIME = "var(--accent)";
const ORANGE = "var(--flame)";
const PINK = "#F472B6";
const GOLD = "#EAB308";
const WHITE = "var(--ink)";
const DIM = "var(--ink-muted)";
const CARD = "var(--bg)";
const CARD_BORDER = "var(--line)";

// ── shared primitives ──────────────────────────────────────────

function Pill({
  children,
  color = LIME,
  textColor = "var(--bg)",
  small = false,
}: {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  small?: boolean;
}) {
  return (
    <span
      style={{
        background: color,
        color: textColor,
        borderRadius: 999,
        padding: small ? "2px 10px" : "4px 14px",
        fontSize: small ? 11 : 13,
        fontWeight: 800,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function IntensityBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        background: LIME,
        borderRadius: 999,
        height: 36,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingLeft: 12,
        paddingRight: 12,
        gap: 4,
      }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: i % 3 === 1 ? 18 : i % 3 === 2 ? 10 : 14,
            background: "rgba(0,0,0,0.25)",
            borderRadius: 20,
          }}
        />
      ))}
      {/* thumb */}
      <div
        style={{
          position: "absolute",
          left: `${pct}%`,
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: 22,
          height: 22,
          borderRadius: 999,
          background: WHITE,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

function MiniLine({
  points,
  color,
  height = 52,
}: {
  points: number[];
  color: string;
  height?: number;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const w = 280;
  const norm = (v: number) =>
    height - 4 - ((v - min) / (max - min + 1)) * (height - 8);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * w},${norm(p)}`)
    .join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fill-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L${w},${height} L0,${height} Z`}
        fill={`url(#fill-${color.replace("#","")})`}
      />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Waveform({ color }: { color: string }) {
  const bars = Array.from({ length: 42 }, () => 0.2 + Math.random() * 0.8);
  return (
    <div
      style={{
        background: color,
        borderRadius: 999,
        height: 52,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 3,
        overflow: "hidden",
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: "0 0 4px",
            height: `${h * 32}px`,
            background: "rgba(0,0,0,0.35)",
            borderRadius: 20,
          }}
        />
      ))}
    </div>
  );
}

// ── Widget 1: Activity / Watch ────────────────────────────────

function WidgetActivity() {
  return (
    <div style={cardStyle}>
      <div style={row("space-between")}>
        <div>
          <span style={{ color: WHITE, fontSize: 15, fontWeight: 700 }}>Marauders</span>
          <sup style={{ color: DIM, fontSize: 11, marginLeft: 4 }}>47</sup>
          <div style={{ color: DIM, fontSize: 11, marginTop: 2 }}>fanfic · ao3</div>
        </div>
        <div style={row("flex-end", 8)}>
          <span style={{ color: DIM, fontSize: 13, fontWeight: 700 }}>9/10</span>
          <div style={{
            background: "var(--flame)",
            borderRadius: 999,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12S1.5 8 1.5 4.5a3.5 3.5 0 017 0 3.5 3.5 0 017 0C15.5 8 7 12 7 12z" fill="white" stroke="none"/>
              <path d="M2 5c0-2.5 2-4.5 5-4.5S12 2.5 12 5c0 4-5 7.5-5 7.5S2 9 2 5z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <span style={{ color: WHITE, fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>47</span>
        <span style={{ color: DIM, fontSize: 36, fontWeight: 700, marginLeft: 8 }}>09</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={row("space-between")}>
          <span style={label}>INTENSITY</span>
          <span style={{ color: LIME, fontSize: 11, fontWeight: 700 }}>SEND HELP · 8PE42M</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <IntensityBar pct={90} />
        </div>
        <div style={{ ...row("space-between"), marginTop: 8 }}>
          <span style={label}>08:23</span>
          <span style={label}>12:44</span>
        </div>
        <div style={{ color: LIME, fontSize: 12, fontWeight: 600, marginTop: 4 }}>
          ↗ 9.4 avg this week
        </div>
      </div>
    </div>
  );
}

// ── Widget 2: Transit / Journey ───────────────────────────────

function WidgetTransit() {
  return (
    <div style={cardStyle}>
      <div style={{ color: DIM, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>HFX047</div>

      <div style={{ ...row("space-between", 0), alignItems: "flex-end", marginTop: 4 }}>
        <span style={{ color: WHITE, fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>MAR</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 12 }}>
          <span style={{ color: DIM, fontSize: 11 }}>••••</span>
          <span style={{ color: LIME, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em" }}>53 DAYS</span>
          <span style={{ color: DIM, fontSize: 11 }}>▶</span>
        </div>
        <span style={{ color: WHITE, fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>JUN</span>
      </div>
      <div style={{ ...row("space-between"), marginTop: -8 }}>
        <span style={label}>Today</span>
        <span style={label}>Milestone</span>
      </div>

      <div style={{
        background: LIME,
        borderRadius: 999,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 14,
      }}>
        <div>
          <div style={{ color: "var(--bg)", fontSize: 22, fontWeight: 900 }}>15:00</div>
          <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 10, fontWeight: 700 }}>START</div>
        </div>
        <div style={{ color: "var(--bg)", fontSize: 20 }}>▶</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "var(--bg)", fontSize: 22, fontWeight: 900 }}>19:22</div>
          <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 10, fontWeight: 700 }}>NOW</div>
        </div>
      </div>

      <div style={{ ...row("space-between"), marginTop: 14 }}>
        <span style={{ color: WHITE, fontSize: 26, fontWeight: 900 }}>15:00</span>
        <span style={{ color: WHITE, fontSize: 26, fontWeight: 900 }}>22:19</span>
      </div>
      <div style={{ color: DIM, fontSize: 11, textAlign: "center", marginTop: 2 }}>With transfer</div>
      <div style={{ ...row("space-between"), marginTop: 12 }}>
        <span style={label}>08 Mar, 2026</span>
        <span style={label}>30 Jun, 2026</span>
      </div>
    </div>
  );
}

// ── Widget 3: Fitness Steps ───────────────────────────────────

function WidgetFitness() {
  return (
    <div style={cardStyle}>
      <div style={row("space-between")}>
        <div>
          <div style={{ color: WHITE, fontSize: 15, fontWeight: 700 }}>Walking</div>
          <div style={{ color: LIME, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em" }}>5 DAYS STREAK</div>
        </div>
        <span style={label}>⏱ 8:46 PM</span>
      </div>

      {/* time slots */}
      <div style={{
        background: LIME,
        borderRadius: 20,
        padding: "10px 12px",
        display: "flex",
        justifyContent: "space-between",
        marginTop: 12,
      }}>
        {[
          { t: "08:00", v: "2,251" },
          { t: "16:10", v: "841" },
          { t: "20:34", v: "1,340" },
        ].map((s) => (
          <div key={s.t} style={{ textAlign: "center" }}>
            <div style={{ color: "var(--bg)", fontSize: 13, fontWeight: 800 }}>{s.t}</div>
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 10 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, ...row("space-between", 0), alignItems: "flex-end" }}>
        <span style={{ color: WHITE, fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
          4,432
        </span>
        <div style={{ textAlign: "right", paddingBottom: 8 }}>
          <span style={{ color: WHITE, fontSize: 22, fontWeight: 900 }}>92</span>
          <span style={{ color: DIM, fontSize: 13, marginLeft: 3 }}>BPM</span>
        </div>
      </div>
      <div style={{ color: DIM, fontSize: 11, marginTop: -4 }}>
        Steps Today
      </div>

      <div style={{ marginTop: 6, height: 44 }}>
        <MiniLine points={[10, 18, 22, 19, 32, 28, 35, 30, 40, 38, 44]} color={LIME} height={44} />
      </div>

      <div style={{ ...row("space-between"), marginTop: 8 }}>
        <span style={label}>⟳ 7.20 km</span>
        <span style={label}>⏱ 320 min</span>
        <span style={label}>2,340 kCal</span>
      </div>
    </div>
  );
}

// ── Widget 4: Stocks ──────────────────────────────────────────

function WidgetStocks() {
  return (
    <div style={cardStyle}>
      <div style={row("flex-start", 10)}>
        <div style={{
          background: GOLD,
          borderRadius: 20,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 18,
          color: "var(--bg)",
        }}>M</div>
        <div>
          <div style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>Marauders</div>
          <div style={{ color: DIM, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>FANFIC</div>
        </div>
      </div>

      <div style={{ marginTop: 12, ...row("space-between", 0), alignItems: "flex-end" }}>
        <span style={{ color: WHITE, fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
          DAY 47
        </span>
      </div>

      <div style={{ ...row("space-between"), marginTop: 8 }}>
        <Pill color={GOLD} textColor="var(--bg)" small>+1 TODAY</Pill>
        <span style={{ color: LIME, fontSize: 13, fontWeight: 800 }}>▲ +1.24%</span>
      </div>

      <div style={{ ...row("space-between"), marginTop: 10 }}>
        <span style={{ color: DIM, fontSize: 12 }}>Strong Buy <span style={{ color: WHITE, fontWeight: 700 }}>Rating</span></span>
        <Pill color={GOLD} textColor="var(--bg)" small>10 Sec</Pill>
      </div>

      <div style={{ marginTop: 12, height: 72 }}>
        <MiniLine points={[20, 22, 19, 24, 23, 28, 26, 30, 29, 34, 36, 38, 40, 42, 47]} color={GOLD} height={72} />
      </div>

      <div style={{ ...row("space-between"), marginTop: 4 }}>
        {["10AM","11AM","12PM","1PM","3PM"].map(t => (
          <span key={t} style={label}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── Widget 5: Music – Ended ───────────────────────────────────

function WidgetMusic() {
  return (
    <div style={cardStyle}>
      <div style={row("space-between")}>
        <div style={row("flex-start", 6)}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: ORANGE,
          }} />
          <span style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>Ended</span>
        </div>
        <Pill color="var(--fill)" textColor={DIM} small>2.4 MB</Pill>
      </div>

      <div style={{ marginTop: 12, ...row("flex-end", 6), alignItems: "flex-end" }}>
        <span style={{ color: WHITE, fontSize: 76, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>
          02:52
        </span>
        <span style={{ color: DIM, fontSize: 26, fontWeight: 700, paddingBottom: 8 }}>26</span>
      </div>

      <div style={{ marginTop: 6 }}>
        <div style={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>Sabrina Carpenter — Tears</div>
        <div style={{ color: DIM, fontSize: 10, marginTop: 2 }}>MAR 14 — APR 23 · 219 LOOPS</div>
      </div>

      <div style={{ color: DIM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginTop: 12 }}>.LOOP</div>
      <div style={{ marginTop: 6 }}>
        <Waveform color={ORANGE} />
      </div>
    </div>
  );
}

// ── Widget 6: Radio ───────────────────────────────────────────

function WidgetRadio() {
  return (
    <div style={cardStyle}>
      <div style={row("space-between")}>
        <div style={row("flex-start", 6)}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "var(--ink)" }} />
          <span style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>Loop Hard</span>
          <sup style={{ color: DIM, fontSize: 9 }}>™</sup>
        </div>
        <div style={row("flex-end", 4)}>
          <span style={{ color: DIM, fontSize: 12, fontWeight: 700 }}>AM</span>
          <Pill color={LIME} textColor="var(--bg)" small>FM</Pill>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <span style={{ color: WHITE, fontSize: 76, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>102.6</span>
        <span style={{ color: DIM, fontSize: 22, fontWeight: 600, marginLeft: 6 }}>MHz</span>
      </div>

      <div style={{ color: DIM, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", marginTop: 6 }}>
        SABRINA CARPENTER — TEARS
      </div>

      {/* frequency bar */}
      <div style={{ marginTop: 14, position: "relative" }}>
        <div style={{
          background: PINK,
          borderRadius: 999,
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 3,
          overflow: "hidden",
        }}>
          {Array.from({ length: 38 }, (_, i) => (
            <div key={i} style={{
              flex: "0 0 4px",
              height: `${8 + Math.abs(Math.sin(i * 0.7)) * 28}px`,
              background: "rgba(0,0,0,0.28)",
              borderRadius: 20,
            }} />
          ))}
        </div>
        <div style={{
          ...row("space-between"),
          marginTop: 6,
          paddingLeft: 4,
          paddingRight: 4,
        }}>
          {["99","100","101","103","105"].map(n => (
            <span key={n} style={label}>{n}</span>
          ))}
        </div>
      </div>

      {/* controls */}
      <div style={{ ...row("space-between"), marginTop: 16 }}>
        {[
          { icon: "★", bg: "var(--fill)" },
          { icon: "⏮", bg: "var(--fill)" },
          { icon: "⏸", bg: "var(--fill)" },
          { icon: "⏭", bg: "var(--fill)" },
        ].map((b, i) => (
          <div key={i} style={{
            background: b.bg,
            borderRadius: 999,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: WHITE,
          }}>
            {b.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── layout helpers ────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: 24,
  padding: 20,
  fontFamily: "'Helvetica Neue', system-ui, sans-serif",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const row = (justify: string, gap = 8): React.CSSProperties => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: justify as React.CSSProperties["justifyContent"],
  gap,
});

const label: React.CSSProperties = {
  color: DIM,
  fontSize: 11,
  fontWeight: 600,
};

// ── exported section ──────────────────────────────────────────

export default function WidgetGallery() {
  return (
    <section className="px-6 sm:px-10 py-20 sm:py-32 bg-bg-soft">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="stamp border-ink/20 text-ink-muted mb-6 inline-block">widget gallery</span>
          <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest text-ink">
            Your fix.
            <br />
            <span className="italic text-accent">Everywhere you look.</span>
          </h2>
          <p className="mt-6 font-sans text-lg text-ink-muted max-w-xl leading-snug">
            Day counters that look like step trackers. Intensity bars that look like stock charts.
            Loop counts that look like radio dials. Your hyperfixation, measured like everything
            else on your phone.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="widget-grid"
        >
          <WidgetActivity />
          <WidgetTransit />
          <WidgetFitness />
          <WidgetStocks />
          <WidgetMusic />
          <WidgetRadio />
        </div>
      </div>
    </section>
  );
}
