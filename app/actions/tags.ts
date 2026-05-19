"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function sanitizeTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 20);
}

export async function updateFixTags(
  fixId: string,
  tags: string[]
): Promise<void | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const sanitized = tags
    .map(sanitizeTag)
    .filter((t) => t.length > 0)
    .slice(0, 5);

  const { error } = await supabase
    .from("fixes")
    .update({ tags: sanitized })
    .eq("id", fixId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/fix/${fixId}`);
  revalidatePath(`/fix/${fixId}`);
}
