// Simple in-memory rate limiter. Works per-instance (fine for Vercel serverless).
// Uses a sliding-window counter: max `limit` requests per `windowMs`.

type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();

// Clean up expired entries periodically (every 1000 calls, roughly)
let calls = 0;
function maybeClean() {
  if (++calls % 1000 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.reset < now) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  maybeClean();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
