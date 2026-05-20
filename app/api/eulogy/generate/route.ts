import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fixId } = await req.json();
  if (!fixId) return new Response("Missing fixId", { status: 400 });

  const { data: fix, error } = await supabase
    .from("fixes")
    .select("title, category, intensity, started_at, note, tags")
    .eq("id", fixId)
    .eq("user_id", user.id)
    .single();

  if (error || !fix) return new Response("Fix not found", { status: 404 });

  const days = Math.max(
    1,
    Math.ceil((Date.now() - new Date(fix.started_at).getTime()) / 86_400_000)
  );

  const prompt = `Write a short, poetic eulogy (2-4 sentences) for a hyperfixation that just ended.

Details:
- Title: ${fix.title}
- Category: ${fix.category}
- Days active: ${days}
- Peak intensity: ${fix.intensity}/10
${fix.note ? `- Original note: "${fix.note}"` : ""}
${fix.tags?.length ? `- Tags: ${fix.tags.join(", ")}` : ""}

The eulogy should be written in first person, bittersweet and slightly dramatic — the voice of someone who loved this thing intensely and is now mourning its passing. Keep it under 60 words. No emojis. No generic phrases like "it was a journey." Make it specific to the thing.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const response = await anthropic.messages.stream({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      });

      for await (const chunk of response) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
