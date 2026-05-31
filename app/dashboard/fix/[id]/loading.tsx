export default function FixDetailLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-5 w-20 rounded-lg" style={{ background: "var(--line)" }} />
          <div className="h-8 w-16 rounded-full" style={{ background: "var(--line)" }} />
        </div>
        <div className="h-6 w-24 rounded-full mb-4" style={{ background: "var(--line)" }} />
        <div className="h-12 w-3/4 rounded-xl mb-6" style={{ background: "var(--line)" }} />
        <div className="rounded-2xl h-40 mb-4" style={{ background: "transparent", border: "1px solid var(--line)" }} />
        <div className="rounded-2xl h-24 mb-4" style={{ background: "transparent", border: "1px solid var(--line)" }} />
        <div className="rounded-2xl h-20" style={{ background: "transparent", border: "1px solid var(--line)" }} />
      </div>
    </div>
  );
}
