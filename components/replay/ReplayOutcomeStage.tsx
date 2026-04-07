"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Clock, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner"
import { LearnChips } from "@/components/shared/LearnChips"
import { ReadyCTA } from "@/components/shared/ReadyCTA"
import { ReplayTimeline } from "./ReplayTimeline"
import { ReplayOutcomeReveal } from "./ReplayOutcomeReveal"
import type { ReplayEvent, ReplayOutcome } from "@/data/replayEvents"

interface ReplayOutcomeStageProps {
  event: ReplayEvent
  outcome: ReplayOutcome
  isRevealing: boolean
  isComplete: boolean
  learnChips: { lessonId: string; emoji: string; label: string }[]
  onRevealComplete: () => void
}

export function ReplayOutcomeStage({
  event,
  outcome,
  isRevealing,
  isComplete,
  learnChips,
  onRevealComplete,
}: ReplayOutcomeStageProps) {
  return (
    <motion.div
      key="outcome"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <ReplayTimeline
        phases={event.phases.map((p) => ({ id: p.id, label: p.label }))}
        currentIndex={event.phases.length}
      />

      <h2 className="font-heading text-xl font-bold">The Outcome</h2>

      <ReplayOutcomeReveal
        outcome={outcome}
        isRevealing={isRevealing}
        onRevealComplete={onRevealComplete}
      />

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Separator />

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              What actually happened
            </p>
            <p className="text-sm leading-relaxed">
              {event.whatActuallyHappened}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
            <Check className="h-4 w-4" />
            Replay complete! Confidence score updated!
          </div>

          {learnChips.length > 0 && (
            <LearnChips chips={learnChips} heading="Dig deeper" />
          )}

          <ReadyCTA
            headline="Feel ready? Take the next step"
            subtext="When you're ready to invest for real"
            variant="subtle"
          />

          <Link
            href="/replay"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:border-primary/30"
          >
            <Clock className="h-4 w-4 text-primary" />
            Try another replay
          </Link>

          <DisclaimerBanner />
        </motion.div>
      )}
    </motion.div>
  )
}
