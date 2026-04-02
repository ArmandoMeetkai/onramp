"use client"

import { cn } from "@/lib/utils"

interface ReplayTimelineProps {
  phases: { id: string; label: string }[]
  currentIndex: number
}

export function ReplayTimeline({ phases, currentIndex }: ReplayTimelineProps) {
  return (
    <div className="flex items-center gap-1" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={phases.length}>
      {phases.map((phase, index) => {
        const isActive = index === currentIndex
        const isCompleted = index < currentIndex

        return (
          <div key={phase.id} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors duration-500",
                  isCompleted
                    ? "bg-primary"
                    : isActive
                      ? "bg-primary/60"
                      : "bg-border"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors truncate",
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {phase.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
