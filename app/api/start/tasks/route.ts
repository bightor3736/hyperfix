import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET  → the user's open tasks ("still waiting on you")
// POST → create a new avoided task { title, step? }
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("start_tasks")
    .select("id, title, step, sessions, total_minutes, last_started_at, created_at")
    .eq("user_id", user.id)
    .is("done_at", null)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ tasks: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { title?: string; step?: string };
  const title = (body.title ?? "").trim().slice(0, 120);
  const step = (body.step ?? "").trim().slice(0, 160);
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const { data, error } = await supabase
    .from("start_tasks")
    .insert({ user_id: user.id, title, step })
    .select("id, title, step, sessions, total_minutes, last_started_at, created_at")
    .single();

  if (error) return NextResponse.json({ error: "Could not create task" }, { status: 500 });
  return NextResponse.json({ task: data });
}
