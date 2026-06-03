const features = [
  {
    emoji: "📝",
    title: "Log it.",
    description: "Track every obsession as it happens.",
  },
  {
    emoji: "📅",
    title: "Count it.",
    description: "Watch the days stack up.",
  },
  {
    emoji: "🔗",
    title: "Share it.",
    description: "Show friends what you're into.",
  },
  {
    emoji: "🪦",
    title: "Mourn it.",
    description: "Bury it properly when it ends.",
  },
];

export function FeaturesFoku() {
  return (
    <section className="py-20 sm:py-28 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "#EEF4FF",
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "#1A1A2E" }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
