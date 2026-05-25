import { Resend } from "resend";

const BRAND = "#5EEAD4";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function emailShell(content: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
</head>
<body style="margin:0;padding:0;background:#070708;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070708;padding:48px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
      <tr><td style="padding-bottom:40px;">
        <span style="font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${BRAND};">hyperfix</span>
      </td></tr>
      ${content}
      <tr><td style="border-top:1px solid rgba(244,244,244,0.07);padding-top:24px;padding-bottom:8px;">
        <p style="margin:0;font-size:11px;color:rgba(244,244,244,0.22);letter-spacing:0.04em;text-transform:uppercase;">
          hyperfix &middot; what are you obsessed with?
        </p>
        <p style="margin:8px 0 0;font-size:11px;">
          <a href="https://hyperfix.app/unsubscribe" style="color:rgba(244,244,244,0.22);text-decoration:underline;">unsubscribe</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#5EEAD4;color:#070708;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;letter-spacing:0.01em;">${label}</a>`;
}

// ── Verification (email/password signup) ─────────────────────────────────────

export async function sendVerificationEmail({
  toEmail,
  name,
  confirmationUrl,
}: {
  toEmail: string;
  name: string;
  confirmationUrl: string;
}) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: "confirm your hyperfix account",
    html: emailShell(`
      <tr><td style="padding-bottom:24px;">
        <h1 style="margin:0;font-size:44px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          confirm your email.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:36px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          hey ${name} &mdash; one click and you&rsquo;re in.<br/>
          your obsessions are waiting.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:40px;">
        ${ctaButton(confirmationUrl, "confirm my account &rarr;")}
      </td></tr>
      <tr><td style="padding-bottom:36px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(244,244,244,0.28);">
          this link expires in 24 hours. if you didn&rsquo;t create a hyperfix account, you can ignore this email.
        </p>
      </td></tr>
    `),
  }).catch(console.error);
}

// ── Welcome (sent after username is set) ─────────────────────────────────────

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
    subject: "welcome to hyperfix. what are you obsessed with?",
    html: emailShell(`
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:44px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.04em;">
          hi, @${username}.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          you&rsquo;re in. log your first fix, watch the day counter climb, and build your graveyard of obsessions over time.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(244,244,244,0.35);">a few things to know:</p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;line-height:2;color:rgba(244,244,244,0.45);">
          <li>free accounts get 3 active fixes at a time</li>
          <li>when a fix ends, it goes to your graveyard forever</li>
          <li>you can share fix cards with anyone, even non-members</li>
          <li>at the end of the year you get a hyperfix wrapped</li>
        </ul>
      </td></tr>
      <tr><td style="padding:28px 0 40px;">
        ${ctaButton("https://hyperfix.app/dashboard/new?welcome=1", "log your first fix &rarr;")}
      </td></tr>
    `),
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
    html: emailShell(`
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:40px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          new follower.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:32px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          <strong style="color:#F4F4F4;">@${followerUsername}</strong> is now following you, ${toName}.<br/>
          they&rsquo;ll see your public fixes in their feed.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:40px;">
        ${ctaButton(`https://hyperfix.app/u/${followerUsername}`, "view their profile &rarr;")}
      </td></tr>
    `),
  }).catch(console.error);
}

export async function sendProWelcomeEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: "✦ you're Pro now. fully obsessed, officially.",
    html: emailShell(`
      <tr><td style="padding-bottom:8px;">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:rgba(94,234,212,0.12);color:#5EEAD4;border:1px solid rgba(94,234,212,0.3);border-radius:4px;padding:3px 8px;">PRO</span>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:44px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.04em;">
          you&rsquo;re Pro, ${toName}.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          unlimited fixes, AI eulogies, a Pro badge on your profile, and the full graveyard you deserve.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(244,244,244,0.35);">what&rsquo;s unlocked:</p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;line-height:2;color:rgba(244,244,244,0.45);">
          <li>✦ unlimited active fixes — no more 3-fix cap</li>
          <li>✦ AI-written eulogies when a fix ends</li>
          <li>✦ Pro badge on your public profile</li>
          <li>✦ priority support</li>
        </ul>
      </td></tr>
      <tr><td style="padding:28px 0 40px;">
        ${ctaButton("https://hyperfix.app/dashboard", "go be unwell &rarr;")}
      </td></tr>
    `),
  }).catch(console.error);
}

export async function sendStreakReminderEmail({
  toEmail,
  toName,
  streakDays,
}: {
  toEmail: string;
  toName: string;
  streakDays: number;
}) {
  const resend = getResend();
  if (!resend) return;

  const streakIcon = streakDays >= 30 ? "⚡" : "🔥";
  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: `${streakIcon} don't break your ${streakDays}-day streak`,
    html: emailShell(`
      <tr><td style="padding-bottom:8px;">
        <span style="font-size:48px;line-height:1;">${streakIcon}</span>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:44px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          ${streakDays} days.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          hey ${toName} — you&rsquo;ve been checking in for ${streakDays} days straight. don&rsquo;t let it end today.
        </p>
      </td></tr>
      <tr><td style="padding:0 0 40px;">
        ${ctaButton("https://hyperfix.app/dashboard", "check in now &rarr;")}
      </td></tr>
    `),
  }).catch(console.error);
}

export async function sendMilestoneEmail({
  toEmail,
  toName,
  fixTitle,
  fixId,
  milestone,
}: {
  toEmail: string;
  toName: string;
  fixTitle: string;
  fixId: string;
  milestone: 7 | 30 | 100 | 365;
}) {
  const resend = getResend();
  if (!resend) return;

  const milestoneData = {
    7:   { icon: "🔥", heading: "one week.",   sub: "seven days into it and it&rsquo;s not letting go." },
    30:  { icon: "⚡", heading: "one month.",  sub: "this fix has officially outlasted most diets." },
    100: { icon: "💀", heading: "100 days.",   sub: "that&rsquo;s dedication. or a cry for help. either way, respect." },
    365: { icon: "🏆", heading: "one year.",   sub: "you spent a full year obsessed with this. legendary." },
  }[milestone];

  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: `${milestoneData.icon} ${milestone}-day milestone: ${fixTitle}`,
    html: emailShell(`
      <tr><td style="padding-bottom:8px;">
        <span style="font-size:56px;line-height:1;">${milestoneData.icon}</span>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:44px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.04em;">
          ${milestoneData.heading}
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:12px;">
        <p style="margin:0;font-size:18px;font-style:italic;color:rgba(244,244,244,0.45);">
          &ldquo;${fixTitle}&rdquo;
        </p>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          ${toName}, ${milestoneData.sub}
        </p>
      </td></tr>
      <tr><td style="padding:0 0 40px;">
        ${ctaButton(`https://hyperfix.app/dashboard/fix/${fixId}`, "see your fix &rarr;")}
      </td></tr>
    `),
  }).catch(console.error);
}

export async function sendWeeklyDigestEmail({
  toEmail,
  toName,
  activeFixCount,
  streak,
  topFix,
  graveyardCount,
}: {
  toEmail: string;
  toName: string;
  activeFixCount: number;
  streak: number;
  topFix: { title: string; days: number } | null;
  graveyardCount: number;
}) {
  const resend = getResend();
  if (!resend) return;

  const streakLine = streak > 0 ? `<li>${streak}-day check-in streak — keep it going</li>` : "";
  const topFixLine = topFix ? `<li>longest fix: <em>&ldquo;${topFix.title}&rdquo;</em> at ${topFix.days} days</li>` : "";
  const graveyardLine = graveyardCount > 0 ? `<li>${graveyardCount} fix${graveyardCount !== 1 ? "es" : ""} in your graveyard</li>` : "";

  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: `your fixes this week, ${toName}`,
    html: emailShell(`
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:40px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          weekly check-in.
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          hey ${toName}, here&rsquo;s your week in fixes.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:12px;">
        <ul style="margin:0;padding-left:20px;font-size:14px;line-height:2;color:rgba(244,244,244,0.5);">
          <li>${activeFixCount} active fix${activeFixCount !== 1 ? "es" : ""}</li>
          ${streakLine}${topFixLine}${graveyardLine}
        </ul>
      </td></tr>
      <tr><td style="padding:28px 0 40px;">
        ${ctaButton("https://hyperfix.app/dashboard", "check in today &rarr;")}
      </td></tr>
    `),
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
    html: emailShell(`
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:52px;font-weight:700;line-height:1;">
          ${emoji}
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:32px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          <strong style="color:#F4F4F4;">@${actorUsername}</strong> reacted ${emoji} to your fix<br/>
          <em style="color:#F4F4F4;">&ldquo;${fixTitle}&rdquo;</em>
        </p>
      </td></tr>
      <tr><td style="padding-bottom:40px;">
        ${ctaButton(`https://hyperfix.app/fix/${fixId}`, "see your fix &rarr;")}
      </td></tr>
    `),
  }).catch(console.error);
}

export async function sendFixInactivityEmail({
  toEmail,
  toName,
  fixes,
}: {
  toEmail: string;
  toName: string;
  fixes: { title: string; id: string; daysSinceCheckin: number; dayCount: number }[];
}) {
  const resend = getResend();
  if (!resend) return;

  const fixLines = fixes.slice(0, 3).map(f =>
    `<li style="margin-bottom:8px;"><strong style="color:#F4F4F4;">&ldquo;${f.title}&rdquo;</strong> <span style="color:rgba(244,244,244,0.35);">— day ${f.dayCount}</span></li>`
  ).join("");

  await resend.emails.send({
    from: "hyperfix <hello@hyperfix.app>",
    to: toEmail,
    subject: `your fixes miss you, ${toName}`,
    html: emailShell(`
      <tr><td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:44px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
          still obsessed?
        </h1>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.55);">
          hey ${toName} — you haven&rsquo;t checked in for a few days. your fixes are waiting.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:rgba(244,244,244,0.5);">
          ${fixLines}
        </ul>
      </td></tr>
      <tr><td style="padding:0 0 40px;">
        ${ctaButton("https://hyperfix.app/dashboard", "check in now &rarr;")}
      </td></tr>
    `),
  }).catch(console.error);
}
