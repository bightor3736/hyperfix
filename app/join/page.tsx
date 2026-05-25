"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function JoinRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    if (refCode) {
      try {
        localStorage.setItem("hyperfix_ref", refCode);
      } catch {
        /* localStorage may be unavailable — ignore */
      }
    }
    router.replace("/auth/signup");
  }, [refCode, router]);

  return null;
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinRedirect />
    </Suspense>
  );
}
