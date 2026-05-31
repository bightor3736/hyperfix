"use client";

import { useState } from "react";

export function ShareProfileButton({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://hyperfix.app/u/${username}`;

  function copyLink() {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareToX() {
    const text = `my hyperfixation history, live on hyperfix. all my obsessions, counted. ${profileUrl}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({
        title: `${displayName} on Hyperfix`,
        text: `check out my hyperfixation history`,
        url: profileUrl,
      });
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-4 py-2 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: copied ? "var(--accent)" : "var(--ink)",
          color: "var(--bg)",
        }}
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            copied
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            copy link
          </>
        )}
      </button>
      <button
        onClick={shareToX}
        className="inline-flex items-center gap-1.5 font-sans text-xs font-medium px-4 py-2 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: "var(--line)",
          border: "1px solid var(--line)",
          color: "var(--ink)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        post to X
      </button>
      <button
        onClick={nativeShare}
        className="inline-flex items-center gap-1.5 font-sans text-xs font-medium px-4 py-2 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: "var(--line)",
          border: "1px solid var(--line)",
          color: "var(--ink)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        share
      </button>
    </div>
  );
}
