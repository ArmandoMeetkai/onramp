"use client"

import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReadyCTA } from "@/components/shared/ReadyCTA"
import { PageTransition } from "@/components/layout/PageTransition"
import { ConfidenceScore } from "@/components/shared/ConfidenceScore"
import { StreakBadge } from "@/components/shared/StreakBadge"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"

const experienceLabels: Record<string, string> = {
  new: "Completely new",
  curious: "A little curious",
  cautious: "Cautious but interested",
  active: "Somewhat active",
}

const riskLabels: Record<string, string> = {
  conservative: "Conservative",
  moderate: "Moderate",
  aggressive: "Aggressive",
}

export default function ProfilePage() {
  const profile = useUserStore((s) => s.profile)
  const progress = useProgressStore((s) => s.progress)

  if (!profile) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">No profile found</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {profile.name}
            </h1>
            <div className="mt-1 flex gap-2">
              <Badge variant="secondary" className="rounded-md text-xs">
                {experienceLabels[profile.experienceLevel]}
              </Badge>
              <Badge variant="secondary" className="rounded-md text-xs">
                {riskLabels[profile.riskStyle]}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center">
          <ConfidenceScore score={progress?.confidenceScore ?? 0} />
        </div>

        <div className="mt-6">
          <StreakBadge streakDays={progress?.streakDays ?? 0} />
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your Activity
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <p className="font-heading text-2xl font-bold">{progress?.cardsViewed ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">Scenarios explored</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <p className="font-heading text-2xl font-bold">{progress?.simulationsRun ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">Simulations run</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <p className="font-heading text-2xl font-bold">{progress?.lessonsCompleted.length ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">Lessons completed</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <p className="font-heading text-2xl font-bold">{progress?.replaysCompleted ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">Replays completed</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <p className="font-heading text-2xl font-bold">{progress?.explanationsOpened ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">Explanations read</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <ReadyCTA
          headline="When you're ready"
          subtext="Take the next step toward real investing"
          variant="subtle"
        />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Member since {new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </PageTransition>
  )
}
