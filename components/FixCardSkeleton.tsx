export function FixCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
      }}
    >
      {/* Title bar */}
      <div
        className="skeleton-shimmer rounded-md mb-2"
        style={{ height: 18, width: "70%" }}
      />

      {/* Category + pill row */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="skeleton-shimmer rounded-full"
          style={{ height: 18, width: 52 }}
        />
        <div
          className="skeleton-shimmer rounded-full"
          style={{ height: 18, width: 80 }}
        />
      </div>

      {/* Big day number block */}
      <div
        className="skeleton-shimmer rounded-md mb-3"
        style={{ height: 44, width: 64 }}
      />

      {/* Intensity bar */}
      <div
        className="skeleton-shimmer rounded-full"
        style={{ height: 4, width: "100%" }}
      />
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <FixCardSkeleton key={i} />
      ))}
    </div>
  );
}
