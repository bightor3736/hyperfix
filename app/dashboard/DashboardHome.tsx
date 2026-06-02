"use client";

import Link from "next/link";
import { Flame, Sparkles, Zap, Trophy, Target, type LucideIcon } from "lucide-react";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { DopamineMenu } from "@/components/game/DopamineMenu";
import { BeatTheWall } from "@/components/game/BeatTheWall";
import type { Quest } from "@/lib/quests/generate";

export type DashboardHomeProps = {
  firstName: string;
  greeting: string;
  username: string | null;
  levelName: string;
  totalPoints: number;
  currentStreak: number;
  streakFreezes: number;
  dopamineToday: number;
  wallsTotal: number;
  quests: Quest[];
};

// Pill stat shown inside the dark hero
function HeroStat({ icon: Icon, value, label, href }: { icon: LucideIcon; value: string | number; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
      style={{
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "5px 12px 5px 9px",
        backdropFilter: "blur(8px)",
      }}
    >
      <Icon size={13} strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.75)" }} />
      <span className="text-[13px] font-semibold tabular-nums leading-none" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
        {value}
      </span>
      <span className="text-[11px] leading-none" style={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </span>
    </Link>
  );
}

// Thin divider with optional label
function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px" style={{ background: "var(--line)" }} />;
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1" style={{ background: "var(--line)" }} />
      <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--ink-faint)" }}>
        {label}
      </span>
      <span className="h-px flex-1" style={{ background: "var(--line)" }} />
    </div>
  );
}

export function DashboardHome({
  firstName,
  greeting,
  username,
  levelName,
  totalPoints,
  currentStreak,
  streakFreezes,
  dopamineToday,
  wallsTotal,
  quests,
}: DashboardHomeProps) {
  const questsDone = quests.filter((q) => q.completed_at).length;

  return (
    <div className="min-h-screen pb-28">

      {/* ── HERO — full-bleed dark indigo with CSS glow ──────────────── */}
      <header
        className="relative overflow-hidden anim-fadeUp"
        style={{
          background: [
            "radial-gradient(ellipse 70% 120% at 100% 55%, rgba(139,92,246,0.55) 0%, transparent 58%)",
            "radial-gradient(ellipse 50% 80%  at 82%  -5%, rgba(99,102,241,0.40) 0%, transparent 52%)",
            "radial-gradient(ellipse 40% 60%  at 95%  90%, rgba(192,78,200,0.35) 0%, transparent 50%)",
            "linear-gradient(140deg, #1a1565 0%, #0f0d40 100%)",
          ].join(", "),
          padding: "clamp(24px,4vw,40px) clamp(20px,5vw,44px) clamp(24px,4vw,36px)",
          minHeight: 200,
        }}
      >
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            opacity: 0.6,
          }}
        />

        <div className="relative z-10">
          <p
            className="text-[11px] font-medium uppercase mb-3"
            style={{ color: "rgba(167,139,250,0.85)", letterSpacing: "0.16em" }}
          >
            {greeting}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-landing-sans), Inter, sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              fontSize: "clamp(38px,6vw,58px)",
              lineHeight: 1,
              color: "#fff",
              marginBottom: "clamp(16px,3vw,22px)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif",
                fontStyle: "italic",
              }}
            >
              {firstName}
            </span>
            .
          </h1>

          {/* Inline stat pills */}
          <div className="flex flex-wrap gap-2">
            <HeroStat icon={Flame}    value={currentStreak}           label="day streak"  href="/dashboard/points" />
            <HeroStat icon={Sparkles} value={totalPoints.toLocaleString()} label="XP"     href="/dashboard/points" />
            <HeroStat icon={Trophy}   value={levelName}               label="level"       href="/dashboard/points" />
          </div>
        </div>
      </header>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <div
        className="mx-auto space-y-4 anim-fadeUp"
        style={{
          maxWidth: 640,
          padding: "20px 16px 0",
          animationDelay: "60ms",
        }}
      >

        {/* Primary action */}
        <DopamineMenu todayCount={dopamineToday} name={firstName} />

        <Divider />

        {/* Secondary: beat the wall */}
        <BeatTheWall wallsTotal={wallsTotal} name={firstName} />

        <Divider />

        {/* Quests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[12px] font-semibold"
              style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
            >
              Today&apos;s quests
            </p>
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full font-medium tabular-nums"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {questsDone} / {quests.length}
            </span>
          </div>
          <DailyQuestsClient initialQuests={quests} />
        </section>

        {/* Footer nav */}
        <div
          className="flex items-center gap-5 pt-3 pb-2"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <Link href="/dashboard/fixations" className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70" style={{ color: "var(--ink-muted)" }}>
            <Flame size={13} strokeWidth={2} style={{ color: "var(--accent)" }} /> Fixations
          </Link>
          <Link href="/dashboard/points" className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70" style={{ color: "var(--ink-muted)" }}>
            <Zap size={13} strokeWidth={2} style={{ color: "var(--accent)" }} /> XP &amp; Levels
          </Link>
          <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70" style={{ color: "var(--ink-muted)" }}>
            <Target size={13} strokeWidth={2} style={{ color: "var(--accent)" }} /> Settings
          </Link>
          {username && (
            <span className="ml-auto text-[13px]" style={{ color: "var(--ink-faint)" }}>
              @{username}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
