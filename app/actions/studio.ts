"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type StudioBlockType = "note" | "link" | "image";

export type StudioBlockContent = {
  text?: string;
  url?: string;
  title?: string;
  caption?: string;
};

export type StudioBlock = {
  id: string;
  fix_id: string;
  user_id: string;
  type: StudioBlockType;
  content: StudioBlockContent;
  sort_order: number;
  created_at: string;
};

function sanitizeContent(
  type: StudioBlockType,
  content: StudioBlockContent
): StudioBlockContent | { error: string } {
  if (type === "note") {
    const text = (content.text ?? "").trim();
    if (text.length < 1) return { error: "Note can't be empty" };
    if (text.length > 5000) return { error: "Note is too long (max 5000 chars)" };
    return { text };
  }
  if (type === "link") {
    const url = (content.url ?? "").trim();
    if (!/^https?:\/\/.+/i.test(url)) return { error: "Enter a valid URL (http/https)" };
    if (url.length > 2000) return { error: "URL is too long" };
    const title = (content.title ?? "").trim().slice(0, 200);
    return { url, title };
  }
  if (type === "image") {
    const url = (content.url ?? "").trim();
    if (!/^https?:\/\/.+/i.test(url)) return { error: "Enter a valid image URL (http/https)" };
    if (url.length > 2000) return { error: "URL is too long" };
    const caption = (content.caption ?? "").trim().slice(0, 200);
    return { url, caption };
  }
  return { error: "Unknown block type" };
}

export async function addStudioBlock(
  fixId: string,
  type: StudioBlockType,
  content: StudioBlockContent
): Promise<StudioBlock | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const clean = sanitizeContent(type, content);
  if ("error" in clean) return clean;

  // Verify fix ownership
  const { data: fix } = await supabase
    .from("fixes")
    .select("user_id")
    .eq("id", fixId)
    .single();
  if (!fix || fix.user_id !== user.id) {
    return { error: "Not authorized" };
  }

  // Next sort_order
  const { data: last } = await supabase
    .from("fix_studio_blocks")
    .select("sort_order")
    .eq("fix_id", fixId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("fix_studio_blocks")
    .insert({
      fix_id: fixId,
      user_id: user.id,
      type,
      content: clean,
      sort_order: nextOrder,
    })
    .select("id, fix_id, user_id, type, content, sort_order, created_at")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/studio/${fixId}`);
  return data as StudioBlock;
}

export async function updateStudioBlock(
  blockId: string,
  type: StudioBlockType,
  content: StudioBlockContent
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const clean = sanitizeContent(type, content);
  if ("error" in clean) return clean;

  const { data: block } = await supabase
    .from("fix_studio_blocks")
    .select("id, fix_id, user_id")
    .eq("id", blockId)
    .single();
  if (!block || block.user_id !== user.id) {
    return { error: "Not authorized" };
  }

  const { error } = await supabase
    .from("fix_studio_blocks")
    .update({ content: clean, updated_at: new Date().toISOString() })
    .eq("id", blockId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/studio/${block.fix_id}`);
  return { ok: true };
}

export async function deleteStudioBlock(
  blockId: string
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: block } = await supabase
    .from("fix_studio_blocks")
    .select("id, fix_id, user_id")
    .eq("id", blockId)
    .single();
  if (!block || block.user_id !== user.id) {
    return { error: "Not authorized" };
  }

  const { error } = await supabase
    .from("fix_studio_blocks")
    .delete()
    .eq("id", blockId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/studio/${block.fix_id}`);
  return { ok: true };
}

export async function reorderStudioBlocks(
  fixId: string,
  orderedIds: string[]
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("fix_studio_blocks")
      .update({ sort_order: i })
      .eq("id", orderedIds[i])
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  }

  revalidatePath(`/studio/${fixId}`);
  return { ok: true };
}
