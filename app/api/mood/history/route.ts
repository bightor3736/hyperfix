import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date(Date.now() - 30 * 86400_000).toISOString().split("T")[0];
  const { data } = await supabase
    .from("mood_logs")
    .select("date, energy, focus, mood")
    .eq("user_id", user.id)
    .gte("date", since)
    .order("date", { ascending: true });

  return NextResponse.json({ logs: data ?? [] });
}
