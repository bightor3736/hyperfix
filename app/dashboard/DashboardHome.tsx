"use client";

import Link from "next/link";
import {
  Zap,
  Flame,
  Sparkles,
  Snowflake,
  Target,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { DopamineMenu } from "@/components/game/DopamineMenu";
import { BeatTheWall } from "@/components/game/BeatTheWall";
import { StreakBadge } from "@/components/ui/streak-badge";
import { PointsBadge } from "@/components/ui/points-badge";
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

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
      <span
        className="text-[13px] font-medium"
        style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
      >
        {children}
      </span>
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
    <div className="min-h-screen px-4 sm:px-8 pt-5 sm:pt-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* ── HERO — the blue blob banner ──────────────────────────── */}
        <header
          className="relative overflow-hidden rounded-[28px] anim-fadeUp mb-4"
          style={{
            background:
              "linear-gradient(120deg, #ffffff 0%, #f6f5ff 55%, #efeaff 100%)",
            border: "1px solid var(--line)",
            minHeight: 168,
          }}
        >
          {/* blob bleeds in from the right */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/site/images/922LPrLT3JS7JXQbJxraBeoo8I_1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute"
            style={{
              top: "-34%",
              right: "-12%",
              width: "72%",
              maxWidth: "none",
              transform: "rotate(-8deg)",
              // blob PNG ships on white — multiply drops the white so only
              // the colour blends into the hero gradient (no hard edge).
              mixBlendMode: "multiply",
            }}
          />
          <div className="relative z-10 px-6 sm:px-8 py-7 sm:py-8">
            <p
              className="uppercase text-[11px] font-medium mb-1.5"
              style={{ color: "var(--accent)", letterSpacing: "0.14em" }}
            >
              {greeting}
            </p>
            <h1
              className="leading-none"
              style={{
                fontFamily: "var(--font-landing-sans), Inter, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.05em",
                fontSize: "clamp(30px,6vw,46px)",
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
              className="mt-2 text-[14px] max-w-[18rem]"
              style={{ color: "var(--ink-muted)", letterSpacing: "-0.01em" }}
            >
              You&apos;re{" "}
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>{levelName}</span>.
              One small win at a time.
            </p>
          </div>
        </header>

        {/* ── STAT COMPONENTS — streak + points ─────────────────────── */}
        <div
          className="grid grid-cols-2 gap-3 mb-4 anim-fadeUp"
          style={{ animationDelay: "40ms" }}
        >
          <StreakBadge
            size="sm"
            length={currentStreak}
            frequency="daily"
            subtitle="day streak"
            className="!w-full !p-4 shadow-sm"
          />
          <Link href="/dashboard/points" className="block group">
            <PointsBadge
              name="total XP"
              total={totalPoints}
              icon={Sparkles}
              className="!w-full !rounded-3xl !p-4 h-full justify-between shadow-sm transition-transform group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* freezes pill — small, icon-led */}
        <Link
          href={streakFreezes > 0 ? "/dashboard/points" : "/pricing"}
          className="flex items-center justify-between rounded-2xl px-4 py-3 mb-8 anim-fadeUp transition-transform hover:-translate-y-0.5"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--line)",
            animationDelay: "80ms",
          }}
        >
          <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: "var(--ink-muted)" }}>
            <Snowflake size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
            Streak freezes
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
            {streakFreezes}
            <ChevronRight size={15} strokeWidth={2} style={{ color: "var(--ink-faint)" }} />
          </span>
        </Link>

        {/* ── RIGHT NOW — core action ───────────────────────────────── */}
        <section className="anim-fadeUp" style={{ animationDelay: "120ms" }}>
          <SectionLabel icon={Zap}>Right now</SectionLabel>
          <DopamineMenu todayCount={dopamineToday} name={firstName} />
        </section>

        {/* ── MORE ──────────────────────────────────────────────────── */}
        <div className="mt-10 space-y-6 anim-fadeUp" style={{ animationDelay: "160ms" }}>
          <section>
            <SectionLabel icon={Target}>Beat the wall</SectionLabel>
            <BeatTheWall wallsTotal={wallsTotal} name={firstName} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel icon={Sparkles}>Today&apos;s quests</SectionLabel>
              <span
                className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                {questsDone}/{quests.length} done
              </span>
            </div>
            <DailyQuestsClient initialQuests={quests} />
          </section>

          <div className="flex items-center gap-4 pt-1">
            <Link
              href="/dashboard/fixations"
              className="inline-flex items-center gap-1.5 text-[13px] transition-colors hover:opacity-80"
              style={{ color: "var(--ink-muted)" }}
            >
              <Flame size={14} strokeWidth={2} style={{ color: "var(--accent)" }} />
              Hyperfixations
            </Link>
            {username && (
              <Link
                href={`/u/${username}`}
                className="inline-flex items-center gap-1.5 text-[13px] transition-colors hover:opacity-80"
                style={{ color: "var(--ink-muted)" }}
              >
                @{username}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
