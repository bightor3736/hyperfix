import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { awardPoints } from "@/lib/gamification/award";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { medication, dose = "", taken_at, effect_rating, notes } = await req.json();
  if (!medication?.trim()) return NextResponse.json({ error: "Medication name required" }, { status: 400 });

  const { data, error } = await supabase
    .from("med_logs")
    .insert({
      user_id: user.id,
      medication: medication.trim(),
      dose,
      taken_at: taken_at ?? new Date().toISOString(),
      effect_rating: effect_rating ?? null,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await awardPoints(user.id, "med_log", data.id, "Medication logged");

  return NextResponse.json({ log: data });
}
