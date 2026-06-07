"use client";

import { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";
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
    a: "No. Habit trackers punish you the moment you break a chain. Hyperfix is built around what you're already obsessed with — you earn XP for logging it, going deeper on it, and following through. Streak freezes cover the bad days. It cares that you did something real, not that you were perfect.",
  },
  {
    q: "What are streak freezes?",
    a: "Miss-day insurance. Skip a day and a freeze is used automatically so your streak survives. Free players get one a month; Power-Up gets five. Because ADHD brains have hard weeks, and one bad week shouldn't erase everything.",
  },
  {
    q: "Is it free?",
    a: "Yes — the full core experience is free. Unlimited hyperfixation logs, deep dives, brain bursts, XP, levels, streaks, daily quests, the focus timer and your shareable stats card. Power-Up adds more streak freezes, an XP multiplier, and premium profile themes.",
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
      <div className="mx-auto max-w-[1100px] px-5 py-24 sm:px-8 sm:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <Reveal>
            <div className="md:sticky md:top-28">
              <span
                className="brutal-tag anim-fadeUp mb-6"
                style={{ background: "var(--pink)", color: "var(--ink)" }}
              >
                <HelpCircle size={13} strokeWidth={3} /> FAQ
              </span>
              <h2
                className="anim-fadeUp delay-100 leading-[0.98] text-ink"
                style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em" }}
              >
                Frequently
                <br />
                asked
                <br />
                <span
                  className="inline-block px-2 mt-1"
                  style={{ background: "var(--yellow)", color: "var(--ink)", border: "2.5px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)", transform: "rotate(-1.5deg)" }}
                >
                  questions.
                </span>
              </h2>
              <p className="anim-fadeUp delay-200 mt-7 max-w-[300px] text-[16px] font-medium leading-[1.5] text-ink-muted">
                Anything else, write us. A real person reads them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-4">
              {items.map((it, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={it.q}
                    style={{
                      background: isOpen ? "var(--lime)" : "var(--bg-elevated)",
                      border: "2.5px solid var(--ink)",
                      borderRadius: 8,
                      boxShadow: isOpen ? "7px 7px 0 0 var(--ink)" : "4px 4px 0 0 var(--ink)",
                      transition: "box-shadow 0.15s ease, background 0.15s ease",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[16px] font-bold leading-snug text-ink" style={{ letterSpacing: "-0.01em" }}>{it.q}</span>
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center"
                        style={{ background: isOpen ? "var(--ink)" : "var(--bg-soft)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
                      >
                        <Plus
                          size={18}
                          strokeWidth={3}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                          style={{ color: isOpen ? "var(--bg)" : "var(--ink)" }}
                        />
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 text-[14px] font-medium leading-[1.65] text-ink" style={{ opacity: 0.85 }}>{it.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
