"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReplayDecisionOption } from "@/data/replayEvents"

interface ReplayDecisionPanelProps {
  prompt: string
  options: ReplayDecisionOption[]
  selected: string | null
  onSelect: (id: "buy" | "sell" | "hold" | "wait") => void
}

export function ReplayDecisionPanel({
  prompt,
  options,
  selected,
  onSelect,
}: ReplayDecisionPanelProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
        <p className="text-sm font-semibold text-accent">Your Decision</p>
        <p className="mt-1 text-sm leading-relaxed">{prompt}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <AnimatePresence>
          {options.map((option) => {
            const isSelected = selected === option.id
            const isHidden = selected !== null && !isSelected

            return (
              <motion.button
                key={option.id}
                onClick={() => !selected && onSelect(option.id)}
                disabled={selected !== null}
                layout
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: isHidden ? 0.3 : 1,
                  scale: isSelected ? 1.03 : isHidden ? 0.97 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 text-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : selected
                      ? "border-border bg-card"
                      : "border-border bg-card hover:border-primary/30 active:scale-[0.97]"
                )}
              >
                <span className="text-2xl">{option.emoji}</span>
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {option.rationale}
                </p>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
