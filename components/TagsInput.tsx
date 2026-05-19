"use client";

import { useRef, useState } from "react";

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
};

function sanitizeTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 20);
}

export function TagsInput({ value, onChange, maxTags = 5 }: Props) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = sanitizeTag(raw);
    if (!tag) return;
    if (value.length >= maxTags) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.endsWith(",")) {
      addTag(val.slice(0, -1));
    } else {
      setInput(val);
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-wrap gap-2 rounded-xl px-3 py-2.5 cursor-text"
      style={{
        background: "#111113",
        border: `1px solid ${focused ? "rgba(163,230,53,0.4)" : "rgba(244,244,244,0.1)"}`,
        minHeight: "44px",
        transition: "border-color 0.15s",
      }}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="font-mono text-[11px] uppercase tracking-widest rounded-full px-2.5 py-1 flex items-center gap-1.5"
          style={{
            background: "rgba(163,230,53,0.1)",
            border: "1px solid rgba(163,230,53,0.2)",
            color: "#A3E635",
          }}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="leading-none transition-colors"
            style={{ color: "rgba(163,230,53,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(163,230,53,1)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(163,230,53,0.5)")}
            aria-label={`Remove tag ${tag}`}
          >
            ✕
          </button>
        </span>
      ))}
      {value.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input) addTag(input); }}
          placeholder={value.length === 0 ? "add tags…" : ""}
          className="bg-transparent outline-none font-mono text-sm flex-1 min-w-[80px]"
          style={{
            color: "#F4F4F4",
          }}
        />
      )}
    </div>
  );
}
