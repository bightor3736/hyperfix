import { TrendingUp, Ban, Brain } from "lucide-react";
import { Reveal } from "./Reveal";

const stats = [
  {
    icon: <TrendingUp size={18} strokeWidth={2} />,
    stat: "134M+",
    label: "views on the hyperfixation + dopamine content that showed us what people need",
  },
  {
    icon: <Ban size={18} strokeWidth={2} />,
    stat: "0",
    label: "ads, leaderboards, or competitive pressure — it's your journey, not a race",
  },
  {
    icon: <Brain size={18} strokeWidth={2} />,
    stat: "100%",
    label: "built for executive function struggles, not neurotypical productivity defaults",
  },
];

export function SocialProof() {
  return (
    <section style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <Reveal>
          <div
            className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-xl)] sm:grid-cols-3"
            style={{ background: "var(--line)", border: "1px solid var(--line)" }}
          >
            {stats.map((s) => (
              <div key={s.stat} className="flex flex-col gap-2 p-6" style={{ background: "var(--bg-elevated)" }}>
                <span style={{ color: "var(--energy)" }}>{s.icon}</span>
                <span className="font-display text-[34px] leading-none text-ink tabular-nums">{s.stat}</span>
                <span className="text-[13px] leading-[1.5] text-ink-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
