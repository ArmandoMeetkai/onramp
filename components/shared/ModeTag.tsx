"use client"

import { cn } from "@/lib/utils"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"

export type Mode = "training" | "ready" | "live"

interface ModeTagProps {
  /** Override the derived mode. Useful for static previews. */
  mode?: Mode
  size?: "xs" | "sm"
  showDot?: boolean
  className?: string
}

const copy: Record<Mode, string> = {
  training: "Practice",
  ready: "Ready",
  live: "Live · testnet",
}

export function ModeTag({ mode, size = "xs", showDot = true, className }: ModeTagProps) {
  const { isEligible, hasWallet } = useTestnetGraduation()
  const derived: Mode = mode ?? (isEligible && hasWallet ? "live" : isEligible ? "ready" : "training")

  const isTraining = derived === "training"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-semibold uppercase tracking-wide leading-none",
        size === "xs" ? "text-[10px]" : "text-[11px]",
        isTraining ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary",
        className,
      )}
    >
      {showDot && (
        <span className={cn("h-1 w-1 rounded-full", isTraining ? "bg-accent" : "bg-primary")} />
      )}
      {copy[derived]}
    </span>
  )
}
