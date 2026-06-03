const eulogies = [
  {
    category: "GAME",
    title: "Stardew Valley",
    daysLived: 47,
    quote: "I was going to marry Sebastian. I really was.",
  },
  {
    category: "SHOW",
    title: "Ted Lasso",
    daysLived: 23,
    quote: "Believe. (I don't anymore.)",
  },
  {
    category: "HOBBY",
    title: "Crochet",
    daysLived: 12,
    quote: "The yarn sits in my closet, judging me.",
  },
];

export function GraveyardFoku() {
  return (
    <section className="py-20 sm:py-28 px-6" style={{ background: "#EEF4FF" }}>
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="font-light tracking-tight"
            style={{ color: "#1A1A2E", fontSize: "clamp(28px, 5vw, 40px)" }}
          >
            Everything ends.{" "}
            <span className="italic font-normal" style={{ color: "#A78BFA" }}>
              Bury it properly.
            </span>
          </h2>
        </div>

        {/* Eulogy cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {eulogies.map((eulogy) => (
            <div
              key={eulogy.title}
              className="rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "#ffffff",
                boxShadow: "0 4px 20px rgba(167, 139, 250, 0.1)",
              }}
            >
              {/* Category pill */}
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4"
                style={{ background: "rgba(167, 139, 250, 0.15)", color: "#A78BFA" }}
              >
                {eulogy.category}
              </span>

              {/* Title */}
              <h3
                className="font-semibold text-xl mb-3"
                style={{ color: "#1A1A2E" }}
              >
                {eulogy.title}
              </h3>

              {/* Days lived */}
              <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                {eulogy.daysLived} days lived
              </p>

              {/* Quote */}
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                &ldquo;{eulogy.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
