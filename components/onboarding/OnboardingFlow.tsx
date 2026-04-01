"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { UserProfile } from "@/lib/db"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { OnboardingStep } from "./OnboardingStep"
import { WelcomeStep } from "./steps/WelcomeStep"
import { ExperienceStep } from "./steps/ExperienceStep"
import { RiskStep } from "./steps/RiskStep"
import { ReadyStep } from "./steps/ReadyStep"

const TOTAL_STEPS = 4

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [name, setName] = useState("")
  const [experienceLevel, setExperienceLevel] = useState<UserProfile["experienceLevel"] | null>(null)
  const [riskStyle, setRiskStyle] = useState<UserProfile["riskStyle"] | null>(null)

  const setProfile = useUserStore((s) => s.setProfile)
  const initializeProgress = useProgressStore((s) => s.initializeProgress)
  const initializePortfolio = usePortfolioStore((s) => s.initializePortfolio)

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }, [])

  const goBack = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const handleComplete = useCallback(async () => {
    if (!experienceLevel || !riskStyle) return

    const id = crypto.randomUUID()
    const profile: UserProfile = {
      id,
      name: name.trim(),
      experienceLevel,
      riskStyle,
      createdAt: new Date(),
      lastActiveAt: new Date(),
    }

    await setProfile(profile)
    await Promise.all([
      initializeProgress(id),
      initializePortfolio(id),
    ])
  }, [name, experienceLevel, riskStyle, setProfile, initializeProgress, initializePortfolio])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <OnboardingStep currentStep={step} totalSteps={TOTAL_STEPS}>
            {step === 0 && (
              <WelcomeStep name={name} onNameChange={setName} onNext={goNext} />
            )}
            {step === 1 && (
              <ExperienceStep
                selected={experienceLevel}
                onSelect={setExperienceLevel}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 2 && (
              <RiskStep
                selected={riskStyle}
                onSelect={setRiskStyle}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && experienceLevel && riskStyle && (
              <ReadyStep
                name={name.trim()}
                experienceLevel={experienceLevel}
                riskStyle={riskStyle}
                onComplete={handleComplete}
                onBack={goBack}
              />
            )}
          </OnboardingStep>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
