"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is a hyperfixation?",
    answer:
      "A hyperfixation is an intense, all-consuming interest in a specific topic, hobby, show, game, or anything else that captures your attention. Common in ADHD and neurodivergent brains, hyperfixations come on strong and can fade just as quickly.",
  },
  {
    question: "Why would I track my hyperfixations?",
    answer:
      "Tracking helps you understand your patterns, remember what you loved, and create a personal archive of your interests. It's also oddly satisfying to watch the day counter go up.",
  },
  {
    question: "What happens when a hyperfixation ends?",
    answer:
      "You send it to the Graveyard — a dedicated space to honor past obsessions. Write a eulogy, remember the good times, and move on to the next one.",
  },
  {
    question: "Is this app only for people with ADHD?",
    answer:
      "Nope! While it's designed with ADHD brains in mind, anyone who experiences intense interests can benefit. If you've ever stayed up until 3am researching something random, this app is for you.",
  },
  {
    question: "Can I share my fixes with friends?",
    answer:
      "Yes! You can share individual fix cards or your entire profile. Great for showing friends what you're currently obsessed with or bonding over shared interests.",
  },
  {
    question: "Is my data private?",
    answer:
      "By default, your fixes are private. You can choose to make individual fixes or your profile public if you want to share. We never sell your data or use it for advertising.",
  },
];

export function FAQFoku() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28 px-6" style={{ background: "#EEF4FF" }}>
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="font-light tracking-tight"
            style={{ color: "#1A1A2E", fontSize: "clamp(28px, 5vw, 40px)" }}
          >
            Questions & answers
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ background: "#ffffff" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-opacity-80"
              >
                <span className="font-medium pr-4" style={{ color: "#1A1A2E" }}>
                  {faq.question}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5B8DEF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
