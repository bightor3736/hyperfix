import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ avgDays: 47 });
  }

  try {
    // Fetch ended fixes to compute average duration
    const res = await fetch(
      `${supabaseUrl}/rest/v1/fixes?select=started_at,ended_at&ended_at=not.is.null&is_public=eq.true&limit=500`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        next: { revalidate: 3600 },
      }
    );

    const fixes: { started_at: string; ended_at: string }[] = await res.json();

    if (!Array.isArray(fixes) || fixes.length === 0) {
      return NextResponse.json({ avgDays: 47 });
    }

    const totalDays = fixes.reduce((sum, f) => {
      const start = new Date(f.started_at).getTime();
      const end = new Date(f.ended_at).getTime();
      return sum + Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    }, 0);

    const avgDays = Math.round(totalDays / fixes.length);
    return NextResponse.json({ avgDays: avgDays > 0 ? avgDays : 47 });
  } catch {
    return NextResponse.json({ avgDays: 47 });
  }
}
