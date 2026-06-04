"use client";

import { Flame, Zap, Trophy, Share2, Palette, Check } from "lucide-react";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { PointsLevelsTimeline, type PointsLevelTimeline } from "@/components/ui/points-levels-timeline";
import type { UserAchievement } from "@/components/ui/achievement-list";
import { Reveal } from "./Reveal";
import { PROFILE_THEMES } from "@/lib/profile-themes";
import { ACCENT_PRESETS, hexToRgba } from "@/lib/accent";

const LEVELS: PointsLevelTimeline[] = [
  { id: "lvl_1", name: "Mildly Curious", points: 0 },
  { id: "lvl_2", name: "Interested", points: 50 },
  { id: "lvl_3", name: "Invested", points: 150 },
  { id: "lvl_4", name: "Hooked", points: 400 },
  { id: "lvl_5", name: "Unwell", points: 900 },
  { id: "lvl_6", name: "Feral", points: 2000 },
  { id: "lvl_7", name: "Clinically Obsessed", points: 5000 },
];

const BADGES: UserAchievement[] = [
  { id: "a1", name: "First Hit", trigger: "metric", achievedAt: "2026-01-01" },
  { id: "a2", name: "Week Warrior", trigger: "streak", achievedAt: "2026-01-08" },
  { id: "a3", name: "Dopamine x25", trigger: "metric", achievedAt: "2026-02-01" },
  { id: "a4", name: "Jackpot", trigger: "metric", achievedAt: "2026-02-10" },
  { id: "a5", name: "Night Owl", trigger: "metric", achievedAt: null },
  { id: "a6", name: "Centurion", trigger: "api", achievedAt: null },
];

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl px-4 py-3" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
      <span style={{ color }}>{icon}</span>
      <span className="font-display text-[24px] leading-none text-ink tabular-nums">{value}</span>
      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">{label}</span>
    </div>
  );
}

export function ProfileShowcase() {
  return (
    <section id="profile" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="max-w-[600px] mb-14">
            <span className="inline-block rounded-full px-4 py-1.5 mb-5 font-mono text-[11px] uppercase tracking-widest text-ink-muted" style={{ border: "1px solid var(--line)" }}>
              Your player card
            </span>
            <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
              <span className="text-ink">A profile worth </span>
              <span className="text-game-gradient">showing off.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
              Your level, streak, XP and unlocked badges, all in one card you can share. Then make it
              unmistakably yours — themes, accent colour, a live status, and every link you&apos;ve got.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Player card */}
          <Reveal>
            <div className="rounded-[var(--radius-xl)] p-6 sm:p-8 anim-neon" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
              {/* header */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-[26px]"
                  style={{ background: "var(--energy)", color: "var(--accent-ink)" }}
                >
                  M
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[22px] leading-tight text-ink truncate">@maya</p>
                  <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full font-mono text-[11px]" style={{ background: "var(--xp-soft)", color: "var(--xp)" }}>
                    <Zap size={12} strokeWidth={2.5} fill="currentColor" /> Level 4 · Hooked
                  </span>
                </div>
                <button
                  className="press-pop ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full font-sans text-[12px] font-medium"
                  style={{ background: "var(--energy-soft)", color: "var(--energy)", border: "1px solid var(--energy)" }}
                >
                  <Share2 size={13} strokeWidth={2} /> Share
                </button>
              </div>

              {/* XP bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                  <span className="text-ink-faint">520 / 900 XP</span>
                  <span style={{ color: "var(--xp)" }}>next: Unwell</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full anim-shimmer" style={{ width: "62%", background: "linear-gradient(90deg, var(--accent), var(--xp))" }} />
                </div>
              </div>

              {/* stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat icon={<Flame size={18} strokeWidth={2} fill="currentColor" />} label="Streak" value="14" color="var(--flame)" />
                <Stat icon={<Zap size={18} strokeWidth={2} fill="currentColor" />} label="Hits" value="63" color="var(--energy)" />
                <Stat icon={<Trophy size={18} strokeWidth={2} />} label="Badges" value="4" color="var(--xp)" />
              </div>

              {/* badges */}
              <div className="mt-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">Badges</p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {BADGES.map((b) => (
                    <AchievementBadge key={b.id} achievement={b} badgeSize="sm" lockedStyle="grayscale" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Level ladder */}
          <Reveal delay={100}>
            <div className="rounded-[var(--radius-xl)] p-6 sm:p-7 h-full" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-4">Level ladder · 7 tiers</p>
              <PointsLevelsTimeline levels={LEVELS} currentPoints={520} currentLevelLabel="You're here" className="border-0 bg-transparent p-0" />
            </div>
          </Reveal>
        </div>

        {/* Make it yours — customization strip */}
        <Reveal delay={150}>
          <div className="mt-6 rounded-[var(--radius-xl)] p-6 sm:p-8" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: "var(--pastel-purple)", color: "var(--ink)" }}>
                <Palette size={17} strokeWidth={2} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Make it yours</span>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
              {/* Themes */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">Themes</p>
                <div className="grid grid-cols-3 gap-2">
                  {PROFILE_THEMES.slice(0, 6).map((t, i) => (
                    <div key={t.id} className="relative h-12 rounded-lg overflow-hidden" style={{ background: t.background("#5EEAD4"), border: i === 0 ? "2px solid var(--accent)" : "1px solid var(--line)" }}>
                      {i === 0 && <span className="absolute top-1 right-1"><Check size={11} style={{ color: "var(--accent)" }} /></span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Accent */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">Accent</p>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_PRESETS.map((p, i) => (
                    <span key={p.hex} className="h-8 w-8 rounded-full" style={{ background: p.hex, border: i === 1 ? "2px solid var(--ink)" : "2px solid transparent", boxShadow: `0 0 10px ${hexToRgba(p.hex, 0.5)}` }} />
                  ))}
                </div>
              </div>

              {/* Status + connections */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">Status & links</p>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-3" style={{ background: "var(--xp-soft)", border: "1px solid var(--xp)" }}>
                  <span className="text-[14px] leading-none">🎧</span>
                  <span className="font-sans text-[12px] text-ink">deep in a sourdough arc</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["she/her", "Instagram", "TikTok", "GitHub"].map((c) => (
                    <span key={c} className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest" style={{ background: "var(--bg)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
