"use client";

import { useState } from "react";

const items = [
  {
    q: "What is hyperfixation?",
    a: "Hyperfixation is when your brain locks onto something with an intensity that's hard to explain to people who don't experience it. It's common in ADHD and autism. Hyperfix is built around it.",
  },
  {
    q: "How is this different from a habit tracker?",
    a: "Habit trackers reward consistency. Hyperfix records intensity. You're not trying to build a routine — you're documenting an experience that's happening to you whether you like it or not.",
  },
  {
    q: "Can I keep my fixes private?",
    a: "Yes. Every fix has a privacy toggle. Public lives on your profile. Private is yours alone. We never sell your data.",
  },
  {
    q: "What's the graveyard?",
    a: "When a fix ends, you write the eulogy and it moves to your graveyard — a quiet room you can walk back into anytime. It's not a failure. It's an archive.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Logging, check-ins, streaks, share cards, and the graveyard are all free forever. Pro unlocks unlimited fixes, premium templates, AI eulogies, and full analytics.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Settings → Delete account. Your data is gone within 24 hours. You can also export everything before you go.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-[36px] leading-[1.05] tracking-tight sm:text-[44px]" style={{ color: "var(--ink)" }}>
              Questions.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6]" style={{ color: "var(--ink-muted)" }}>
              The ones people actually ask.
            </p>
          </div>

          <ul className="flex flex-col">
            {items.map((item, i) => (
              <li key={i} style={{ borderTop: "1px solid var(--line)" }}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-[16px] font-medium" style={{ color: "var(--ink)" }}>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-[18px] transition-transform"
                    style={{
                      border: "1px solid var(--line)",
                      color: "var(--ink-muted)",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <p className="pb-5 text-[14px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>
                    {item.a}
                  </p>
                )}
              </li>
            ))}
            <li style={{ borderTop: "1px solid var(--line)" }} />
          </ul>
        </div>
      </div>
    </section>
  );
}
