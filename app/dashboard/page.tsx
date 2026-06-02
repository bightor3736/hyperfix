import { createClient } from "@/lib/supabase/server";
import { DashboardHome } from "./DashboardHome";
import { getDailyQuests } from "@/lib/quests/generate";
import { levelForPoints } from "@/lib/gamification/levels";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "good night, night owl";
  if (hour < 12) return "good morning";
  if (hour < 18) return "good afternoon";
  if (hour < 22) return "good evening";
  return "good night, night owl";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  let username: string | null = null;

  let profile: {
    display_name: string | null;
    username: string | null;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    streak_freezes: number;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, username, total_points, current_streak, longest_streak, streak_freezes")
      .eq("id", user.id)
      .single();
    profile = data;
    if (data) {
      displayName = data.display_name || data.username || displayName;
      username = data.username ?? null;
    }
  }

  const totalPoints = profile?.total_points ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const streakFreezes = profile?.streak_freezes ?? 0;

  const quests = user ? await getDailyQuests(user.id) : [];

  // Dopamine hits today (drives the daily-goal ring inside the menu)
  let dopamineToday = 0;
  if (user) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("dopamine_hits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfDay.toISOString());
    dopamineToday = count ?? 0;
  }

  let wallsTotal = 0;
  if (user) {
    const { count } = await supabase
      .from("walls_broken")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    wallsTotal = count ?? 0;
  }

  const { level, next } = levelForPoints(totalPoints);
  const levelName = level.name;
  const firstName = displayName.split(" ")[0];

  return (
    <DashboardHome
      firstName={firstName}
      greeting={getGreeting()}
      username={username}
      levelName={levelName}
      totalPoints={totalPoints}
      currentStreak={currentStreak}
      streakFreezes={streakFreezes}
      dopamineToday={dopamineToday}
      wallsTotal={wallsTotal}
      quests={quests}
      currentLevelPoints={level.points}
      nextLevelPoints={next?.points}
    />
  );
}
