"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  fixId?: string;
  bannerUrl: string | null;
  onChange: (url: string | null) => void;
};

const TEAL = "#5EEAD4";

export function FixBannerUpload({ userId, fixId, bannerUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(0);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `fixes/${userId}/${Date.now()}.${ext}`;

      const tick = setInterval(() => {
        setProgress((p) => (p === null || p >= 85 ? p : p + 15));
      }, 150);

      const { error: uploadErr } = await supabase.storage
        .from("banners")
        .upload(path, file, { upsert: true });

      clearInterval(tick);

      if (uploadErr) {
        setProgress(null);
        setError("Upload failed.");
        return;
      }

      const { data: urlData } = supabase.storage.from("banners").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      // If we know the fix id, persist immediately. Otherwise the parent stores it.
      if (fixId) {
        const { error: updateErr } = await supabase
          .from("fixes")
          .update({ banner_url: publicUrl })
          .eq("id", fixId);
        if (updateErr) {
          setError("Uploaded but failed to save.");
          return;
        }
      }

      setProgress(100);
      onChange(publicUrl);
      setTimeout(() => setProgress(null), 1000);
    } catch {
      setProgress(null);
      setError("Upload failed.");
    }
  }

  async function handleRemove() {
    if (fixId) {
      const supabase = createClient();
      await supabase.from("fixes").update({ banner_url: null }).eq("id", fixId);
    }
    onChange(null);
  }

  return (
    <div>
      <span
        className="font-sans text-[11px] font-semibold uppercase tracking-widest block mb-3"
        style={{ color: "rgba(244,244,244,0.25)" }}
      >
        Fixation banner
      </span>
      <div
        className="relative rounded-2xl overflow-hidden mb-3 flex items-end"
        style={{
          height: 120,
          background: bannerUrl ? undefined : "rgba(94,234,212,0.05)",
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(94,234,212,0.15)",
        }}
      >
        {!bannerUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-mono text-xs" style={{ color: "rgba(94,234,212,0.35)" }}>
              Drop in a vibe (optional)
            </p>
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(7,7,8,0.85)",
              border: "1px solid rgba(94,234,212,0.3)",
              color: TEAL,
              backdropFilter: "blur(8px)",
            }}
          >
            {bannerUrl ? "Change" : "Upload banner"}
          </button>
          {bannerUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: "rgba(7,7,8,0.85)",
                border: "1px solid rgba(244,244,244,0.15)",
                color: "rgba(244,244,244,0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      {progress !== null && (
        <div className="w-48 mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.4)" }}>
              Uploading…
            </span>
            <span className="font-mono text-[10px]" style={{ color: TEAL }}>
              {progress}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: TEAL }}
            />
          </div>
        </div>
      )}
      {error && <p className="font-sans text-[12px]" style={{ color: "#fda4af" }}>{error}</p>}
      <p className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.2)" }}>
        1500×500px recommended · JPG or PNG · max 5MB
      </p>
    </div>
  );
}
