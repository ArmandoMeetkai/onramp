"use client"

import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Lesson } from "@/data/lessons"

interface LessonCardProps {
  lesson: Lesson
  isCompleted: boolean
  isNext: boolean
  lessonNumber: number
}

export function LessonCard({ lesson, isCompleted, isNext, lessonNumber }: LessonCardProps) {
  return (
    <Link
      href={`/learn/${lesson.id}`}
      className={cn(
        "flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition-all duration-200 hover:border-primary/30 active:scale-[0.98]",
        isNext && !isCompleted ? "border-primary/40 shadow-sm" : "border-border"
      )}
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {isCompleted ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/15">
            <Check className="h-5 w-5 text-success" />
          </div>
        ) : (
          lesson.emoji
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground">{lessonNumber}.</span>
          <p className={cn(
            "font-semibold leading-snug truncate",
            isCompleted && "text-muted-foreground"
          )}>
            {lesson.title}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
          <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px]">
            {lesson.difficulty === "beginner" ? "Beginner" : "Intermediate"}
          </Badge>
          {isNext && !isCompleted && (
            <Badge className="rounded-md px-1.5 py-0 text-[10px]">Up next</Badge>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </Link>
  )
}
