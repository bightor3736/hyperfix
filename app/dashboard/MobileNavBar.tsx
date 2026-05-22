"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Discovery, Plus, Category, Chart, Setting } from "react-iconly";

export function MobileNavBar() {
  const pathname = usePathname();

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
      <MobileNavLink href="/dashboard/new" label="New fix" pathname={pathname}>
        <Plus set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/lists" label="Lists" pathname={pathname}>
        <Category set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/analytics" label="Analytics" pathname={pathname}>
        <Chart set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/settings" label="Settings" pathname={pathname}>
        <Setting set="light" size={22} primaryColor="currentColor" />
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
