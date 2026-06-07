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
  { id: "a3", name: "Deep Diver", trigger: "metric", achievedAt: "2026-02-01" },
  { id: "a4", name: "Ten Fixations", trigger: "metric", achievedAt: "2026-02-10" },
  { id: "a5", name: "Night Owl", trigger: "metric", achievedAt: null },
  { id: "a6", name: "Centurion", trigger: "api", achievedAt: null },
];

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-4 py-3"
      style={{ background: "var(--bg)", border: "2.5px solid var(--ink)", borderRadius: 6, boxShadow: "3px 3px 0 0 var(--ink)" }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="text-[26px] font-bold leading-none text-ink tabular-nums" style={{ letterSpacing: "-0.03em" }}>{value}</span>
      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-faint">{label}</span>
    </div>
  );
}

export function ProfileShowcase() {
  return (
    <section id="profile" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="max-w-[600px] mb-14">
            <span
              className="brutal-tag mb-5"
              style={{ background: "var(--lime)", color: "var(--ink)" }}
            >
              Your player card
            </span>
            <h2 className="leading-[0.98] text-ink" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
              A profile worth{" "}
              <span
                className="inline-block px-2"
                style={{ background: "var(--xp)", color: "#fff", border: "2.5px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)", transform: "rotate(-1.5deg)" }}
              >
                showing off.
              </span>
            </h2>
            <p className="mt-6 text-[17px] font-medium leading-[1.55] text-ink-muted">
              Your level, streak, XP and unlocked badges, all in one card you can share. Then make it
              unmistakably yours — themes, accent colour, a live status, and every link you&apos;ve got.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Player card */}
          <Reveal>
            <div
              className="brutal-hover p-6 sm:p-8"
              style={{ background: "var(--bg-elevated)", border: "3.5px solid var(--ink)", borderRadius: 8, boxShadow: "10px 10px 0 0 var(--ink)" }}
            >
              {/* header */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center text-[28px] font-bold"
                  style={{ background: "var(--yellow)", color: "var(--ink)", border: "2.5px solid var(--ink)", borderRadius: 6, boxShadow: "3px 3px 0 0 var(--ink)", letterSpacing: "-0.03em" }}
                >
                  M
                </div>
                <div className="min-w-0">
                  <p className="text-[22px] font-bold leading-tight text-ink truncate" style={{ letterSpacing: "-0.02em" }}>@maya</p>
                  <span
                    className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider"
                    style={{ background: "var(--xp)", color: "#fff", border: "2px solid var(--ink)", borderRadius: 999 }}
                  >
                    <Zap size={12} strokeWidth={3} fill="currentColor" /> Level 4 · Hooked
                  </span>
                </div>
                <button
                  className="brutal-btn ml-auto shrink-0 px-3.5 py-2 text-[12px]"
                  style={{ background: "var(--blue)", color: "#fff" }}
                >
                  <Share2 size={13} strokeWidth={3} /> Share
                </button>
              </div>

              {/* XP bar */}
              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-ink-faint">520 / 900 XP</span>
                  <span style={{ color: "var(--xp)" }}>next: Unwell</span>
                </div>
                <div
                  className="h-5 overflow-hidden"
                  style={{ background: "var(--bg)", border: "2.5px solid var(--ink)", borderRadius: 6 }}
                >
                  <div className="h-full" style={{ width: "62%", background: "var(--xp)", borderRight: "2.5px solid var(--ink)" }} />
                </div>
              </div>

              {/* stats */}
              <div className="mt-7 grid grid-cols-3 gap-3">
                <Stat icon={<Flame size={20} strokeWidth={2.5} fill="currentColor" />} label="Streak" value="14" color="var(--flame)" />
                <Stat icon={<Zap size={20} strokeWidth={2.5} fill="currentColor" />} label="Hits" value="63" color="var(--blue)" />
                <Stat icon={<Trophy size={20} strokeWidth={2.5} />} label="Badges" value="4" color="var(--xp)" />
              </div>

              {/* badges */}
              <div className="mt-7">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Badges</p>
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
            <div
              className="h-full p-6 sm:p-7"
              style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 8, boxShadow: "7px 7px 0 0 var(--ink)" }}
            >
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Level ladder · 7 tiers</p>
              <PointsLevelsTimeline levels={LEVELS} currentPoints={520} currentLevelLabel="You're here" className="border-0 bg-transparent p-0" />
            </div>
          </Reveal>
        </div>

        {/* Make it yours — customization strip */}
        <Reveal delay={150}>
          <div
            className="mt-6 p-6 sm:p-8"
            style={{ background: "var(--bg-elevated)", border: "2.5px solid var(--ink)", borderRadius: 8, boxShadow: "7px 7px 0 0 var(--ink)" }}
          >
            <div className="mb-6 flex items-center gap-2.5">
              <span
                className="inline-flex h-10 w-10 items-center justify-center"
                style={{ background: "var(--pink)", color: "var(--ink)", border: "2.5px solid var(--ink)", borderRadius: 6, boxShadow: "3px 3px 0 0 var(--ink)" }}
              >
                <Palette size={18} strokeWidth={2.5} />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">Make it yours</span>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
              {/* Themes */}
              <div>
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Themes</p>
                <div className="grid grid-cols-3 gap-2">
                  {PROFILE_THEMES.slice(0, 6).map((t, i) => (
                    <div
                      key={t.id}
                      className="relative h-12 overflow-hidden"
                      style={{ background: t.background("#5EEAD4"), border: "2.5px solid var(--ink)", borderRadius: 6, boxShadow: i === 0 ? "3px 3px 0 0 var(--ink)" : "none" }}
                    >
                      {i === 0 && (
                        <span
                          className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center"
                          style={{ background: "var(--lime)", border: "1.5px solid var(--ink)", borderRadius: 4 }}
                        >
                          <Check size={9} strokeWidth={3.5} style={{ color: "var(--ink)" }} />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Accent */}
              <div>
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Accent</p>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_PRESETS.map((p, i) => (
                    <span
                      key={p.hex}
                      className="h-8 w-8"
                      style={{ background: p.hex, border: "2.5px solid var(--ink)", borderRadius: 6, boxShadow: i === 1 ? "3px 3px 0 0 var(--ink)" : "none", transform: i === 1 ? "translate(-1px,-1px)" : "none" }}
                      title={`${p.name} ${hexToRgba(p.hex, 1)}`}
                    />
                  ))}
                </div>
              </div>

              {/* Status + connections */}
              <div>
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Status & links</p>
                <div
                  className="mb-3 inline-flex items-center gap-2 px-3 py-1.5"
                  style={{ background: "var(--xp)", border: "2.5px solid var(--ink)", borderRadius: 999, boxShadow: "3px 3px 0 0 var(--ink)" }}
                >
                  <span className="text-[14px] leading-none">🎧</span>
                  <span className="text-[12px] font-bold" style={{ color: "#fff" }}>deep in a sourdough arc</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["she/her", "Instagram", "TikTok", "GitHub"].map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ background: "var(--bg)", border: "2px solid var(--ink)", borderRadius: 999, color: "var(--ink-muted)" }}
                    >
                      {c}
                    </span>
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
