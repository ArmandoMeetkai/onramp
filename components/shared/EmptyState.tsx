"use client"

import type { ReactNode } from "react"

interface EmptyStateProps {
  emoji?: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
      {emoji && <p className="text-3xl mb-3">{emoji}</p>}
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
