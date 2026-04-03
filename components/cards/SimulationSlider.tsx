"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { InfoTip } from "@/components/shared/InfoTip"
import type { DecisionScenario } from "@/data/scenarios"

interface SimulationSliderProps {
  scenario: DecisionScenario
  onSimulate?: () => void
}

export function SimulationSlider({ scenario, onSimulate }: SimulationSliderProps) {
  const { simulationRange, outcomes } = scenario
  const [amount, setAmount] = useState(simulationRange.defaultAmount)
  const [hasSimulated, setHasSimulated] = useState(false)

  const bestResult = Math.round(amount * outcomes.bestCase.multiplier)
  const worstResult = Math.round(amount * outcomes.worstCase.multiplier)
  const bestGain = bestResult - amount
  const worstLoss = amount - worstResult
  const bestPct = (((bestResult - amount) / amount) * 100).toFixed(0)
  const worstPct = (((worstResult - amount) / amount) * 100).toFixed(0)

  const handleChange = useCallback(
    (values: number[]) => {
      setAmount(values[0])
      if (!hasSimulated) {
        setHasSimulated(true)
        onSimulate?.()
      }
    },
    [hasSimulated, onSimulate]
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-muted-foreground">
          If this had been real...
        </p>
        <InfoTip>
          This <strong className="text-foreground">simulation</strong> shows what could
          happen to your money based on the best and worst historical outcomes for this
          type of scenario. It&apos;s not a prediction. It&apos;s a way to feel the
          range of possibilities before risking anything real.
        </InfoTip>
      </div>

      {/* Amount display */}
      <div className="mt-4 flex items-baseline justify-center gap-1">
        <span className="text-sm text-muted-foreground">$</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={amount}
            className="font-heading text-4xl font-bold"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
          >
            {amount}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Slider */}
      <div className="mt-4 px-1">
        <Slider
          value={[amount]}
          onValueChange={handleChange}
          min={simulationRange.min}
          max={simulationRange.max}
          step={10}
          className="cursor-pointer"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>${simulationRange.min}</span>
          <span className="text-center">← drag to change amount →</span>
          <span>${simulationRange.max}</span>
        </div>
      </div>

      {/* Best / Worst case */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-success/10 p-4">
          <p className="text-xs font-medium text-success">Best case</p>
          <p className="mt-1 font-heading text-xl font-bold text-success">
            ${bestResult}
          </p>
          <p className="mt-0.5 text-xs text-success/80">
            +${bestGain} · +{bestPct}%
          </p>
        </div>
        <div className="rounded-xl bg-danger/10 p-4">
          <p className="text-xs font-medium text-danger">Worst case</p>
          <p className="mt-1 font-heading text-xl font-bold text-danger">
            ${worstResult}
          </p>
          <p className="mt-0.5 text-xs text-danger/80">
            -${worstLoss} · {worstPct}%
          </p>
        </div>
      </div>
    </div>
  )
}
