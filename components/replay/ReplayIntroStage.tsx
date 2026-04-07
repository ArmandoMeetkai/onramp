"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ReplayEvent } from "@/data/replayEvents"

interface ReplayIntroStageProps {
  event: ReplayEvent
  timeTravelDate: string | null
  onBegin: () => void
}

export function ReplayIntroStage({ event, timeTravelDate, onBegin }: ReplayIntroStageProps) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <span className="text-5xl">{event.coverEmoji}</span>
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight leading-tight">
          {event.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {event.subtitle}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Badge variant="secondary" className="rounded-md text-xs">
            {event.asset}
          </Badge>
          <Badge variant="secondary" className="rounded-md text-xs">
            {event.difficulty === "beginner" ? "Beginner" : "Intermediate"}
          </Badge>
          <Badge variant="secondary" className="rounded-md text-xs">
            {event.category === "crash" ? "Crash" : event.category === "milestone" ? "Milestone" : "Event"}
          </Badge>
        </div>
      </div>

      <div className="mt-6 text-sm leading-relaxed text-foreground/85">
        <p>{event.briefSummary}</p>
      </div>

      <div className="mt-4 rounded-xl bg-accent/10 px-3 py-2">
        <p className="text-center text-xs font-medium text-accent">
          This is a real historical event. You will see real prices and headlines.
        </p>
      </div>

      {timeTravelDate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 flex flex-col items-center"
        >
          <Clock className="h-6 w-6 text-primary animate-spin" />
          <p className="mt-2 font-heading text-lg font-bold text-primary">
            {timeTravelDate}
          </p>
          <p className="text-xs text-muted-foreground">Traveling back in time...</p>
        </motion.div>
      )}

      {!timeTravelDate && (
        <Button
          onClick={onBegin}
          className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
        >
          <Clock className="mr-2 h-5 w-5" />
          Begin Replay
        </Button>
      )}
    </motion.div>
  )
}
