"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";
import { BannerGalleryPicker } from "@/components/BannerGalleryPicker";
import { bannerPresetUrl } from "@/lib/banner-presets";

type Props = {
  userId: string;
  fixId?: string;
  bannerUrl: string | null;
  onChange: (url: string | null) => void;
};

const TEAL = "var(--accent)";

export function FixBannerUpload({ userId, fixId, bannerUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { toast } = useToast();

  async function handlePresetSelect(presetId: string) {
    setError(null);
    const url = bannerPresetUrl(presetId);
    if (fixId) {
      const supabase = createClient();
      const { error: updateErr } = await supabase
        .from("fixes")
        .update({ banner_url: url })
        .eq("id", fixId);
      if (updateErr) {
        setError("Failed to save preset.");
        toast({ message: "Save failed.", type: "error" });
        return;
      }
    }
    onChange(url);
    toast({ message: "Banner set", type: "success" });
  }

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
        toast({ message: "Upload failed.", type: "error" });
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
          toast({ message: "Save failed.", type: "error" });
          return;
        }
      }

      setProgress(100);
      onChange(publicUrl);
      toast({ message: "Banner uploaded", type: "success" });
      setTimeout(() => setProgress(null), 1000);
    } catch {
      setProgress(null);
      setError("Upload failed.");
      toast({ message: "Upload failed.", type: "error" });
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
        style={{ color: "var(--ink-faint)" }}
      >
        Fixation banner
      </span>
      <div
        className="relative rounded-2xl overflow-hidden mb-3 flex items-end"
        style={{
          height: 120,
          background: bannerUrl
            ? undefined
            : "radial-gradient(ellipse 120% 160% at 50% 130%, var(--accent) 0%, var(--accent) 12%, #0E4F47 30%, #08231F 52%, var(--bg) 75%)",
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid var(--accent)",
        }}
      >
        {!bannerUrl && (
          <>
            {/* noise grain */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                backgroundSize: "200px 200px",
                opacity: 0.45,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                Hyperfix default · upload or pick a preset to customise
              </p>
            </div>
          </>
        )}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(7,7,8,0.85)",
              border: "1px solid var(--accent-soft)",
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
                border: "1px solid var(--line-strong)",
                color: "var(--ink-muted)",
                backdropFilter: "blur(8px)",
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            color: TEAL,
          }}
        >
          Or pick a preset
        </button>
      </div>
      {pickerOpen && (
        <BannerGalleryPicker
          onSelect={handlePresetSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
      {progress !== null && (
        <div className="w-48 mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[10px]" style={{ color: "var(--ink-muted)" }}>
              Uploading…
            </span>
            <span className="font-mono text-[10px]" style={{ color: TEAL }}>
              {progress}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: TEAL }}
            />
          </div>
        </div>
      )}
      {error && <p className="font-sans text-[12px]" style={{ color: "#fda4af" }}>{error}</p>}
      <p className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>
        1500×500px recommended · JPG or PNG · max 5MB
      </p>
    </div>
  );
}
