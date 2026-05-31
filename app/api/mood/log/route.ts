import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { energy, focus, mood, note, date } = await req.json();
  const logDate = date ?? new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("mood_logs")
    .upsert({ user_id: user.id, date: logDate, energy, focus, mood, note: note ?? null },
             { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ log: data });
}
