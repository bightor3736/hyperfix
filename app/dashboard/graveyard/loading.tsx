const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

function TombstoneSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        minHeight: 200,
      }}
    >
      {/* Tombstone-style arched header */}
      <div
        className="skeleton-shimmer mx-auto mb-5"
        style={{
          height: 32,
          width: 32,
          borderRadius: "16px 16px 4px 4px",
        }}
      />

      {/* Title */}
      <div
        className="skeleton-shimmer rounded-lg mx-auto mb-2"
        style={{ height: 18, width: "70%" }}
      />
      {/* Dates */}
      <div
        className="skeleton-shimmer rounded mx-auto mb-5"
        style={{ height: 11, width: "55%" }}
      />

      {/* Day count */}
      <div className="flex items-baseline justify-center gap-2">
        <div className="skeleton-shimmer rounded-lg" style={{ height: 36, width: 64 }} />
        <div className="skeleton-shimmer rounded-full" style={{ height: 14, width: 56 }} />
      </div>
    </div>
  );
}

export default function GraveyardLoading() {
  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="skeleton-shimmer rounded-xl mb-2" style={{ height: 34, width: 192 }} />
        <div className="skeleton-shimmer rounded-lg mb-8" style={{ height: 14, width: 260 }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TombstoneSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
