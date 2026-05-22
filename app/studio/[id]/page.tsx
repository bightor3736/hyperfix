import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { StudioClient } from "./StudioClient";
import type { StudioBlock } from "@/app/actions/studio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: fix } = await supabase
    .from("fixes")
    .select("title")
    .eq("id", id)
    .single();
  return {
    title: fix ? `${fix.title} · Hyperfix Studio` : "Hyperfix Studio",
  };
}

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: fix } = await supabase
    .from("fixes")
    .select("id, title, category, started_at, ended_at, user_id")
    .eq("id", id)
    .single();

  if (!fix || fix.user_id !== user.id) {
    notFound();
  }

  const { data: blocks } = await supabase
    .from("fix_studio_blocks")
    .select("id, fix_id, user_id, type, content, sort_order, created_at")
    .eq("fix_id", id)
    .order("sort_order", { ascending: true });

  return (
    <StudioClient
      fixId={fix.id}
      fixTitle={fix.title}
      fixCategory={fix.category ?? "other"}
      dayCount={dayCount(fix.started_at, fix.ended_at)}
      ended={fix.ended_at !== null}
      initialBlocks={(blocks ?? []) as StudioBlock[]}
    />
  );
}
