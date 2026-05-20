import { NextResponse } from "next/server";
import { Resend } from "resend";

// Add RESEND_API_KEY=your_key_here to .env.local

function buildEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>welcome to hyperfix</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;">

          <!-- Wordmark -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#5EEAD4;">
                hyperfix
              </span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:48px;font-weight:700;line-height:1;color:#F4F4F4;letter-spacing:-0.03em;">
                you&rsquo;re in.
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding-bottom:36px;">
              <p style="margin:0;font-size:16px;line-height:1.65;color:rgba(244,244,244,0.6);">
                thanks for joining hyperfix, ${name}.<br />
                your obsessions deserve to be logged.<br />
                we&rsquo;ll be here when the next one hits.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:48px;">
              <a
                href="https://hyperfix.app/dashboard"
                style="display:inline-block;background:#5EEAD4;color:#0A0A0A;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;letter-spacing:0.01em;"
              >
                start logging &rarr;
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid rgba(244,244,244,0.08);padding-top:24px;">
              <p style="margin:0;font-size:11px;color:rgba(244,244,244,0.25);letter-spacing:0.04em;text-transform:uppercase;">
                hyperfix &middot; what are you unwell about?
              </p>
              <p style="margin:8px 0 0;font-size:11px;">
                <a href="https://hyperfix.app/unsubscribe" style="color:rgba(244,244,244,0.25);text-decoration:underline;">
                  unsubscribe
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true }); // silently skip when not configured
  }
  try {
    const body = await request.json();
    const { email, name } = body as { email?: string; name?: string };

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const displayName = name || email.split("@")[0] || "friend";

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "hyperfix <hello@hyperfix.app>",
      to: email,
      subject: "welcome to hyperfix 👁",
      html: buildEmailHtml(displayName),
    });

    if (error) {
      console.error("[welcome email] resend error:", error);
      return NextResponse.json({ error: "failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[welcome email] unexpected error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
