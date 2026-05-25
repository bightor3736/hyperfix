import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RevealSection } from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Terms of Service — Hyperfix",
  description: "The rules for using Hyperfix.",
  alternates: { canonical: "https://hyperfix.app/tos" },
  robots: { index: true, follow: false },
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

        <main id="main-content" className="relative max-w-3xl mx-auto flex flex-col gap-6">
          {/* Hero — tight, restrained */}
          <div className="anim-fadeUp">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(94,234,212,0.55)" }}>
              legal
            </p>
            <h1 className="font-display" style={{ color: "#F4F4F4", fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
              Terms of Service
            </h1>
            <p className="mt-3 font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Effective {EFFECTIVE}
            </p>
          </div>

          <RevealSection>
            <div className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-10" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
              <div className="relative flex flex-col gap-10">
                {sections.map((s) => (
                  <div key={s.h}>
                    <h2 className="font-display mb-3" style={{ color: TEAL, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {s.h}
                    </h2>
                    <p className="font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>
                      {s.body}
                    </p>
                  </div>
                ))}

                <div className="mt-4 pt-8 flex flex-col sm:flex-row gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <a href="/privacy" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: TEAL }}>
                    Privacy Policy →
                  </a>
                  <a href="/" className="font-sans text-sm transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}>
                    ← Back to Hyperfix
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>
        </main>
      </div>
      <Footer />
    </>
  );
}
