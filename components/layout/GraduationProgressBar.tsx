"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"

export function GraduationProgressBar() {
  const { isEligible, hasWallet, milestones } = useTestnetGraduation()

  const weightedProgress = milestones.reduce(
    (sum, m) => sum + Math.min(m.current / m.required, 1),
    0
  ) / milestones.length

  const percentage = weightedProgress * 100
  const isFullyGraduated = isEligible && hasWallet

  return (
    <div
      className="h-1 w-full bg-muted"
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Graduation progress"
    >
      <motion.div
        className={cn("h-full", isEligible ? "bg-primary" : "bg-accent")}
        initial={{ width: 0 }}
        animate={{
          width: `${percentage}%`,
          ...(isFullyGraduated && { opacity: [1, 0.6, 1] }),
        }}
        transition={{
          width: { duration: 0.6, ease: "easeOut" },
          ...(isFullyGraduated && {
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }),
        }}
      />
    </div>
  )
}
