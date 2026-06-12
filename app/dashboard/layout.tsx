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
          background: "#000000",
          "--bg": "#000000",
          "--bg-soft": "#0a0a0a",
          "--bg-elevated": "#111111",
          "--bg-white": "#0d0d0d",
          "--ink": "#ffffff",
          "--ink-muted": "rgba(255,255,255,0.55)",
          "--ink-faint": "rgba(255,255,255,0.30)",
          "--line": "rgba(255,255,255,0.08)",
          "--line-strong": "rgba(255,255,255,0.18)",
          "--fill": "rgba(255,255,255,0.04)",
          "--fill-soft": "rgba(255,255,255,0.02)",
          "--accent": "#A78BFA",
          "--accent-soft": "rgba(167,139,250,0.12)",
          "--accent-ink": "#000000",
          "--energy": "#A78BFA",
          "--energy-soft": "rgba(167,139,250,0.12)",
          "--xp": "#A78BFA",
          "--xp-soft": "rgba(167,139,250,0.12)",
          "--flame": "#F97316",
          "--flame-soft": "rgba(249,115,22,0.12)",
          "--primary": "#ffffff",
          "--primary-foreground": "#000000",
          "--card": "#0d0d0d",
          "--card-foreground": "#ffffff",
          "--muted-foreground": "rgba(255,255,255,0.55)",
          "--border": "rgba(255,255,255,0.08)",
          "--invert-bg": "#ffffff",
          "--invert-ink": "#000000",
          fontFamily: "var(--font-landing-sans), Inter, system-ui, sans-serif",
          color: "#ffffff",
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

