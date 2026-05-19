#!/usr/bin/env node
/**
 * tiktok-auth.mjs  —  one-time OAuth helper
 *
 * Run once on your machine to get the refresh_token you need to store
 * as a GitHub Secret. You never need to run this again unless the token
 * expires (365 days) or is revoked.
 *
 * Usage:
 *   TIKTOK_CLIENT_KEY=xxx TIKTOK_CLIENT_SECRET=yyy node scripts/tiktok-auth.mjs
 *
 * Steps it walks you through:
 *   1. Prints the TikTok auth URL → open in browser, approve the app
 *   2. TikTok redirects to your redirect_uri with ?code=...
 *   3. Paste the full redirect URL back here
 *   4. Script exchanges the code for tokens and prints your refresh_token
 */

import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const CLIENT_KEY    = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI  = process.env.TIKTOK_REDIRECT_URI ?? "https://hyperfix.app/auth/tiktok/callback";

if (!CLIENT_KEY || !CLIENT_SECRET) {
  console.error("Error: set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET before running.");
  process.exit(1);
}

const rl = readline.createInterface({ input, output });

const state = Math.random().toString(36).slice(2);
const scope = "video.publish,user.info.basic";

const authUrl =
  `https://www.tiktok.com/v2/auth/authorize/` +
  `?client_key=${CLIENT_KEY}` +
  `&scope=${encodeURIComponent(scope)}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&state=${state}`;

console.log("\n─────────────────────────────────────────────────────");
console.log("STEP 1 — Open this URL in your browser and approve:");
console.log("\n" + authUrl + "\n");
console.log("─────────────────────────────────────────────────────");
console.log("(TikTok will redirect to your redirect_uri with ?code=...)");
console.log("If the redirect fails, just copy the full URL from the browser bar.\n");

const redirected = await rl.question("STEP 2 — Paste the full redirect URL here:\n> ");

let code;
try {
  const url = new URL(redirected.trim());
  code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  if (returnedState !== state) {
    console.warn("Warning: state mismatch — continuing anyway.");
  }
} catch {
  // Maybe they pasted just the code
  code = redirected.trim();
}

if (!code) {
  console.error("Could not extract code from the URL. Exiting.");
  rl.close();
  process.exit(1);
}

console.log(`\n[auth] exchanging code for tokens…`);

const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_key:    CLIENT_KEY,
    client_secret: CLIENT_SECRET,
    code,
    grant_type:    "authorization_code",
    redirect_uri:  REDIRECT_URI,
  }),
});

const data = await res.json();

if (!data.refresh_token) {
  console.error("Token exchange failed:");
  console.error(JSON.stringify(data, null, 2));
  rl.close();
  process.exit(1);
}

console.log("\n─────────────────────────────────────────────────────");
console.log("✓ Success! Add these as GitHub Secrets:\n");
console.log(`TIKTOK_CLIENT_KEY      = ${CLIENT_KEY}`);
console.log(`TIKTOK_CLIENT_SECRET   = ${CLIENT_SECRET}`);
console.log(`TIKTOK_REFRESH_TOKEN   = ${data.refresh_token}`);
console.log(`SITE_URL               = https://hyperfix.app`);
console.log("\n─────────────────────────────────────────────────────");
console.log("Access token (expires 24h — DO NOT store this, the script auto-refreshes):");
console.log(data.access_token);
console.log("\nRefresh token valid for:", data.refresh_token_expires_in ?? "~365 days");

rl.close();
