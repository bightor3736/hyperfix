import Link from "next/link";

const perks = [
  { icon: "👥", label: "Body-doubling",    desc: "Presence of others makes focus easier — it's science." },
  { icon: "🎵", label: "Shared music",     desc: "Owner links Spotify. Everyone hears it. Mute if needed." },
  { icon: "🍅", label: "Synced Pomodoro",  desc: "One timer, whole room. Work and break together." },
  { icon: "🎤", label: "Voice chat",       desc: "Talk between rounds. Per-person volume controls." },
  { icon: "🌧️", label: "Ambient sounds",   desc: "White noise, brown noise, rain — pick your flavour." },
  { icon: "💬", label: "Live chat",        desc: "Drop a note, share a win, fire an emoji reaction." },
];

export function FocusRooms() {
  return (
    <section id="rooms" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr] items-center">
          {/* Left — text */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium mb-6"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              ⚡ New · Focus Rooms
            </div>
            <h2
              className="font-display text-[36px] leading-[1.05] tracking-tight sm:text-[44px]"
              style={{ color: "var(--ink)" }}
            >
              Work better,
              <br />
              together.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] max-w-[440px]" style={{ color: "var(--ink-muted)" }}>
              Body-doubling is one of the most effective focus strategies for ADHD brains. Jump into an open room, see who else is working, and get things done.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/room"
                className="inline-flex h-11 items-center justify-center rounded-full px-6 text-[14px] font-medium transition-opacity hover:opacity-80"
                style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
              >
                Browse open rooms →
              </Link>
              <Link
                href="/room"
                className="inline-flex h-11 items-center justify-center rounded-full px-6 text-[14px] font-medium border transition-opacity hover:opacity-70"
                style={{ borderColor: "var(--line-strong)", color: "var(--ink)" }}
              >
                Create a room
              </Link>
            </div>
          </div>

          {/* Right — feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((p) => (
              <div
                key={p.label}
                className="rounded-[18px] p-5"
                style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
              >
                <div className="text-[24px] mb-3">{p.icon}</div>
                <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--ink)" }}>{p.label}</p>
                <p className="text-[13px] leading-[1.5]" style={{ color: "var(--ink-muted)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
