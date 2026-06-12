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
    <section style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "100px 0" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14, color: "rgba(255,255,255,0.35)" }}>What people say</div>
          <h2 className="display-lg">Real humans, real starts.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "28px",
              }}
            >
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.65)", marginBottom: 20 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{t.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
