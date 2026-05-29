import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lists open (public, active) rooms with live member counts so people can browse and join
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: rooms, error } = await supabase
    .from("focus_rooms")
    .select(`
      id, code, name, owner_id, max_members, current_track, last_activity,
      owner:profiles!focus_rooms_owner_id_fkey(username, avatar_url),
      members:room_members(user_id, status,
        profile:profiles(username, avatar_url)
      )
    `)
    .eq("is_active", true)
    .eq("is_private", false)
    .order("last_activity", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Shape for the client: counts, avatars, whether the viewer is already in
  const shaped = (rooms ?? []).map((r: any) => {
    const members = r.members ?? [];
    return {
      code:        r.code,
      name:        r.name,
      ownerName:   r.owner?.username ?? "someone",
      memberCount: members.length,
      maxMembers:  r.max_members,
      isFull:      members.length >= r.max_members,
      alreadyIn:   members.some((m: any) => m.user_id === user.id),
      track:       r.current_track?.name
        ? { name: r.current_track.name, artist: r.current_track.artist }
        : null,
      avatars: members
        .slice(0, 5)
        .map((m: any) => ({
          username:  m.profile?.username ?? "?",
          avatarUrl: m.profile?.avatar_url ?? null,
        })),
    };
  });

  return NextResponse.json({ rooms: shaped });
}
