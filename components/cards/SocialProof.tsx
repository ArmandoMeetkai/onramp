"use client"

import { Users } from "lucide-react"

interface SocialProofProps {
  usersWhoSimulated: number
  avgDecision: string
  communityNote: string
}

export function SocialProof({ usersWhoSimulated, avgDecision, communityNote }: SocialProofProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>
          <strong className="text-foreground">{usersWhoSimulated.toLocaleString()}</strong> people explored this scenario
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Most chose: <strong className="text-foreground capitalize">{avgDecision}</strong>
      </p>
      <p className="mt-3 border-l-2 border-primary/30 pl-3 text-sm italic text-muted-foreground leading-relaxed">
        &ldquo;{communityNote}&rdquo;
      </p>
    </div>
  )
}
