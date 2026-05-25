export default function FixDetailLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-5 w-20 rounded-lg" style={{ background: "rgba(244,244,244,0.06)" }} />
          <div className="h-8 w-16 rounded-full" style={{ background: "rgba(244,244,244,0.06)" }} />
        </div>
        <div className="h-6 w-24 rounded-full mb-4" style={{ background: "rgba(244,244,244,0.06)" }} />
        <div className="h-12 w-3/4 rounded-xl mb-6" style={{ background: "rgba(244,244,244,0.06)" }} />
        <div className="rounded-2xl h-40 mb-4" style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.06)" }} />
        <div className="rounded-2xl h-24 mb-4" style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.06)" }} />
        <div className="rounded-2xl h-20" style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.06)" }} />
      </div>
    </div>
  );
}
