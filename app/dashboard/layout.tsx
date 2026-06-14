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
      className="dash-landing min-h-screen flex"
      style={
        {
          background: "#FBF7F1",
          "--bg": "#FBF7F1",
          "--bg-soft": "#F5EFE5",
          "--bg-elevated": "#FFFFFF",
          "--bg-white": "#FFFFFF",
          "--ink": "#181410",
          "--ink-muted": "rgba(24,20,16,0.60)",
          "--ink-faint": "rgba(24,20,16,0.40)",
          "--line": "rgba(24,20,16,0.10)",
          "--line-strong": "rgba(24,20,16,0.18)",
          "--fill": "rgba(24,20,16,0.04)",
          "--fill-soft": "rgba(24,20,16,0.025)",
          "--fill-faint": "rgba(24,20,16,0.02)",
          "--accent": "#FF5A36",
          "--accent-soft": "rgba(255,90,54,0.12)",
          "--accent-ink": "#ffffff",
          "--energy": "#FF5A36",
          "--energy-soft": "rgba(255,90,54,0.12)",
          "--xp": "#6D5AE6",
          "--xp-soft": "rgba(109,90,230,0.12)",
          "--flame": "#F2541B",
          "--flame-soft": "rgba(242,84,27,0.12)",
          "--primary": "#181410",
          "--primary-foreground": "#FBF7F1",
          "--card": "#FFFFFF",
          "--card-foreground": "#181410",
          "--muted-foreground": "rgba(24,20,16,0.60)",
          "--border": "rgba(24,20,16,0.10)",
          "--invert-bg": "#181410",
          "--invert-ink": "#FBF7F1",
          fontFamily: "var(--font-landing-sans), Inter, system-ui, sans-serif",
          color: "#181410",
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

        <MobileNavBar username={profile?.username ?? null} />
      </div>
    </div>
    </ToastProvider>
  );
}

