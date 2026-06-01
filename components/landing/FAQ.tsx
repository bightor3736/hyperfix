"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

const items = [
  {
    q: "What actually is Hyperfix?",
    a: "A personal ADHD accountability app with game mechanics. You track your hyperfixations, earn XP for real actions, and beat the tasks your brain keeps avoiding — all at your own pace. Not a competition, not a habit tracker. Just you and your streak.",
  },
  {
    q: "What does 'proof of action' mean?",
    a: "Instead of just tapping 'done' and lying to yourself, you run a timer for the activity's duration — or write one sentence about what you actually did. XP only drops when you've shown a receipt. It prevents checkbox farming and makes the XP feel earned.",
  },
  {
    q: "Is this just another habit tracker?",
    a: "No. Habit trackers punish you the moment you break a chain. Hyperfix rewards showing up at all — variable XP, jackpots, streak freezes for bad days. And it doesn't care about consistency — it cares that you did something real today.",
  },
  {
    q: "What are streak freezes?",
    a: "Miss-day insurance. Skip a day and a freeze is used automatically so your streak survives. Free players get one a month; Power-Up gets five. Because ADHD brains have hard weeks, and one bad week shouldn't erase everything.",
  },
  {
    q: "Is it free?",
    a: "Yes — the full core experience is free. Unlimited dopamine hits, hyperfixation log, XP, levels, streaks, quests and your stats card. Power-Up adds more streak freezes, boosted jackpot odds, and XP multipliers.",
  },
  {
    q: "Will this actually help my ADHD?",
    a: "It's built around what ADHD brains actually respond to: instant feedback, variable rewards, low-friction starts, and forgiving systems. It won't fix everything — but it makes starting easier, keeps your hyperfixations organized, and rewards you for real effort instead of punishing imperfection.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <Reveal>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--energy)" }}>
                FAQ
              </p>
              <h2 className="font-display leading-[1.05] tracking-tight text-ink" style={{ fontSize: "clamp(30px,4.5vw,44px)" }}>
                Common questions.
              </h2>
              <p className="mt-4 max-w-[280px] text-[15px] leading-[1.6] text-ink-muted">
                Anything else, write us. A real person reads them.
              </p>
            </div>
          </Reveal>

          <ul className="md:col-span-2">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <li key={it.q} className="border-t last:border-b" style={{ borderColor: "var(--line)" }}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-[20px] leading-[1.25] tracking-tight text-ink">{it.q}</span>
                    <span
                      className="relative inline-flex h-6 w-6 flex-shrink-0 items-center justify-center"
                      style={{ color: "var(--energy)" }}
                      aria-hidden="true"
                    >
                      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                      <span
                        className={`absolute h-[1.5px] w-3.5 rounded-full bg-current transition-transform duration-300 ease-out ${isOpen ? "rotate-0" : "rotate-90"}`}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-12 text-[15px] leading-[1.65] text-ink-muted">{it.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
