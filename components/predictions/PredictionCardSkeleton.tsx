"use client"

export function PredictionCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="h-3 w-full rounded-full bg-muted" />
    </div>
  )
}
