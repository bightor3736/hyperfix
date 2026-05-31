import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { MedsClient } from "./MedsClient";

export const metadata: Metadata = {
  title: "Medication Tracker — Hyperfix",
  description: "Log ADHD medication doses, track timing, and see what's working.",
};

export default async function MedsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);
  const since14 = new Date(Date.now() - 14 * 86400_000).toISOString();

  const [{ data: todayLogs }, { data: historyLogs }] = await Promise.all([
    supabase.from("med_logs").select("*").eq("user_id", user.id)
      .gte("taken_at", start.toISOString()).lte("taken_at", end.toISOString())
      .order("taken_at", { ascending: true }),
    supabase.from("med_logs").select("*").eq("user_id", user.id)
      .gte("taken_at", since14).order("taken_at", { ascending: true }),
  ]);

  return <MedsClient todayLogs={todayLogs ?? []} historyLogs={historyLogs ?? []} />;
}
