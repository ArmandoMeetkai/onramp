"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const WALKTHROUGH_HUB_KEY = "onramp-predictions-hub-seen"
export const WALKTHROUGH_FORM_KEY = "onramp-predictions-form-seen"

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface TourStep {
  label: string
  title: string
  description: string
  targetId?: string          // DOM element to spotlight
  tooltipSide?: "above" | "below" | "auto"
}

interface TargetRect {
  left: number
  top: number
  width: number
  height: number
}

const PADDING = 10
const NAV_HEIGHT = 80

// ─── SpotlightTour (shared engine) ────────────────────────────────────────────

interface SpotlightTourProps {
  steps: TourStep[]
  onComplete: () => void
  storageKey: string
  devMode?: boolean
}

export function SpotlightTour({ steps, onComplete, storageKey, devMode = true }: SpotlightTourProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)

  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  // Measure target element after scrolling it into view
  const measureTarget = useCallback((id: string | undefined) => {
    if (!id) {
      setTargetRect(null)
      return
    }
    const el = document.getElementById(id)
    if (!el) {
      setTargetRect(null)
      return
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    // Wait for scroll to settle before measuring
    setTimeout(() => {
      const r = el.getBoundingClientRect()
      setTargetRect({ left: r.left, top: r.top, width: r.width, height: r.height })
    }, 450)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) measureTarget(step.targetId)
  }, [isVisible, step.targetId, measureTarget])

  function goNext() {
    if (!isLast) {
      setTargetRect(null)
      setStepIndex((s) => s + 1)
    } else {
      dismiss()
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setTargetRect(null)
      setStepIndex((s) => s - 1)
    }
  }

  function dismiss() {
    setIsVisible(false)
    if (!devMode) localStorage.setItem(storageKey, "1")
    setTimeout(onComplete, 300)
  }

  // Decide tooltip position
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800
  const spotlightBottom = targetRect ? targetRect.top + targetRect.height + PADDING : 0
  const spaceBelow = windowHeight - spotlightBottom - NAV_HEIGHT
  const spaceAbove = targetRect ? targetRect.top - PADDING : 0

  const wantedSide = step.tooltipSide ?? "auto"
  const side = wantedSide === "auto"
    ? spaceBelow >= 180 ? "below" : "above"
    : wantedSide

  const tooltipTop = targetRect
    ? side === "below"
      ? spotlightBottom + 12
      : spaceAbove - 180 - 12
    : undefined

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* SVG overlay with cutout */}
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-0 z-50 h-full w-full"
            onClick={dismiss}
            style={{ pointerEvents: "all" }}
          >
            <defs>
              <mask id={`tour-mask-${stepIndex}`}>
                <rect width="100%" height="100%" fill="white" />
                {targetRect && (
                  <rect
                    x={targetRect.left - PADDING}
                    y={targetRect.top - PADDING}
                    width={targetRect.width + PADDING * 2}
                    height={targetRect.height + PADDING * 2}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            {/* Dark overlay with cutout */}
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.72)"
              mask={`url(#tour-mask-${stepIndex})`}
            />
            {/* Highlight ring */}
            {targetRect && (
              <rect
                x={targetRect.left - PADDING}
                y={targetRect.top - PADDING}
                width={targetRect.width + PADDING * 2}
                height={targetRect.height + PADDING * 2}
                rx="12"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2"
              />
            )}
          </motion.svg>

          {/* Tooltip card */}
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: targetRect ? (side === "below" ? 10 : -10) : 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-x-4 z-51 mx-auto max-w-[420px] rounded-2xl border border-border bg-card p-5 shadow-xl"
            style={
              targetRect && tooltipTop !== undefined
                ? { top: Math.max(8, tooltipTop) }
                : { bottom: NAV_HEIGHT + 12 }
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Skip */}
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Skip guide"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Step label */}
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground pr-6">
              {step.label}
            </p>

            <p className="mt-2 text-base font-bold tracking-tight leading-snug">{step.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>

            {/* Progress bar */}
            <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Navigation */}
            <div className="mt-3 flex items-center justify-between">
              {stepIndex === 0 ? (
                <button
                  onClick={dismiss}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Skip intro
                </button>
              ) : (
                <button
                  onClick={goBack}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  ← Back
                </button>
              )}
              <Button onClick={goNext} size="sm" className="rounded-xl px-5 font-semibold">
                {isLast ? "Got it!" : (
                  <span className="flex items-center gap-1.5">
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Hub walkthrough (4 steps, shown on predictions list page) ────────────────

const HUB_STEPS: TourStep[] = [
  {
    label: "1 of 4 · Welcome",
    title: "What are Predictions?",
    description:
      "Each market asks one question about crypto. You pick YES or NO and stake some of your practice portfolio. If you're right, you earn more crypto. If not, you lose what you staked.",
  },
  {
    label: "2 of 4 · Your balance",
    title: "Your practice balance",
    description:
      "This number is the total value of your practice portfolio in USD. You use those coins to make predictions — never real money.",
    targetId: "pred-balance",
    tooltipSide: "below",
  },
  {
    label: "3 of 4 · Filters",
    title: "Filter by coin or status",
    description:
      "Use these filters to show only BTC, ETH, or SOL markets. You can also switch between active markets and already resolved ones.",
    targetId: "pred-filters",
    tooltipSide: "below",
  },
  {
    label: "4 of 4 · The cards",
    title: "Tap a card to predict",
    description:
      "The green/red bar shows the current odds (YES vs NO). When you open a market, I'll walk you through the prediction form step by step. Tap any card to continue!",
    targetId: "pred-first-card",
    tooltipSide: "above",
  },
]

interface PredictionWalkthroughProps {
  onComplete: () => void
}

export function PredictionWalkthrough({ onComplete }: PredictionWalkthroughProps) {
  return (
    <SpotlightTour
      steps={HUB_STEPS}
      onComplete={onComplete}
      storageKey={WALKTHROUGH_HUB_KEY}
      devMode={true}
    />
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useShouldShowWalkthrough(_hasPredictions: boolean): boolean {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    // DEV: always show — for prod restore:
    // const seen = localStorage.getItem(WALKTHROUGH_HUB_KEY)
    // if (!seen && !_hasPredictions) setShow(true)
    setShow(true)
  }, [])
  return show
}

export function useShouldShowFormWalkthrough(): boolean {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    // DEV: always show — for prod restore:
    // const seen = localStorage.getItem(WALKTHROUGH_FORM_KEY)
    // if (!seen) setShow(true)
    setShow(true)
  }, [])
  return show
}
