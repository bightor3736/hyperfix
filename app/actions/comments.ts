"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CommentWithProfile = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export async function addComment(
  fixId: string,
  content: string
): Promise<CommentWithProfile | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const trimmed = content.trim();
  if (trimmed.length < 1 || trimmed.length > 500) {
    return { error: "Comment must be between 1 and 500 characters" };
  }

  const { data, error } = await supabase
    .from("fix_comments")
    .insert({
      fix_id: fixId,
      user_id: user.id,
      content: trimmed,
    })
    .select("id, user_id, content, created_at, profiles(username, display_name, avatar_url)")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/fix/${fixId}`);

  const raw = data as unknown as {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: Array<{ username: string | null; display_name: string | null; avatar_url: string | null }> | { username: string | null; display_name: string | null; avatar_url: string | null } | null;
  };

  const profiles = Array.isArray(raw.profiles) ? raw.profiles[0] : raw.profiles;

  return {
    id: raw.id,
    user_id: raw.user_id,
    content: raw.content,
    created_at: raw.created_at,
    profiles: profiles ?? { username: null, display_name: null, avatar_url: null },
  };
}

export async function deleteComment(
  commentId: string
): Promise<void | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch the comment to get fix_id and verify ownership
  const { data: comment, error: fetchError } = await supabase
    .from("fix_comments")
    .select("id, fix_id, user_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !comment) {
    return { error: "Comment not found" };
  }

  const typedComment = comment as { id: string; fix_id: string; user_id: string };

  if (typedComment.user_id !== user.id) {
    return { error: "Not authorized" };
  }

  const { error: deleteError } = await supabase
    .from("fix_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath(`/fix/${typedComment.fix_id}`);
}
