export default function GraveyardLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-48 rounded-xl mb-2" style={{ background: "rgba(244,244,244,0.06)" }} />
        <div className="h-5 w-64 rounded-lg mb-8" style={{ background: "rgba(244,244,244,0.04)" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl h-52" style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.06)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
