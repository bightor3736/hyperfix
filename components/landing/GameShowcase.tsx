"use client";

import { Flame, Sparkles, Trophy } from "lucide-react";
import { StreakBadge } from "@/components/ui/streak-badge";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { PointsLevelsTimeline, type PointsLevelTimeline } from "@/components/ui/points-levels-timeline";
import type { UserAchievement } from "@/components/ui/achievement-list";

// Real level ladder (mirrors lib/gamification/levels.ts)
const LEVELS: PointsLevelTimeline[] = [
  { id: "lvl_1", name: "Mildly Curious", description: "Something's caught your eye.", points: 0 },
  { id: "lvl_2", name: "Interested", description: "You think about it daily now.", points: 50 },
  { id: "lvl_3", name: "Invested", description: "It's a personality trait at this point.", points: 150 },
  { id: "lvl_4", name: "Hooked", description: "You've reorganised your life around it.", points: 400 },
  { id: "lvl_5", name: "Unwell", description: "We love that for you.", points: 900 },
  { id: "lvl_6", name: "Feral", description: "There is no off switch.", points: 2000 },
  { id: "lvl_7", name: "Clinically Obsessed", description: "Send help. Or don't.", points: 5000 },
];

const BADGES: UserAchievement[] = [
  { id: "a1", name: "First Hit", trigger: "metric", achievedAt: "2026-01-01" },
  { id: "a2", name: "Week Warrior", trigger: "streak", achievedAt: "2026-01-08" },
  { id: "a3", name: "Dopamine x25", trigger: "metric", achievedAt: "2026-02-01" },
  { id: "a4", name: "Night Owl", trigger: "metric", achievedAt: null },
  { id: "a5", name: "Wall Breaker", trigger: "api", achievedAt: null },
];

export function GameShowcase() {
  return (
    <section id="game" className="bg-bg-soft">
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="max-w-[640px]">
          <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--energy)" }}>
            It&apos;s a game, not a chore
          </p>
          <h2 className="font-display leading-[1.05] tracking-tight text-ink" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
            Every tap earns XP. Every day builds a streak.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
            Real game mechanics wrapped around things your brain actually needs. Watch the
            numbers climb, unlock badges, and level up from Mildly Curious to Clinically Obsessed.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
          {/* Left column: streak + badges */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <StreakBadge
                size="lg"
                length={14}
                frequency="daily"
                subtitle="on a roll"
                icon={<Flame className="h-20 w-20 shrink-0" style={{ color: "var(--flame)" }} fill="var(--flame)" />}
              />
            </div>

            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Trophy size={16} strokeWidth={2} style={{ color: "var(--xp)" }} />
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">Badges to chase</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map((b) => (
                  <AchievementBadge key={b.id} achievement={b} badgeSize="sm" lockedStyle="grayscale" />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: levels timeline */}
          <div
            className="rounded-2xl p-5 sm:p-7"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} strokeWidth={1.5} style={{ color: "var(--energy)" }} />
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">Level ladder · 7 tiers</p>
            </div>
            <PointsLevelsTimeline
              levels={LEVELS}
              currentPoints={520}
              currentLevelLabel="You're here"
              className="border-0 bg-transparent p-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
