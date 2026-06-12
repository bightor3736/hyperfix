"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Flame, Sparkles, User } from "lucide-react";

export function MobileNavBar({ username }: { username?: string | null }) {
  const pathname = usePathname();
  const profileHref = username ? `/u/${username}` : "/onboarding/username";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <MobileNavLink href="/dashboard" label="Play" pathname={pathname} exact>
        <LayoutDashboard size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/fixations" label="Fixations" pathname={pathname}>
        <Flame size={22} strokeWidth={1.5} />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/points" label="XP" pathname={pathname}>
        <Sparkles size={22} strokeWidth={1.5} />
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
      className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all"
      style={{
        color: isActive ? "#ffffff" : "rgba(255,255,255,0.35)",
        background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
      }}
    >
      {children}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
