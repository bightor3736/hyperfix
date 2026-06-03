import { Reveal } from "./Reveal";

const items = [
  {
    headline: "XP you actually earned.",
    body: "Run the timer or write one line about what you did. The XP only drops when you've shown a receipt — so it means something.",
  },
  {
    headline: "A streak that survives a miss.",
    body: "Streak freezes fire automatically when you miss a day. One bad week doesn't erase everything. ADHD isn't linear and your streak shouldn't be either.",
  },
  {
    headline: "Your game. Nobody else's.",
    body: "No leaderboards. No competitive pressure. No shame spirals. What you track, how you level up — that's between you and your streak.",
  },
];

export function SocialProof() {
  return (
    <section style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pb-2">
        <Reveal>
          <div
            className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-xl)] sm:grid-cols-3"
            style={{ background: "var(--line)", border: "1px solid var(--line)" }}
          >
            {items.map((item) => (
              <div key={item.headline} className="flex flex-col gap-3 p-7" style={{ background: "var(--bg-elevated)" }}>
                <p className="font-display text-[20px] leading-[1.2] tracking-tight text-ink">{item.headline}</p>
                <p className="text-[13px] leading-[1.6] text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
