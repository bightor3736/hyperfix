"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function OAuthCallback({ code }: { code: string }) {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      window.location.replace(error ? "/auth/login?error=callback" : "/dashboard");
    });
  }, [code]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080808",
        color: "#A3E635",
        fontFamily: "monospace",
        fontSize: 13,
        letterSpacing: "0.08em",
      }}
    >
      signing in…
    </div>
  );
}
