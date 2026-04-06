"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface OnboardingStepProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
}

export function OnboardingStep({ children, currentStep, totalSteps }: OnboardingStepProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div
        className="mb-8 flex gap-2"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 w-8 rounded-full transition-colors duration-300",
              i <= currentStep ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
