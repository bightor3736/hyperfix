"use client";

import Link from "next/link";
import { Bell, BookOpen, Sparkles, Timer, Trophy, ArrowUpRight, type LucideIcon } from "lucide-react";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { JustStart } from "@/components/start/JustStart";
import { MilestoneWatcher } from "@/components/game/MilestoneWatcher";
import { LevelRing } from "@/components/dashboard/LevelRing";
import { StreakWeek } from "@/components/dashboard/StreakWeek";
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

const SHORTCUTS: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: BookOpen, label: "Fixations", href: "/dashboard/fixations" },
  { icon: Sparkles, label: "XP & Levels", href: "/dashboard/points" },
  { icon: Trophy, label: "Achievements", href: "/dashboard/achievements" },
  { icon: Timer, label: "Focus Timer", href: "/dashboard/timer" },
];

function todayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function DashboardHome({
  firstName,
  greeting,
  username,
  levelName,
  levelNum,
  totalPoints,
  currentStreak,
  streakFreezes,
  quests,
  isPro = false,
  welcome = false,
  nextLevelPoints,
  currentLevelPoints = 0,
}: DashboardHomeProps) {
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

      <div className="mx-auto" style={{ maxWidth: 880, padding: "28px 20px 120px" }}>
        {/* ── Greeting ── */}
        <header className="anim-fadeUp" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
              {todayLabel()}
            </p>
            <h1 style={{ marginTop: 6, fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.05 }}>
              {greeting},{" "}
              <span style={{ fontFamily: "var(--font-serif-display, serif)", fontStyle: "italic", fontWeight: 400 }}>
                {firstName}.
              </span>
            </h1>
          </div>
          <Link
            href="/dashboard/notifications"
            className="flex items-center justify-center rounded-full shrink-0 lg:hidden"
            style={{ width: 42, height: 42, background: "var(--card)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.75} />
          </Link>
        </header>

        {/* ── Hero: the action comes first ── */}
        <div className="anim-fadeUp" style={{ animationDelay: "40ms", marginBottom: 16 }}>
          <JustStart welcome={welcome} />
        </div>

        {/* ── Status bento ── */}
        <div
          className="anim-fadeUp"
          style={{
            animationDelay: "80ms",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <LevelRing
            levelNum={levelNum}
            levelName={levelName}
            totalPoints={totalPoints}
            currentLevelPoints={currentLevelPoints}
            nextLevelPoints={nextLevelPoints}
          />
          <StreakWeek currentStreak={currentStreak} streakFreezes={streakFreezes} />
        </div>

        {/* ── Daily quests ── */}
        <div className="anim-fadeUp" style={{ animationDelay: "120ms", marginBottom: 16 }}>
          <DailyQuestsClient initialQuests={quests} />
        </div>

        {/* ── Shortcuts ── */}
        <div
          className="anim-fadeUp"
          style={{
            animationDelay: "160ms",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
          }}
        >
          {SHORTCUTS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "13px 14px", borderRadius: 14,
                background: "var(--card)", border: "1px solid var(--line)",
                textDecoration: "none", transition: "border-color 0.15s",
              }}
            >
              <span
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 10,
                  background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0,
                }}
              >
                <s.icon size={17} strokeWidth={2} />
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", flex: 1 }}>{s.label}</span>
              <ArrowUpRight size={15} strokeWidth={2} style={{ color: "var(--ink-faint)" }} />
            </Link>
          ))}
        </div>

        {username && (
          <p className="text-center" style={{ fontSize: 12, color: "var(--ink-faint)", paddingTop: 28 }}>
            @{username}
          </p>
        )}
      </div>
    </div>
  );
}
