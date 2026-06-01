import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Write first-touch attribution to the profile, once, at account creation.
async function persistSource() {
  try {
    const jar = await cookies();
    const raw = jar.get("hf_src")?.value;
    if (!raw) return;

    const { source, campaign } = JSON.parse(decodeURIComponent(raw)) as {
      source?: string;
      campaign?: string;
    };
    if (!source && !campaign) return;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Only set if not already attributed (first-touch wins).
    const { data: profile } = await supabase
      .from("profiles")
      .select("signup_source")
      .eq("id", user.id)
      .single();

    if (profile && !profile.signup_source) {
      await supabase
        .from("profiles")
        .update({ signup_source: source ?? null, signup_campaign: campaign ?? null })
        .eq("id", user.id);
    }
  } catch {
    /* attribution is best-effort — never block auth */
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "magiclink" | "recovery" | "email_change" | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // OAuth / PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await persistSource();
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Email confirmation link (token_hash from admin.generateLink or Supabase email template)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      await persistSource();
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback`);
}
