"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"

export function GraduationProgressBar() {
  const { isEligible, hasWallet, milestones } = useTestnetGraduation()

  // Graduation requires 3 learning milestones + wallet creation — count as 4 steps
  // so the bar stays honest: 100% only when the user is actually Live, not just eligible.
  const milestonesProgress = milestones.reduce(
    (sum, m) => sum + Math.min(m.current / m.required, 1),
    0,
  )
  const walletProgress = hasWallet ? 1 : 0
  const percentage = ((milestonesProgress + walletProgress) / (milestones.length + 1)) * 100
  const isFullyGraduated = isEligible && hasWallet

  return (
    <Link
      href="/wallet"
      aria-label={`Graduation progress: ${Math.round(percentage)}%. View milestones.`}
      className="group block w-full"
    >
      {/* Expanded hit area (8px) wrapping a visually slim bar (1px). */}
      <div className="w-full py-[3px]">
        <div
          className="h-[1px] w-full bg-muted transition-[height] duration-150 group-hover:h-[2px]"
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className={cn("h-full", isFullyGraduated ? "bg-primary" : "bg-accent")}
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
      </div>
    </Link>
  )
}
