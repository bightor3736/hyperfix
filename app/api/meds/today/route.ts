import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const start = new Date(); start.setHours(0,0,0,0);
  const end   = new Date(); end.setHours(23,59,59,999);

  const { data } = await supabase
    .from("med_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("taken_at", start.toISOString())
    .lte("taken_at", end.toISOString())
    .order("taken_at", { ascending: true });

  return NextResponse.json({ logs: data ?? [] });
}
