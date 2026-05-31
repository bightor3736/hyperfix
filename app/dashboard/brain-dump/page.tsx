import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BrainDumpClient } from "./BrainDumpClient";

export const metadata: Metadata = {
  title: "Brain Dump — Hyperfix",
  description: "Clear your mental RAM. Capture every task, worry, and idea so your brain can focus.",
};

export default async function BrainDumpPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data } = await supabase
    .from("brain_dump")
    .select("id, content, status, energy_required, created_at, completed_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <BrainDumpClient initialTasks={data ?? []} />;
}
