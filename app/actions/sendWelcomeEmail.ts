"use server";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendWelcomeEmail(email: string, position: number) {
  if (!resend) return;

  await resend.emails.send({
    from: "Hyperfix <hello@hyperfix.app>",
    to: email,
    subject: `you're on the list — #${position} in line`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>you're on the hyperfix waitlist</title>
</head>
<body style="margin:0;padding:0;background:#F4EFE6;font-family:Georgia,serif;color:#1A1614;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4EFE6;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1A1614;border:2px solid #1A1614;padding:6px 14px;">
                hyperfix · waitlist confirmed
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:56px;line-height:0.92;letter-spacing:-0.04em;font-weight:500;">
                you're in.<br/>
                <span style="color:#D72638;font-style:italic;">number ${position} in line.</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid rgba(26,22,20,0.15);">
              <p style="margin:0;font-family:sans-serif;font-size:17px;line-height:1.6;color:#3A322C;">
                Thanks for joining. We're building Hyperfix for people who can't shut up about their current obsession — the fic, the album, the character, the show. The hyperfixation tracker that counts the days and writes the eulogy when it ends.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8B7E6A;">what happens next</p>
              <p style="margin:0;font-family:sans-serif;font-size:16px;line-height:1.6;color:#3A322C;">
                First access goes out in waves. Early users get a permanent Pro discount and the best usernames before they're taken. We'll email you when your wave opens — no spam, just that one email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:48px;">
              <a href="https://hyperfix.app" style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;background:#1A1614;color:#F4EFE6;padding:12px 24px;text-decoration:none;display:inline-block;">
                back to hyperfix.app →
              </a>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid rgba(26,22,20,0.1);padding-top:24px;">
              <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8B7E6A;">
                © 2026 hyperfix · we do not train ai on your obsessions
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
