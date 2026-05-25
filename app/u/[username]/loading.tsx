import { FixCardSkeleton } from "@/components/FixCardSkeleton";

const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      {/* Banner skeleton */}
      <div
        className="w-full skeleton-shimmer"
        style={{
          height: 220,
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16">
        {/* Avatar + name row */}
        <div className="flex items-end gap-4 mb-8">
          <div
            className="skeleton-shimmer rounded-full shrink-0"
            style={{
              width: 96,
              height: 96,
              border: "3px solid #0A0A0A",
            }}
          />
          <div className="flex-1 pb-2">
            <div
              className="skeleton-shimmer rounded-lg mb-2"
              style={{ height: 28, width: "55%" }}
            />
            <div
              className="skeleton-shimmer rounded-lg"
              style={{ height: 14, width: "30%" }}
            />
          </div>
        </div>

        {/* Bio placeholder */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="skeleton-shimmer rounded mb-2" style={{ height: 12, width: "85%" }} />
          <div className="skeleton-shimmer rounded" style={{ height: 12, width: "55%" }} />
        </div>

        {/* Fix grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <FixCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
