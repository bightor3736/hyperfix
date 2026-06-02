import { createClient } from "@/lib/supabase/server";
import { completeQuestByKind } from "@/lib/quests/complete";
import { NextResponse } from "next/server";

// DB columns are `note` + `created_at`; the client uses `notes` + `logged_at`.
// Alias on read so the client interface stays stable.
const SELECT = "id, energy, focus, mood, notes:note, logged_at:created_at, date";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("mood_logs")
    .select(SELECT)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
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
      { user_id: user.id, energy, focus, mood, note: notes ?? null, date: today },
      { onConflict: "user_id,date" }
    )
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Logging mood auto-completes today's mood_log quest, if any.
  await completeQuestByKind(user.id, "mood_log");

  return NextResponse.json({ log: data });
}
