const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

export default function PublicFixLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {/* Header row (logo / back link placeholder) */}
        <div className="skeleton-shimmer rounded-lg mb-6" style={{ height: 18, width: 120 }} />

        {/* Banner area */}
        <div
          className="w-full skeleton-shimmer rounded-3xl mb-6"
          style={{
            height: 220,
            border: `1px solid ${CARD_BORDER}`,
          }}
        />

        {/* Title bar */}
        <div className="skeleton-shimmer rounded-xl mb-2" style={{ height: 30, width: "70%" }} />
        <div className="skeleton-shimmer rounded-lg mb-8" style={{ height: 14, width: "40%" }} />

        {/* Day count placeholder */}
        <div
          className="rounded-3xl p-6 mb-6 flex items-baseline gap-3"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="skeleton-shimmer rounded-xl" style={{ height: 64, width: 100 }} />
          <div className="skeleton-shimmer rounded-full" style={{ height: 18, width: 80 }} />
        </div>

        {/* Reactions / actions row */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer rounded-full"
              style={{ height: 34, width: 60 }}
            />
          ))}
        </div>

        {/* Note placeholder */}
        <div
          className="rounded-3xl p-5"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="skeleton-shimmer rounded mb-2" style={{ height: 12, width: "90%" }} />
          <div className="skeleton-shimmer rounded mb-2" style={{ height: 12, width: "75%" }} />
          <div className="skeleton-shimmer rounded" style={{ height: 12, width: "60%" }} />
        </div>
      </div>
    </div>
  );
}
