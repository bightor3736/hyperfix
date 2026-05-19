#!/usr/bin/env node
/**
 * tiktok-post.mjs
 *
 * Posts one content pack (4 slides) to TikTok as a photo carousel.
 * Runs from GitHub Actions 3× per day; pack is selected by day-of-year × slot.
 *
 * Required env vars (GitHub Secrets):
 *   TIKTOK_CLIENT_KEY      — from TikTok developer app
 *   TIKTOK_CLIENT_SECRET   — from TikTok developer app
 *   TIKTOK_REFRESH_TOKEN   — long-lived token from OAuth (valid 365 days)
 *   SITE_URL               — e.g. https://hyperfix.app
 *   GITHUB_TOKEN           — injected automatically by Actions (needs secrets:write)
 *   GITHUB_REPOSITORY      — injected automatically by Actions (owner/repo)
 */

import { execSync } from "child_process";

const {
  TIKTOK_CLIENT_KEY,
  TIKTOK_CLIENT_SECRET,
  TIKTOK_REFRESH_TOKEN,
  SITE_URL,
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  PACK_OVERRIDE,
} = process.env;

const TOTAL_PACKS = 6; // must match PACKS.length in route.tsx
const SLIDES_PER_PACK = 4;

// ── 1. Pick which pack to post ─────────────────────────────────────────────
function pickPack() {
  if (PACK_OVERRIDE !== undefined && PACK_OVERRIDE !== "") {
    const idx = parseInt(PACK_OVERRIDE, 10);
    console.log(`[pack] override → ${idx}`);
    return idx % TOTAL_PACKS;
  }

  const now = new Date();
  const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - startOfYear) / 86_400_000);

  // 3 time slots: 0 = morning (< 12 UTC), 1 = afternoon (< 18), 2 = evening
  const hour = now.getUTCHours();
  const slot = hour < 12 ? 0 : hour < 18 ? 1 : 2;

  const idx = (dayOfYear * 3 + slot) % TOTAL_PACKS;
  console.log(`[pack] day=${dayOfYear} slot=${slot} → pack ${idx}`);
  return idx;
}

// ── 2. Refresh access token ────────────────────────────────────────────────
async function refreshToken() {
  console.log("[token] refreshing…");

  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: TIKTOK_REFRESH_TOKEN,
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    throw new Error(`Token refresh failed:\n${JSON.stringify(data, null, 2)}`);
  }

  console.log(`[token] ok — expires in ${data.expires_in}s`);
  return data;
}

// ── 3. Save updated refresh token to GitHub Secrets ───────────────────────
async function saveRefreshToken(newToken) {
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    console.warn("[token] GITHUB_TOKEN / GITHUB_REPOSITORY not set — skipping secret update");
    return;
  }

  try {
    // Use gh CLI (pre-installed on GitHub-hosted runners)
    execSync(`echo "${newToken}" | gh secret set TIKTOK_REFRESH_TOKEN --repo ${GITHUB_REPOSITORY}`, {
      env: { ...process.env, GH_TOKEN: GITHUB_TOKEN },
      stdio: "pipe",
    });
    console.log("[token] refresh token saved to GitHub Secrets");
  } catch (err) {
    // Non-fatal — next run will still work for 365 days
    console.warn("[token] could not update GitHub Secret:", err.message);
  }
}

// ── 4. Post to TikTok Content Posting API ─────────────────────────────────
async function postPhotoCarousel(accessToken, packIdx) {
  const photoImages = Array.from({ length: SLIDES_PER_PACK }, (_, i) =>
    `${SITE_URL}/api/tiktok/slide?pack=${packIdx}&n=${i + 1}`
  );

  // Fetch captions from the slide route (they live in the same file as the images)
  // We hard-code them here to avoid a round-trip; keep in sync with route.tsx
  const captions = [
    "if you felt this you are so perceived 💚 #hyperfixation #adhd #adhdtiktok #fandom #relatable #audhd #foryoupage",
    "the song loop one is so personal to me 🎵 #hyperfixation #adhd #audhd #adhdthings #foryou #relatable",
    "post-fix depression is so real 💔 #hyperfixation #adhd #audhd #comingdown #relatable #adhdtiktok",
    "stage 2 → 3 has zero warning time 😭 #hyperfixation #adhdthings #audhd #relatable #foryoupage #neurodivergent",
    "the second one is genuinely how I gaslit myself for months 💀 #hyperfixation #adhd #audhd #fandom #relatable",
    "the pipeline is a straight vertical drop ⬇️ #adhdtiktok #hyperfixation #audhd #neurodivergent #relatable",
  ];

  const caption = captions[packIdx % captions.length];

  console.log(`[post] uploading ${photoImages.length} slides for pack ${packIdx}`);
  photoImages.forEach((u, i) => console.log(`  slide ${i + 1}: ${u}`));

  const body = {
    post_info: {
      title: caption,
      privacy_level: "PUBLIC_TO_EVERYONE",
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
    },
    source_info: {
      source: "PULL_FROM_URL",
      photo_images: photoImages,
      photo_cover_index: 0,
    },
    media_type: "PHOTO",
  };

  const res = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/content/init/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  console.log("[tiktok] response:", JSON.stringify(data, null, 2));

  const errorCode = data?.error?.code ?? data?.data?.error?.code;
  if (errorCode && errorCode !== "ok") {
    throw new Error(`TikTok API error: ${errorCode} — ${data?.error?.message ?? ""}`);
  }

  return data?.data?.publish_id ?? data?.data?.share_id ?? "unknown";
}

// ── main ───────────────────────────────────────────────────────────────────
async function main() {
  // Validate env
  for (const key of ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN", "SITE_URL"]) {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
  }

  const packIdx = pickPack();

  // Refresh token
  const tokenData = await refreshToken();
  const { access_token, refresh_token } = tokenData;

  // Persist new refresh token if it changed
  if (refresh_token && refresh_token !== TIKTOK_REFRESH_TOKEN) {
    await saveRefreshToken(refresh_token);
  }

  // Post
  const publishId = await postPhotoCarousel(access_token, packIdx);
  console.log(`\n✓ Posted! publish_id: ${publishId}`);
}

main().catch((err) => {
  console.error("\n✗ Failed:", err.message);
  process.exit(1);
});
