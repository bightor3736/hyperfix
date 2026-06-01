import { Flame, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const quotes = [
  {
    text: "I've been hyperfixating on Japanese vocab for three weeks. Having somewhere to actually log it and check in — and get XP for still being in it — makes it feel real instead of just chaotic.",
    name: "maya",
    meta: "21-day streak · Level 4",
    icon: Flame,
  },
  {
    text: "The proof timer is what got me. I can't just tap done anymore. I have to actually run 30 seconds of it or write what I did. Sounds annoying. It's not. It means my XP is mine.",
    name: "theo",
    meta: "63 verified hits",
    icon: Zap,
  },
  {
    text: "I finally archived a hyperfixation. Months of notes, links, half-finished things — and I marked it done. +15 XP. That felt more real than finishing any task I've ever had.",
    name: "elise",
    meta: "7 fixations logged",
    icon: Zap,
  },
  {
    text: "Streak freezes are the whole reason I'm still here. I had a brutal week, missed three days. It didn't reset me. Every other app would've crushed me and I'd have quit. I didn't quit.",
    name: "sam",
    meta: "38-day streak",
    icon: Flame,
  },
];

export function Testimonials() {
  return (
    <section style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="max-w-[600px] mb-12">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--energy)" }}>
              From people who get it
            </p>
            <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
              <span className="text-ink">The app that </span>
              <span className="text-game-gradient">actually stuck.</span>
            </h2>
          </div>
        </Reveal>

        <div className="columns-1 gap-5 sm:columns-2">
          {quotes.map((q, idx) => {
            const Icon = q.icon;
            return (
              <Reveal key={q.name} delay={(idx % 2) * 80}>
                <figure
                  className="mb-5 break-inside-avoid rounded-[var(--radius-lg)] p-6"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
                >
                  <blockquote className="text-[15px] leading-[1.6] text-ink">&ldquo;{q.text}&rdquo;</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full font-display text-[15px]"
                      style={{ background: "var(--energy)", color: "var(--accent-ink)" }}
                    >
                      {q.name[0].toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-[13px] font-medium text-ink">@{q.name}</p>
                      <p className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-faint">
                        <Icon size={11} strokeWidth={2} style={{ color: "var(--energy)" }} />
                        {q.meta}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
