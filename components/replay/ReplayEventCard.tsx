"use client"

import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReplayEvent } from "@/data/replayEvents"

interface ReplayEventCardProps {
  event: ReplayEvent
  isCompleted: boolean
}

const categoryLabels: Record<string, string> = {
  crash: "Crash",
  milestone: "Milestone",
  event: "Event",
}

export function ReplayEventCard({ event, isCompleted }: ReplayEventCardProps) {
  return (
    <Link
      href={`/replay/${event.id}`}
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all duration-200 hover:border-primary/30 active:scale-[0.98]",
        isCompleted ? "border-success/30" : "border-border"
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
        {isCompleted ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15">
            <Check className="h-6 w-6 text-success" />
          </div>
        ) : (
          event.coverEmoji
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-snug truncate">{event.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {event.date} · {event.asset}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px]">
            {categoryLabels[event.category]}
          </Badge>
          <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px]">
            {event.difficulty === "beginner" ? "Beginner" : "Intermediate"}
          </Badge>
          {isCompleted && (
            <Badge className="rounded-md px-1.5 py-0 text-[10px] bg-success/15 text-success border-0">
              Completed
            </Badge>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </Link>
  )
}
