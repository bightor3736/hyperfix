export default function ListsLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-8 w-36 rounded-xl mb-8" style={{ background: "var(--line)" }} />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-28" style={{ background: "transparent", border: "1px solid var(--line)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
