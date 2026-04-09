"use client"

import { SpotlightTour, WALKTHROUGH_FORM_KEY } from "./PredictionWalkthrough"
import type { TourStep } from "./PredictionWalkthrough"

const FORM_STEPS: TourStep[] = [
  {
    label: "1 of 3 · Choose your coin",
    title: "Which coin do you want to predict with?",
    description:
      "Select BTC, ETH, or SOL based on what you hold in your portfolio. The number below each coin is your balance in USD. You can only use coins you already own.",
    targetId: "pred-coin-selector",
    tooltipSide: "below",
  },
  {
    label: "2 of 3 · YES or NO",
    title: "Your prediction",
    description:
      "Read the market question at the top. Tap YES if you think it will happen, or NO if you think it won't. No in-between, just your best call.",
    targetId: "pred-yes-no",
    tooltipSide: "above",
  },
  {
    label: "3 of 3 · Amount",
    title: "How much are you risking?",
    description:
      "Choose how much to stake in USD. If you're right, you get that amount back in crypto plus a bonus from people who got it wrong. If you're wrong, you lose what you staked.",
    targetId: "pred-amount",
    tooltipSide: "above",
  },
]

interface PredictionFormWalkthroughProps {
  onComplete: () => void
}

export function PredictionFormWalkthrough({ onComplete }: PredictionFormWalkthroughProps) {
  return (
    <SpotlightTour
      steps={FORM_STEPS}
      onComplete={onComplete}
      storageKey={WALKTHROUGH_FORM_KEY}
    />
  )
}
