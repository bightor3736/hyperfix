"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Plus, Timer, User } from "lucide-react";

export function MobileNavBar({ username }: { username?: string | null }) {
  const pathname = usePathname();
  const profileHref = username ? `/u/${username}` : "/onboarding/username";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        background: "var(--bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--line)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <MobileNavLink href="/dashboard" label="Home" pathname={pathname} exact>
        <LayoutDashboard size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/brain-dump" label="Dump" pathname={pathname}>
        <Inbox size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavFab href="/dashboard/new" pathname={pathname} />
      <MobileNavLink href="/dashboard/timer" label="Timer" pathname={pathname}>
        <Timer size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavLink href={profileHref} label="Profile" pathname={pathname}>
        <User size={22} strokeWidth={1.5} />
      </MobileNavLink>
    </nav>
  );
}

function MobileNavLink({
  href,
  label,
  pathname,
  exact,
  children,
}: {
  href: string;
  label: string;
  pathname: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
      style={{ color: isActive ? "var(--accent)" : "var(--ink-muted)" }}
    >
      {children}
      <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
    </Link>
  );
}

function MobileNavFab({
  href,
  pathname,
}: {
  href: string;
  pathname: string;
}) {
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-label="New fix"
      aria-current={isActive ? "page" : undefined}
      className="flex items-center justify-center rounded-full transition-all active:scale-95"
      style={{
        width: 48,
        height: 48,
        transform: "translateY(-10px)",
        background: "var(--invert-bg)",
        color: "var(--invert-ink)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <Plus size={22} strokeWidth={2} />
    </Link>
  );
}
