"use client"

import { Flame } from "lucide-react"

interface StreakBadgeProps {
  streakDays: number
}

export function StreakBadge({ streakDays }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
        <Flame className="h-5 w-5 text-accent" />
      </div>
      <div className="flex-1">
        {streakDays > 0 ? (
          <>
            <p className="font-semibold">{streakDays}-day streak</p>
            <p className="text-sm text-muted-foreground">
              You&apos;re on a roll! Keep exploring.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold">Start your streak</p>
            <p className="text-sm text-muted-foreground">
              Explore a scenario or complete a lesson today
            </p>
          </>
        )}
      </div>
    </div>
  )
}
