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

function HeroStat({ icon: Icon, value, label, href, iconColor }: {
  icon: LucideIcon; value: string | number; label: string; href: string; iconColor?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
      style={{
        background: "rgba(255,255,255,0.11)",
        border: "1px solid rgba(255,255,255,0.16)",
        padding: "6px 14px 6px 10px",
        backdropFilter: "blur(12px)",
      }}
    >
      <Icon size={13} strokeWidth={2.5} style={{ color: iconColor ?? "rgba(255,255,255,0.7)" }} />
      <span className="text-[13px] font-bold tabular-nums leading-none" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
        {value}
      </span>
      <span className="text-[11px] leading-none" style={{ color: "rgba(255,255,255,0.48)" }}>
        {label}
      </span>
    </Link>
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
  const levelPct = nextLevelPoints
    ? Math.min(100, Math.max(0, ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))
    : 100;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden anim-fadeUp"
        style={{
          background: [
            "radial-gradient(ellipse 85% 150% at 115% 65%, rgba(139,92,246,0.70) 0%, transparent 55%)",
            "radial-gradient(ellipse 55% 90%  at 85%  -5%, rgba(99,102,241,0.55) 0%, transparent 50%)",
            "radial-gradient(ellipse 40% 60%  at 100% 95%, rgba(192,78,200,0.45) 0%, transparent 48%)",
            "linear-gradient(145deg, #201890 0%, #0f0d40 100%)",
          ].join(", "),
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 60px",
        }}
      >
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
          <p className="text-[11px] font-medium uppercase mb-2" style={{ color: "rgba(167,139,250,0.8)", letterSpacing: "0.18em" }}>
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
            <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>
              {firstName}
            </span>
            .
          </h1>

          <div className="flex flex-wrap gap-2 mb-5">
            <HeroStat icon={Flame}    value={currentStreak}              label="day streak" href="/dashboard/points" iconColor="#fb923c" />
            <HeroStat icon={Sparkles} value={totalPoints.toLocaleString()} label="XP"       href="/dashboard/points" iconColor="#a78bfa" />
            <HeroStat icon={Trophy}   value={levelName}                  label="level"      href="/dashboard/points" iconColor="#fbbf24" />
          </div>

          <div className="max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                {levelName}
              </span>
              {nextLevelPoints && (
                <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {(nextLevelPoints - totalPoints).toLocaleString()} XP to next
                </span>
              )}
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${levelPct}%`, background: "linear-gradient(90deg, #818cf8, #a78bfa, #c084fc)" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT — cards emerge from hero ──────────────────────────── */}
      <div
        className="mx-auto anim-fadeUp pb-28"
        style={{ maxWidth: 640, padding: "0 16px", marginTop: -32, animationDelay: "60ms" }}
      >
        <DopamineMenu todayCount={dopamineToday} name={firstName} />
        <div style={{ height: 14 }} />
        <BeatTheWall wallsTotal={wallsTotal} name={firstName} />
        <div style={{ height: 14 }} />
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
