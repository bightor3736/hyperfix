"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoLockup } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { StreakBadge } from "@/components/ui/streak-badge";
import {
  LayoutDashboard,
  Compass,
  Search,
  BookMarked,
  FolderOpen,
  BarChart3,
  Inbox,
  Timer,
  Activity,
  BookOpen,
  Pill,
  MessageCircle,
  Users,
  Gift,
  Settings,
  Plus,
  LogOut,
  User,
  Zap,
  Trophy,
  Sparkles,
  Snowflake,
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

type NavSection = {
  label?: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    badge?: number;
  }>;
};

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
  const levelFloor = level.points;
  const levelCeil = next ? next.points : level.points;
  const levelPct = next
    ? Math.min(100, Math.max(0, ((totalPoints - levelFloor) / (levelCeil - levelFloor)) * 100))
    : 100;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/messages/unread-count");
        if (!res.ok) return;
        const data = (await res.json()) as { count: number };
        if (!cancelled) setUnreadMessages(data.count ?? 0);
      } catch {
        /* ignore */
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pathname]);

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
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={16} strokeWidth={1.5} />,
        },
        {
          href: "/explore",
          label: "Explore",
          icon: <Compass size={16} strokeWidth={1.5} />,
        },
        {
          href: "/search",
          label: "Search",
          icon: <Search size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/points",
          label: "Points & Levels",
          icon: <Sparkles size={16} strokeWidth={1.5} />,
        },
        {
          href: "/leaderboard",
          label: "Leaderboard",
          icon: <Trophy size={16} strokeWidth={1.5} />,
        },
      ],
    },
    {
      label: "Projects",
      items: [
        {
          href: "/dashboard/graveyard",
          label: "Graveyard",
          icon: <BookMarked size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/lists",
          label: "Lists",
          icon: <FolderOpen size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/analytics",
          label: "Analytics",
          icon: <BarChart3 size={16} strokeWidth={1.5} />,
        },
      ],
    },
    {
      label: "ADHD Toolkit",
      items: [
        {
          href: "/dashboard/brain-dump",
          label: "Brain Dump",
          icon: <Inbox size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/timer",
          label: "Timer",
          icon: <Timer size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/mood",
          label: "Mood Log",
          icon: <Activity size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/rsd",
          label: "RSD Journal",
          icon: <BookOpen size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/meds",
          label: "Medications",
          icon: <Pill size={16} strokeWidth={1.5} />,
        },
      ],
    },
    {
      label: "Community",
      items: [
        {
          href: "/dashboard/messages",
          label: "Messages",
          icon: <MessageCircle size={16} strokeWidth={1.5} />,
          badge: unreadMessages,
        },
        {
          href: "/room",
          label: "Focus Rooms",
          icon: <Users size={16} strokeWidth={1.5} />,
        },
      ],
    },
    {
      label: "More",
      items: [
        {
          href: `/wrapped/${new Date().getFullYear()}`,
          label: `Wrapped '${String(new Date().getFullYear()).slice(2)}`,
          icon: <Gift size={16} strokeWidth={1.5} />,
        },
        {
          href: "/dashboard/settings",
          label: "Settings",
          icon: <Settings size={16} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/explore") return pathname === "/explore" || pathname.startsWith("/explore/");
    if (href === "/search") return pathname === "/search";
    if (href === "/room") return pathname === "/room" || pathname.startsWith("/room/");
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-30"
      style={{
        background: "var(--bg)",
        borderRight: "1px solid var(--line)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <Link href="/dashboard" className="inline-block transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
      </div>

      {/* New fix CTA */}
      <div className="px-3 pb-3 shrink-0">
        <Link
          href="/dashboard/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-sans text-[13px] font-medium transition-all hover:opacity-90 active:scale-[0.97] bg-invert-bg text-invert-ink"
        >
          <Plus size={14} strokeWidth={2} />
          New project
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 shrink-0" style={{ height: 1, background: "var(--line)" }} />

      {/* Nav — scrollable */}
      <nav className="flex-1 px-3 flex flex-col overflow-y-auto min-h-0 pb-2">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p
                className="px-3 mb-1 font-mono uppercase tracking-[0.12em] text-ink-faint"
                style={{ fontSize: 10, marginTop: si === 0 ? 4 : 20 }}
              >
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl font-sans transition-all duration-150 mb-0.5"
                  style={{
                    fontSize: 13,
                    color: active ? "var(--accent)" : "var(--ink-muted)",
                    background: active ? "var(--accent-soft)" : "transparent",
                    border: active ? "1px solid rgba(111,138,99,0.3)" : "1px solid transparent",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className="inline-flex items-center justify-center font-mono rounded-full px-1.5 min-w-[18px] h-[18px] shrink-0"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        background: "var(--accent)",
                        color: "var(--accent-ink)",
                        lineHeight: 1,
                      }}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Level / XP progress */}
      <div className="px-3 pb-2 shrink-0">
        <Link
          href="/dashboard/points"
          className="block rounded-2xl p-3 transition-all hover:-translate-y-0.5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles size={12} strokeWidth={1.5} className="text-accent shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent truncate">
                {level.name}
              </span>
            </div>
            <span className="font-mono text-[10px] tabular-nums text-ink-muted shrink-0">
              {totalPoints.toLocaleString()} XP
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${levelPct}%`, background: "var(--accent)" }}
            />
          </div>
          {next && (
            <p className="mt-1.5 font-mono text-[9px] text-ink-faint">
              {(next.points - totalPoints).toLocaleString()} XP to {next.name}
            </p>
          )}
        </Link>
      </div>

      {/* Streak badge */}
      {currentStreak > 0 && (
        <div className="px-3 pb-2 shrink-0 flex justify-center">
          <StreakBadge
            size="sm"
            length={currentStreak}
            frequency="daily"
            subtitle="check-in streak"
            className="w-full"
          />
        </div>
      )}

      {/* Streak freezes — protects your run + Pro upsell when empty */}
      <div className="px-3 pb-2 shrink-0">
        {streakFreezes > 0 ? (
          <div
            className="flex items-center justify-between rounded-xl px-3 py-2"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              <Snowflake size={12} strokeWidth={1.5} className="text-accent" />
              freezes
            </span>
            <span className="font-mono text-[11px] tabular-nums text-ink">
              {streakFreezes}
            </span>
          </div>
        ) : (
          <Link
            href="/pricing"
            className="flex items-center justify-between rounded-xl px-3 py-2 transition-all hover:-translate-y-0.5"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent">
              <Snowflake size={12} strokeWidth={1.5} />
              0 freezes
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Get more →
            </span>
          </Link>
        )}
      </div>

      {/* Pro upsell — free users only */}
      {!isPro && (
        <div className="px-3 pb-2 shrink-0">
          <Link
            href="/pricing"
            className="block relative overflow-hidden rounded-2xl p-3.5 transition-all hover:-translate-y-0.5 group"
            style={{
              background: "var(--accent-soft)",
              border: "1px solid var(--accent)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={12} strokeWidth={1.5} className="text-accent" />
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-accent"
              >
                Hyperfix Pro
              </span>
            </div>
            <p className="font-sans text-[12px] mb-2 leading-snug text-ink-muted">
              Unlimited fixes, custom theme, premium card templates.
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-accent group-hover:gap-1.5 transition-all">
              See plans →
            </span>
          </Link>
        </div>
      )}

      {/* User section */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: "1px solid var(--line)" }}>
        {/* Avatar + name + bell */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
              style={{
                background: avatarUrl ? "transparent" : "var(--accent-soft)",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName[0]?.toUpperCase() || "?"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-sans text-sm font-medium truncate text-ink">
                  {displayName}
                </p>
                {isPro && (
                  <span
                    className="font-mono text-[9px] shrink-0 rounded px-1.5 py-0.5"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
              {userEmail && (
                <p className="font-mono text-[10px] truncate text-ink-faint">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* Theme toggle row */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* Profile + sign out row */}
        <div className="flex gap-2">
          <Link
            href={username ? `/u/${username}` : "/onboarding/username"}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-medium transition-all duration-150 hover:opacity-80"
            style={{
              color: username ? "var(--ink-muted)" : "var(--accent)",
              background: username ? "var(--line)" : "var(--accent-soft)",
              border: username ? "1px solid var(--line)" : "1px solid var(--accent)",
            }}
          >
            <User size={12} strokeWidth={1.5} />
            {username ? "My profile" : "Set up profile"}
          </Link>
          <button
            onClick={handleSignOut}
            disabled={pending}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs transition-all duration-150 hover:opacity-80 disabled:opacity-50"
            style={{
              color: "var(--ink-muted)",
              background: "var(--line)",
              border: "1px solid var(--line)",
            }}
          >
            <LogOut size={12} strokeWidth={1.5} />
            {pending ? "…" : "Sign out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
