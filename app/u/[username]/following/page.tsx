import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowListView, type FollowProfile } from "@/components/FollowListView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} is following · Hyperfix` };
}

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, is_public")
    .eq("username", username)
    .single();

  if (error || !profile) {
    notFound();
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isSelf = currentUser?.id === profile.id;

  if (!profile.is_public && !isSelf) {
    notFound();
  }

  const { data: followRows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", profile.id);

  const ids = (followRows ?? []).map((r: { following_id: string }) => r.following_id);

  let profiles: FollowProfile[] = [];
  if (ids.length > 0) {
    const query = supabase
      .from("profiles")
      .select("username, display_name, avatar_url, bio")
      .in("id", ids);
    // visitors only see public profiles; owner sees everyone they follow
    if (!isSelf) query.eq("is_public", true);
    const { data } = await query;
    profiles = (data ?? []) as FollowProfile[];
  }

  return <FollowListView username={username} mode="following" profiles={profiles} />;
}
