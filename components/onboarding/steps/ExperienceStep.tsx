"use client"

import { cn } from "@/lib/utils"
import type { UserProfile } from "@/lib/db"

type ExperienceLevel = UserProfile["experienceLevel"]

const options: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: "new", label: "Completely new", description: "I've heard of crypto but never tried it" },
  { value: "curious", label: "A little curious", description: "I've read some articles and watched videos" },
  { value: "cautious", label: "Cautious but interested", description: "I've thought about it but haven't taken the leap" },
  { value: "active", label: "Somewhat active", description: "I've bought or used crypto before" },
]

interface ExperienceStepProps {
  selected: ExperienceLevel | null
  onSelect: (level: ExperienceLevel) => void
  onNext: () => void
  onBack: () => void
}

export function ExperienceStep({ selected, onSelect, onNext, onBack }: ExperienceStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        How familiar are you with crypto?
      </h1>
      <p className="mt-2 text-muted-foreground">No wrong answers here</p>
      <div className="mt-6 w-full space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "w-full rounded-2xl border-2 p-4 text-left transition-all duration-200",
              selected === option.value
                ? "border-primary bg-secondary"
                : "border-border bg-card hover:border-primary/30"
            )}
          >
            <p className="font-semibold">{option.label}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{option.description}</p>
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
