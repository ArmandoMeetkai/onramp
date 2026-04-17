"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, TrendingUp, Target, ArrowRight, Lock } from "lucide-react"
import { type GraduationMilestone } from "@/hooks/useTestnetGraduation"

interface WalletGraduationGateProps {
  milestones: GraduationMilestone[]
}

const milestoneConfig: Record<string, { icon: typeof Target; href: string; linkLabel: string }> = {
  "Confidence score ≥ 50": { icon: Target, href: "/explore", linkLabel: "Keep exploring" },
  "Complete 3+ lessons": { icon: BookOpen, href: "/learn", linkLabel: "Take a lesson" },
  "Make 2+ predictions": { icon: TrendingUp, href: "/predictions", linkLabel: "Make a prediction" },
}

export function WalletGraduationGate({ milestones }: WalletGraduationGateProps) {
  const completedCount = milestones.filter((m) => m.completed).length
  const allComplete = completedCount === milestones.length
  // Weighted progress — matches GraduationProgressBar so the aggregate fill
  // reflects partial milestones instead of going 0 → full at each completion.
  const weightedProgress = milestones.reduce(
    (sum, m) => sum + Math.min(m.current / m.required, 1),
    0,
  ) / milestones.length

  return (
    <div className="py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          Unlock your crypto wallet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Complete these milestones to unlock your wallet. Get free tokens
          and use them for predictions on test blockchains (no real money).
        </p>
      </motion.div>

      {/* Progress overview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>
            {completedCount} of {milestones.length} completed
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <motion.div
            className={`h-full rounded-full ${allComplete ? "bg-primary" : "bg-accent"}`}
            initial={{ width: 0 }}
            animate={{ width: `${weightedProgress * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Milestone cards */}
      <div className="mt-6 space-y-3">
        {milestones.map((milestone, index) => {
          const config = milestoneConfig[milestone.label] ?? { icon: Target, href: "/", linkLabel: "Continue" }
          const Icon = config.icon
          const progress = Math.min(
            milestone.current / milestone.required,
            1,
          )

          return (
            <motion.div
              key={milestone.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    milestone.completed
                      ? "bg-primary/10"
                      : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      milestone.completed
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{milestone.label}</p>
                    <span
                      className={`text-xs font-medium ${
                        milestone.completed
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {milestone.completed
                        ? "Done"
                        : `${milestone.current}/${milestone.required}`}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        milestone.completed ? "bg-primary" : "bg-accent"
                      }`}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  {!milestone.completed && (
                    <Link
                      href={config.href}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      {config.linkLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-xl border border-border bg-muted/30 px-4 py-3"
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Why milestones?</strong> We want
          to make sure you understand the basics before using real blockchain
          tokens. These activities build the foundation you need. No rush.
        </p>
      </motion.div>
    </div>
  )
}
