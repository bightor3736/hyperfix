import { createClient } from "@/lib/supabase/server";
import { DashboardSidebarClient } from "./DashboardSidebarClient";
import { ToastProvider } from "@/components/ToastProvider";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { MobileNavBar } from "./MobileNavBar";
import { QuickCapture } from "@/components/QuickCapture";

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
  let profile: { username: string | null; display_name: string | null; avatar_url: string | null; is_pro: boolean | null; referral_code: string | null; total_points: number | null; current_streak: number | null; streak_freezes: number | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url, is_pro, referral_code, total_points, current_streak, streak_freezes")
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
  const currentStreak = profile?.current_streak ?? 0;

  return (
    <ToastProvider>
    <div
      className="min-h-screen flex"
      style={
        {
          background: "var(--bg)",
          "--bg": "#f0f0f0",
          "--bg-soft": "#eae9e7",
          "--bg-elevated": "#ffffff",
          "--ink": "#0a0a0a",
          "--ink-muted": "#7c7c7c",
          "--ink-faint": "#a4a4a4",
          "--line": "rgba(0,0,0,0.10)",
          "--line-strong": "rgba(0,0,0,0.18)",
          "--accent": "#1dcc5d",
          "--accent-soft": "#e3f9ec",
          "--accent-ink": "#04130a",
          "--energy": "#1dcc5d",
          "--energy-soft": "#e3f9ec",
          "--xp": "#13a64c",
          "--xp-soft": "#e3f9ec",
          "--primary": "#1dcc5d",
          "--primary-foreground": "#04130a",
          fontFamily: "var(--font-landing-sans), Inter, system-ui, sans-serif",
          color: "#0a0a0a",
        } as React.CSSProperties
      }
    >
      {/* Desktop Sidebar */}
      <DashboardSidebarClient
        displayName={displayName}
        avatarUrl={avatarUrl}
        userEmail={user?.email || ""}
        isPro={profile?.is_pro ?? false}
        username={profile?.username ?? null}
        currentStreak={currentStreak}
        totalPoints={profile?.total_points ?? 0}
        streakFreezes={profile?.streak_freezes ?? 0}
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
        <QuickCapture />

        <MobileNavBar username={profile?.username ?? null} />
      </div>
    </div>
    </ToastProvider>
  );
}

