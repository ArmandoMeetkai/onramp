"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Target, Trophy, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const WALKTHROUGH_KEY = "onramp-predictions-intro-seen"

interface WalkthroughStep {
  icon: React.ElementType
  title: string
  description: string
  accent: string
}

const steps: WalkthroughStep[] = [
  {
    icon: DollarSign,
    title: "Predict with your crypto",
    description:
      "Use the BTC, ETH, or SOL you already hold. If you believe in it, put it on the line.",
    accent: "bg-accent/15 text-accent",
  },
  {
    icon: Target,
    title: "Simple YES or NO",
    description:
      "Each market asks one question about what happens next in crypto. No complex options, no jargon. Just your call.",
    accent: "bg-primary/15 text-primary",
  },
  {
    icon: Trophy,
    title: "Win more crypto",
    description:
      "If you\u2019re right, you get your crypto back plus a bonus. Go against the crowd for a bigger reward.",
    accent: "bg-success/15 text-success",
  },
]

interface PredictionWalkthroughProps {
  onComplete: () => void
}

export function PredictionWalkthrough({ onComplete }: PredictionWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      handleDismiss()
    }
  }

  function handleDismiss() {
    setIsVisible(false)
    localStorage.setItem(WALKTHROUGH_KEY, "1")
    setTimeout(onComplete, 300)
  }

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const StepIcon = step.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+80px)] z-50 mx-auto max-w-[420px] rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            {/* Skip */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Skip walkthrough"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.accent}`}>
                  <StepIcon className="h-7 w-7" />
                </div>
                <p className="mt-4 text-lg font-bold tracking-tight">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots + action */}
            <div className="mt-6 flex items-center justify-between">
              {/* Step dots */}
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "w-6 bg-primary"
                        : i < currentStep
                          ? "w-1.5 bg-primary/40"
                          : "w-1.5 bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              {/* Action button */}
              <Button
                onClick={handleNext}
                size="sm"
                className="rounded-xl px-5 font-semibold"
              >
                {isLastStep ? (
                  "Let\u2019s go"
                ) : (
                  <span className="flex items-center gap-1.5">
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
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

export function useShouldShowWalkthrough(hasPredictions: boolean): boolean {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const seen = localStorage.getItem(WALKTHROUGH_KEY)
    if (!seen && !hasPredictions) {
      setShow(true)
    }
  }, [hasPredictions])

  return show
}
