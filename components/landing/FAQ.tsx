"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "What is Hyperfix?", a: "An ADHD app that gets you over the starting line on the task you've been avoiding. Name the thing, AI breaks it into tiny steps, do just 5 minutes — and earn XP for starting, not for being perfect." },
  { q: "Why does it reward starting instead of finishing?", a: "Because for ADHD brains, starting is the hard part. If the win is 'I began', you get a real hit of success every time. Finishing takes care of itself once you've crossed the line." },
  { q: "What does the AI task breakdown do?", a: "When you add a task, tap 'Break it down' and the AI splits it into 3 absurdly small first steps. It's the difference between 'do my taxes' and 'open the folder'. Free users get 5 per month, Power-Up is unlimited." },
  { q: "What are streak freezes?", a: "Miss-day insurance. Skip a day and a freeze activates automatically so your streak survives. Free players get 1 per month, Power-Up gets 5. We never tell you 'you lost your streak.'" },
  { q: "Is it actually free?", a: "Yes — the full core loop is free. Tasks, AI breakdowns (5/month), focus timer, XP, levels, streaks, and daily quests. Power-Up adds unlimited AI breakdowns, more freezes, 1.5× XP, and premium themes." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", padding: "100px 0" }}>
      <div className="wrap-sm">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>FAQ</div>
          <h2 className="display-lg">Common questions.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqs.map((f, i) => (
            <div
              key={f.q}
              style={{
                background: "var(--bg-white)",
                borderRadius: 12,
                border: "1px solid var(--line)",
                overflow: "hidden",
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
                  padding: "18px 22px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.012em" }}>{f.q}</span>
                {open === i
                  ? <Minus size={16} strokeWidth={2} color="#A1A1AA" style={{ flexShrink: 0 }} />
                  : <Plus size={16} strokeWidth={2} color="#A1A1AA" style={{ flexShrink: 0 }} />
                }
              </button>
              {open === i && (
                <div style={{ padding: "0 22px 18px", fontSize: 14, color: "#71717A", lineHeight: 1.65 }}>
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
