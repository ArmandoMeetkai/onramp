"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"

export function ModeBanner() {
  const { isEligible, hasWallet } = useTestnetGraduation()
  const isTestnet = isEligible && hasWallet
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={isTestnet
          ? "bg-primary/10 border-b border-primary/20"
          : "bg-accent/10 border-b border-accent/20"
        }
      >
        <div className="mx-auto flex max-w-[480px] items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isTestnet ? "bg-primary animate-pulse" : "bg-accent"}`} />
            <p className={`text-[11px] font-medium ${isTestnet ? "text-primary" : "text-accent"}`}>
              {isTestnet
                ? "Testnet Mode — trading with real blockchain tokens"
                : "Practice Mode — using simulated balance"
              }
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
