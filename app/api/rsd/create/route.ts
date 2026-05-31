import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { awardPoints } from "@/lib/gamification/award";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { trigger, content, intensity = 5, reframe } = await req.json();
  if (!trigger?.trim() || !content?.trim())
    return NextResponse.json({ error: "Trigger and content required" }, { status: 400 });

  const { data, error } = await supabase
    .from("rsd_entries")
    .insert({ user_id: user.id, trigger: trigger.trim(), content: content.trim(), intensity, reframe: reframe?.trim() || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await awardPoints(user.id, "rsd_entry", data.id, "RSD entry logged");

  return NextResponse.json({ entry: data });
}
