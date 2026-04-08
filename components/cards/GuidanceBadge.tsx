"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/lib/db"

type RiskStyle = UserProfile["riskStyle"]

interface GuidanceBadgeProps {
  guidance: {
    conservative: string
    moderate: string
    aggressive: string
  }
  userRiskStyle: RiskStyle
}

const riskOptions: { value: RiskStyle; label: string }[] = [
  { value: "conservative", label: "Conservative" },
  { value: "moderate", label: "Moderate" },
  { value: "aggressive", label: "Aggressive" },
]

export function GuidanceBadge({ guidance, userRiskStyle }: GuidanceBadgeProps) {
  const [selected, setSelected] = useState<RiskStyle>(userRiskStyle)

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-muted-foreground">
        What would you do?
      </p>
      <div className="flex gap-2" role="radiogroup" aria-label="Risk style">
        {riskOptions.map(({ value, label }) => (
          <button
            key={value}
            role="radio"
            aria-checked={selected === value}
            onClick={() => setSelected(value)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              selected === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-3 rounded-xl bg-card border border-border p-4"
        >
          <p className="text-sm leading-relaxed text-foreground">
            {guidance[selected]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
