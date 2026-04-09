"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PredictionOddsBarProps {
  yesPercent: number
  noPercent: number
  userPosition?: "yes" | "no" | null
  size?: "sm" | "lg"
}

export function PredictionOddsBar({
  yesPercent,
  noPercent,
  userPosition,
  size = "sm",
}: PredictionOddsBarProps) {
  const isLarge = size === "lg"

  return (
    <div className="w-full">
      <div className={cn("flex w-full overflow-hidden rounded-full", isLarge ? "h-6" : "h-3")}>
        <motion.div
          className={cn(
            "bg-success",
            userPosition === "yes" && "ring-2 ring-success ring-offset-1 ring-offset-card"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${yesPercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className={cn(
            "bg-danger",
            userPosition === "no" && "ring-2 ring-danger ring-offset-1 ring-offset-card"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${noPercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      {isLarge && (
        <div className="mt-2 flex justify-between text-sm font-medium">
          <span className="text-success">YES {yesPercent}%</span>
          <span className="text-danger">NO {noPercent}%</span>
        </div>
      )}
    </div>
  )
}
