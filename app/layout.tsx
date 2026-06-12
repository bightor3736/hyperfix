import type { Metadata, Viewport } from "next";
import { Quicksand, Nunito, Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { AffTracker } from "@/components/AffTracker";
import { CursorGlow } from "@/components/CursorGlow";
import "./globals.css";

// Quicksand — friendly rounded sans; body, labels, UI. Maps to --font-grotesk
// (kept so all existing components restyle without markup changes).
const grotesk = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

// Nunito — soft rounded labels, chips, small uppercase text. --font-mono slot.
const mono = Nunito({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-mono",
});

// Inter — neutral dense UI fallback. --font-landing-sans.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-sans",
});

// Instrument Serif — editorial italic accent for hero headline.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const SITE_URL = "https://hyperfix.app";
const SITE_NAME = "Hyperfix";
const TITLE = "Hyperfix — start the task you've been avoiding";
const DESCRIPTION =
  "The ADHD app that beats task paralysis. AI breaks down tasks, you do 5 minutes, earn XP for starting. Forgiving streaks. Free.";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Hyperfix",
  },
  description: DESCRIPTION,
  keywords: [
    "ADHD dopamine app",
    "dopamine menu app",
    "anti doomscroll app",
    "ADHD game",
    "ADHD focus app",
    "ADHD productivity app",
    "ADHD streak app",
    "understimulation ADHD",
    "neurodivergent productivity",
    "dopamine on tap",
  ],
  authors: [{ name: "Hyperfix" }],
  creator: "Hyperfix",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hyperfix — start the task you've been avoiding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "health",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hyperfix",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hyperfix",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web, iOS, Android",
  description: DESCRIPTION,
  url: SITE_URL,
  screenshot: `${SITE_URL}/opengraph-image`,
  featureList: [
    "Hyperfixation tracker",
    "XP and levels",
    "Proof-of-action timer",
    "Streak freezes",
    "Focus rooms with body doubling",
    "Customizable profile",
    "Daily quests",
    "Jackpot rewards",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Free Player",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Power-Up",
      price: "3.25",
      priceCurrency: "USD",
      description: "Billed annually at $39/year",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: SITE_NAME,
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${mono.variable} ${inter.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hyperfix-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`,
          }}
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
          >
            Skip to content
          </a>
          <Suspense fallback={null}><AffTracker /></Suspense>
          <CursorGlow />
          {children}
          <Analytics />
        </body>
    </html>
  );
}
