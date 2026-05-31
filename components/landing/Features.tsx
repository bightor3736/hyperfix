const pillars = [
  {
    title: "Log it.",
    body: "Name the obsession. Set today's intensity.",
  },
  {
    title: "Count it.",
    body: "The counter starts the moment you commit.",
  },
  {
    title: "Share it.",
    body: "Export a clean card. Drop it in a Story.",
  },
  {
    title: "Mourn it.",
    body: "When it ends, write the eulogy.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[36px] leading-[1.05] tracking-tight text-ink sm:text-[44px]">
            Four moves. That's the app.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
            No streaks for hydration. No coach. A small civilised place to
            put the thing your brain refuses to let go of.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-10">
          {pillars.map((p) => (
            <article key={p.title}>
              <h3 className="font-display text-[28px] leading-[1.1] tracking-tight text-ink">
                {p.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-ink-muted">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
