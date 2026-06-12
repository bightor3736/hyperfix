const SECTION_HEADING = (
  <>
    Task management has{" "}
    <span
      style={{
        fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
        fontStyle: "italic",
        fontWeight: 400,
      }}
    >
      changed.
    </span>{" "}
    Have you?
  </>
);

const TAGLINE = "If you don't break down the task, your brain will avoid it forever.";

const SUBTITLE =
  "Traditional productivity apps were built for neurotypical brains. ADHD brains work differently — and Hyperfix is built around that truth.";

// Monochrome SVG icons for each card (200×200 viewBox, white on dark)
function JustStartIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* Clock face */}
      <circle cx="40" cy="40" r="22" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Clock hands */}
      <line x1="40" y1="40" x2="40" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
      <line x1="40" y1="40" x2="53" y2="47" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
      <circle cx="40" cy="40" r="2.5" fill="white" fillOpacity="0.9" />
      {/* Play arrow at bottom */}
      <path d="M32 62 L40 70 L48 62" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" fill="none" />
    </svg>
  );
}

function XPSystemIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* Star shape */}
      <path
        d="M40 14 L44.5 30 L62 30 L48 40 L53 56 L40 47 L27 56 L32 40 L18 30 L35.5 30 Z"
        stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.9"
        fill="white" fillOpacity="0.08"
      />
      {/* XP text suggestion — small dots */}
      <circle cx="36" cy="38" r="1.5" fill="white" fillOpacity="0.6" />
      <circle cx="40" cy="38" r="1.5" fill="white" fillOpacity="0.6" />
      <circle cx="44" cy="38" r="1.5" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function AIBreakdownIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* Brain-like interconnected nodes */}
      <circle cx="40" cy="28" r="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx="26" cy="44" r="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx="54" cy="44" r="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx="34" cy="58" r="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx="46" cy="58" r="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      {/* Connecting lines */}
      <line x1="40" y1="33" x2="28" y2="40" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="40" y1="33" x2="52" y2="40" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="28" y1="48" x2="34" y2="54" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="52" y1="48" x2="46" y2="54" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="28" y1="48" x2="46" y2="54" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}

const PLATFORMS = [
  {
    name: "Just Start",
    icon: <JustStartIcon />,
    description:
      "Stop planning, start moving. The 5-minute timer makes beginning the win — not the finish line.",
  },
  {
    name: "XP System",
    icon: <XPSystemIcon />,
    description:
      "Real rewards for real actions. XP drops the moment you start. Streaks have freeze protection built in.",
  },
  {
    name: "AI Breakdown",
    icon: <AIBreakdownIcon />,
    description:
      "Any task, split into the three smallest possible steps. No more staring at 'do taxes' for three months.",
  },
];

export function SearchChanged() {
  return (
    <section style={{ textAlign: "center", padding: "208px 24px 36px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(36px, 7vw, 88px)",
            fontWeight: 500,
            letterSpacing: "-2px",
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          {SECTION_HEADING}
        </h2>

        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 600,
            margin: "0 auto 96px",
            lineHeight: 1.6,
          }}
        >
          {SUBTITLE}
        </p>

        {/* Platform cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 48,
            marginBottom: 80,
          }}
        >
          {PLATFORMS.map(({ name, icon, description }) => (
            <div
              key={name}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
            >
              <div
                style={{
                  width: 200, height: 200,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {icon}
              </div>
              <p style={{ fontWeight: 600, fontSize: 16, color: "#ffffff" }}>{name}</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", maxWidth: 240, lineHeight: 1.6 }}>
                {description}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          {TAGLINE}
        </p>
      </div>
    </section>
  );
}
