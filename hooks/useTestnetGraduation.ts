"use client"

import { useProgressStore } from "@/store/useProgressStore"
import { usePredictionStore } from "@/store/usePredictionStore"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"

const REQUIRED_CONFIDENCE = 50
const REQUIRED_LESSONS = 3
const REQUIRED_PREDICTIONS = 2

export interface GraduationMilestone {
  label: string
  current: number
  required: number
  completed: boolean
}

export function useTestnetGraduation() {
  const progress = useProgressStore((s) => s.progress)
  const wallet = useTestnetWalletStore((s) => s.wallet)

  const confidenceScore = progress?.confidenceScore ?? 0
  const lessonsCount = progress?.lessonsCompleted.length ?? 0
  const predictionsCount = usePredictionStore((s) => s.userPredictions).length

  const milestones: GraduationMilestone[] = [
    {
      label: "Confidence score",
      current: confidenceScore,
      required: REQUIRED_CONFIDENCE,
      completed: confidenceScore >= REQUIRED_CONFIDENCE,
    },
    {
      label: "Lessons completed",
      current: lessonsCount,
      required: REQUIRED_LESSONS,
      completed: lessonsCount >= REQUIRED_LESSONS,
    },
    {
      label: "Predictions made",
      current: predictionsCount,
      required: REQUIRED_PREDICTIONS,
      completed: predictionsCount >= REQUIRED_PREDICTIONS,
    },
  ]

  const isEligible = milestones.every((m) => m.completed)
  const hasWallet = wallet !== null

  return { isEligible, hasWallet, milestones }
}
