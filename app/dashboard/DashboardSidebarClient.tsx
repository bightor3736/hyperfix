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
  ChevronRight,
  Trophy,
  Timer,
  Palette,
} from "lucide-react";
import { levelForPoints } from "@/lib/gamification/levels";

const D = {
  bg: "var(--bg-elevated)",
  bgCard: "var(--bg-soft)",
  bgActive: "var(--accent-soft)",
  border: "var(--line)",
  text: "var(--ink)",
  muted: "var(--ink-muted)",
  faint: "var(--ink-faint)",
  accent: "var(--accent)",
  accentBg: "var(--accent-soft)",
};

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
        { href: "/dashboard",              label: "Play",         icon: <LayoutDashboard size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/fixations",    label: "Fixations",    icon: <Flame size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/points",       label: "XP & Levels",  icon: <Sparkles size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/achievements", label: "Achievements", icon: <Trophy size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/timer",        label: "Focus Timer",  icon: <Timer size={15} strokeWidth={1.5} /> },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/dashboard/customize", label: "Customize",  icon: <Palette size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/settings",  label: "Settings",   icon: <Settings size={15} strokeWidth={1.5} /> },
      ],
    },
  ];

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  }

  const initials = displayName.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside
      className="hidden lg:flex flex-col h-screen w-60 shrink-0 fixed left-0 top-0 z-40"
      style={{ background: D.bg, borderRight: `1px solid ${D.border}` }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4" style={{ borderBottom: `1px solid ${D.border}` }}>
        <Link href="/dashboard" className="font-display text-[18px] tracking-tight transition-opacity hover:opacity-80" style={{ color: "var(--ink)" }}>
          hyperfix
        </Link>
        <NotificationBell />
      </div>

      {/* Profile strip */}
      <Link
        href={username ? `/u/${username}` : "/onboarding/username"}
        className="flex items-center gap-2.5 px-4 py-3 transition-opacity hover:opacity-80"
        style={{ borderBottom: `1px solid ${D.border}` }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: `1px solid ${D.border}` }} />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "var(--pastel-green)", color: "var(--lime)" }}>
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold truncate" style={{ color: D.text }}>{displayName}</p>
          {isPro && <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--lime)" }}>pro</p>}
        </div>
        <ChevronRight size={13} strokeWidth={2} style={{ color: D.faint }} />
      </Link>

      {/* Streak + level strip */}
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${D.border}` }}>
        <div className="flex items-center gap-3 mb-2.5">
          <Link href="/dashboard/points" className="flex items-center gap-1.5 transition-opacity hover:opacity-80" style={{ color: "var(--flame)" }}>
            <Flame size={13} strokeWidth={2.5} fill="currentColor" />
            <span className="font-mono text-[12px] font-bold tabular-nums">{currentStreak}</span>
          </Link>
          {streakFreezes > 0 && (
            <span className="flex items-center gap-1 font-mono text-[11px]" style={{ color: "var(--accent)" }}>
              <Snowflake size={11} strokeWidth={2} />
              {streakFreezes}
            </span>
          )}
          <span className="ml-auto font-mono text-[10px]" style={{ color: D.faint }}>
            {totalPoints.toLocaleString()} XP
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: D.bgCard }}>
          <div className="h-full rounded-full" style={{ width: `${levelPct}%`, background: "linear-gradient(90deg, var(--accent), var(--violet))" }} />
        </div>
        <p className="mt-1.5 font-mono text-[10px]" style={{ color: D.faint }}>{level.name}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-2 mb-1.5 font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: D.faint }}>
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
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                    style={{
                      background: active ? D.bgActive : "transparent",
                      color: active ? D.accent : D.muted,
                    }}
                  >
                    <span style={{ color: active ? D.accent : D.faint }}>{item.icon}</span>
                    <span className="text-[13px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5" style={{ borderTop: `1px solid ${D.border}`, paddingTop: 12 }}>
        <button
          onClick={handleSignOut}
          disabled={pending}
          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:opacity-70 disabled:opacity-50"
          style={{ color: D.faint }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          <span className="text-[13px] font-medium">Sign out</span>
        </button>
        <p className="mt-2 px-3 font-mono text-[10px] truncate" style={{ color: "var(--ink-faint)" }}>{userEmail}</p>
      </div>
    </aside>
  );
}
