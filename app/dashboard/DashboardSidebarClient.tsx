"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/NotificationBell";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  Snowflake,
  Flame,
  Trophy,
  Timer,
  Palette,
} from "lucide-react";
import { levelForPoints } from "@/lib/gamification/levels";

type Props = {
  displayName: string;
  avatarUrl: string | null;
  userEmail: string;
  isPro?: boolean;
  username?: string | null;
  currentStreak?: number;
  totalPoints?: number;
  streakFreezes?: number;
};

type NavItem = { href: string; label: string; icon: React.ReactNode };
type NavSection = { label?: string; items: NavItem[] };

export function DashboardSidebarClient({
  displayName,
  avatarUrl,
  userEmail,
  isPro,
  username,
  currentStreak = 0,
  totalPoints = 0,
  streakFreezes = 0,
}: Props) {
  const { level, next } = levelForPoints(totalPoints);
  const levelPct = next
    ? Math.min(100, Math.max(0, ((totalPoints - level.points) / (next.points - level.points)) * 100))
    : 100;

  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
      router.refresh();
    });
  }

  const navSections: NavSection[] = [
    {
      items: [
        { href: "/dashboard",              label: "Play",         icon: <LayoutDashboard size={16} strokeWidth={1.75} /> },
        { href: "/dashboard/fixations",    label: "Fixations",    icon: <Flame size={16} strokeWidth={1.75} /> },
        { href: "/dashboard/points",       label: "XP & Levels",  icon: <Sparkles size={16} strokeWidth={1.75} /> },
        { href: "/dashboard/achievements", label: "Achievements", icon: <Trophy size={16} strokeWidth={1.75} /> },
        { href: "/dashboard/timer",        label: "Focus Timer",  icon: <Timer size={16} strokeWidth={1.75} /> },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/dashboard/customize", label: "Customize",  icon: <Palette size={16} strokeWidth={1.75} /> },
        { href: "/dashboard/settings",  label: "Settings",   icon: <Settings size={16} strokeWidth={1.75} /> },
      ],
    },
  ];

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  }

  const initials = displayName.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside
      className="apple-glass hidden lg:flex flex-col h-screen w-[220px] shrink-0 fixed left-0 top-0 z-40"
      style={{ background: "var(--bg-elevated)" }}
    >
      {/* ── App title ── */}
      <div
        className="flex items-center justify-between px-4 pt-5 pb-3"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <Link
          href="/dashboard"
          className="font-display text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70"
          style={{ color: "var(--ink)" }}
        >
          hyperfix
        </Link>
        <NotificationBell />
      </div>

      {/* ── Profile row ── */}
      <Link
        href={username ? `/u/${username}` : "/onboarding/username"}
        className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[var(--fill-faint)]"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>
            {displayName}
          </p>
          {isPro && (
            <p className="text-[10px] font-semibold" style={{ color: "var(--accent)" }}>
              Pro
            </p>
          )}
        </div>
      </Link>

      {/* ── Streak + XP strip ── */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/dashboard/points"
            className="flex items-center gap-1.5 text-[12px] font-semibold tabular-nums transition-opacity hover:opacity-70"
            style={{ color: "var(--flame)" }}
          >
            <Flame size={12} strokeWidth={2.5} fill="currentColor" />
            {currentStreak}
          </Link>
          {streakFreezes > 0 && (
            <span
              className="flex items-center gap-1 text-[11px] font-medium"
              style={{ color: "var(--accent)" }}
            >
              <Snowflake size={10} strokeWidth={2} />
              {streakFreezes}
            </span>
          )}
          <span className="ml-auto text-[11px] tabular-nums" style={{ color: "var(--ink-faint)" }}>
            {totalPoints.toLocaleString()} XP
          </span>
        </div>
        {/* Level progress bar */}
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "var(--fill-soft)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${levelPct}%`, background: "var(--accent)" }}
          />
        </div>
        <p className="mt-1 text-[10px]" style={{ color: "var(--ink-faint)" }}>
          {level.name}
        </p>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p
                className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: "var(--ink-faint)" }}
              >
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] transition-colors"
                    style={{
                      background: active ? "var(--accent-soft)" : "transparent",
                      color: active ? "var(--accent)" : "var(--ink-muted)",
                    }}
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-[6px] shrink-0"
                      style={{
                        background: active ? "var(--accent)" : "var(--fill-soft)",
                        color: active ? "#fff" : "var(--ink-muted)",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Sign out ── */}
      <div
        className="px-2 pb-4 pt-2"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <button
          onClick={handleSignOut}
          disabled={pending}
          className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-[9px] transition-colors hover:bg-[var(--fill-faint)] disabled:opacity-40"
          style={{ color: "var(--ink-faint)" }}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-[6px] shrink-0"
            style={{ background: "var(--fill-soft)", color: "var(--ink-faint)" }}
          >
            <LogOut size={14} strokeWidth={1.75} />
          </span>
          <span className="text-[13px] font-medium">Sign out</span>
        </button>
        <p className="mt-1.5 px-2.5 text-[10px] truncate" style={{ color: "var(--ink-faint)" }}>
          {userEmail}
        </p>
      </div>
    </aside>
  );
}
