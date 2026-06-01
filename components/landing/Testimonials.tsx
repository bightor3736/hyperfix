import { Flame, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const quotes = [
  {
    text: "First app that doesn't make me feel guilty. I open it bored, it gives me one thing, I do it, I get a hit. That's it. My brain loves it.",
    name: "maya",
    meta: "21-day streak",
    icon: Flame,
  },
  {
    text: "The reroll button is genius. Half the battle is not being able to pick. It picks for me and I just go.",
    name: "theo",
    meta: "Level 5 · Unwell",
    icon: Zap,
  },
  {
    text: "I replaced my 'open phone and scroll for 40 minutes' reflex with this. The jackpot thing actually got me. I want the jackpot.",
    name: "elise",
    meta: "63 dopamine hits",
    icon: Zap,
  },
  {
    text: "Streak freezes are the whole reason I'm still here. I missed two days and it didn't punish me. Every other app would've reset me to zero and I'd have quit.",
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
              <span className="text-ink">The only app they </span>
              <span className="text-game-gradient">didn&apos;t abandon.</span>
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
                      className="flex h-9 w-9 items-center justify-center rounded-full font-display text-[15px] text-white"
                      style={{ background: "var(--energy)" }}
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
