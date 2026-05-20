"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoWordmark } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";

type Props = {
  displayName: string;
  avatarUrl: string | null;
  userEmail: string;
  isPro?: boolean;
};

export function DashboardSidebarClient({ displayName, avatarUrl, userEmail, isPro }: Props) {
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

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: "/explore",
      label: "Explore",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      href: "/search",
      label: "Search",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      ),
    },
    {
      href: "/dashboard/lists",
      label: "Lists",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      href: "/dashboard/graveyard",
      label: "Graveyard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2" width="12" height="14" rx="6" />
          <path d="M6 16 L4 22 L20 22 L18 16" />
          <path d="M10 10 L14 10 M12 8 L12 12" />
        </svg>
      ),
    },
    {
      href: `/wrapped/${new Date().getFullYear()}`,
      label: `Wrapped '${String(new Date().getFullYear()).slice(2)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
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
      <div className="px-6 pt-6 pb-4">
        <Link href="/dashboard">
          <LogoWordmark size="md" />
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4" style={{ height: 1, background: "rgba(244,244,244,0.06)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
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
                color: isActive ? "#A855F7" : "rgba(244,244,244,0.5)",
                background: isActive ? "rgba(168,85,247,0.08)" : "transparent",
                border: isActive ? "1px solid rgba(168,85,247,0.15)" : "1px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}>
        {/* Avatar + name + bell */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: avatarUrl ? "transparent" : "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.2)",
                color: "#A855F7",
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
                      background: "rgba(168,85,247,0.2)",
                      color: "#A855F7",
                      border: "1px solid rgba(168,85,247,0.3)",
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

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={pending}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-sans text-sm transition-all duration-150 hover:opacity-80 disabled:opacity-50"
          style={{
            color: "rgba(244,244,244,0.4)",
            background: "rgba(244,244,244,0.04)",
            border: "1px solid rgba(244,244,244,0.06)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
