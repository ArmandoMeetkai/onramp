"use client"

import Link from "next/link"

interface LearnChip {
  lessonId: string
  emoji: string
  label: string
}

interface LearnChipsProps {
  chips: LearnChip[]
  heading?: string
}

/**
 * Horizontal scrollable strip of quick-learn chips.
 * Each chip links to a lesson in the /learn section.
 */
export function LearnChips({ chips, heading = "Learn the basics" }: LearnChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {heading}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {chips.map((chip) => (
          <Link
            key={chip.lessonId}
            href={`/learn/${chip.lessonId}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
          >
            <span>{chip.emoji}</span>
            <span>{chip.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
