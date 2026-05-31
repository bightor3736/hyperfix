import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { MoodClient } from "./MoodClient";

export const metadata: Metadata = {
  title: "Mood Log — Hyperfix",
  description: "Track your energy, focus, and mood daily to understand your ADHD patterns.",
};

export default async function MoodPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().slice(0, 10);
  const since30 = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);

  const [{ data: todayData }, { data: historyData }] = await Promise.all([
    supabase.from("mood_logs").select("*").eq("user_id", user.id).eq("date", today).maybeSingle(),
    supabase.from("mood_logs").select("*").eq("user_id", user.id).gte("date", since30).order("date", { ascending: true }),
  ]);

  return <MoodClient today={todayData ?? null} history={historyData ?? []} />;
}
