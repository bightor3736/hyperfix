const testimonials = [
  {
    quote: "I've tried every productivity app and they all made me feel worse. Hyperfix is the first one that actually gets it — the XP hits when I START, not when I finish a 47-step project.",
    name: "Maya R.",
    tag: "ADHD since 2019",
  },
  {
    quote: "The streak freeze thing alone is worth it. I had a horrible week, missed three days, opened the app and it just said 'streak survived'. I cried a little.",
    name: "Jordan K.",
    tag: "Diagnosed late, 34",
  },
  {
    quote: "Broke down 'apply for jobs' into 'open LinkedIn' and suddenly I did it. That's the whole product right there.",
    name: "Sam T.",
    tag: "ADHD + anxiety",
  },
];

export function Testimonials() {
  return (
    <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", padding: "100px 0" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>What people say</div>
          <h2 className="display-lg">Real humans, real starts.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "var(--bg-white)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#3F3F46", marginBottom: 20 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 2 }}>{t.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
