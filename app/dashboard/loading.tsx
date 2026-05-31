export default function DashboardLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-32 rounded-xl" style={{ background: "var(--line)" }} />
          <div className="h-8 w-24 rounded-full" style={{ background: "var(--line)" }} />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-20" style={{ background: "transparent", border: "1px solid var(--line)" }} />
          ))}
        </div>
        {/* Fix cards */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-28" style={{ background: "transparent", border: "1px solid var(--line)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
