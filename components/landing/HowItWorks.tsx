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
              Name the thing you&apos;re avoiding, shrink it, do five minutes, get rewarded for starting — and keep a streak that forgives you. No busywork.
            </p>
          </div>
        </Reveal>

        {/* Step 1 — card left, text right */}
        <Step
          n="1"
          color="var(--coral)"
          title="Name what you're avoiding"
          body="Type in the thing you've been dreading — the email, the form, the gym bag by the door. Getting it out of your head and onto the screen is the first crack in the wall. Hyperfix keeps your avoided tasks so they stop haunting you in the background."
          card={<AvoidCard />}
          flip
        />

        {/* Step 2 — text left */}
        <Step
          n="2"
          color="var(--violet)"
          title="Shrink it, do 5 minutes"
          body="Pick the smallest possible first move — open the doc, write one line — and start a tiny timer. The deal: do five minutes, then you're allowed to quit. You usually won't want to. That's the whole trick to beating task paralysis."
          card={<DealCard />}
        />

        {/* Step 3 — card left */}
        <Step
          n="3"
          color="var(--blue)"
          title="Get XP for starting"
          body="The win is that you began — not that you finished. Cross the line and the XP drops, because starting is the hard part for an ADHD brain. Every start is a real hit of success, which is exactly what brings you back tomorrow."
          card={<ProofCard />}
          flip
        />

        {/* Step 4 — text left */}
        <Step
          n="4"
          color="var(--yellow)"
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

function AvoidCard() {
  return (
    <CardShell tint="var(--coral)">
      <div className="mb-4">
        <Label icon={<BookOpen size={11} strokeWidth={3} />}>Still waiting on you</Label>
      </div>
      <div style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 6 }}>
        {[
          { name: "The email I've been dreading", meta: "added 2d ago" },
          { name: "My tax return", meta: "1 start · 5m in" },
          { name: "The gym bag by the door", meta: "added today" },
        ].map((f, idx) => (
          <div
            key={f.name}
            className="flex items-center justify-between gap-3 px-3.5 py-3"
            style={{ borderTop: idx === 0 ? "none" : "2.5px solid var(--ink)" }}
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-ink" style={{ letterSpacing: "-0.01em" }}>{f.name}</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-faint">{f.meta}</p>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase"
              style={{ background: "var(--yellow)", border: "2px solid var(--ink)", borderRadius: 6, color: "var(--ink)" }}
            >
              <Timer size={11} strokeWidth={3} /> Go
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function DealCard() {
  return (
    <CardShell tint="var(--violet)">
      <div className="mb-4 flex items-center justify-between">
        <Label icon={<Sparkles size={11} strokeWidth={3} />}>The deal</Label>
        <span
          className="px-2.5 py-1 font-mono text-[12px] font-bold tabular-nums"
          style={{ background: "var(--bg-elevated)", border: "2px solid var(--ink)", borderRadius: 6, color: "var(--xp)" }}
        >
          5:00
        </span>
      </div>
      <p className="mb-3 text-[22px] font-bold leading-snug" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
        Do 5 minutes. Then you can stop.
      </p>
      <div
        className="mb-4 px-3.5 py-3 text-[13px] font-medium text-ink"
        style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
      >
        Smallest first move: just open the doc and write one line.
      </div>
      <button className="brutal-btn w-full py-3.5 text-[15px]" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
        <Check size={16} strokeWidth={3} /> Start now
      </button>
    </CardShell>
  );
}

function ProofCard() {
  return (
    <CardShell tint="var(--blue)">
      <div className="mb-4">
        <Label icon={<Clock size={11} strokeWidth={3} />}>You started</Label>
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
        <Check size={16} strokeWidth={3} /> I started <span style={{ color: "var(--xp)" }}>+20 XP</span>
      </button>
    </CardShell>
  );
}

function StreakCard() {
  return (
    <CardShell tint="var(--yellow)">
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
