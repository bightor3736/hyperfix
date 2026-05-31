"use client"

import * as React from "react"
import { Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import type { UserAchievement } from "@/components/ui/achievement-list"

interface AchievementBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  achievement: UserAchievement
  badgeSize?: "sm" | "default" | "lg"
  lockedStyle?: "grayscale" | "silhouette" | "hidden"
  onAchievementClick?: (achievement: UserAchievement) => void
}

const badgeSizeMap = {
  sm: "h-14 w-14",
  default: "h-16 w-16",
  lg: "h-20 w-20",
} as const

const iconSizeMap = {
  sm: "h-7 w-7",
  default: "h-8 w-8",
  lg: "h-10 w-10",
} as const

const AchievementBadge = React.forwardRef<HTMLDivElement, AchievementBadgeProps>(
  (
    {
      className,
      achievement,
      badgeSize = "default",
      lockedStyle = "grayscale",
      onAchievementClick,
      ...props
    },
    ref
  ) => {
    const isUnlocked = achievement.achievedAt !== null

    if (!isUnlocked && lockedStyle === "hidden") {
      return null
    }

    return (
      <div
        ref={ref}
        role={onAchievementClick ? "button" : "group"}
        tabIndex={onAchievementClick ? 0 : undefined}
        aria-label={achievement.name}
        onClick={() => onAchievementClick?.(achievement)}
        onKeyDown={
          onAchievementClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onAchievementClick(achievement)
                }
              }
            : undefined
        }
        className={cn(
          "bg-card flex flex-col items-center gap-2 rounded-2xl border p-4 text-center shadow-sm transition-shadow hover:shadow-md",
          onAchievementClick && "cursor-pointer",
          className
        )}
        {...props}
      >
        {achievement.badgeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={achievement.badgeUrl}
            alt={achievement.name}
            className={cn(
              badgeSizeMap[badgeSize],
              "shrink-0 rounded-xl object-cover",
              !isUnlocked && lockedStyle === "grayscale" && "grayscale",
              !isUnlocked &&
                lockedStyle === "silhouette" &&
                "opacity-30 brightness-0"
            )}
          />
        ) : (
          <div
            aria-hidden="true"
            className={cn(
              badgeSizeMap[badgeSize],
              "flex shrink-0 items-center justify-center rounded-xl",
              isUnlocked
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Trophy className={iconSizeMap[badgeSize]} />
          </div>
        )}

        <p
          className={cn(
            "max-w-full truncate text-sm font-semibold",
            !isUnlocked && "text-muted-foreground"
          )}
        >
          {achievement.name}
        </p>
      </div>
    )
  }
)
AchievementBadge.displayName = "AchievementBadge"

export { AchievementBadge }
export type { AchievementBadgeProps }
