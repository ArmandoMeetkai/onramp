"use client"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ReadyStepProps {
  name: string
  experienceLevel: string
  riskStyle: string
  onComplete: () => void
  onBack: () => void
}

const experienceLabels: Record<string, string> = {
  new: "Completely new",
  curious: "A little curious",
  cautious: "Cautious but interested",
  active: "Somewhat active",
}

const riskLabels: Record<string, string> = {
  conservative: "Play it safe",
  moderate: "Open to some risk",
  aggressive: "Comfortable with uncertainty",
}

export function ReadyStep({ name, experienceLevel, riskStyle, onComplete, onBack }: ReadyStepProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onComplete()
      } else if (e.key === "Backspace") {
        onBack()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onComplete, onBack])

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 text-4xl">✨</div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        You&apos;re all set, {name}!
      </h1>
      <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
        Let&apos;s start exploring crypto together.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-sm">
          {experienceLabels[experienceLevel]}
        </Badge>
        <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-sm">
          {riskLabels[riskStyle]}
        </Badge>
      </div>
      <div className="mt-8 flex w-full flex-col gap-3">
        <Button
          onClick={onComplete}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          Start Exploring
        </Button>
        <button
          onClick={onBack}
          className="h-10 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Go back
        </button>
      </div>
    </div>
  )
}
