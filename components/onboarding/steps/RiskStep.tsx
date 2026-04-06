"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/lib/db"

type RiskStyle = UserProfile["riskStyle"]

const options: { value: RiskStyle; label: string; description: string; emoji: string }[] = [
  { value: "conservative", label: "Play it safe", description: "I'd rather be safe. Small steps.", emoji: "🛡️" },
  { value: "moderate", label: "Open to some risk", description: "I'm okay with risk if I understand it.", emoji: "⚖️" },
  { value: "aggressive", label: "Comfortable with uncertainty", description: "I learn by doing, even if things are unpredictable.", emoji: "🚀" },
]

interface RiskStepProps {
  selected: RiskStyle | null
  onSelect: (style: RiskStyle) => void
  onNext: () => void
  onBack: () => void
}

export function RiskStep({ selected, onSelect, onNext, onBack }: RiskStepProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && selected) {
        onNext()
      } else if (e.key === "Backspace") {
        e.preventDefault()
        onBack()
      } else {
        const num = Number(e.key)
        if (num >= 1 && num <= options.length) {
          onSelect(options[num - 1].value)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selected, onNext, onBack, onSelect])

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        How do you feel about risk?
      </h1>
      <p className="mt-2 text-muted-foreground">This helps us tailor your experience</p>
      <div className="mt-6 w-full space-y-3" role="radiogroup" aria-label="Risk style">
        {options.map((option) => (
          <button
            key={option.value}
            role="radio"
            aria-checked={selected === option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "w-full rounded-2xl border-2 p-4 text-left transition-all duration-200",
              selected === option.value
                ? "border-primary bg-secondary"
                : "border-border bg-card hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{option.emoji}</span>
              <div>
                <p className="font-semibold">{option.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 flex w-full gap-3">
        <button
          onClick={onBack}
          className="h-12 flex-1 rounded-xl text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className={cn(
            "h-12 flex-1 rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-opacity",
            !selected && "opacity-40"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
