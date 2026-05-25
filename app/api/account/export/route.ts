import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, banner_url, accent_color, is_pro, is_public, created_at")
    .eq("id", user.id)
    .single();

  if (!profile?.is_pro) {
    return NextResponse.json(
      { error: "Data export is a Pro feature. Upgrade to export your data." },
      { status: 403 }
    );
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("*")
    .eq("user_id", user.id);

  const { data: entries } = await supabase
    .from("fix_entries")
    .select("*")
    .eq("user_id", user.id);

  const { data: comments } = await supabase
    .from("fix_comments")
    .select("*")
    .eq("user_id", user.id);

  const payload = {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email },
    profile,
    fixes: fixes ?? [],
    fix_entries: entries ?? [],
    comments: comments ?? [],
  };

  const filename = `hyperfix-export-${new Date().toISOString().split("T")[0]}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
