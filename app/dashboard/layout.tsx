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
          background: "var(--bg)",
          "--bg": "#f1f1f4",
          "--bg-soft": "#e9e9f0",
          "--bg-elevated": "#ffffff",
          "--ink": "#0b0b12",
          "--ink-muted": "#6b6b78",
          "--ink-faint": "#a2a2af",
          "--line": "rgba(15,15,40,0.10)",
          "--line-strong": "rgba(15,15,40,0.18)",
          // Accent system derived from the hero blob (blue → indigo → purple)
          "--accent": "#4f46e5",
          "--accent-soft": "#ececfd",
          "--accent-ink": "#ffffff",
          "--energy": "#4f46e5",
          "--energy-soft": "#ececfd",
          "--xp": "#7c3aed",
          "--xp-soft": "#f1eafe",
          "--flame": "#f97316",
          "--flame-soft": "#fff0e3",
          // shadcn semantic tokens so ui/* components adopt the blue theme
          "--primary": "#4f46e5",
          "--primary-foreground": "#ffffff",
          "--card": "#ffffff",
          "--card-foreground": "#0b0b12",
          "--muted-foreground": "#6b6b78",
          "--border": "rgba(15,15,40,0.10)",
          // near-black pill buttons
          "--invert-bg": "#16161d",
          "--invert-ink": "#ffffff",
          fontFamily: "var(--font-landing-sans), Inter, system-ui, sans-serif",
          color: "#0b0b12",
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

