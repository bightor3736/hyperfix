import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Hyperfix",
  description: "The rules for using Hyperfix.",
  alternates: { canonical: "https://hyperfix.app/tos" },
  robots: { index: true, follow: false },
};

const EFFECTIVE = "May 2026";

const sections = [
  {
    h: "1. Who we are",
    body: "Hyperfix (\"we\", \"us\", \"our\") is a hyperfixation tracking app available at hyperfix.app. By creating an account or using the service, you agree to these terms.",
  },
  {
    h: "2. Your account",
    body: "You must be 13 or older to use Hyperfix. You're responsible for keeping your login credentials secure and for all activity under your account. If you believe your account has been compromised, contact us immediately.",
  },
  {
    h: "3. What you can do",
    body: "Free accounts may have up to 3 active fixes at a time. Pro accounts have unlimited active fixes. You may use Hyperfix for personal, non-commercial purposes. You can make your fixes public or keep them private — that's your choice.",
  },
  {
    h: "4. What you can't do",
    body: "Don't use Hyperfix to post content that is illegal, harassing, or harmful to others. Don't attempt to reverse-engineer, scrape, or abuse the platform. Don't create fake accounts or impersonate others.",
  },
  {
    h: "5. Your content",
    body: "You own everything you write in Hyperfix — your fix titles, notes, and eulogies are yours. You grant us a limited licence to store and display your content to you (and, for public fixes, to other users). We don't sell your content or train AI on it.",
  },
  {
    h: "6. Pro subscriptions",
    body: "Pro is a monthly subscription billed via Stripe. You can cancel any time — access continues until the end of your billing period. We don't offer refunds for partial months, but we'll always be reasonable if something goes wrong.",
  },
  {
    h: "7. Service availability",
    body: "We aim for high availability but can't guarantee it. We may change, suspend, or discontinue features with reasonable notice. We won't delete your data without warning you first and giving you a chance to export it.",
  },
  {
    h: "8. Limitation of liability",
    body: "Hyperfix is provided as-is. We're not liable for indirect damages, lost data, or anything that goes wrong outside our control. Our total liability is capped at the amount you paid us in the 12 months before the claim.",
  },
  {
    h: "9. Changes to these terms",
    body: "We'll notify you by email if we make material changes. Continued use after notice means you accept the updated terms.",
  },
  {
    h: "10. Contact",
    body: "Questions? Email us at hello@hyperfix.app. We're a small team and we actually read these.",
  },
];

export default function TosPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="min-h-screen px-6 sm:px-10 py-20 sm:py-32"
        style={{ background: "#0A0A0A" }}
      >
        <div className="max-w-2xl mx-auto">
          <span
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
            style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.35)" }}
          >
            legal
          </span>

          <h1
            className="font-display font-bold mb-3"
            style={{ color: "#F4F4F4", fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
          >
            Terms of Service
          </h1>
          <p
            className="font-mono text-[11px] uppercase tracking-widest mb-16"
            style={{ color: "rgba(244,244,244,0.3)" }}
          >
            Effective {EFFECTIVE}
          </p>

          <div className="flex flex-col gap-12">
            {sections.map((s) => (
              <div key={s.h}>
                <h2
                  className="font-display font-semibold mb-3"
                  style={{ color: "#A855F7", fontSize: 17, letterSpacing: "-0.02em" }}
                >
                  {s.h}
                </h2>
                <p
                  className="font-sans leading-relaxed"
                  style={{ color: "rgba(244,244,244,0.65)", fontSize: 15, lineHeight: 1.7 }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-16 pt-10 flex flex-col sm:flex-row gap-4"
            style={{ borderTop: "1px solid rgba(244,244,244,0.07)" }}
          >
            <a
              href="/privacy"
              className="font-mono text-[11px] uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ color: "rgba(244,244,244,0.4)" }}
            >
              Privacy Policy →
            </a>
            <a
              href="/"
              className="font-mono text-[11px] uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ color: "rgba(244,244,244,0.4)" }}
            >
              ← Back to Hyperfix
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
