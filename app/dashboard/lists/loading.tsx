export default function ListsLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "#0A0A0A" }}>
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-8 w-36 rounded-xl mb-8" style={{ background: "rgba(244,244,244,0.06)" }} />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-28" style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.06)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
