"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type StudioBlockType = "note" | "link" | "image" | "slideshow";

export type StudioBlockContent = {
  text?: string;
  url?: string;
  title?: string;
  caption?: string;
  images?: Array<{ url: string; caption?: string }>;
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

// Free accounts can add this many Studio blocks per fix; Pro is unlimited.
const FREE_STUDIO_BLOCK_LIMIT = 8;

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
  if (type === "slideshow") {
    const imgs = Array.isArray(content.images) ? content.images : [];
    if (imgs.length === 0) return { error: "Add at least one image to the slideshow" };
    if (imgs.length > 20) return { error: "Max 20 images per slideshow" };
    const cleaned: Array<{ url: string; caption?: string }> = [];
    for (const img of imgs) {
      const url = (img.url ?? "").trim();
      if (!/^https?:\/\/.+/i.test(url)) return { error: "All images must have a valid URL" };
      cleaned.push({ url, caption: (img.caption ?? "").trim().slice(0, 200) || undefined });
    }
    return { images: cleaned };
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

  // Free-tier block limit (Pro is unlimited)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();
  if (!profile?.is_pro) {
    const { count } = await supabase
      .from("fix_studio_blocks")
      .select("id", { count: "exact", head: true })
      .eq("fix_id", fixId);
    if ((count ?? 0) >= FREE_STUDIO_BLOCK_LIMIT) {
      return {
        error: `Free accounts can add up to ${FREE_STUDIO_BLOCK_LIMIT} Studio blocks per fix. Upgrade to Pro for unlimited blocks.`,
      };
    }
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

  revalidatePath(`/dashboard/fix/${fixId}/studio`);
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

  revalidatePath(`/dashboard/fix/${block.fix_id}/studio`);
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

  revalidatePath(`/dashboard/fix/${block.fix_id}/studio`);
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

  revalidatePath(`/dashboard/fix/${fixId}/studio`);
  return { ok: true };
}
