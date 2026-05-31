const pillars = [
  {
    title: "Log it.",
    body: "Name the obsession. Set today's intensity on a 1–10 scale.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    title: "Count it.",
    body: "The counter starts the moment you commit. Day 1 is today.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    title: "Share it.",
    body: "Every fix renders to a clean card. Drop it in the chat. No explanation needed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    ),
  },
  {
    title: "Mourn it.",
    body: "When it ends, write the eulogy. It lives in the graveyard forever.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="14" rx="6" />
        <path d="M6 16L4 22h16l-2-6M10 9h4M12 7v4" />
      </svg>
    ),
  },
];

const extras = [
  { label: "Streaks & heatmap",       desc: "Check in daily. The shape of your spiral over weeks." },
  { label: "Public profile",          desc: "Followers see your eras as they unfold." },
  { label: "AI eulogies",             desc: "When words fail, let the AI write the obituary." },
  { label: "Wrapped",                 desc: "Your year in fixations, every December." },
  { label: "Focus Rooms",             desc: "Body-double with others in real-time." },
  { label: "Analytics",               desc: "Patterns, peaks, and the fixes that defined your year." },
];

export function Features() {
  return (
    <section id="features" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        {/* Section header */}
        <div className="max-w-[640px] mb-14">
          <h2 className="font-display text-[36px] leading-[1.05] tracking-tight sm:text-[44px]" style={{ color: "var(--ink)" }}>
            Four moves. That's the app.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6]" style={{ color: "var(--ink-muted)" }}>
            No streaks for hydration. No coach. A small civilised place to put the thing your brain refuses to let go of.
          </p>
        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="rounded-[20px] p-6"
              style={{ border: "1px solid var(--line)", background: "var(--bg-elevated)" }}
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-5"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {p.icon}
              </div>
              <h3 className="font-display text-[24px] leading-[1.1] tracking-tight" style={{ color: "var(--ink)" }}>
                {p.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--ink-muted)" }}>
                {p.body}
              </p>
            </article>
          ))}
        </div>

        {/* Extra features list */}
        <div
          className="rounded-[24px] p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6"
          style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}
        >
          {extras.map((e) => (
            <div key={e.label} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 inline-flex w-5 h-5 items-center justify-center rounded-full"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[14px] font-medium" style={{ color: "var(--ink)" }}>{e.label}</p>
                <p className="text-[13px] leading-[1.5]" style={{ color: "var(--ink-muted)" }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
