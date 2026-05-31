import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { TimerClient } from "./TimerClient";

export const metadata: Metadata = {
  title: "Time Blindness Timer — Hyperfix",
  description: "Visual countdowns designed for the ADHD brain — Focus, Pomodoro, and Ultradian rhythm timers.",
};

export default async function TimerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return <TimerClient />;
}
