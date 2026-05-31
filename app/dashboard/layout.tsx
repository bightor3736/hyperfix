import { createClient } from "@/lib/supabase/server";
import { DashboardSidebarClient } from "./DashboardSidebarClient";
import { ToastProvider } from "@/components/ToastProvider";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { MobileNavBar } from "./MobileNavBar";

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
  let profile: { username: string | null; display_name: string | null; avatar_url: string | null; is_pro: boolean | null; referral_code: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url, is_pro, referral_code")
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

  // Current check-in streak for the sidebar badge
  let currentStreak = 0;
  if (user) {
    const { data: entryDates } = await supabase
      .from("fix_entries")
      .select("date")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(90);

    if (entryDates && entryDates.length > 0) {
      const uniqueDates = [
        ...new Set(entryDates.map((e: { date: string }) => e.date)),
      ]
        .sort()
        .reverse();
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      let cursor =
        uniqueDates[0] === today || uniqueDates[0] === yesterday
          ? uniqueDates[0]
          : null;
      if (cursor) {
        for (const d of uniqueDates) {
          if (d === cursor) {
            currentStreak++;
            cursor = new Date(new Date(cursor).getTime() - 86400000)
              .toISOString()
              .split("T")[0];
          } else {
            break;
          }
        }
      }
    }
  }

  return (
    <ToastProvider>
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Desktop Sidebar */}
      <DashboardSidebarClient
        displayName={displayName}
        avatarUrl={avatarUrl}
        userEmail={user?.email || ""}
        isPro={profile?.is_pro ?? false}
        username={profile?.username ?? null}
        currentStreak={currentStreak}
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
        <ServiceWorkerRegister />

        <MobileNavBar username={profile?.username ?? null} />
      </div>
    </div>
    </ToastProvider>
  );
}

