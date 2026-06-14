"use client";

import Link from "next/link";
import { Flame, Trophy, Bell, Plus, BookOpen, Sparkles, Timer, type LucideIcon } from "lucide-react";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { JustStart } from "@/components/start/JustStart";
import { MilestoneWatcher } from "@/components/game/MilestoneWatcher";
import type { Quest } from "@/lib/quests/generate";

export type DashboardHomeProps = {
  firstName: string;
  greeting: string;
  username: string | null;
  levelName: string;
  levelNum: number;
  totalPoints: number;
  currentStreak: number;
  streakFreezes: number;
  quests: Quest[];
  isPro?: boolean;
  welcome?: boolean;
  nextLevelPoints?: number;
  currentLevelPoints?: number;
};

const QUICK_ACTIONS: { icon: LucideIcon; label: string; href: string; iconBg: string; iconColor: string }[] = [
  { icon: Plus,     label: "Log fix",    href: "/dashboard/new",       iconBg: "var(--accent)",            iconColor: "#ffffff" },
  { icon: BookOpen, label: "Fixations",  href: "/dashboard/fixations", iconBg: "var(--fill)",              iconColor: "var(--ink)" },
  { icon: Sparkles, label: "XP",         href: "/dashboard/points",    iconBg: "var(--xp)",                iconColor: "#ffffff" },
  { icon: Timer,    label: "Timer",      href: "/dashboard/timer",     iconBg: "var(--fill)",              iconColor: "var(--ink)" },
];

export function DashboardHome({
  firstName,
  greeting,
  username,
  levelName,
  levelNum,
  totalPoints,
  currentStreak,
  quests,
  isPro = false,
  welcome = false,
  nextLevelPoints,
  currentLevelPoints = 0,
}: DashboardHomeProps) {
  const levelPct = nextLevelPoints
    ? Math.min(100, Math.max(0, ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))
    : 100;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      <MilestoneWatcher
        levelNum={levelNum}
        levelName={levelName}
        streak={currentStreak}
        xp={totalPoints}
        displayName={username ?? firstName}
        isPro={isPro}
      />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-10 anim-fadeUp" style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 640, padding: "12px 16px" }}
        >
          <Link
            href={username ? `/u/${username}` : "/dashboard/customize"}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full font-semibold text-[14px]"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              {firstName.charAt(0).toUpperCase()}
            </span>
            <div className="leading-tight">
              <p
                className="text-[11px]"
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                }}
              >
                {greeting}
              </p>
              <p className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
                {firstName}
              </p>
            </div>
          </Link>
          <Link
            href="/dashboard/notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--fill-soft)]"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.75} style={{ color: "var(--ink-muted)" }} />
          </Link>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div
        className="mx-auto pb-28 anim-fadeUp"
        style={{ maxWidth: 640, padding: "20px 16px", animationDelay: "40ms" }}
      >

        {/* XP + level card */}
        <div
          className="overflow-hidden mb-4"
          style={{
            background: "var(--bg-white)",
            border: "1px solid var(--line)",
            borderRadius: 16,
          }}
        >
          {/* XP hero */}
          <div className="px-5 pt-5 pb-4">
            <p
              className="mb-1"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
              }}
            >
              Total XP
            </p>
            <div className="flex items-end gap-3">
              <p
                className="font-display leading-none tracking-tight tabular-nums"
                style={{ fontSize: "clamp(40px,9vw,56px)", fontWeight: 700, color: "var(--ink)" }}
              >
                {totalPoints.toLocaleString()}
              </p>
              <span
                className="mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ background: "var(--xp-soft)", color: "var(--xp)" }}
              >
                <Trophy size={11} strokeWidth={2} /> {levelName}
              </span>
            </div>

            {/* Level progress */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-medium" style={{ color: "var(--ink-faint)" }}>{levelName}</span>
                {nextLevelPoints && (
                  <span className="text-[10px] tabular-nums" style={{ color: "var(--ink-faint)" }}>
                    {(nextLevelPoints - totalPoints).toLocaleString()} XP to next
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--fill-soft)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${levelPct}%`, background: "var(--xp)", transition: "width 0.6s ease" }}
                />
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div
            className="flex items-stretch"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <Link
              href="/dashboard/points"
              className="flex flex-1 items-center justify-center gap-2 py-3 transition-colors hover:bg-[var(--fill-faint)]"
            >
              <Flame size={14} strokeWidth={2.5} fill="currentColor" style={{ color: "var(--flame)" }} />
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--ink)" }}>
                {currentStreak}
              </span>
              <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>streak</span>
            </Link>
            <div style={{ width: 1, background: "var(--line)", margin: "8px 0" }} />
            <Link
              href="/dashboard/achievements"
              className="flex flex-1 items-center justify-center gap-2 py-3 transition-colors hover:bg-[var(--fill-faint)]"
            >
              <Sparkles size={14} strokeWidth={2} style={{ color: "var(--xp)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                {levelName}
              </span>
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-center gap-2 py-3.5 transition-colors hover:bg-[var(--fill-soft)]"
              style={{ background: "var(--bg-white)", border: "1px solid var(--line)", borderRadius: 16 }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: a.iconBg, color: a.iconColor }}
              >
                <a.icon size={18} strokeWidth={1.75} />
              </span>
              <span className="text-[11px] font-medium text-center" style={{ color: "var(--ink-muted)" }}>
                {a.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Start section */}
        <JustStart welcome={welcome} />

        <div style={{ height: 20 }} />

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
