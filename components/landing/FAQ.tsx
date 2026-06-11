"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What actually is Hyperfix?", a: "An ADHD app that gets you over the starting line on the task you've been avoiding. Name the thing, break it into tiny steps with AI, do just 5 minutes — and earn XP for starting, not for being perfect." },
  { q: "Why XP for starting instead of finishing?", a: "Because for ADHD brains, starting is the hard part. If the win is 'I began', you get a real hit of success every time. Finishing takes care of itself once you've crossed the line." },
  { q: "What are streak freezes?", a: "Miss-day insurance. Skip a day and a freeze activates automatically so your streak survives. Free players get 1/month; Power-Up gets 5. ADHD brains have hard weeks — one bad week shouldn't erase everything." },
  { q: "What does the AI task breakdown do?", a: "When you add a task, tap 'Break it down' and the AI splits it into 3 absurdly small first steps — so small you can't say no. It's the difference between 'do my taxes' and 'open the folder'." },
  { q: "Is it really free?", a: "Yes — the full core loop is free. Tasks, AI breakdowns (5/month), focus timer, XP, levels, streaks, daily quests. Power-Up adds unlimited AI breakdowns, 5 freezes, 1.5× XP, and premium themes." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ background: "#f5f5f7", padding: "120px 0" }}>
      <div className="container-sm">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="apple-label" style={{ color: "#7c3aed", marginBottom: 16 }}>FAQ</div>
          <h2 className="apple-headline-lg" style={{ color: "#1d1d1f" }}>Questions answered.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqs.map((f, i) => (
            <div
              key={f.q}
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.012em" }}>{f.q}</span>
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  color="#aeaeb2"
                  style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                />
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 20px", fontSize: 15, color: "#6e6e73", lineHeight: 1.65, letterSpacing: "-0.009em" }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
