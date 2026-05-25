import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const origin = req.nextUrl.origin;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // Verify slug exists and log click
    const { data: link } = await supabase
      .from("aff_links")
      .select("slug, redirect_url")
      .eq("slug", slug)
      .single();

    if (link) {
      await supabase.from("aff_events").insert({ slug, event: "click" });
      const dest = link.redirect_url ?? "/";
      const url = new URL(dest.startsWith("http") ? dest : `${origin}${dest}`);
      url.searchParams.set("aff", slug);
      return NextResponse.redirect(url.toString());
    }
  } catch {}

  return NextResponse.redirect(`${origin}/`);
}
