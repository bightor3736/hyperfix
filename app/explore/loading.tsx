import { FixCardSkeleton } from "@/components/FixCardSkeleton";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading placeholder */}
        <div className="skeleton-shimmer rounded-xl mb-3" style={{ height: 32, width: 192 }} />
        <div className="skeleton-shimmer rounded-lg mb-8" style={{ height: 14, width: 260 }} />

        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer rounded-full"
              style={{ height: 30, width: 88 }}
            />
          ))}
        </div>

        {/* Masonry / responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <FixCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
