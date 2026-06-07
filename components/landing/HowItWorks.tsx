"use client";

import { BookOpen, Clock, Timer, Flame, Snowflake, Sparkles, Check, Zap, Trophy } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * "How it works" — the 5-step Hyperfix loop, rebuilt in a strict
 * neo-brutalist style: thick black borders, hard offset shadows, flat
 * color blocks, square corners, mono labels. Each step's demo card gets
 * its own flat accent so the section reads loud and varied.
 */

export function HowItWorks() {
  return (
    <section id="features" className="px-5 py-24 sm:px-8 sm:py-28" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1080px]">
        {/* Section header */}
        <Reveal>
          <div className="mb-20 text-center">
            <span className="brutal-tag mb-6" style={{ background: "var(--lime)", color: "var(--ink)" }}>
              <Zap size={13} strokeWidth={3} /> How it works
            </span>
            <h2
              className="font-bold leading-[0.95] text-ink"
              style={{ fontSize: "clamp(34px,5.5vw,62px)", letterSpacing: "-0.03em" }}
            >
              The whole loop,
              <br />
              <span
                className="mt-2 inline-block px-3"
                style={{
                  background: "var(--yellow)",
                  color: "var(--ink)",
                  border: "3.5px solid var(--ink)",
                  boxShadow: "7px 7px 0 0 var(--ink)",
                  transform: "rotate(-1deg)",
                }}
              >
                built for your brain.
              </span>
            </h2>
            <p className="mx-auto mt-7 max-w-[480px] text-[17px] font-medium leading-[1.5] text-ink-muted">
              Log what you&apos;re into, get a hit, prove you did it, keep a streak that forgives you. Five steps, no busywork.
            </p>
          </div>
        </Reveal>

        {/* Step 1 — card left, text right */}
        <Step
          n="1"
          color="var(--yellow)"
          title="Log your hyperfixation"
          body="Drop in whatever you're deep in right now — a show, a song, a language, a person. Rate the intensity and check in daily. Hyperfix gives it a home instead of letting it live in 40 browser tabs."
          card={<FixationCard />}
          flip
        />

        {/* Step 2 — text left */}
        <Step
          n="2"
          color="var(--violet)"
          title="Go deep, earn XP"
          body="Answer a quick prompt about your fixation — what pulled you in, the thing that surprised you, the next rabbit hole. Every deep dive earns XP and builds a real record of your obsession. Brain bursts let you dump a stray thought before it's gone."
          card={<DeepDiveCard />}
        />

        {/* Step 3 — card left */}
        <Step
          n="3"
          color="var(--blue)"
          title="Prove you did it"
          body="No more tapping 'done' and lying to yourself. Run the timer or write one line about what you actually did. XP only drops when you've shown a receipt — so it means something."
          card={<ProofCard />}
          flip
        />

        {/* Step 4 — text left */}
        <Step
          n="4"
          color="var(--coral)"
          title="Keep a streak that survives"
          body="ADHD isn't linear, so your streak shouldn't snap the first day you miss. Streak freezes kick in automatically. Miss a day, your run survives. No reset to zero, no guilt spiral."
          card={<StreakCard />}
        />

        {/* Step 5 — centered finish */}
        <Reveal>
          <div
            className="relative mx-auto max-w-[640px] p-8 text-center sm:p-12"
            style={{
              background: "var(--lime)",
              border: "3.5px solid var(--ink)",
              borderRadius: 8,
              boxShadow: "10px 10px 0 0 var(--ink)",
            }}
          >
            <span
              className="mb-5 inline-flex h-12 w-12 items-center justify-center font-bold text-[20px]"
              style={{
                background: "var(--bg-elevated)",
                color: "var(--ink)",
                border: "3px solid var(--ink)",
                borderRadius: 6,
                boxShadow: "4px 4px 0 0 var(--ink)",
              }}
            >
              5
            </span>
            <h3
              className="font-bold leading-tight text-ink"
              style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-0.03em" }}
            >
              Level up.
            </h3>
            <p className="mx-auto mt-3 max-w-[460px] text-[16px] font-medium leading-[1.5] text-ink-muted">
              Watch your XP climb through seven levels — Mildly Curious all the way to Clinically Obsessed.
              Unlock badges, customize your profile, and share a card that&apos;s unmistakably yours.
            </p>
            <a
              href="/auth/signup"
              className="brutal-btn mt-8 h-[54px] px-7 text-[16px]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              <Trophy size={18} strokeWidth={3} /> Start playing — free
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  body,
  card,
  color,
  flip = false,
}: {
  n: string;
  title: string;
  body: string;
  card: React.ReactNode;
  color: string;
  flip?: boolean;
}) {
  return (
    <Reveal>
      <div className="mb-24 grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className={flip ? "order-1 md:order-1" : "order-1 md:order-2"}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center font-bold text-[18px]"
              style={{
                background: color,
                color: "var(--ink)",
                border: "2.5px solid var(--ink)",
                borderRadius: 6,
                boxShadow: "4px 4px 0 0 var(--ink)",
              }}
            >
              {n}
            </span>
            <h3
              className="font-bold leading-tight text-ink"
              style={{ fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.03em" }}
            >
              {title}
            </h3>
          </div>
          <p className="mt-5 text-[16px] font-medium leading-[1.6] text-ink-muted">{body}</p>
        </div>
        <div className={flip ? "order-2 md:order-2" : "order-2 md:order-1"}>{card}</div>
      </div>
    </Reveal>
  );
}

/* ── Brutalist card shell — thick border, hard shadow, flat tinted base. ── */
function CardShell({ tint, children }: { tint: string; children: React.ReactNode }) {
  return (
    <div
      className="brutal-hover p-5 sm:p-6"
      style={{
        background: tint,
        border: "3.5px solid var(--ink)",
        borderRadius: 8,
        boxShadow: "7px 7px 0 0 var(--ink)",
      }}
    >
      {children}
    </div>
  );
}

function Label({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
      style={{ background: "var(--bg-elevated)", border: "2px solid var(--ink)", borderRadius: 999, color: "var(--ink)" }}
    >
      {icon}
      {children}
    </span>
  );
}

function FixationCard() {
  return (
    <CardShell tint="var(--yellow)">
      <div className="mb-4">
        <Label icon={<BookOpen size={11} strokeWidth={3} />}>Active fixations</Label>
      </div>
      <div style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 6 }}>
        {[
          { name: "Japanese vocab", days: "21d", bars: 5 },
          { name: "Sourdough starters", days: "4d", bars: 3 },
          { name: "90s skateboarding", days: "12d", bars: 4 },
        ].map((f, idx) => (
          <div
            key={f.name}
            className="flex items-center justify-between px-3.5 py-3"
            style={{ borderTop: idx === 0 ? "none" : "2.5px solid var(--ink)" }}
          >
            <div>
              <p className="text-[15px] font-bold text-ink" style={{ letterSpacing: "-0.01em" }}>{f.name}</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-faint">{f.days} in</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((b) => (
                <span
                  key={b}
                  className="h-5 w-2.5"
                  style={{ background: b <= f.bars ? "var(--coral)" : "var(--bg)", border: "2px solid var(--ink)" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function DeepDiveCard() {
  return (
    <CardShell tint="var(--violet)">
      <div className="mb-4 flex items-center justify-between">
        <Label icon={<Sparkles size={11} strokeWidth={3} />}>Deep dive</Label>
        <span
          className="px-2.5 py-1 font-mono text-[12px] font-bold tabular-nums"
          style={{ background: "var(--bg-elevated)", border: "2px solid var(--ink)", borderRadius: 6, color: "var(--xp)" }}
        >
          +8 XP
        </span>
      </div>
      <p className="mb-3 text-[24px] font-bold leading-snug" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
        What pulled you in?
      </p>
      <div
        className="mb-4 px-3.5 py-3 text-[13px] font-medium text-ink"
        style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
      >
        It started with one video at 2am and now I&apos;ve read every wiki page…
      </div>
      <button className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
        <Check size={16} strokeWidth={3} /> Save — +8 XP
      </button>
    </CardShell>
  );
}

function ProofCard() {
  return (
    <CardShell tint="var(--blue)">
      <div className="mb-4">
        <Label icon={<Clock size={11} strokeWidth={3} />}>Proof of action</Label>
      </div>
      <div
        className="px-4 py-5 text-center"
        style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
      >
        <p className="font-bold leading-none tabular-nums text-ink" style={{ fontSize: 48, letterSpacing: "-0.03em" }}>01:24</p>
        <div className="mt-4 h-4 overflow-hidden" style={{ background: "var(--bg)", border: "2.5px solid var(--ink)", borderRadius: 4 }}>
          <div className="h-full" style={{ width: "62%", background: "var(--lime)", borderRight: "2.5px solid var(--ink)" }} />
        </div>
      </div>
      <div className="my-4 flex items-center justify-center">
        <span
          className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-wider"
          style={{ background: "var(--lime)", color: "var(--ink)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
        >
          <Timer size={14} strokeWidth={3} /> Running
        </span>
      </div>
      <button className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
        <Check size={16} strokeWidth={3} /> Claim <span style={{ color: "var(--xp)" }}>+8 XP</span>
      </button>
    </CardShell>
  );
}

function StreakCard() {
  return (
    <CardShell tint="var(--coral)">
      <div className="mb-4">
        <Label icon={<Flame size={11} strokeWidth={3} fill="var(--ink)" />}>14-day streak</Label>
      </div>
      <div
        className="flex items-center justify-center gap-1.5 px-2 py-4"
        style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
      >
        {[1, 1, 1, 0, 1, 1, 1].map((on, idx) => (
          <span
            key={idx}
            className="flex h-9 w-9 items-center justify-center"
            style={{
              background: on ? "var(--flame)" : "var(--blue)",
              border: "2.5px solid var(--ink)",
              borderRadius: 6,
            }}
          >
            {on ? (
              <Flame size={15} strokeWidth={2.5} fill="#fff" style={{ color: "#fff" }} />
            ) : (
              <Snowflake size={15} strokeWidth={2.5} style={{ color: "#fff" }} />
            )}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
        Day 4 missed — freeze used. Streak intact.
      </p>
    </CardShell>
  );
}
