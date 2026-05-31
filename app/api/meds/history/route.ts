import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date(Date.now() - 14 * 86400_000).toISOString();
  const { data } = await supabase
    .from("med_logs")
    .select("id, medication, dose, taken_at, effect_rating")
    .eq("user_id", user.id)
    .gte("taken_at", since)
    .order("taken_at", { ascending: false });

  return NextResponse.json({ logs: data ?? [] });
}
