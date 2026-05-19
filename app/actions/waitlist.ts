"use server";

import { sendWelcomeEmail } from "./sendWelcomeEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type WaitlistResult =
  | { ok: true; position: number }
  | { ok: false; error: "invalid_email" | "already_on_list" | "server_error" };

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData
): Promise<WaitlistResult> {
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();

  if (!EMAIL_RE.test(email) || email.length > 320) {
    return { ok: false, error: "invalid_email" };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Supabase env vars missing");
    return { ok: false, error: "server_error" };
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ email, source: "landing" }),
  });

  if (res.status === 409) {
    return { ok: false, error: "already_on_list" };
  }

  if (!res.ok) {
    console.error("Supabase error", res.status, await res.text());
    return { ok: false, error: "server_error" };
  }

  // Count total signups for the "you're number X" display
  const countRes = await fetch(
    `${supabaseUrl}/rest/v1/waitlist?select=id`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0",
      },
    }
  );

  const raw = countRes.headers.get("content-range") ?? "";
  const total = parseInt(raw.split("/")[1] ?? "0", 10) || 1248;

  sendWelcomeEmail(email, total).catch(() => {});

  return { ok: true, position: total };
}
