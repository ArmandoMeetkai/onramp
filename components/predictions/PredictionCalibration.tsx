"use client"

import { motion } from "framer-motion"
import { usePredictionStore } from "@/store/usePredictionStore"
import { cn } from "@/lib/utils"

function brierLabel(score: number): { label: string; color: string } {
  if (score <= 0.1) return { label: "Excellent", color: "text-success" }
  if (score <= 0.2) return { label: "Good", color: "text-accent" }
  if (score <= 0.3) return { label: "Average", color: "text-foreground" }
  return { label: "Needs work", color: "text-danger" }
}

export function PredictionCalibration() {
  const getCalibrationData = usePredictionStore((s) => s.getCalibrationData)
  const { buckets, brierScore } = getCalibrationData()

  if (buckets.length === 0) return null

  const brier = brierLabel(brierScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold">Calibration</p>
          <p className="text-xs text-muted-foreground">
            How well your confidence matches reality
          </p>
        </div>
        <div className="text-right" title={`Brier score: ${brierScore.toFixed(3)}`}>
          <p className={cn("text-sm font-bold", brier.color)}>
            {brier.label}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {buckets.map((bucket) => {
          const expectedRate = bucket.midpoint / 100
          const actualRate = bucket.rate
          const isCalibrated = Math.abs(actualRate - expectedRate) <= 0.15

          return (
            <div key={bucket.label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">
                  When you pick <span className="font-semibold text-foreground">{bucket.label}</span> odds
                </p>
                <p className="text-xs">
                  <span className={cn("font-semibold", isCalibrated ? "text-success" : "text-accent")}>
                    {Math.round(actualRate * 100)}%
                  </span>
                  <span className="text-muted-foreground"> hit</span>
                  <span className="text-muted-foreground/50 ml-1">({bucket.correct}/{bucket.total})</span>
                </p>
              </div>
              {/* Bar visualization */}
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                {/* Expected marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-muted-foreground/30 z-10"
                  style={{ left: `${expectedRate * 100}%` }}
                />
                {/* Actual bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${actualRate * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    isCalibrated ? "bg-success/60" : "bg-accent/60"
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-xl bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
        Perfect calibration means your confidence matches your hit rate.
        The thin line shows where you <em>should</em> be; the bar shows where you <em>are</em>.
        {brierScore <= 0.2
          ? " You're doing well -- keep it up."
          : " More predictions will sharpen your calibration."
        }
      </div>
    </motion.div>
  )
}
