"use client";

import { useState, useTransition } from "react";

type Props = {
  targetUserId: string;
  targetUsername: string;
  initialFollowing: boolean;
  initialCount: number;
};

export function FollowButton({
  targetUserId,
  targetUsername,
  initialFollowing,
  initialCount,
}: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [hovered, setHovered] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      // Optimistic update
      const nextFollowing = !following;
      setFollowing(nextFollowing);
      setCount((c) => (nextFollowing ? c + 1 : Math.max(0, c - 1)));

      try {
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId }),
        });
        if (!res.ok) {
          // Revert on error
          setFollowing(following);
          setCount(count);
          return;
        }
        const data = (await res.json()) as { following: boolean; followerCount: number };
        setFollowing(data.following);
        setCount(data.followerCount);
      } catch {
        setFollowing(following);
        setCount(count);
      }
    });
  }

  if (following) {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={pending}
        className="px-4 py-1.5 rounded-full font-sans text-sm font-semibold transition-all duration-150 disabled:opacity-60"
        style={
          hovered
            ? {
                background: "rgba(220,38,38,0.12)",
                border: "1px solid rgba(220,38,38,0.4)",
                color: "#f87171",
              }
            : {
                background: "#A855F7",
                border: "1px solid #A855F7",
                color: "#0A0A0A",
              }
        }
      >
        {hovered ? "Unfollow" : "Following ✓"}
      </button>
    );
  }

  return (
    <a
      href={`/auth/signup?next=/u/${targetUsername}`}
      className="px-4 py-1.5 rounded-full font-sans text-sm font-semibold transition-all duration-150 inline-block"
      style={{
        background: "transparent",
        border: "1px solid rgba(168,85,247,0.4)",
        color: "#A855F7",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#A855F7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(168,85,247,0.4)";
      }}
    >
      Follow
    </a>
  );
}

export function FollowButtonLoggedIn({
  targetUserId,
  targetUsername,
  initialFollowing,
  initialCount,
}: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [hovered, setHovered] = useState(false);
  const [pending, startTransition] = useTransition();

  void targetUsername;

  function handleClick() {
    startTransition(async () => {
      const nextFollowing = !following;
      setFollowing(nextFollowing);
      setCount((c) => (nextFollowing ? c + 1 : Math.max(0, c - 1)));

      try {
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId }),
        });
        if (!res.ok) {
          setFollowing(following);
          setCount(count);
          return;
        }
        const data = (await res.json()) as { following: boolean; followerCount: number };
        setFollowing(data.following);
        setCount(data.followerCount);
      } catch {
        setFollowing(following);
        setCount(count);
      }
    });
  }

  if (following) {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={pending}
        className="px-4 py-1.5 rounded-full font-sans text-sm font-semibold transition-all duration-150 disabled:opacity-60"
        style={
          hovered
            ? {
                background: "rgba(220,38,38,0.12)",
                border: "1px solid rgba(220,38,38,0.4)",
                color: "#f87171",
              }
            : {
                background: "#A855F7",
                border: "1px solid #A855F7",
                color: "#0A0A0A",
              }
        }
      >
        {hovered ? "Unfollow" : "Following ✓"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="px-4 py-1.5 rounded-full font-sans text-sm font-semibold transition-all duration-150 disabled:opacity-60"
      style={{
        background: "transparent",
        border: "1px solid rgba(168,85,247,0.4)",
        color: "#A855F7",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#A855F7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(168,85,247,0.4)";
      }}
    >
      Follow
    </button>
  );
}
