import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(14);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { energy, focus, mood, notes } = (await req.json()) as {
    energy: number; focus: number; mood: number; notes?: string;
  };

  const today = new Date().toISOString().slice(0, 10);

  // Upsert: one entry per day
  const { data, error } = await supabase
    .from("mood_logs")
    .upsert(
      { user_id: user.id, energy, focus, mood, notes: notes ?? null, logged_at: new Date().toISOString(), date: today },
      { onConflict: "user_id,date" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ log: data });
}
