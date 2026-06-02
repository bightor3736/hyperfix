"use client";

import Link from "next/link";
import { Flame, Sparkles, Trophy, type LucideIcon } from "lucide-react";
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
  nextLevelPoints?: number;
  currentLevelPoints?: number;
};

function HeroStat({ icon: Icon, value, label, href, accent }: { icon: LucideIcon; value: string | number; label: string; href: string; accent?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
      style={{
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.14)",
        padding: "6px 14px 6px 10px",
        backdropFilter: "blur(12px)",
      }}
    >
      <Icon size={13} strokeWidth={2.5} style={{ color: accent ?? "rgba(255,255,255,0.7)" }} />
      <span className="text-[13px] font-bold tabular-nums leading-none" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
        {value}
      </span>
      <span className="text-[11px] leading-none" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}
      </span>
    </Link>
  );
}

function SectionLabel({ children, count, total }: { children: React.ReactNode; count?: number; total?: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--ink-faint)" }}>
        {children}
      </p>
      {count !== undefined && total !== undefined && (
        <span
          className="text-[11px] px-2.5 py-0.5 rounded-full font-medium tabular-nums"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {count} / {total}
        </span>
      )}
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
  dopamineToday,
  wallsTotal,
  quests,
  nextLevelPoints,
  currentLevelPoints = 0,
}: DashboardHomeProps) {
  const questsDone = quests.filter((q) => q.completed_at).length;
  const levelPct = nextLevelPoints
    ? Math.min(100, Math.max(0, ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))
    : 100;

  return (
    <div className="min-h-screen pb-28">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden anim-fadeUp"
        style={{
          background: [
            "radial-gradient(ellipse 80% 140% at 110% 60%, rgba(139,92,246,0.6) 0%, transparent 55%)",
            "radial-gradient(ellipse 55% 90%  at 85%  -8%, rgba(99,102,241,0.45) 0%, transparent 50%)",
            "radial-gradient(ellipse 45% 65%  at 98%  95%, rgba(192,78,200,0.40) 0%, transparent 48%)",
            "linear-gradient(145deg, #1e1880 0%, #0f0d40 100%)",
          ].join(", "),
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) clamp(28px,4vw,40px)",
          minHeight: 220,
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            opacity: 0.7,
          }}
        />

        <div className="relative z-10">
          <p
            className="text-[11px] font-medium uppercase mb-2"
            style={{ color: "rgba(167,139,250,0.8)", letterSpacing: "0.18em" }}
          >
            {greeting}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-landing-sans), Inter, sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              fontSize: "clamp(40px,6.5vw,62px)",
              lineHeight: 1,
              color: "#fff",
              marginBottom: "clamp(18px,3vw,26px)",
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

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <HeroStat icon={Flame}    value={currentStreak} label="day streak" href="/dashboard/points" accent="#fb923c" />
            <HeroStat icon={Sparkles} value={totalPoints.toLocaleString()} label="XP" href="/dashboard/points" accent="#a78bfa" />
            <HeroStat icon={Trophy}   value={levelName}     label="level"      href="/dashboard/points" accent="#fbbf24" />
          </div>

          {/* Level progress bar */}
          <div className="max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                {levelName}
              </span>
              {nextLevelPoints && (
                <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {(nextLevelPoints - totalPoints).toLocaleString()} XP to next
                </span>
              )}
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${levelPct}%`,
                  background: "linear-gradient(90deg, #818cf8, #a78bfa, #c084fc)",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div
        className="mx-auto anim-fadeUp"
        style={{
          maxWidth: 640,
          padding: "24px 16px 0",
          animationDelay: "60ms",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >

        {/* Dopamine Menu */}
        <div>
          <SectionLabel>Dopamine Menu</SectionLabel>
          <DopamineMenu todayCount={dopamineToday} name={firstName} />
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--line)" }} />

        {/* Beat the Wall */}
        <div>
          <SectionLabel>Beat the Wall</SectionLabel>
          <BeatTheWall wallsTotal={wallsTotal} name={firstName} />
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--line)" }} />

        {/* Quests */}
        <div>
          <SectionLabel count={questsDone} total={quests.length}>Today&apos;s Quests</SectionLabel>
          <DailyQuestsClient initialQuests={quests} />
        </div>

        {/* Footer nav — only shown on mobile where sidebar is hidden */}
        <div
          className="lg:hidden flex items-center gap-5 pt-3 pb-2"
          style={{ borderTop: "1px solid var(--line)" }}
        >
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
