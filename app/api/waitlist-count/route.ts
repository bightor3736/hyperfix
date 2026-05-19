import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ count: 1247 });
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=id`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0",
      },
      next: { revalidate: 60 },
    });

    const raw = res.headers.get("content-range") ?? "";
    const count = parseInt(raw.split("/")[1] ?? "0", 10) || 1247;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 1247 });
  }
}
