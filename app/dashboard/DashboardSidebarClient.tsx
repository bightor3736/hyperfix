"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/NotificationBell";
import {
  LayoutDashboard,
  MessageCircle,
  Settings,
  LogOut,
  User,
  Sparkles,
  Snowflake,
  Flame,
  ChevronRight,
  Brain,
  Activity,
  Trophy,
  Pill,
  Heart,
  Timer,
} from "lucide-react";
import { levelForPoints } from "@/lib/gamification/levels";

// Dark sidebar — matches the dark indigo hero used in DashboardHome.
// All colours are explicit (no var(--bg) etc.) so this is self-contained.
const D = {
  bg: "#0f0d40",
  bgCard: "rgba(255,255,255,0.06)",
  bgActive: "rgba(255,255,255,0.12)",
  border: "rgba(255,255,255,0.07)",
  text: "rgba(255,255,255,0.88)",
  muted: "rgba(255,255,255,0.48)",
  faint: "rgba(255,255,255,0.28)",
  accent: "#a78bfa",      // violet-400 — readable on dark
  accentBg: "rgba(167,139,250,0.15)",
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

type NavItem = { href: string; label: string; icon: React.ReactNode; badge?: number };
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
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/messages/unread-count");
        if (!res.ok) return;
        const { count } = (await res.json()) as { count: number };
        if (!cancelled) setUnread(count ?? 0);
      } catch { /* ignore */ }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
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
        { href: "/dashboard",             label: "Play",         icon: <LayoutDashboard size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/fixations",   label: "Fixations",    icon: <Flame size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/points",      label: "XP & Levels",  icon: <Sparkles size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/achievements",label: "Achievements", icon: <Trophy size={15} strokeWidth={1.5} /> },
      ],
    },
    {
      label: "Toolkit",
      items: [
        { href: "/dashboard/timer",      label: "Focus Timer",   icon: <Timer size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/brain-dump", label: "Brain Dump",    icon: <Brain size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/mood",       label: "Mood Check-in", icon: <Activity size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/meds",       label: "Meds",          icon: <Pill size={15} strokeWidth={1.5} /> },
        { href: "/dashboard/rsd",        label: "RSD Journal",   icon: <Heart size={15} strokeWidth={1.5} /> },
      ],
    },
    {
      label: "Community",
      items: [
        { href: "/dashboard/messages",  label: "Messages",       icon: <MessageCircle size={15} strokeWidth={1.5} />, badge: unread },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/dashboard/settings",  label: "Settings",       icon: <Settings size={15} strokeWidth={1.5} /> },
      ],
    },
  ];

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-30"
      style={{ background: D.bg, borderRight: `1px solid ${D.border}` }}
    >
      {/* Wordmark */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <Link href="/dashboard" className="inline-block transition-opacity hover:opacity-80">
          <span style={{
            fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1,
            letterSpacing: "-0.08em",
            color: "#fff",
            display: "inline-block",
          }}>
            hyperfix
            <span style={{ fontSize: "0.42em", verticalAlign: "super", fontStyle: "normal", letterSpacing: 0, marginLeft: "0.06em" }}>®</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col overflow-y-auto min-h-0 pb-2">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.14em]"
                style={{ color: D.faint, marginTop: si === 0 ? 4 : 18 }}>
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans transition-all duration-150 mb-0.5"
                  style={{
                    fontSize: 13,
                    color: active ? "#fff" : D.muted,
                    background: active ? D.bgActive : "transparent",
                    fontWeight: active ? 500 : 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span className="shrink-0" style={{ color: active ? D.accent : D.muted }}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] shrink-0"
                      style={{ fontSize: 10, fontWeight: 700, background: D.accent, color: D.bg, lineHeight: 1 }}>
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* XP / Level bar */}
      <div className="px-4 pb-3 shrink-0">
        <Link href="/dashboard/points"
          className="block rounded-2xl p-3.5 transition-all hover:brightness-110"
          style={{ background: D.bgCard, border: `1px solid ${D.border}` }}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} strokeWidth={2} style={{ color: D.accent }} />
              <span className="text-[11px] font-medium" style={{ color: D.accent, letterSpacing: "-0.01em" }}>
                {level.name}
              </span>
            </div>
            <span className="text-[11px] tabular-nums" style={{ color: D.muted }}>
              {totalPoints.toLocaleString()} XP
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.10)" }}>
            <div className="h-full rounded-full" style={{
              width: `${levelPct}%`,
              background: "linear-gradient(90deg, #818cf8, #a78bfa)",
            }} />
          </div>
          {next && (
            <p className="mt-1.5 text-[10px]" style={{ color: D.faint }}>
              {(next.points - totalPoints).toLocaleString()} XP to {next.name}
            </p>
          )}
        </Link>
      </div>

      {/* Streak + Freezes chips */}
      <div className="px-4 pb-3 shrink-0 flex gap-2">
        <div className="flex-1 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: D.bgCard, border: `1px solid ${D.border}` }}>
          <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: D.muted }}>
            <Flame size={13} strokeWidth={2} style={{ color: "#fb923c" }} />
            streak
          </span>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: "#fff" }}>
            {currentStreak}
          </span>
        </div>
        <Link href={streakFreezes > 0 ? "/dashboard/points" : "/pricing"}
          className="flex-1 flex items-center justify-between rounded-xl px-3 py-2 transition-all hover:brightness-110"
          style={{ background: D.bgCard, border: `1px solid ${D.border}` }}>
          <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: D.muted }}>
            <Snowflake size={13} strokeWidth={2} style={{ color: "#7dd3fc" }} />
            freezes
          </span>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: "#fff" }}>
            {streakFreezes}
          </span>
        </Link>
      </div>

      {/* User section */}
      <div className="px-4 pt-3 pb-4 shrink-0" style={{ borderTop: `1px solid ${D.border}` }}>
        <div className="flex items-center gap-2.5 mb-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
            style={{ background: D.bgCard, border: `1.5px solid ${D.border}`, color: D.accent }}>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName[0]?.toUpperCase() || "?"
            )}
          </div>
          {/* Name / email */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium truncate" style={{ color: D.text, letterSpacing: "-0.01em" }}>
                {displayName}
              </p>
              {isPro && (
                <span className="text-[9px] rounded px-1.5 py-0.5 shrink-0 font-semibold"
                  style={{ background: D.accentBg, color: D.accent }}>PRO</span>
              )}
            </div>
            {userEmail && (
              <p className="text-[10px] truncate" style={{ color: D.faint }}>{userEmail}</p>
            )}
          </div>
          <NotificationBell />
        </div>

        <div className="flex gap-2">
          <Link
            href={username ? `/u/${username}` : "/onboarding/username"}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:brightness-110"
            style={{ background: D.bgCard, color: D.muted, border: `1px solid ${D.border}` }}
          >
            <User size={12} strokeWidth={1.5} />
            {username ? "Profile" : "Set up"}
            <ChevronRight size={11} strokeWidth={2} />
          </Link>
          <button
            onClick={handleSignOut}
            disabled={pending}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: D.bgCard, color: D.muted, border: `1px solid ${D.border}` }}
          >
            <LogOut size={12} strokeWidth={1.5} />
            {pending ? "…" : "Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
