const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function FixCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
      />

      {/* Category + status pills */}
      <div className="relative flex items-center gap-2 mb-4">
        <div className="skeleton-shimmer rounded-full" style={{ height: 22, width: 64 }} />
        <div className="skeleton-shimmer rounded-full" style={{ height: 22, width: 52 }} />
      </div>

      {/* Title */}
      <div className="skeleton-shimmer rounded-lg mb-1" style={{ height: 20, width: "75%" }} />
      <div className="skeleton-shimmer rounded-lg mb-5" style={{ height: 20, width: "50%" }} />

      {/* Day counter */}
      <div className="flex items-baseline gap-3 mb-1">
        <div className="skeleton-shimmer rounded-lg" style={{ height: 52, width: 72 }} />
        <div className="skeleton-shimmer rounded-full" style={{ height: 18, width: 80 }} />
      </div>

      {/* Date row */}
      <div className="skeleton-shimmer rounded" style={{ height: 12, width: 160, marginTop: 10 }} />
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
