export default function ExploreLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-24" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl mb-2" style={{ background: "rgba(244,244,244,0.06)" }} />
        <div className="h-4 w-64 rounded-lg mb-8" style={{ background: "rgba(244,244,244,0.04)" }} />
        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 rounded-full" style={{ background: "rgba(244,244,244,0.06)" }} />
          ))}
        </div>
        {/* Cards */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl h-24" style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.06)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
