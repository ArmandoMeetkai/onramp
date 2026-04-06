"use client"

import { motion } from "framer-motion"

interface ConfidenceScoreProps {
  score: number
}

function getLabel(score: number): string {
  if (score <= 20) return "Just starting"
  if (score <= 40) return "Getting curious"
  if (score <= 60) return "Building knowledge"
  if (score <= 80) return "Growing confident"
  return "Ready to explore"
}

function getEncouragement(score: number): string {
  if (score === 0) return "Explore a scenario or complete a lesson to get started"
  if (score <= 20) return "You're taking your first steps. That's what matters"
  if (score <= 40) return "Keep going, you're building a solid foundation"
  if (score <= 60) return "You're making great progress"
  if (score <= 80) return "You're well on your way to understanding crypto"
  return "You've built a strong understanding"
}

export function ConfidenceScore({ score }: ConfidenceScoreProps) {
  const circumference = 2 * Math.PI * 44
  const progress = (score / 100) * circumference
  const label = getLabel(score)
  const encouragement = getEncouragement(score)

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 w-full">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100" role="img" aria-label={`Confidence score: ${score} out of 100`}>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-border"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-heading text-3xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
            of 100
          </span>
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-primary">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{encouragement}</p>
      </div>
    </div>
  )
}
