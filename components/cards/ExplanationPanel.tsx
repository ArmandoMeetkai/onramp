"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, TrendingUp, TrendingDown, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExplanationPanelProps {
  whyUp: string
  whyDown: string
  whatToWatch: string
  onOpen?: () => void
}

export function ExplanationPanel({ whyUp, whyDown, whatToWatch, onOpen }: ExplanationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    if (!isOpen) {
      onOpen?.()
    }
    setIsOpen((v) => !v)
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="font-semibold">Explain this simply</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-5 px-5 pb-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Why it might go up</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {whyUp}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10">
                  <TrendingDown className="h-4 w-4 text-danger" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Why it might go down</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {whyDown}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-info/10">
                  <Eye className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-sm font-semibold">What to watch for</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {whatToWatch}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
