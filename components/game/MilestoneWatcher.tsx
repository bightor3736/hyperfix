"use client";

import { useEffect, useState } from "react";
import { MilestoneCelebration, type Milestone } from "@/components/game/MilestoneCelebration";

/**
 * Watches the user's level and streak across visits and fires a celebration
 * (with the share card) the moment they cross a level-up or streak milestone.
 *
 * State is kept in localStorage so we know what the user has already seen —
 * no migration, and existing users won't get a false celebration on first
 * load (we seed the baseline silently, then only celebrate increases).
 */

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];
const LV_KEY = "hyperfix_seen_level";
const STREAK_KEY = "hyperfix_seen_streak_milestone";

function highestMilestoneReached(streak: number): number {
  let hit = 0;
  for (const m of STREAK_MILESTONES) if (streak >= m) hit = m;
  return hit;
}

export function MilestoneWatcher({
  levelNum,
  levelName,
  streak,
  xp,
  displayName,
  isPro = false,
}: {
  levelNum: number;
  levelName: string;
  streak: number;
  xp: number;
  displayName?: string;
  isPro?: boolean;
}) {
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    try {
      const seenLevelRaw = localStorage.getItem(LV_KEY);
      const seenStreakRaw = localStorage.getItem(STREAK_KEY);

      // First ever load: seed baselines silently, don't celebrate.
      if (seenLevelRaw === null || seenStreakRaw === null) {
        localStorage.setItem(LV_KEY, String(levelNum));
        localStorage.setItem(STREAK_KEY, String(highestMilestoneReached(streak)));
        return;
      }

      const seenLevel = parseInt(seenLevelRaw, 10) || 0;
      const seenStreak = parseInt(seenStreakRaw, 10) || 0;
      const currentMilestone = highestMilestoneReached(streak);

      // Level-up takes precedence (rarer, bigger flex).
      if (levelNum > seenLevel) {
        timer = setTimeout(() => setMilestone({ kind: "levelup", levelName, levelNum }), 600);
        localStorage.setItem(LV_KEY, String(levelNum));
        // keep streak baseline current so we don't double-fire next load
        localStorage.setItem(STREAK_KEY, String(currentMilestone));
      } else if (currentMilestone > seenStreak) {
        timer = setTimeout(() => setMilestone({ kind: "streak", days: currentMilestone }), 600);
        localStorage.setItem(STREAK_KEY, String(currentMilestone));
      }
    } catch {
      /* storage blocked — skip celebration */
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [levelNum, levelName, streak]);

  if (!milestone) return null;

  return (
    <MilestoneCelebration
      milestone={milestone}
      displayName={displayName}
      streak={streak}
      levelName={levelName}
      levelNum={levelNum}
      xp={xp}
      isPro={isPro}
      onClose={() => setMilestone(null)}
    />
  );
}
