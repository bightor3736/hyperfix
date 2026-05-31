"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoLockup } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";
import { Home, Discovery, Search, Category, Setting, Plus, Logout, Chart } from "react-iconly";

function MessagesIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7l9 6 9-6" />
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  );
}

type Props = {
  displayName: string;
  avatarUrl: string | null;
  userEmail: string;
  isPro?: boolean;
  username?: string | null;
};

export function DashboardSidebarClient({ displayName, avatarUrl, userEmail, isPro, username }: Props) {
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

  const navItems: Array<{
    href: string;
    label: string;
    icon: (active: boolean) => React.ReactNode;
    badge?: number;
  }> = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (active: boolean) => <Home set={active ? "bold" : "light"} size={18} primaryColor="currentColor" />,
    },
    {
      href: "/explore",
      label: "Explore",
      icon: (active: boolean) => <Discovery set={active ? "bold" : "light"} size={18} primaryColor="currentColor" />,
    },
    {
      href: "/search",
      label: "Search",
      icon: (active: boolean) => <Search set={active ? "bold" : "light"} size={18} primaryColor="currentColor" />,
    },
    {
      href: "/dashboard/lists",
      label: "Lists",
      icon: (active: boolean) => <Category set={active ? "bold" : "light"} size={18} primaryColor="currentColor" />,
    },
    {
      href: "/dashboard/graveyard",
      label: "Graveyard",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2" width="12" height="14" rx="6" />
          <path d="M6 16 L4 22 L20 22 L18 16" />
          <path d="M10 10 L14 10 M12 8 L12 12" />
        </svg>
      ),
    },
    {
      href: "/room",
      label: "Focus Rooms",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
          <path d="M15.5 19c0-2 1-3.4 2.5-3.4 2 0 3 1.6 3 3.4" />
        </svg>
      ),
    },
    {
      href: "/dashboard/brain-dump",
      label: "Brain Dump",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
          <rect x="9" y="1" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      ),
    },
    {
      href: "/dashboard/timer",
      label: "Timer",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M9 3h6M12 3v2" />
        </svg>
      ),
    },
    {
      href: "/dashboard/mood",
      label: "Mood Log",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/rsd",
      label: "RSD Journal",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      href: "/dashboard/meds",
      label: "Medications",
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 2.3L2.3 10.5a5 5 0 0 0 7.07 7.07l8.2-8.2a5 5 0 0 0-7.07-7.07z" />
          <line x1="7" y1="12" x2="12" y2="7" />
        </svg>
      ),
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: (active: boolean) => <MessagesIcon active={active} />,
      badge: unreadMessages,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: (active: boolean) => <Chart set={active ? "bold" : "light"} size={18} primaryColor="currentColor" />,
    },
    {
      href: `/wrapped/${new Date().getFullYear()}`,
      label: `Wrapped '${String(new Date().getFullYear()).slice(2)}`,
      icon: (_active: boolean) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M3 12 L21 12" />
          <path d="M12 8 L12 21" />
          <path d="M7.5 8 C6 8 5 6.5 5.5 5 C6 3.5 8 3.5 9 5 C10 6.5 12 8 12 8" />
          <path d="M16.5 8 C18 8 19 6.5 18.5 5 C18 3.5 16 3.5 15 5 C14 6.5 12 8 12 8" />
        </svg>
      ),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: (active: boolean) => <Setting set={active ? "bold" : "light"} size={18} primaryColor="currentColor" />,
    },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-30"
      style={{
        background: "#0A0A0A",
        borderRight: "1px solid rgba(244,244,244,0.07)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/dashboard" className="inline-block transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
      </div>

      {/* New fix CTA */}
      <div className="px-3 pb-3">
        <Link
          href="/dashboard/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: "#5EEAD4", color: "#F4F4F4" }}
        >
          <Plus set="light" size={16} primaryColor="currentColor" />
          New fix
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4" style={{ height: 1, background: "rgba(244,244,244,0.06)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : item.href === "/explore"
              ? pathname === "/explore" || pathname.startsWith("/explore/")
              : item.href === "/search"
              ? pathname === "/search"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm font-medium transition-all duration-150"
              style={{
                color: isActive ? "#5EEAD4" : "rgba(244,244,244,0.5)",
                background: isActive ? "rgba(94,234,212,0.08)" : "transparent",
                border: isActive ? "1px solid rgba(94,234,212,0.15)" : "1px solid transparent",
              }}
            >
              {item.icon(isActive)}
              <span className="flex-1">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span
                  className="inline-flex items-center justify-center font-mono text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] h-[18px]"
                  style={{
                    background: "#5EEAD4",
                    color: "#0A0A0A",
                    lineHeight: 1,
                  }}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro upsell — free users only */}
      {!isPro && (
        <div className="px-3 pb-3">
          <Link
            href="/pricing"
            className="block relative overflow-hidden rounded-2xl p-3.5 transition-all hover:-translate-y-0.5 group"
            style={{
              background: "linear-gradient(135deg, rgba(94,234,212,0.08) 0%, rgba(94,234,212,0.02) 100%)",
              border: "1px solid rgba(94,234,212,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#5EEAD4" }}>
                Hyperfix Pro
              </span>
            </div>
            <p className="font-sans text-[12px] mb-2 leading-snug" style={{ color: "rgba(244,244,244,0.7)" }}>
              Unlimited fixes, custom theme, premium card templates.
            </p>
            <span
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest group-hover:gap-1.5 transition-all"
              style={{ color: "#5EEAD4" }}
            >
              See plans →
            </span>
          </Link>
        </div>
      )}

      {/* User section */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}>
        {/* Avatar + name + bell */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: avatarUrl ? "transparent" : "rgba(94,234,212,0.15)",
                border: "1px solid rgba(94,234,212,0.2)",
                color: "#5EEAD4",
                overflow: "hidden",
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName[0]?.toUpperCase() || "?"
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-sans text-sm font-medium truncate" style={{ color: "#F4F4F4" }}>
                  {displayName}
                </p>
                {isPro && (
                  <span
                    className="font-mono text-[9px] shrink-0 rounded px-1.5 py-0.5"
                    style={{
                      background: "rgba(94,234,212,0.2)",
                      color: "#5EEAD4",
                      border: "1px solid rgba(94,234,212,0.3)",
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
              {userEmail && (
                <p className="font-mono text-[10px] truncate" style={{ color: "rgba(244,244,244,0.35)" }}>
                  {userEmail}
                </p>
              )}
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* Profile + sign out row */}
        <div className="flex gap-2">
          <Link
            href={username ? `/u/${username}` : "/onboarding/username"}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-medium transition-all duration-150 hover:opacity-80"
            style={{
              color: username ? "rgba(244,244,244,0.5)" : "#5EEAD4",
              background: username ? "rgba(244,244,244,0.04)" : "rgba(94,234,212,0.07)",
              border: username ? "1px solid rgba(244,244,244,0.06)" : "1px solid rgba(94,234,212,0.2)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            {username ? "My profile" : "Set up profile"}
          </Link>
          <button
            onClick={handleSignOut}
            disabled={pending}
            className={`${username ? "" : "w-full "}flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-sans text-xs transition-all duration-150 hover:opacity-80 disabled:opacity-50`}
            style={{
              color: "rgba(244,244,244,0.4)",
              background: "rgba(244,244,244,0.04)",
              border: "1px solid rgba(244,244,244,0.06)",
            }}
          >
            <Logout set="light" size={14} primaryColor="currentColor" />
            {pending ? "…" : "Sign out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
