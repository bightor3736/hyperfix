"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createList(
  name: string,
  description: string,
  isPublic: boolean
): Promise<{ id: string } | { error: string }> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!name.trim()) {
    return { error: "Name is required" };
  }

  const { data, error } = await supabase
    .from("fix_lists")
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description.trim() || null,
      is_public: isPublic,
    })
    .select("id")
    .single();

  if (error) {
    return { error: `Failed to create list: ${error.message}` };
  }

  revalidatePath("/dashboard/lists");
  return { id: data.id };
}

export async function deleteList(listId: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("fix_lists")
    .delete()
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete list: ${error.message}`);
  }

  revalidatePath("/dashboard/lists");
  redirect("/dashboard/lists");
}

export async function addFixToList(listId: string, fixId: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  // Verify the user owns the list
  const { data: list, error: listError } = await supabase
    .from("fix_lists")
    .select("id")
    .eq("id", listId)
    .eq("user_id", user.id)
    .single();

  if (listError || !list) {
    throw new Error("List not found or you don't have permission to modify it");
  }

  const { error } = await supabase.from("fix_list_items").insert({
    list_id: listId,
    fix_id: fixId,
  });

  if (error) {
    throw new Error(`Failed to add fix to list: ${error.message}`);
  }

  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function removeFixFromList(listId: string, fixId: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  // Verify the user owns the list
  const { data: list, error: listError } = await supabase
    .from("fix_lists")
    .select("id")
    .eq("id", listId)
    .eq("user_id", user.id)
    .single();

  if (listError || !list) {
    throw new Error("List not found or you don't have permission to modify it");
  }

  const { error } = await supabase
    .from("fix_list_items")
    .delete()
    .eq("list_id", listId)
    .eq("fix_id", fixId);

  if (error) {
    throw new Error(`Failed to remove fix from list: ${error.message}`);
  }

  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function updateList(
  listId: string,
  name: string,
  description: string,
  isPublic: boolean
): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!name.trim()) {
    throw new Error("Name is required");
  }

  const { error } = await supabase
    .from("fix_lists")
    .update({
      name: name.trim(),
      description: description.trim() || null,
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to update list: ${error.message}`);
  }

  revalidatePath("/dashboard/lists");
  revalidatePath(`/dashboard/lists/${listId}`);
}
