"use client"

import { SpotlightTour, WALKTHROUGH_NO_HOLDINGS_KEY } from "./PredictionWalkthrough"
import type { TourStep } from "./PredictionWalkthrough"

const NO_HOLDINGS_STEPS: TourStep[] = [
  {
    label: "1 of 2 · How it works",
    title: "What is a prediction?",
    description:
      "Each market asks one yes/no question about crypto. You stake some of your own crypto on your answer. If you're right, you get your stake back plus a bonus. If you're wrong, you lose what you staked.",
  },
  {
    label: "2 of 2 · First step",
    title: "You need crypto to stake",
    description:
      "Before you can predict, you need a bit of BTC, ETH, or SOL in your wallet. Tap this card to get some — it's free in practice mode. Come back and the form will unlock.",
    targetId: "pred-get-started-cta",
    tooltipSide: "above",
  },
]

interface PredictionNoHoldingsWalkthroughProps {
  onComplete: () => void
}

export function PredictionNoHoldingsWalkthrough({ onComplete }: PredictionNoHoldingsWalkthroughProps) {
  return (
    <SpotlightTour
      steps={NO_HOLDINGS_STEPS}
      onComplete={onComplete}
      storageKey={WALKTHROUGH_NO_HOLDINGS_KEY}
    />
  )
}
