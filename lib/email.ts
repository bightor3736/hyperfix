import { Resend } from "resend";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWelcomeEmail({
  toEmail,
  username,
}: {
  toEmail: string;
  username: string;
}) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: "welcome to hyperfix. what are you unwell about?",
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
  <tr><td align="center">
    <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;">
      <tr><td style="padding-bottom:32px;">
        <span style="font-size:20px;font-weight:800;letter-spacing:-0.03em;color:#A855F7;">hyperfix</span>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:40px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.04em;">
          hi, @${username}.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.6);">
          you&rsquo;re in. log your first fix, watch the day counter go up, and build your graveyard of obsessions over time.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <p style="margin:0;font-size:14px;line-height:1.65;color:rgba(244,244,244,0.4);">
          a few things to know:
        </p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;line-height:2;color:rgba(244,244,244,0.5);">
          <li>free accounts get 3 active fixes at a time</li>
          <li>when a fix ends, it goes to your graveyard forever</li>
          <li>you can share fix cards with anyone, even non-members</li>
          <li>at the end of the year you get a hyperfix wrapped</li>
        </ul>
      </td></tr>
      <tr><td style="padding:28px 0 40px;">
        <a href="https://hyperfix.app/dashboard/new?welcome=1"
          style="display:inline-block;background:#A855F7;color:#0A0A0A;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;">
          log your first fix &rarr;
        </a>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(244,244,244,0.08);padding-top:20px;">
        <p style="margin:0;font-size:11px;color:rgba(244,244,244,0.25);letter-spacing:0.04em;text-transform:uppercase;">
          hyperfix &middot; what are you unwell about?
        </p>
        <p style="margin:8px 0 0;font-size:11px;">
          <a href="https://hyperfix.app/unsubscribe" style="color:rgba(244,244,244,0.25);text-decoration:underline;">unsubscribe</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
  }).catch(console.error);
}

export async function sendFollowNotification({
  toEmail,
  toName,
  followerUsername,
  followerDisplayName,
}: {
  toEmail: string;
  toName: string;
  followerUsername: string;
  followerDisplayName: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const name = followerDisplayName || followerUsername;
  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: `${name} started following you on hyperfix`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
  <tr><td align="center">
    <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;">
      <tr><td style="padding-bottom:32px;">
        <span style="font-size:20px;font-weight:800;letter-spacing:-0.03em;color:#A855F7;">hyperfix</span>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:36px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          new follower.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:32px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.6);">
          <strong style="color:#F4F4F4;">@${followerUsername}</strong> is now following you, ${toName}.<br/>
          They&rsquo;ll see your public fixes in their feed.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:40px;">
        <a href="https://hyperfix.app/u/${followerUsername}"
          style="display:inline-block;background:#A855F7;color:#0A0A0A;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:12px;">
          view their profile &rarr;
        </a>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(244,244,244,0.08);padding-top:20px;">
        <p style="margin:0;font-size:11px;color:rgba(244,244,244,0.25);letter-spacing:0.04em;text-transform:uppercase;">
          hyperfix &middot; what are you unwell about?
        </p>
        <p style="margin:8px 0 0;font-size:11px;">
          <a href="https://hyperfix.app/unsubscribe" style="color:rgba(244,244,244,0.25);text-decoration:underline;">unsubscribe</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
  }).catch(console.error);
}

export async function sendReactionNotification({
  toEmail,
  toName,
  actorUsername,
  actorDisplayName,
  emoji,
  fixTitle,
  fixId,
}: {
  toEmail: string;
  toName: string;
  actorUsername: string;
  actorDisplayName: string;
  emoji: string;
  fixTitle: string;
  fixId: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const name = actorDisplayName || actorUsername;
  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: `${name} reacted ${emoji} to your fix`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
  <tr><td align="center">
    <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;">
      <tr><td style="padding-bottom:32px;">
        <span style="font-size:20px;font-weight:800;letter-spacing:-0.03em;color:#A855F7;">hyperfix</span>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:48px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          ${emoji}
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:32px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.6);">
          <strong style="color:#F4F4F4;">@${actorUsername}</strong> reacted ${emoji} to your fix<br/>
          <em style="color:#F4F4F4;">&ldquo;${fixTitle}&rdquo;</em>
        </p>
      </td></tr>
      <tr><td style="padding-bottom:40px;">
        <a href="https://hyperfix.app/fix/${fixId}"
          style="display:inline-block;background:#A855F7;color:#0A0A0A;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:12px;">
          see your fix &rarr;
        </a>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(244,244,244,0.08);padding-top:20px;">
        <p style="margin:0;font-size:11px;color:rgba(244,244,244,0.25);letter-spacing:0.04em;text-transform:uppercase;">
          hyperfix &middot; what are you unwell about?
        </p>
        <p style="margin:8px 0 0;font-size:11px;">
          <a href="https://hyperfix.app/unsubscribe" style="color:rgba(244,244,244,0.25);text-decoration:underline;">unsubscribe</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
  }).catch(console.error);
}
