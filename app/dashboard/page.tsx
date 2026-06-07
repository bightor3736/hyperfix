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
    streak_freezes: number;
    is_pro: boolean | null;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, username, total_points, current_streak, streak_freezes, is_pro")
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
  const isPro = profile?.is_pro ?? false;
  const quests = user ? await getDailyQuests(user.id) : [];

  const { level, index, next } = levelForPoints(totalPoints);
  const firstName = displayName.split(" ")[0];

  return (
    <DashboardHome
      firstName={firstName}
      greeting={getGreeting()}
      username={username}
      levelName={level.name}
      levelNum={index + 1}
      totalPoints={totalPoints}
      currentStreak={currentStreak}
      streakFreezes={streakFreezes}
      isPro={isPro}
      quests={quests}
      currentLevelPoints={level.points}
      nextLevelPoints={next?.points}
    />
  );
}
