"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, MessageCircle, User } from "lucide-react";

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
      <MobileNavLink href="/dashboard" label="Play" pathname={pathname} exact>
        <LayoutDashboard size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavLink href="/leaderboard" label="Ranks" pathname={pathname}>
        <Trophy size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/messages" label="Inbox" pathname={pathname}>
        <MessageCircle size={22} strokeWidth={1.5} />
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

