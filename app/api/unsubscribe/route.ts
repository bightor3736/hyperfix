import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let email: string | null = null;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    email = body.email ?? null;
  } else {
    const form = await request.formData().catch(() => null);
    email = form?.get("email")?.toString() ?? null;
  }

  email = email?.trim().toLowerCase() ?? "";

  if (!email || !EMAIL_RE.test(email)) {
    const isJson = contentType.includes("application/json");
    if (isJson) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    return NextResponse.redirect(new URL("/unsubscribe?error=invalid", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    // Remove from waitlist
    await fetch(`${supabaseUrl}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }).catch(() => {});

    // Try to update notification_prefs for the user profile
    try {
      const usersRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        }
      );
      const usersData = await usersRes.json().catch(() => null);
      const userId: string | undefined = usersData?.users?.[0]?.id ?? usersData?.id;
      if (userId) {
        await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
          method: "PATCH",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notification_prefs: {
              streak_reminders: false,
              milestones: false,
              weekly_digest: false,
            },
          }),
        }).catch(() => {});
      }
    } catch {
      // Non-fatal — user may not have an account
    }
  }

  const isJson = contentType.includes("application/json");
  if (isJson) return NextResponse.json({ ok: true });
  return NextResponse.redirect(new URL("/unsubscribe?done=1", request.url));
}
