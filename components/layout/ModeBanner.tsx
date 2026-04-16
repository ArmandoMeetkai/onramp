"use client"

import { useState } from "react"
import { X, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"
import { cn } from "@/lib/utils"

export function ModeBanner() {
  const { isEligible, hasWallet } = useTestnetGraduation()
  const isTestnet = isEligible && hasWallet
  const readyToGraduate = isEligible && !hasWallet
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  // In "ready" state the banner uses the primary (green) palette and links to /wallet
  const isPrimaryPalette = isTestnet || readyToGraduate

  const message = isTestnet
    ? "Live — predicting on real blockchain (testnet tokens)"
    : readyToGraduate
      ? "You're ready — unlock your testnet wallet to go Live"
      : "Training — simulate before you go live"

  const content = (
    <div className="mx-auto flex max-w-[480px] items-center justify-between px-4 py-1.5">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-1.5 w-1.5 rounded-full",
          isPrimaryPalette ? "bg-primary animate-pulse" : "bg-accent",
        )} />
        <p className={cn(
          "text-[11px] font-medium",
          isPrimaryPalette ? "text-primary" : "text-accent",
        )}>
          {message}
        </p>
        {readyToGraduate && <ArrowRight className="h-3 w-3 text-primary" />}
      </div>
      <button
        onClick={(e) => { e.preventDefault(); setDismissed(true) }}
        className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "border-b",
          isPrimaryPalette ? "bg-primary/10 border-primary/20" : "bg-accent/10 border-accent/20",
        )}
      >
        {readyToGraduate ? (
          <Link href="/wallet" className="block transition-colors hover:bg-primary/5">
            {content}
          </Link>
        ) : (
          content
        )}
      </motion.div>
    </AnimatePresence>
  )
}
