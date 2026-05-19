import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("referral_code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: data.username,
    displayName: data.display_name || data.username || "A friend",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { code?: string };
    const code = body.code;

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the referrer by code
    const { data: referrer, error: referrerError } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", code)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === user.id) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // Check if already referred
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("referred_by")
      .eq("id", user.id)
      .single();

    if (currentProfile?.referred_by) {
      return NextResponse.json({ error: "Already referred" }, { status: 400 });
    }

    // Use admin client to set referred_by and increment referral_count
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    await adminSupabase
      .from("profiles")
      .update({ referred_by: referrer.id })
      .eq("id", user.id);

    await adminSupabase.rpc("increment_referral_count", { referrer_id: referrer.id });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
