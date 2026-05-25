import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { email, password, name } = body as { email?: string; password?: string; name?: string };
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: name?.trim() || email.split("@")[0] },
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    const msg = error.message ?? "";
    if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    console.error("[signup] generateLink error:", error);
    return NextResponse.json({ error: msg || "Failed to create account." }, { status: 400 });
  }

  const displayName = name?.trim() || email.split("@")[0];
  const confirmationUrl = data.properties.action_link;

  await sendVerificationEmail({ toEmail: email, name: displayName, confirmationUrl });

  return NextResponse.json({ ok: true });
}
