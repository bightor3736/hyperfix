"use client";

import { SparkIcon } from "@/components/Logo";

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekRings({ checkedDates }: { checkedDates: string[] }) {
  const dateSet = new Set(checkedDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const monday = getMondayOfWeek(today);
  const weekDates = DAY_LABELS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div>
      <p
        className="font-mono text-[10px] uppercase tracking-widest mb-4"
        style={{ color: "rgba(244,244,244,0.3)" }}
      >
        This week
      </p>
      <div className="flex justify-between gap-1">
        {weekDates.map((date, i) => {
          const isFuture = date > todayStr;
          const isToday = date === todayStr;
          const checkedIn = dateSet.has(date);
          const isPast = date < todayStr;

          return (
            <div key={date} className="flex flex-col items-center gap-2 flex-1">
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  maxWidth: 52,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: checkedIn
                    ? "#5EEAD4"
                    : "transparent",
                  border: checkedIn
                    ? "none"
                    : isFuture
                      ? "1.5px dashed rgba(244,244,244,0.1)"
                      : isPast
                        ? "2px solid rgba(244,244,244,0.15)"
                        : "2px solid rgba(94,234,212,0.5)",
                  boxShadow: checkedIn
                    ? "0 0 18px rgba(94,234,212,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
                    : isToday
                      ? "0 0 12px rgba(94,234,212,0.2)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {checkedIn ? (
                  <SparkIcon size={18} color="white" />
                ) : isToday ? (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5EEAD4" }} />
                ) : null}
              </div>
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{
                  color: isToday
                    ? "#5EEAD4"
                    : checkedIn
                      ? "rgba(244,244,244,0.6)"
                      : "rgba(244,244,244,0.2)",
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
