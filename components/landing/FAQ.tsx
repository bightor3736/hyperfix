"use client";

import { useState } from "react";

const items = [
  {
    q: "What counts as a hyperfixation?",
    a: "Anything you cannot stop thinking about. A song, a series, a fictional man. If you have brought it up in three conversations this week, log it.",
  },
  {
    q: "Is this a habit tracker with a darker font?",
    a: "No. Habit trackers reward consistency. Hyperfix records intensity.",
  },
  {
    q: "Do my fixes have to be public?",
    a: "No. Every fix has a public switch, and it is off by default.",
  },
  {
    q: "What is the graveyard?",
    a: "When a fix ends, it moves there with the date, the duration, and the eulogy you wrote.",
  },
  {
    q: "Free forever, really?",
    a: "Three active fixes is enough to find out if this is for you. Pro is for once you know.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes, from settings, instantly. Pro can export the graveyard first.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h2 className="font-display text-[36px] leading-[1.05] tracking-tight text-ink sm:text-[44px]">
              Common questions.
            </h2>
            <p className="mt-4 max-w-[280px] text-[15px] leading-[1.6] text-ink-muted">
              Anything else, write us. A person reads them.
            </p>
          </div>

          <ul className="md:col-span-2">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <li key={it.q} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-[20px] leading-[1.25] tracking-tight text-ink">
                      {it.q}
                    </span>
                    <span
                      className="relative inline-flex h-6 w-6 flex-shrink-0 items-center justify-center text-ink-muted"
                      aria-hidden="true"
                    >
                      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                      <span
                        className={`absolute h-[1.5px] w-3.5 rounded-full bg-current transition-transform duration-300 ease-out ${
                          isOpen ? "rotate-0" : "rotate-90"
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-12 text-[15px] leading-[1.65] text-ink-muted">
                        {it.a}
                      </p>
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
