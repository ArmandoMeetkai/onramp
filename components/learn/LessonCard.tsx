"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Lesson } from "@/data/lessons"

interface LessonCardProps {
  lesson: Lesson
  isCompleted: boolean
  isNext: boolean
}

export function LessonCard({ lesson, isCompleted, isNext }: LessonCardProps) {
  return (
    <Link
      href={`/learn/${lesson.id}`}
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all duration-200 hover:border-primary/30 active:scale-[0.98]",
        isNext ? "border-primary/40 shadow-sm" : "border-border",
        isCompleted && "opacity-80"
      )}
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {lesson.emoji}
        {isCompleted && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className={cn("font-semibold leading-snug", isCompleted && "line-through decoration-muted-foreground/40")}>
          {lesson.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
          <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px]">
            {lesson.difficulty === "beginner" ? "Beginner" : "Intermediate"}
          </Badge>
        </div>
      </div>
      {isNext && !isCompleted && (
        <Badge className="shrink-0 rounded-md text-[10px]">Next</Badge>
      )}
    </Link>
  )
}
