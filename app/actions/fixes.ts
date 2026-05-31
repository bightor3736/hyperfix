"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { awardPoints, evaluateAchievements } from "@/lib/gamification/award";

export type FixStatus =
  | "Day 1"
  | "Obsessing"
  | "On loop"
  | "Fading"
  | "Post-fix"
  | "Ended"
  | "Dormant"
  | "Send help";

export type Fix = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  status: FixStatus;
  intensity: number;
  note: string | null;
  eulogy: string | null;
  is_public: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
};

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }
  return { supabase, user };
}

export async function editFix(id: string, title: string, category: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("fixes")
    .update({ title: title.trim(), category })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(`Failed to update fix: ${error.message}`);
  revalidatePath(`/dashboard/fix/${id}`);
  revalidatePath("/dashboard");
}

export async function createFix(formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser();

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const intensity = parseInt(formData.get("intensity") as string, 10);
  const note = formData.get("note") as string;
  const is_public = formData.get("is_public") === "on";

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  // Enforce free tier limit server-side
  const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single();
  if (!profile?.is_pro) {
    const { count } = await supabase
      .from("fixes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("status", "in", '("Ended","Dormant")');
    if ((count ?? 0) >= 3) {
      throw new Error("free_limit_reached");
    }
  }

  const { data, error } = await supabase
    .from("fixes")
    .insert({
      user_id: user.id,
      title: title.trim(),
      category: category || "other",
      status: "Day 1" as FixStatus,
      intensity: isNaN(intensity) ? 5 : Math.min(10, Math.max(1, intensity)),
      note: note?.trim() || null,
      is_public,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create fix: ${error.message}`);
  }

  await awardPoints(user.id, "new_fix", data.id, "New fixation logged");

  revalidatePath("/dashboard");
  redirect(`/dashboard/fix/${data.id}`);
}

export async function updateFixStatus(id: string, status: FixStatus) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("fixes")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/fix/${id}`);
}

export async function updateFixIntensity(id: string, intensity: number) {
  const { supabase, user } = await getAuthenticatedUser();

  const clampedIntensity = Math.min(10, Math.max(1, intensity));

  const { error } = await supabase
    .from("fixes")
    .update({ intensity: clampedIntensity })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to update intensity: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/fix/${id}`);
}

export async function endFix(id: string, eulogy: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("fixes")
    .update({
      status: "Ended" as FixStatus,
      ended_at: new Date().toISOString(),
      eulogy: eulogy?.trim() || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to end fix: ${error.message}`);
  }

  await evaluateAchievements(user.id);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/fix/${id}`);
}

export async function checkInFix(fixId: string, intensity: number, note?: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const clampedIntensity = Math.min(10, Math.max(1, intensity));

  const { error } = await supabase.from("fix_entries").upsert(
    {
      fix_id: fixId,
      user_id: user.id,
      date: today,
      intensity: clampedIntensity,
      note: note?.trim() || null,
    },
    { onConflict: "fix_id,date" }
  );

  if (error) {
    throw new Error(`Failed to check in: ${error.message}`);
  }

  await awardPoints(user.id, "check_in", `${fixId}:${today}`, "Daily check-in");

  revalidatePath(`/dashboard/fix/${fixId}`);
  revalidatePath("/dashboard/points");
}

export async function updateFixPrivacy(id: string, isPublic: boolean) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("fixes")
    .update({ is_public: isPublic })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to update privacy: ${error.message}`);
  }

  revalidatePath(`/dashboard/fix/${id}`);
}

export async function deleteFix(id: string) {
  const { supabase, user } = await getAuthenticatedUser();

  // Verify ownership before deleting
  const { data: fix, error: fetchError } = await supabase
    .from("fixes")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !fix) {
    throw new Error("Fix not found or you don't have permission to delete it");
  }

  const { error } = await supabase
    .from("fixes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete fix: ${error.message}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function bulkCheckInFixes(fixIds: string[]): Promise<void> {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const today = new Date().toISOString().split("T")[0];

  for (const fixId of fixIds) {
    // Verify ownership
    const { data: fix } = await supabase.from("fixes").select("id").eq("id", fixId).eq("user_id", user.id).single();
    if (!fix) continue;

    // Check not already checked in
    const { data: existing } = await supabase.from("fix_entries").select("id").eq("fix_id", fixId).eq("date", today).maybeSingle();
    if (existing) continue;

    await supabase.from("fix_entries").insert({ fix_id: fixId, user_id: user.id, date: today, intensity: 5 });
  }

  revalidatePath("/dashboard");
}

// Pro users can pin up to this many fixes; free users get one.
const PRO_MAX_PINS = 3;

export async function pinFix(fixId: string | null): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, is_pro, pinned_fix_ids, pinned_fix_id")
    .eq("id", user.id)
    .single();

  const isPro = !!profile?.is_pro;
  const current: string[] =
    (profile?.pinned_fix_ids as string[] | null) ??
    (profile?.pinned_fix_id ? [profile.pinned_fix_id as string] : []);

  let next: string[];
  if (fixId === null) {
    // Clear all pins
    next = [];
  } else if (current.includes(fixId)) {
    // Toggle off
    next = current.filter((id) => id !== fixId);
  } else if (isPro) {
    // Pro: append, keep most recent PRO_MAX_PINS
    next = [...current, fixId].slice(-PRO_MAX_PINS);
  } else {
    // Free: single pin replaces
    next = [fixId];
  }

  const { error } = await supabase
    .from("profiles")
    .update({ pinned_fix_ids: next, pinned_fix_id: next[0] ?? null })
    .eq("id", user.id);

  if (error) throw new Error(`Failed to pin fix: ${error.message}`);

  revalidatePath("/dashboard");
  if (profile?.username) revalidatePath(`/u/${profile.username}`);
}
