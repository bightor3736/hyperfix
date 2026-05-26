import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const { allowed } = rateLimit(`username-check:${ip}`, 20, 60_000);
  if (!allowed) {
    return NextResponse.json({ available: false }, { status: 429 });
  }

  const u = req.nextUrl.searchParams.get("u");

  if (!u) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", u.toLowerCase())
    .maybeSingle();

  if (error) {
    // If the table doesn't exist yet in dev, treat as available
    return NextResponse.json({ available: true });
  }

  return NextResponse.json({ available: data === null });
}
