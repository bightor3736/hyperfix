"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Discovery, Plus, User } from "react-iconly";

function RoomsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M15.5 19c0-2 1-3.4 2.5-3.4 2 0 3 1.6 3 3.4" />
    </svg>
  );
}

export function MobileNavBar({ username }: { username?: string | null }) {
  const pathname = usePathname();
  const profileHref = username ? `/u/${username}` : "/onboarding/username";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(244,244,244,0.07)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <MobileNavLink href="/dashboard" label="Home" pathname={pathname} exact>
        <Home set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/explore" label="Explore" pathname={pathname}>
        <Discovery set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavFab href="/dashboard/new" pathname={pathname} />
      <MobileNavLink href={profileHref} label="Profile" pathname={pathname}>
        <User set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/room" label="Rooms" pathname={pathname}>
        <RoomsIcon />
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
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors"
      style={{ color: isActive ? "#5EEAD4" : "rgba(244,244,244,0.45)" }}
    >
      {children}
      <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
    </Link>
  );
}

function MobileNavFab({ href, pathname }: { href: string; pathname: string }) {
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-label="New fix"
      aria-current={isActive ? "page" : undefined}
      className="flex items-center justify-center rounded-full transition-all active:scale-95"
      style={{
        width: 44,
        height: 44,
        transform: "translateY(-8px)",
        background: "#5EEAD4",
        color: "#070708",
        boxShadow: "0 4px 16px rgba(94,234,212,0.4)",
      }}
    >
      <Plus set="bold" size={24} primaryColor="currentColor" />
    </Link>
  );
}
