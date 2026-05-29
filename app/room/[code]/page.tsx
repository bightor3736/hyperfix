import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RoomClient } from "./RoomClient";

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase  = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile?.username) redirect("/onboarding/username");

  // Fetch initial room state (server-side for fast first paint)
  const { data: room } = await supabase
    .from("focus_rooms")
    .select(`
      id, code, name, owner_id, timer_state, current_track,
      spotify_access_token,
      members:room_members(
        user_id, status, task, joined_at,
        profile:profiles(id, username, avatar_url)
      ),
      messages:room_messages(
        id, content, created_at,
        profile:profiles(username, avatar_url)
      )
    `)
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .order("created_at", { referencedTable: "room_messages", ascending: true })
    .limit(50, { referencedTable: "room_messages" })
    .single();

  if (!room) redirect("/room");

  return (
    <RoomClient
      initialRoom={room as any}
      currentUser={{
        id:        profile.id,
        username:  profile.username,
        avatarUrl: profile.avatar_url ?? null,
      }}
    />
  );
}
