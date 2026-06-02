import { createClient } from "@/lib/supabase/server";
import { completeQuestByKind } from "@/lib/quests/complete";
import { NextResponse } from "next/server";

const SELECT = "id, trigger, content, intensity, reframe, created_at";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rsd_entries")
    .select(SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { trigger, content, intensity, reframe } = (await req.json()) as {
    trigger: string; content: string; intensity?: number; reframe?: string;
  };
  if (!trigger?.trim()) return NextResponse.json({ error: "trigger required" }, { status: 400 });
  if (!content?.trim()) return NextResponse.json({ error: "content required" }, { status: 400 });

  const { data, error } = await supabase
    .from("rsd_entries")
    .insert({
      user_id: user.id,
      trigger: trigger.trim(),
      content: content.trim(),
      intensity: intensity ?? 5,
      reframe: reframe?.trim() || null,
    })
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Writing an RSD entry auto-completes today's rsd_entry quest, if any.
  await completeQuestByKind(user.id, "rsd_entry");

  return NextResponse.json({ entry: data });
}
