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
          {username && (
            <Link
              href={`/u/${username}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-medium transition-all duration-150 hover:opacity-80"
              style={{
                color: "rgba(244,244,244,0.5)",
                background: "rgba(244,244,244,0.04)",
                border: "1px solid rgba(244,244,244,0.06)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              My profile
            </Link>
          )}
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
