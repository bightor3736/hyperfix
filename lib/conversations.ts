import type { SupabaseClient } from "@supabase/supabase-js";

export type ConversationProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type InboxRow = {
  conversation_id: string;
  last_message_at: string;
  other_user: ConversationProfile;
  last_message: {
    body: string;
    sender_id: string;
    read: boolean;
    created_at: string;
  } | null;
};

/**
 * Returns existing or freshly-created conversation id for the two users.
 * Pair is stored deterministically with (user_a < user_b).
 */
export async function getOrCreateConversation(
  supabase: SupabaseClient,
  currentUserId: string,
  otherUserId: string,
): Promise<string> {
  if (currentUserId === otherUserId) {
    throw new Error("Cannot start a conversation with yourself");
  }
  const [user_a, user_b] =
    currentUserId < otherUserId
      ? [currentUserId, otherUserId]
      : [otherUserId, currentUserId];

  const { data: existing, error: selErr } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", user_a)
    .eq("user_b", user_b)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing) return (existing as { id: string }).id;

  const { data: created, error: insErr } = await supabase
    .from("conversations")
    .insert({ user_a, user_b })
    .select("id")
    .single();

  if (insErr) throw insErr;
  return (created as { id: string }).id;
}

/**
 * Inbox for a user: their conversations with the other party's profile and last message.
 * Ordered by last_message_at desc.
 */
export async function getInbox(
  supabase: SupabaseClient,
  userId: string,
): Promise<InboxRow[]> {
  const { data: convos, error } = await supabase
    .from("conversations")
    .select("id, user_a, user_b, last_message_at")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("getInbox failed:", error.message);
    return [];
  }
  const rows = (convos ?? []) as Array<{
    id: string;
    user_a: string;
    user_b: string;
    last_message_at: string;
  }>;
  if (rows.length === 0) return [];

  const otherIds = Array.from(
    new Set(rows.map((r) => (r.user_a === userId ? r.user_b : r.user_a))),
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", otherIds);

  const profMap = new Map<string, ConversationProfile>();
  for (const p of (profiles ?? []) as ConversationProfile[]) {
    profMap.set(p.id, p);
  }

  // Fetch last message per conversation (one query then group)
  const convoIds = rows.map((r) => r.id);
  const { data: lastMsgs } = await supabase
    .from("messages")
    .select("conversation_id, body, sender_id, read, created_at")
    .in("conversation_id", convoIds)
    .order("created_at", { ascending: false });

  const lastByConvo = new Map<
    string,
    { body: string; sender_id: string; read: boolean; created_at: string }
  >();
  for (const m of (lastMsgs ?? []) as Array<{
    conversation_id: string;
    body: string;
    sender_id: string;
    read: boolean;
    created_at: string;
  }>) {
    if (!lastByConvo.has(m.conversation_id)) {
      lastByConvo.set(m.conversation_id, {
        body: m.body,
        sender_id: m.sender_id,
        read: m.read,
        created_at: m.created_at,
      });
    }
  }

  return rows.map((r): InboxRow => {
    const otherId = r.user_a === userId ? r.user_b : r.user_a;
    const other =
      profMap.get(otherId) ??
      {
        id: otherId,
        username: null,
        display_name: null,
        avatar_url: null,
      };
    return {
      conversation_id: r.id,
      last_message_at: r.last_message_at,
      other_user: other,
      last_message: lastByConvo.get(r.id) ?? null,
    };
  });
}

/**
 * Count unread messages addressed to userId (sent by someone else, not read).
 */
export async function getUnreadCount(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  // Find conversation ids the user participates in
  const { data: convos } = await supabase
    .from("conversations")
    .select("id")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);
  const ids = ((convos ?? []) as Array<{ id: string }>).map((c) => c.id);
  if (ids.length === 0) return 0;

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", ids)
    .eq("read", false)
    .neq("sender_id", userId);
  return count ?? 0;
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w}w`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo`;
  const y = Math.floor(d / 365);
  return `${y}y`;
}
