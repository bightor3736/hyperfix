/**
 * Web Push helper — sends notifications to subscribed users.
 *
 * Required env vars (set in Vercel / .env.local):
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY   public VAPID key (also used by the browser)
 *   VAPID_PRIVATE_KEY              private VAPID key (server only)
 *   VAPID_CONTACT_EMAIL            e.g. "mailto:hello@hyperfix.app"
 *
 * Generate keys with:
 *   npx web-push generate-vapid-keys
 *
 * If any of the env vars are missing, sendPushToUser becomes a graceful no-op
 * so the cron and other callers keep working until the keys are configured.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import webpush from "web-push";

type PushPayload = {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
};

type StoredSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

let configured = false;
let configureAttempted = false;

function configure(): boolean {
  if (configureAttempted) return configured;
  configureAttempted = true;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const contact = process.env.VAPID_CONTACT_EMAIL;

  if (!publicKey || !privateKey || !contact) {
    // eslint-disable-next-line no-console
    console.warn(
      "[push] VAPID keys not configured — skipping push sends. " +
        "Set NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT_EMAIL."
    );
    configured = false;
    return false;
  }

  try {
    webpush.setVapidDetails(contact, publicKey, privateKey);
    configured = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[push] failed to configure web-push", err);
    configured = false;
  }
  return configured;
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; removed: number }> {
  if (!configure()) return { sent: 0, removed: 0 };

  const supabase = createAdminClient();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (error || !subs || subs.length === 0) {
    return { sent: 0, removed: 0 };
  }

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/dashboard",
    icon: payload.icon,
    badge: payload.badge,
    tag: payload.tag,
  });

  let sent = 0;
  let removed = 0;
  const staleEndpoints: string[] = [];

  await Promise.all(
    (subs as StoredSubscription[]).map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
        sent++;
      } catch (err: unknown) {
        const status =
          typeof err === "object" && err !== null && "statusCode" in err
            ? (err as { statusCode?: number }).statusCode
            : undefined;
        if (status === 404 || status === 410) {
          staleEndpoints.push(sub.endpoint);
        } else {
          // eslint-disable-next-line no-console
          console.warn("[push] send failed", status ?? err);
        }
      }
    })
  );

  if (staleEndpoints.length > 0) {
    const { error: delErr } = await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
    if (!delErr) removed = staleEndpoints.length;
  }

  return { sent, removed };
}
