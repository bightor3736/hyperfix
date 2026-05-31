const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="skeleton-shimmer rounded-xl mb-2" style={{ height: 30, width: 200 }} />
        <div className="skeleton-shimmer rounded-lg mb-8" style={{ height: 14, width: 240 }} />

        {/* Notification rows */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <div
                className="skeleton-shimmer rounded-full shrink-0"
                style={{ width: 36, height: 36 }}
              />
              <div className="flex-1">
                <div
                  className="skeleton-shimmer rounded mb-2"
                  style={{ height: 12, width: "70%" }}
                />
                <div
                  className="skeleton-shimmer rounded"
                  style={{ height: 10, width: "40%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
