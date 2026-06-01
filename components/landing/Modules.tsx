import { BookOpen, ShieldCheck, Dice5, BrickWall, Flame, Check, Zap, Snowflake, Timer, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Feature sections — Linear discipline (uniform dark glass panels, one accent
 * per block) with Tiimo warmth (serif headlines, friendly copy, rounded UI).
 */

function ModuleShell({
  icon: Icon,
  tint,
  eyebrow,
  title,
  body,
  flip = false,
  children,
}: {
  icon: LucideIcon;
  tint: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div
        className="overflow-hidden rounded-[var(--radius-xl)] glass"
      >
        <div
          className={`grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="max-w-[460px]">
            <div className="mb-5 inline-flex items-center gap-2.5">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px]"
                style={{ background: tint, color: "var(--ink)" }}
              >
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                {eyebrow}
              </span>
            </div>
            <h3 className="font-display leading-[1.08] tracking-tight text-ink" style={{ fontSize: "clamp(26px,3.4vw,38px)" }}>
              {title}
            </h3>
            <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">{body}</p>
          </div>
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </Reveal>
  );
}

function MockCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`soft-card w-full max-w-[380px] rounded-[var(--radius-lg)] p-5 ${className}`}
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--glass-border)" }}
    >
      {children}
    </div>
  );
}

export function Modules() {
  return (
    <section id="features" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <div className="max-w-[640px] mb-12">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Features
            </p>
            <h2 className="font-display leading-[1.05] tracking-tight text-ink" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
              Built for the way ADHD actually works.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
              Four tools, no busywork. Each one earns you XP for doing something real —
              and forgives you when life gets in the way.
            </p>
          </div>
        </Reveal>

        <div className="space-y-5">
          {/* Hyperfixation log */}
          <ModuleShell
            icon={BookOpen}
            tint="var(--pastel-purple)"
            eyebrow="Hyperfixation log"
            title={<>A home for your <span style={{ color: "var(--accent)" }}>obsessions.</span></>}
            body="Log what you're deep in, rate the intensity, and check in daily for XP. When it fades, archive it — and watch your patterns over time."
          >
            <MockCard>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Active fixations</span>
              </div>
              {[
                { name: "Japanese vocab", days: "21d", bars: 5 },
                { name: "Sourdough starters", days: "4d", bars: 3 },
                { name: "90s skateboarding", days: "12d", bars: 4 },
              ].map((f) => (
                <div key={f.name} className="flex items-center justify-between py-2.5" style={{ borderTop: "1px solid var(--line)" }}>
                  <div>
                    <p className="font-sans text-[14px] font-medium text-ink">{f.name}</p>
                    <p className="font-mono text-[10px] text-ink-faint">{f.days} in</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <span key={b} className="h-4 w-1.5 rounded-full" style={{ background: b <= f.bars ? "var(--accent)" : "var(--line)" }} />
                    ))}
                  </div>
                </div>
              ))}
            </MockCard>
          </ModuleShell>

          {/* Proof of action */}
          <ModuleShell
            icon={ShieldCheck}
            tint="var(--pastel-green)"
            eyebrow="Proof of action"
            title={<>XP you <span style={{ color: "var(--accent)" }}>actually earned.</span></>}
            body="No more tapping 'done' and lying to yourself. Run the timer or write one line about what you did. The XP only drops when you've shown your receipt — so it means something."
            flip
          >
            <MockCard>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Proof of action</span>
              </div>
              <div className="text-center py-2">
                <p className="font-display tabular-nums text-ink leading-none" style={{ fontSize: 46 }}>01:24</p>
                <div className="h-2 rounded-full overflow-hidden my-4" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg, var(--accent), var(--xp))" }} />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[13px] font-bold" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                  <Timer size={14} strokeWidth={2.5} /> Running
                </span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold" style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
                <Check size={16} strokeWidth={2.5} /> Claim +8 XP
              </button>
            </MockCard>
          </ModuleShell>

          {/* Dopamine menu */}
          <ModuleShell
            icon={Dice5}
            tint="var(--pastel-pink)"
            eyebrow="Dopamine menu"
            title={<>One tap beats the <span style={{ color: "var(--accent)" }}>doomscroll.</span></>}
            body="Bored or understimulated? Tell it your energy, tap once, and it deals a real activity matched to you — move, create, connect, reset. Don't like it? Reroll. Roughly 1 in 8 pays a 3× jackpot."
          >
            <MockCard>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-ink-muted" style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}>
                  <Dice5 size={11} strokeWidth={2} /> Move
                </span>
                <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: "var(--xp)" }}>+8 XP</span>
              </div>
              <p className="font-display text-[24px] leading-snug text-ink mb-4">Step outside for 90 seconds. Real air.</p>
              <div className="flex items-center gap-2.5">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                  <Zap size={15} strokeWidth={2.5} fill="var(--accent-ink)" /> Give me a hit
                </button>
              </div>
            </MockCard>
          </ModuleShell>

          {/* Beat the Wall */}
          <ModuleShell
            icon={BrickWall}
            tint="var(--pastel-blue)"
            eyebrow="Beat the Wall"
            title={<>Shrink the task you&apos;re <span style={{ color: "var(--accent)" }}>dreading.</span></>}
            body="Can't start? Name the wall and we cut it down to a 2-minute first step. You get rewarded for starting — because starting is the whole battle, and your brain knows it."
            flip
          >
            <MockCard>
              <div className="flex items-center gap-2 mb-3">
                <BrickWall size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">The wall</span>
              </div>
              <p className="font-sans text-[14px] text-ink-muted line-through mb-4">Reply to that email I&apos;ve been avoiding for 6 days</p>
              <div className="rounded-[var(--radius-lg)] p-4 mb-3" style={{ background: "var(--pastel-blue)" }}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-1.5">First step · 2 min</p>
                <p className="font-display text-[18px] leading-snug text-ink">Open the email and read it once. That&apos;s it.</p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold" style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
                <Check size={16} strokeWidth={2.5} /> I started it
              </button>
            </MockCard>
          </ModuleShell>
        </div>

        {/* Forgiving streaks — quiet full-width banner */}
        <Reveal>
          <div className="mt-5 overflow-hidden rounded-[var(--radius-xl)] glass p-8 sm:p-12">
            <div className="flex flex-col items-center text-center max-w-[620px] mx-auto">
              <div className="inline-flex items-center gap-2 mb-5">
                <Flame size={22} strokeWidth={2} fill="var(--flame)" style={{ color: "var(--flame)" }} />
                <Snowflake size={20} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="font-display leading-[1.08] tracking-tight text-ink" style={{ fontSize: "clamp(26px,3.6vw,40px)" }}>
                A streak that survives a bad week.
              </h3>
              <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
                ADHD isn&apos;t linear, so your streak shouldn&apos;t snap the first day you miss. Streak freezes
                kick in automatically. Miss a day, your run survives. No reset to zero. No guilt spiral.
              </p>
              <div className="mt-7 flex items-center gap-1.5">
                {[1, 1, 1, 0, 1, 1, 1].map((on, idx) => (
                  <span
                    key={idx}
                    className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                    style={{ background: on ? "var(--flame)" : "var(--bg-elevated)", border: on ? "none" : "1px solid var(--line)" }}
                  >
                    {on ? (
                      <Flame size={15} strokeWidth={2} fill="#fff" style={{ color: "#fff" }} />
                    ) : (
                      <Snowflake size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
                    )}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] text-ink-faint">Day 4 missed — freeze used automatically. Streak intact.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
