"use client";

import { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    q: "What actually is Hyperfix?",
    a: "An ADHD app that gets you over the starting line on the task you've been avoiding. Name the thing, shrink it to the smallest first move, do just 5 minutes — and earn XP for starting, not for being perfect. Built for task paralysis, not for tracking.",
  },
  {
    q: "Why does it reward starting instead of finishing?",
    a: "Because for ADHD brains, starting is the hard part — task initiation is the actual wall. If the win is 'I began', you get a real hit of success every time, which is exactly what makes you come back. Finishing takes care of itself once you've crossed the line.",
  },
  {
    q: "What's the '5-minute' thing?",
    a: "The deal: commit to just a few minutes, and you're allowed to quit after. Most of the time you won't want to — momentum takes over. It works because it drops the barrier from 'finish this huge thing' to 'do 5 minutes', which is what gets a stuck brain moving.",
  },
  {
    q: "What are streak freezes?",
    a: "Miss-day insurance. Skip a day and a freeze is used automatically so your streak survives. Free players get one a month; Power-Up gets five. ADHD brains have hard weeks — one bad week shouldn't erase everything, and you'll never get a shaming 'streak lost'.",
  },
  {
    q: "Is it free?",
    a: "Yes — the full core loop is free. Unlimited tasks, the focus timer, XP, levels, streaks, daily quests, and your shareable card. Power-Up adds a 1.5× XP multiplier, five streak freezes a month, and premium profile themes.",
  },
  {
    q: "Will this actually help my ADHD?",
    a: "It's built around what ADHD brains respond to: instant feedback, tiny low-friction starts, rewards for showing up, and forgiving systems that never punish a bad day. It won't fix everything — but it makes starting the thing you're dreading genuinely easier.",
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
                className="anim-fadeUp mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold"
                style={{ background: "var(--pastel-pink)", color: "var(--pink)" }}
              >
                <HelpCircle size={14} strokeWidth={2.5} /> FAQ
              </span>
              <h2
                className="anim-fadeUp delay-100 leading-[1.05] text-ink"
                style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Frequently
                <br />
                asked
                <br />
                <span style={{ color: "var(--accent)" }}>questions.</span>
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
                      background: isOpen ? "var(--accent-soft)" : "var(--bg-elevated)",
                      border: "1px solid var(--line)",
                      borderRadius: 24,
                      boxShadow: isOpen ? "var(--shadow-lg)" : "var(--shadow-sm)",
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
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: isOpen ? "var(--accent)" : "var(--bg-soft)" }}
                      >
                        <Plus
                          size={18}
                          strokeWidth={2.5}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                          style={{ color: isOpen ? "#fff" : "var(--ink)" }}
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
