"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/PageTransition"
import { ReplayEventCard } from "@/components/replay/ReplayEventCard"
import { useReplayStore } from "@/store/useReplayStore"
import { cn } from "@/lib/utils"
import type { ReplayEvent } from "@/data/replayEvents"

const filters = [
  { label: "All", value: "all" },
  { label: "Crashes", value: "crash" },
  { label: "Milestones", value: "milestone" },
  { label: "Events", value: "event" },
] as const

type FilterValue = (typeof filters)[number]["value"]

interface ReplayHubContentProps {
  events: ReplayEvent[]
}

export function ReplayHubContent({ events }: ReplayHubContentProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")
  const isEventCompleted = useReplayStore((s) => s.isEventCompleted)

  const filtered = events.filter((event) => {
    if (activeFilter === "all") return true
    return event.category === activeFilter
  })

  return (
    <PageTransition>
      <div className="py-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Time Travel
        </h1>
        <p className="mt-1 text-muted-foreground">
          Relive real crypto events. Make the call. See what happened.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
            >
              <ReplayEventCard
                event={event}
                isCompleted={isEventCompleted(event.id)}
              />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No events match this filter.
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
