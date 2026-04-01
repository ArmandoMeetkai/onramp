"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WelcomeStepProps {
  name: string
  onNameChange: (name: string) => void
  onNext: () => void
}

export function WelcomeStep({ name, onNameChange, onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 text-4xl">👋</div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Welcome to Onramp
      </h1>
      <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
        A safe place to explore crypto at your own pace.
      </p>
      <div className="mt-8 w-full space-y-4">
        <Input
          placeholder="What should we call you?"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim().length >= 2) onNext()
          }}
          className="h-12 rounded-xl text-center text-lg"
          autoFocus
        />
        <Button
          onClick={onNext}
          disabled={name.trim().length < 2}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
