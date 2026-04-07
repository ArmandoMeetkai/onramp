"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ReplayTimeline } from "./ReplayTimeline"
import { ReplayPriceChart } from "./ReplayPriceChart"
import { ReplayHeadlines } from "./ReplayHeadlines"
import { ReplayDecisionPanel } from "./ReplayDecisionPanel"
import type { ReplayEvent } from "@/data/replayEvents"

interface ReplayPhaseStageProps {
  event: ReplayEvent
  currentPhaseIndex: number
  accumulatedPriceData: number[]
  userDecision: "buy" | "sell" | "hold" | "wait" | null
  onDecision: (decision: "buy" | "sell" | "hold" | "wait") => void
  onAdvance: () => void
  onAdvancePhase: () => void
}

export function ReplayPhaseStage({
  event,
  currentPhaseIndex,
  accumulatedPriceData,
  userDecision,
  onDecision,
  onAdvance,
  onAdvancePhase,
}: ReplayPhaseStageProps) {
  const currentPhase = event.phases[currentPhaseIndex]
  const hasDecisionPhase = currentPhase?.decisionOptions !== undefined
  const isLastPhase = currentPhaseIndex >= event.phases.length - 1

  if (!currentPhase) return null

  return (
    <motion.div
      key={`phase-${currentPhaseIndex}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <ReplayTimeline
        phases={event.phases.map((p) => ({ id: p.id, label: p.label }))}
        currentIndex={currentPhaseIndex}
      />

      <div>
        <h2 className="font-heading text-xl font-bold">
          {currentPhase.label}
        </h2>
        <p className="text-xs text-muted-foreground">
          {new Date(currentPhase.dateRange.start).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          {" to "}
          {new Date(currentPhase.dateRange.end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <ReplayPriceChart priceData={accumulatedPriceData} animate />

      <ReplayHeadlines headlines={currentPhase.headlines} />

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm leading-relaxed text-foreground/85">
          {currentPhase.context}
        </p>
      </div>

      {hasDecisionPhase && currentPhase.decisionPrompt && currentPhase.decisionOptions && (
        <>
          <Separator />
          <ReplayDecisionPanel
            prompt={currentPhase.decisionPrompt}
            options={currentPhase.decisionOptions}
            selected={userDecision}
            onSelect={onDecision}
          />
        </>
      )}

      {hasDecisionPhase ? (
        userDecision && (
          <Button
            onClick={onAdvance}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            See What Happened
          </Button>
        )
      ) : !isLastPhase ? (
        <Button
          onClick={onAdvancePhase}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          Continue
        </Button>
      ) : null}
    </motion.div>
  )
}
