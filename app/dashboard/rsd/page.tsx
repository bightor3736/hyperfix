import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { RSDClient } from "./RSDClient";

export const metadata: Metadata = {
  title: "RSD Journal — Hyperfix",
  description: "Private journal for processing rejection-sensitive dysphoria and finding reframes.",
};

export default async function RSDPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data } = await supabase
    .from("rsd_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return <RSDClient initialEntries={data ?? []} />;
}
