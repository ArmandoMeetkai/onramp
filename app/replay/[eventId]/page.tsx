"use client"

import { use, useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { PageTransition } from "@/components/layout/PageTransition"
import { ReplayIntroStage } from "@/components/replay/ReplayIntroStage"
import { ReplayPhaseStage } from "@/components/replay/ReplayPhaseStage"
import { ReplayOutcomeStage } from "@/components/replay/ReplayOutcomeStage"
import { getReplayEventById } from "@/data/replayEvents"
import { getLessonById } from "@/data/lessons"
import { useReplayStore } from "@/store/useReplayStore"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"

type Stage = "intro" | "phase" | "outcome"

export default function ReplayDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = use(params)
  const router = useRouter()
  const event = getReplayEventById(eventId)
  const profile = useUserStore((s) => s.profile)
  const incrementReplaysCompleted = useProgressStore((s) => s.incrementReplaysCompleted)
  const updateStreak = useProgressStore((s) => s.updateStreak)

  const startReplay = useReplayStore((s) => s.startReplay)
  const advancePhase = useReplayStore((s) => s.advancePhase)
  const makeDecision = useReplayStore((s) => s.makeDecision)
  const revealOutcome = useReplayStore((s) => s.revealOutcome)
  const completeReplay = useReplayStore((s) => s.completeReplay)
  const currentPhaseIndex = useReplayStore((s) => s.currentPhaseIndex)
  const userDecision = useReplayStore((s) => s.userDecision)
  const isRevealing = useReplayStore((s) => s.isRevealing)
  const isComplete = useReplayStore((s) => s.isComplete)
  const isEventCompleted = useReplayStore((s) => s.isEventCompleted)

  const [stage, setStage] = useState<Stage>("intro")
  const [timeTravelDate, setTimeTravelDate] = useState<string | null>(null)
  const timersRef = useRef<{ interval?: ReturnType<typeof setInterval>; timeout?: ReturnType<typeof setTimeout> }>({})

  const accumulatedPriceData = event
    ? event.phases.slice(0, currentPhaseIndex + 1).flatMap((p) => p.priceData)
    : []

  const selectedOutcome = event?.outcomes.find((o) => o.decisionId === userDecision)
  const wasAlreadyCompleted = event ? isEventCompleted(event.id) : false

  const learnChips = event
    ? event.relatedLessonIds
        .map((id) => {
          const lesson = getLessonById(id)
          if (!lesson) return null
          return { lessonId: lesson.id, emoji: lesson.emoji, label: lesson.title }
        })
        .filter(Boolean) as { lessonId: string; emoji: string; label: string }[]
    : []

  const handleBeginReplay = useCallback(() => {
    if (!event) return
    startReplay(event.id)

    const targetDate = new Date(event.phases[0].dateRange.start)
    const now = new Date()
    const steps = 20
    let step = 0

    const interval = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 2)
      const interpolated = new Date(
        now.getTime() - (now.getTime() - targetDate.getTime()) * eased
      )
      setTimeTravelDate(
        interpolated.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      )

      if (step >= steps) {
        clearInterval(interval)
        timersRef.current.timeout = setTimeout(() => setStage("phase"), 400)
      }
    }, 60)
    timersRef.current.interval = interval
  }, [event, startReplay])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      clearInterval(timers.interval)
      clearTimeout(timers.timeout)
    }
  }, [])

  const handleAdvance = useCallback(() => {
    if (!event) return
    const currentPhase = event.phases[currentPhaseIndex]
    const hasDecision = currentPhase?.decisionOptions !== undefined

    if (hasDecision && userDecision) {
      revealOutcome()
      setStage("outcome")
    } else if (currentPhaseIndex < event.phases.length - 1) {
      advancePhase()
    }
  }, [event, currentPhaseIndex, userDecision, advancePhase, revealOutcome])

  const handleRevealComplete = useCallback(async () => {
    if (!profile) return
    await completeReplay(profile.id)
    if (!wasAlreadyCompleted) {
      await incrementReplaysCompleted()
    }
    await updateStreak()
  }, [profile, completeReplay, wasAlreadyCompleted, incrementReplaysCompleted, updateStreak])

  if (!event) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">Event not found</p>
          <button
            onClick={() => router.push("/replay")}
            className="mt-4 text-sm font-medium text-primary"
          >
            Back to Time Travel
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="py-4">
        <button
          onClick={() => window.history.length > 1 ? router.back() : router.push("/replay")}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <ReplayIntroStage
              event={event}
              timeTravelDate={timeTravelDate}
              onBegin={handleBeginReplay}
            />
          )}

          {stage === "phase" && (
            <ReplayPhaseStage
              event={event}
              currentPhaseIndex={currentPhaseIndex}
              accumulatedPriceData={accumulatedPriceData}
              userDecision={userDecision}
              onDecision={makeDecision}
              onAdvance={handleAdvance}
              onAdvancePhase={advancePhase}
            />
          )}

          {stage === "outcome" && selectedOutcome && (
            <ReplayOutcomeStage
              event={event}
              outcome={selectedOutcome}
              isRevealing={isRevealing}
              isComplete={isComplete}
              learnChips={learnChips}
              onRevealComplete={handleRevealComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
