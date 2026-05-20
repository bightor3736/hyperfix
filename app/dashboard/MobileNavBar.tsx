"use client";

import Link from "next/link";
import { Home, Discovery, Plus, Category, Setting } from "react-iconly";

export function MobileNavBar() {
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
      <MobileNavLink href="/dashboard" label="Home">
        <Home set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/explore" label="Explore">
        <Discovery set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/new" label="New fix">
        <Plus set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/lists" label="Lists">
        <Category set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
      <MobileNavLink href="/dashboard/settings" label="Settings">
        <Setting set="light" size={22} primaryColor="currentColor" />
      </MobileNavLink>
    </nav>
  );
}

function MobileNavLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors"
      style={{ color: "rgba(244,244,244,0.45)" }}
    >
      {children}
      <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
    </Link>
  );
}
