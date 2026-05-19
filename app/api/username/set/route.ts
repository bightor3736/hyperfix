import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// Admin client using service role
const adminClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username } = body as { username?: string };

  if (!username || !USERNAME_REGEX.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3–20 characters: letters, numbers, underscores only." },
      { status: 400 }
    );
  }

  // Get authenticated user — try Authorization header first, fall back to cookie
  let userId: string | null = null;

  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data, error } = await adminClient.auth.getUser(token);
    if (!error && data.user) {
      userId = data.user.id;
    }
  }

  if (!userId) {
    // Fall back to cookie-based auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check uniqueness
  const { data: existing } = await adminClient
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Username already taken." }, { status: 409 });
  }

  // Update the profile
  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ username: username.toLowerCase() })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to set username." }, { status: 500 });
  }

  // Send welcome email (fire and forget)
  const { data: authUser } = await adminClient.auth.admin.getUserById(userId);
  if (authUser.user?.email) {
    sendWelcomeEmail({ toEmail: authUser.user.email, username: username.toLowerCase() });
  }

  return NextResponse.json({ ok: true });
}
