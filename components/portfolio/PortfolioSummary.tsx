"use client"

import { useProgressStore } from "@/store/useProgressStore"
import type { Transaction } from "@/lib/db"

interface PortfolioSummaryProps {
  transactions: Transaction[]
}

function getLearningMessage(txCount: number): string {
  if (txCount === 0) return "You haven't started yet. That's okay — there's no rush."
  if (txCount <= 3) return "You're getting comfortable with the basics."
  return "You're building confidence. Keep exploring!"
}

export function PortfolioSummary({ transactions }: PortfolioSummaryProps) {
  const progress = useProgressStore((s) => s.progress)

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Your Learning Summary
      </h2>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-heading text-xl font-bold">{progress?.cardsViewed ?? 0}</p>
            <p className="text-xs text-muted-foreground">Cards viewed</p>
          </div>
          <div>
            <p className="font-heading text-xl font-bold">{progress?.simulationsRun ?? 0}</p>
            <p className="text-xs text-muted-foreground">Simulations</p>
          </div>
          <div>
            <p className="font-heading text-xl font-bold">{transactions.length}</p>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed text-center">
          {getLearningMessage(transactions.length)}
        </p>
      </div>
    </div>
  )
}
