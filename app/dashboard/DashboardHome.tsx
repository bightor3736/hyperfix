"use client";

import Link from "next/link";
import { Flame, Trophy, Bell, Plus, BookOpen, Sparkles, Timer, type LucideIcon } from "lucide-react";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { JustStart } from "@/components/start/JustStart";
import type { Quest } from "@/lib/quests/generate";

export type DashboardHomeProps = {
  firstName: string;
  greeting: string;
  username: string | null;
  levelName: string;
  totalPoints: number;
  currentStreak: number;
  streakFreezes: number;
  quests: Quest[];
  nextLevelPoints?: number;
  currentLevelPoints?: number;
};

const QUICK_ACTIONS: { icon: LucideIcon; label: string; href: string; tint: string }[] = [
  { icon: Plus,     label: "Log a fix",   href: "/dashboard/new",       tint: "var(--pastel-purple)" },
  { icon: BookOpen, label: "Fixations",   href: "/dashboard/fixations", tint: "var(--pastel-green)" },
  { icon: Sparkles, label: "XP & levels", href: "/dashboard/points",    tint: "var(--pastel-blue)" },
  { icon: Timer,    label: "Timer",       href: "/dashboard/timer",     tint: "var(--pastel-orange)" },
];

export function DashboardHome({
  firstName,
  greeting,
  username,
  levelName,
  totalPoints,
  currentStreak,
  quests,
  nextLevelPoints,
  currentLevelPoints = 0,
}: DashboardHomeProps) {
  const levelPct = nextLevelPoints
    ? Math.min(100, Math.max(0, ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))
    : 100;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden anim-fadeUp">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(45,212,191,0.14) 0%, rgba(96,165,250,0.08) 42%, rgba(167,139,250,0.06) 68%, transparent 92%)",
          }}
        />

        <div className="relative mx-auto w-full" style={{ maxWidth: 640, padding: "clamp(16px,4vw,24px) 16px 44px" }}>
          {/* Profile row */}
          <div className="flex items-center justify-between">
            <Link href={username ? `/u/${username}` : "/dashboard/customize"} className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full font-display text-[19px]"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", outline: "2px solid var(--accent-soft)", outlineOffset: 2 }}
              >
                {firstName.charAt(0).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                  {greeting}
                </p>
                <p className="font-display text-[18px] tracking-tight text-ink">{firstName}</p>
              </div>
            </Link>
            <Link
              href="/dashboard/notifications"
              className="press-pop relative flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
              aria-label="Notifications"
            >
              <Bell size={17} strokeWidth={2} className="text-ink-muted" />
            </Link>
          </div>

          {/* Big XP hero */}
          <div className="mt-7">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-1">Total XP</p>
            <div className="flex items-end gap-3">
              <p className="font-display leading-none tracking-tight text-ink tabular-nums" style={{ fontSize: "clamp(44px,9vw,64px)" }}>
                {totalPoints.toLocaleString()}
              </p>
              <span
                className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px]"
                style={{ background: "var(--xp-soft)", color: "var(--xp)" }}
              >
                <Trophy size={12} strokeWidth={2.5} /> {levelName}
              </span>
            </div>
          </div>

          {/* Streak pill */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/dashboard/points"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-opacity hover:opacity-80"
              style={{ background: "var(--flame-soft)", color: "var(--flame)" }}
            >
              <Flame size={13} strokeWidth={2.5} fill="currentColor" />
              <span className="text-[13px] font-bold tabular-nums leading-none">{currentStreak}</span>
              <span className="text-[12px] leading-none opacity-70">day streak</span>
            </Link>
          </div>

          {/* Level progress */}
          <div className="mt-5 max-w-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">{levelName}</span>
              {nextLevelPoints && (
                <span className="font-mono text-[10px] tabular-nums text-ink-faint">
                  {(nextLevelPoints - totalPoints).toLocaleString()} XP to next
                </span>
              )}
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
              <div
                className="h-full rounded-full anim-shimmer"
                style={{ width: `${levelPct}%`, background: "linear-gradient(90deg, var(--accent), var(--xp))" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <div className="mx-auto anim-fadeUp pb-28" style={{ maxWidth: 640, padding: "0 16px", animationDelay: "60ms" }}>

        {/* The painkiller: get over the starting line on a task you're avoiding */}
        <JustStart />

        <div style={{ height: 16 }} />

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="press-pop flex flex-col items-center gap-2 rounded-[var(--radius-lg)] py-3.5 transition-opacity hover:opacity-90"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px]" style={{ background: a.tint, color: "var(--ink)" }}>
                <a.icon size={18} strokeWidth={2} />
              </span>
              <span className="text-[11px] font-medium text-ink-muted text-center">{a.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ height: 16 }} />
        <DailyQuestsClient initialQuests={quests} />

        {username && (
          <p className="text-center text-[12px] pt-6 pb-2" style={{ color: "var(--ink-faint)" }}>
            @{username}
          </p>
        )}
      </div>

    </div>
  );
}
