import { createClient } from "@/lib/supabase/server";
import { completeQuestByKind } from "@/lib/quests/complete";
import { NextResponse } from "next/server";

const SELECT = "id, medication, dose, taken_at, effect_rating, notes";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("med_logs")
    .select(SELECT)
    .eq("user_id", user.id)
    .order("taken_at", { ascending: false })
    .limit(60);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { medication, dose, effect_rating, notes } = (await req.json()) as {
    medication: string; dose?: string; effect_rating?: number; notes?: string;
  };
  if (!medication?.trim()) return NextResponse.json({ error: "medication required" }, { status: 400 });

  const { data, error } = await supabase
    .from("med_logs")
    .insert({
      user_id: user.id,
      medication: medication.trim(),
      dose: dose?.trim() ?? "",
      effect_rating: effect_rating ?? null,
      notes: notes?.trim() || null,
    })
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Logging meds auto-completes today's med_log quest, if any.
  await completeQuestByKind(user.id, "med_log");

  return NextResponse.json({ log: data });
}
