import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Valid goal keys — keep in sync with the onboarding goals page.
const VALID_GOALS = new Set([
  "focus", "follow_through", "mood", "meds", "rejection", "accountability", "dopamine", "routine",
]);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { goals } = (await req.json()) as { goals?: string[] };
  const clean = Array.isArray(goals) ? goals.filter((g) => VALID_GOALS.has(g)).slice(0, 8) : [];

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_goals: clean, onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
