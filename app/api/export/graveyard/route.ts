import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function getDays(startedAt: string, endedAt: string): number {
  return Math.max(
    1,
    Math.ceil((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 86_400_000)
  );
}

function escapeCSV(val: string | null | undefined): string {
  if (!val) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: fixes, error } = await supabase
    .from("fixes")
    .select("title, category, intensity, started_at, ended_at, eulogy, tags")
    .eq("user_id", user.id)
    .not("ended_at", "is", null)
    .order("ended_at", { ascending: false });

  if (error) return new Response("Failed to fetch", { status: 500 });

  const header = ["title", "category", "intensity", "days", "started", "ended", "tags", "eulogy"];
  const rows = (fixes ?? []).map((f) => [
    escapeCSV(f.title),
    escapeCSV(f.category),
    String(f.intensity ?? ""),
    String(getDays(f.started_at, f.ended_at)),
    escapeCSV(f.started_at?.split("T")[0]),
    escapeCSV(f.ended_at?.split("T")[0]),
    escapeCSV(Array.isArray(f.tags) ? f.tags.join("; ") : ""),
    escapeCSV(f.eulogy),
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const filename = `hyperfix-graveyard-${new Date().toISOString().split("T")[0]}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
