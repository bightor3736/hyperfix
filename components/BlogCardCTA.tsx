import Link from "next/link";

export function BlogCardCTA() {
  return (
    <section className="px-6 sm:px-10 py-12 border-t border-[var(--line)]">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
        {/* Card preview */}
        <div
          className="shrink-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 140,
            height: 249,
            border: "1px solid var(--line)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/share/_test"
            alt="Hyperfix shareable card — Severance, 47 days, intensity 9/10"
            width={140}
            height={249}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Text */}
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-3"
            style={{ color: "var(--ink-muted)" }}
          >
            track yours
          </p>
          <h3
            className="font-display text-2xl sm:text-3xl leading-tight tracking-tight mb-3 text-balance"
            style={{ color: "var(--ink)", fontWeight: 600 }}
          >
            Give your obsession
            a home.
          </h3>
          <p
            className="font-sans text-base mb-6 leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
          >
            Log it. Count the days. Export a card and post it. Free forever.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 rounded-full transition-all hover:opacity-95 active:scale-[0.98]"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              textDecoration: "none",
            }}
          >
            Start tracking →
          </Link>
        </div>
      </div>
    </section>
  );
}
