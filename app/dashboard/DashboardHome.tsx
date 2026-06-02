"use client";

import Link from "next/link";
import {
  Zap,
  Flame,
  Sparkles,
  Snowflake,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
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

// Four-cell stat band — one clean card, no separate components
function StatBand({
  streak,
  points,
  levelName,
  freezes,
}: {
  streak: number;
  points: number;
  levelName: string;
  freezes: number;
}) {
  const cells: Array<{
    icon: LucideIcon;
    value: string;
    label: string;
    href: string;
    accent?: boolean;
  }> = [
    { icon: Flame, value: String(streak), label: "streak", href: "/dashboard/points", accent: streak > 0 },
    { icon: Sparkles, value: points.toLocaleString(), label: "XP", href: "/dashboard/points", accent: true },
    { icon: Trophy, value: levelName, label: "level", href: "/dashboard/points" },
    { icon: Snowflake, value: String(freezes), label: "freezes", href: freezes > 0 ? "/dashboard/points" : "/pricing" },
  ];

  return (
    <div
      className="grid grid-cols-4 rounded-[22px] overflow-hidden mb-4 anim-fadeUp"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--line)",
        animationDelay: "40ms",
      }}
    >
      {cells.map((c, i) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.label}
            href={c.href}
            className="flex flex-col items-center gap-1 py-4 transition-colors hover:bg-[var(--bg-soft)]"
            style={{
              borderRight: i < cells.length - 1 ? "1px solid var(--line)" : undefined,
            }}
          >
            <Icon
              size={16}
              strokeWidth={2}
              style={{ color: c.accent ? "var(--accent)" : "var(--ink-faint)" }}
            />
            <span
              className="font-semibold leading-none text-center"
              style={{
                color: "var(--ink)",
                fontSize: c.value.length > 4 ? 13 : 18,
                letterSpacing: "-0.03em",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                padding: "0 4px",
              }}
            >
              {c.value}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.06em]"
              style={{ color: "var(--ink-faint)" }}
            >
              {c.label}
            </span>
          </Link>
        );
      })}
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
    <div className="min-h-screen px-4 sm:px-6 pt-5 sm:pt-8 pb-28">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <header
          className="relative overflow-hidden rounded-[28px] anim-fadeUp"
          style={{
            background: "linear-gradient(115deg, #fafafe 0%, #f0eeff 40%, #ede5ff 100%)",
            border: "1px solid rgba(79,70,229,0.14)",
            minHeight: 210,
          }}
        >
          {/* Full-range blob: wide enough to show blue → indigo → purple → pink */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/site/images/922LPrLT3JS7JXQbJxraBeoo8I_1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute"
            style={{
              top: "-18%",
              right: "-6%",
              width: "86%",
              maxWidth: "none",
              transform: "rotate(-5deg)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Left-side gradient so text stays legible over the blob */}
          <div
            className="absolute inset-y-0 left-0 pointer-events-none z-[5]"
            style={{
              width: "62%",
              background: "linear-gradient(to right, #f4f2ff 55%, transparent)",
            }}
          />

          <div className="relative z-10 px-7 sm:px-9 py-8" style={{ maxWidth: "58%" }}>
            <p
              className="text-[11px] font-medium mb-2 uppercase"
              style={{ color: "var(--accent)", letterSpacing: "0.14em" }}
            >
              {greeting}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-landing-sans), Inter, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.05em",
                fontSize: "clamp(34px,5vw,50px)",
                lineHeight: 1,
                color: "var(--ink)",
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
            <p
              className="mt-3 text-[13px] leading-snug"
              style={{ color: "var(--ink-muted)", letterSpacing: "-0.01em" }}
            >
              You&apos;re{" "}
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{levelName}</span>
              {" "}· one small win at a time.
            </p>
          </div>
        </header>

        {/* ── STATS BAND ───────────────────────────────────────────── */}
        <StatBand
          streak={currentStreak}
          points={totalPoints}
          levelName={levelName}
          freezes={streakFreezes}
        />

        {/* ── RIGHT NOW — core dopamine hit ────────────────────────── */}
        <section className="anim-fadeUp" style={{ animationDelay: "80ms" }}>
          <p
            className="text-[11px] font-medium uppercase mb-2.5"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.1em" }}
          >
            Right now
          </p>
          <DopamineMenu todayCount={dopamineToday} name={firstName} />
        </section>

        {/* ── BEAT THE WALL ────────────────────────────────────────── */}
        <section className="anim-fadeUp" style={{ animationDelay: "120ms" }}>
          <p
            className="text-[11px] font-medium uppercase mb-2.5"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.1em" }}
          >
            Beat the wall
          </p>
          <BeatTheWall wallsTotal={wallsTotal} name={firstName} />
        </section>

        {/* ── DAILY QUESTS ─────────────────────────────────────────── */}
        <section className="anim-fadeUp" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-2.5">
            <p
              className="text-[11px] font-medium uppercase"
              style={{ color: "var(--ink-faint)", letterSpacing: "0.1em" }}
            >
              Today&apos;s quests
            </p>
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {questsDone} / {quests.length}
            </span>
          </div>
          <DailyQuestsClient initialQuests={quests} />
        </section>

        {/* ── FOOTER LINKS ─────────────────────────────────────────── */}
        <div className="flex items-center gap-5 pt-2 pb-4">
          <Link
            href="/dashboard/fixations"
            className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
            style={{ color: "var(--ink-muted)" }}
          >
            <Flame size={13} strokeWidth={2} style={{ color: "var(--accent)" }} />
            Hyperfixations
          </Link>
          <Link
            href="/dashboard/points"
            className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
            style={{ color: "var(--ink-muted)" }}
          >
            <Zap size={13} strokeWidth={2} style={{ color: "var(--accent)" }} />
            XP &amp; Levels
          </Link>
          {username && (
            <Link
              href={`/u/${username}`}
              className="text-[13px] transition-opacity hover:opacity-70"
              style={{ color: "var(--ink-faint)" }}
            >
              @{username}
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
