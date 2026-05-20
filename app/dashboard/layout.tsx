import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DashboardSidebarClient } from "./DashboardSidebarClient";
import { ToastProvider } from "@/components/ToastProvider";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Try to get profile
  let profile: { username: string | null; display_name: string | null; avatar_url: string | null; is_pro: boolean | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url, is_pro")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const displayName =
    profile?.display_name ||
    profile?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "you";

  const avatarUrl = profile?.avatar_url || null;

  return (
    <ToastProvider>
    <div className="min-h-screen flex" style={{ background: "#0A0A0A" }}>
      {/* Desktop Sidebar */}
      <DashboardSidebarClient
        displayName={displayName}
        avatarUrl={avatarUrl}
        userEmail={user?.email || ""}
        isPro={profile?.is_pro ?? false}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        {/* Main area */}
        <main id="main-content" className="flex-1">
          {children}
          {/* Spacer on mobile so content clears the fixed tab bar + safe area */}
          <div className="lg:hidden" style={{ height: "calc(5rem + env(safe-area-inset-bottom))" }} />
        </main>

        <PWAInstallPrompt />

        {/* Mobile bottom tab bar */}
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
            <HomeIcon />
          </MobileNavLink>
          <MobileNavLink href="/explore" label="Explore">
            <ExploreIcon />
          </MobileNavLink>
          <MobileNavLink href="/dashboard/new" label="New fix">
            <PlusIcon />
          </MobileNavLink>
          <MobileNavLink href="/dashboard/lists" label="Lists">
            <ListsIcon />
          </MobileNavLink>
          <MobileNavLink href="/dashboard/settings" label="Settings">
            <GearIcon />
          </MobileNavLink>
        </nav>
      </div>
    </div>
    </ToastProvider>
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

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function TombstoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="14" rx="6" />
      <path d="M6 16 L4 22 L20 22 L18 16" />
      <path d="M10 10 L14 10 M12 8 L12 12" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ListsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export { HomeIcon, StackIcon, TombstoneIcon, GearIcon, PlusIcon, ExploreIcon, ListsIcon };
