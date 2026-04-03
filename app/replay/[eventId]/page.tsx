"use client"

import { use, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner"
import { LearnChips } from "@/components/shared/LearnChips"
import { ReadyCTA } from "@/components/shared/ReadyCTA"
import { ReplayTimeline } from "@/components/replay/ReplayTimeline"
import { ReplayPriceChart } from "@/components/replay/ReplayPriceChart"
import { ReplayHeadlines } from "@/components/replay/ReplayHeadlines"
import { ReplayDecisionPanel } from "@/components/replay/ReplayDecisionPanel"
import { ReplayOutcomeReveal } from "@/components/replay/ReplayOutcomeReveal"
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

  // Build accumulated price data up to current phase
  const accumulatedPriceData = event
    ? event.phases
        .slice(0, currentPhaseIndex + 1)
        .flatMap((p) => p.priceData)
    : []

  const currentPhase = event?.phases[currentPhaseIndex]
  const hasDecisionPhase = currentPhase?.decisionOptions !== undefined
  const isLastPhase = event ? currentPhaseIndex >= event.phases.length - 1 : false
  const selectedOutcome = event?.outcomes.find((o) => o.decisionId === userDecision)
  const wasAlreadyCompleted = event ? isEventCompleted(event.id) : false

  // Time travel animation
  const handleBeginReplay = useCallback(() => {
    if (!event) return

    startReplay(event.id)

    // Animate date countdown
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
        setTimeout(() => setStage("phase"), 400)
      }
    }, 60)
  }, [event, startReplay])

  const handleAdvance = useCallback(() => {
    if (!event) return

    if (hasDecisionPhase && userDecision) {
      // Move to outcome
      revealOutcome()
      setStage("outcome")
    } else if (!isLastPhase) {
      advancePhase()
    }
  }, [event, hasDecisionPhase, userDecision, isLastPhase, advancePhase, revealOutcome])

  const handleDecision = useCallback(
    (decision: "buy" | "sell" | "hold" | "wait") => {
      makeDecision(decision)
    },
    [makeDecision]
  )

  const handleRevealComplete = useCallback(async () => {
    if (!profile) return
    await completeReplay(profile.id)
    if (!wasAlreadyCompleted) {
      await incrementReplaysCompleted()
    }
    await updateStreak()
  }, [profile, completeReplay, wasAlreadyCompleted, incrementReplaysCompleted, updateStreak])

  // Build learn chips from related lessons
  const learnChips = event
    ? event.relatedLessonIds
        .map((id) => {
          const lesson = getLessonById(id)
          if (!lesson) return null
          return { lessonId: lesson.id, emoji: lesson.emoji, label: lesson.title }
        })
        .filter(Boolean) as { lessonId: string; emoji: string; label: string }[]
    : []

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
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <AnimatePresence mode="wait">
          {/* INTRO STAGE */}
          {stage === "intro" && (
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

              {/* Time travel animation display */}
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
                  onClick={handleBeginReplay}
                  className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Begin Replay
                </Button>
              )}
            </motion.div>
          )}

          {/* PHASE STAGE */}
          {stage === "phase" && currentPhase && (
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

              <ReplayPriceChart
                priceData={accumulatedPriceData}
                animate
              />

              <ReplayHeadlines headlines={currentPhase.headlines} />

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm leading-relaxed text-foreground/85">
                  {currentPhase.context}
                </p>
              </div>

              {/* Decision panel (only in the decision phase) */}
              {hasDecisionPhase && currentPhase.decisionPrompt && currentPhase.decisionOptions && (
                <>
                  <Separator />
                  <ReplayDecisionPanel
                    prompt={currentPhase.decisionPrompt}
                    options={currentPhase.decisionOptions}
                    selected={userDecision}
                    onSelect={handleDecision}
                  />
                </>
              )}

              {/* Navigation buttons */}
              {hasDecisionPhase ? (
                userDecision && (
                  <Button
                    onClick={handleAdvance}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    See What Happened
                  </Button>
                )
              ) : !isLastPhase ? (
                <Button
                  onClick={() => advancePhase()}
                  className="h-12 w-full rounded-xl text-base font-semibold"
                >
                  Continue
                </Button>
              ) : null}
            </motion.div>
          )}

          {/* OUTCOME STAGE */}
          {stage === "outcome" && selectedOutcome && (
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

              <h2 className="font-heading text-xl font-bold">
                The Outcome
              </h2>

              <ReplayOutcomeReveal
                outcome={selectedOutcome}
                isRevealing={isRevealing}
                onRevealComplete={handleRevealComplete}
              />

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <Separator />

                  {/* What actually happened */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      What actually happened
                    </p>
                    <p className="text-sm leading-relaxed">
                      {event.whatActuallyHappened}
                    </p>
                  </div>

                  {/* Completion badge */}
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
                    <Check className="h-4 w-4" />
                    Replay complete! Confidence score updated!
                  </div>

                  {/* Related lessons */}
                  {learnChips.length > 0 && (
                    <LearnChips
                      chips={learnChips}
                      heading="Dig deeper"
                    />
                  )}

                  {/* Next replay CTA */}
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
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
