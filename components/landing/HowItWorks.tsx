"use client";

import { BookOpen, Clock, Timer, Flame, Snowflake, Sparkles, Check } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * "How it works" — a faithful port of the v0 template's 5-step flow
 * (pill eyebrow, serif heading, alternating text/card steps, then a
 * featured product demo), mapped to how Hyperfix actually works and
 * restyled to the teal/warm Hyperfix palette.
 */

export function HowItWorks() {
  return (
    <section id="features" className="px-6 py-24 sm:py-28" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1080px]">
        {/* Section header */}
        <Reveal>
          <div className="mb-20 text-center">
            <span
              className="mb-6 inline-block rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted"
              style={{ border: "1px solid var(--line)" }}
            >
              How it works
            </span>
            <h2 className="font-display leading-[1.05] tracking-tight text-ink" style={{ fontSize: "clamp(30px,4.5vw,50px)" }}>
              The whole loop,
              <br />
              built for your brain.
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-[1.6] text-ink-muted">
              Log what you&apos;re into, get a hit, prove you did it, keep a streak that forgives you. Five steps, no busywork.
            </p>
          </div>
        </Reveal>

        {/* Step 1 — text right, card left */}
        <Step
          n="1"
          title="Log your hyperfixation"
          body="Drop in whatever you're deep in right now — a show, a song, a language, a person. Rate the intensity and check in daily. Hyperfix gives it a home instead of letting it live in 40 browser tabs."
          card={<FixationCard />}
          flip
        />

        {/* Step 2 — text left */}
        <Step
          n="2"
          title="Go deep, earn XP"
          body="Answer a quick prompt about your fixation — what pulled you in, the thing that surprised you, the next rabbit hole. Every deep dive earns XP and builds a real record of your obsession. Brain bursts let you dump a stray thought before it's gone."
          card={<DeepDiveCard />}
        />

        {/* Step 3 — card left */}
        <Step
          n="3"
          title="Prove you did it"
          body="No more tapping 'done' and lying to yourself. Run the timer or write one line about what you actually did. XP only drops when you've shown a receipt — so it means something."
          card={<ProofCard />}
          flip
        />

        {/* Step 4 — text left */}
        <Step
          n="4"
          title="Keep a streak that survives"
          body="ADHD isn't linear, so your streak shouldn't snap the first day you miss. Streak freezes kick in automatically. Miss a day, your run survives. No reset to zero, no guilt spiral."
          card={<StreakCard />}
        />

        {/* Step 5 — centered finish */}
        <Reveal>
          <div className="mb-16 text-center">
            <span
              className="mb-5 inline-flex h-8 w-8 items-center justify-center rounded-full font-display text-[15px]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              5
            </span>
            <h3 className="font-display text-[24px] leading-tight tracking-tight text-ink sm:text-[30px]">
              Level up.
            </h3>
            <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-[1.6] text-ink-muted">
              Watch your XP climb through seven levels — Mildly Curious all the way to Clinically Obsessed.
              Unlock badges, customize your profile, and share a card that&apos;s unmistakably yours.
            </p>
            <a
              href="/auth/signup"
              className="press-pop mt-7 inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Start playing — free
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
  flip = false,
}: {
  n: string;
  title: string;
  body: string;
  card: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <Reveal>
      <div className="mb-24 grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className={flip ? "order-1 md:order-1" : "order-1 md:order-2"}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full font-display text-[15px]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {n}
            </span>
            <h3 className="font-display text-[24px] leading-tight tracking-tight text-ink sm:text-[28px]">{title}</h3>
          </div>
          <p className="mt-4 text-[15px] leading-[1.65] text-ink-muted">{body}</p>
        </div>
        <div className={flip ? "order-2 md:order-2" : "order-2 md:order-1"}>{card}</div>
      </div>
    </Reveal>
  );
}

/* ── Soft card wrapper — template's bg-muted/50 nesting, our tokens ── */
function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-xl)] p-5 sm:p-6" style={{ background: "var(--bg-soft)" }}>
      <div
        className="soft-card rounded-[var(--radius-lg)] p-5"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        {children}
      </div>
    </div>
  );
}

function FixationCard() {
  return (
    <CardShell>
      <div className="mb-4 flex items-center gap-2">
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
    </CardShell>
  );
}

function DeepDiveCard() {
  return (
    <CardShell>
      <div className="mb-4 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted"
          style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}
        >
          <Sparkles size={11} strokeWidth={2} /> Deep dive
        </span>
        <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: "var(--xp)" }}>+8 XP</span>
      </div>
      <p className="mb-2 font-display text-[22px] leading-snug text-ink">What pulled you in?</p>
      <div className="mb-4 rounded-[var(--radius-lg)] px-3 py-2.5 font-sans text-[13px] text-ink-muted" style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}>
        It started with one video at 2am and now I&apos;ve read every wiki page…
      </div>
      <button
        className="press-pop flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] py-3 font-sans text-[14px] font-bold"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        <Check size={15} strokeWidth={2.5} /> Save — +8 XP
      </button>
    </CardShell>
  );
}

function ProofCard() {
  return (
    <CardShell>
      <div className="mb-4 flex items-center gap-2">
        <Clock size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Proof of action</span>
      </div>
      <div className="py-2 text-center">
        <p className="font-display leading-none tabular-nums text-ink" style={{ fontSize: 46 }}>01:24</p>
        <div className="my-4 h-2 overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
          <div className="h-full rounded-full anim-shimmer" style={{ width: "62%", background: "linear-gradient(90deg, var(--accent), var(--xp))" }} />
        </div>
      </div>
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-[13px] font-bold" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <Timer size={14} strokeWidth={2.5} /> Running
        </span>
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] py-3 font-sans text-[14px] font-bold" style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
        <Check size={16} strokeWidth={2.5} /> Claim +8 XP
      </button>
    </CardShell>
  );
}

function StreakCard() {
  return (
    <CardShell>
      <div className="mb-4 flex items-center gap-2">
        <Flame size={15} strokeWidth={2} fill="var(--flame)" style={{ color: "var(--flame)" }} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">14-day streak</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 py-3">
        {[1, 1, 1, 0, 1, 1, 1].map((on, idx) => (
          <span
            key={idx}
            className="flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{ background: on ? "var(--flame)" : "var(--bg-soft)", border: on ? "none" : "1px solid var(--line)" }}
          >
            {on ? (
              <Flame size={15} strokeWidth={2} fill="#fff" style={{ color: "#fff" }} />
            ) : (
              <Snowflake size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
            )}
          </span>
        ))}
      </div>
      <p className="text-center font-mono text-[11px] text-ink-faint">Day 4 missed — freeze used automatically. Streak intact.</p>
    </CardShell>
  );
}
