"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReplayPriceChart } from "./ReplayPriceChart"
import type { ReplayOutcome } from "@/data/replayEvents"

interface ReplayOutcomeRevealProps {
  outcome: ReplayOutcome
  isRevealing: boolean
  onRevealComplete: () => void
}

function AnimatedMultiplier({ target }: { target: number }) {
  const [current, setCurrent] = useState(100)
  const final = Math.round(target * 100)

  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    const start = 100

    function tick() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(start + (final - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [final])

  const isPositive = current >= 100

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">$100 became</p>
      <p
        className={cn(
          "font-heading text-5xl font-bold tracking-tight",
          isPositive ? "text-success" : "text-danger"
        )}
      >
        ${current}
      </p>
      <p
        className={cn(
          "text-sm font-medium",
          isPositive ? "text-success" : "text-danger"
        )}
      >
        {isPositive ? "+" : ""}{final - 100}%
      </p>
    </div>
  )
}

export function ReplayOutcomeReveal({
  outcome,
  isRevealing,
  onRevealComplete,
}: ReplayOutcomeRevealProps) {
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => {
        setShowResult(true)
        onRevealComplete()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isRevealing, onRevealComplete])

  if (isRevealing && !showResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
        <p className="mt-4 text-sm font-semibold text-muted-foreground animate-pulse">
          Revealing what happened...
        </p>
      </motion.div>
    )
  }

  if (!showResult) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="space-y-5"
    >
      {/* Multiplier */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <AnimatedMultiplier target={outcome.multiplier} />
      </div>

      {/* Post-decision chart */}
      {outcome.priceDataAfter.length > 1 && (
        <ReplayPriceChart
          priceData={outcome.priceDataAfter}
          animate
          label="What happened after your decision"
        />
      )}

      {/* Result description */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm leading-relaxed">{outcome.resultDescription}</p>
      </div>

      {/* Lessons learned */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-primary">Lessons Learned</p>
        </div>
        <ul className="space-y-2">
          {outcome.lessonsLearned.map((lesson, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {lesson}
            </li>
          ))}
        </ul>
      </div>

      {/* Expert note */}
      <div className="rounded-2xl bg-muted/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          What experts did
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {outcome.expertNote}
        </p>
      </div>
    </motion.div>
  )
}
