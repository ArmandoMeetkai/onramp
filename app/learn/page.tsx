"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { PageTransition } from "@/components/layout/PageTransition"
import { LessonCard } from "@/components/learn/LessonCard"
import { lessons } from "@/data/lessons"
import { useProgressStore } from "@/store/useProgressStore"

export default function LearnPage() {
  const progress = useProgressStore((s) => s.progress)
  const completedIds = progress?.lessonsCompleted ?? []
  const completedCount = completedIds.length
  const totalCount = lessons.length
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const nextLessonId = lessons.find((l) => !completedIds.includes(l.id))?.id ?? null

  return (
    <PageTransition>
      <div className="py-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Learn at Your Pace
        </h1>
        <p className="mt-1 text-muted-foreground">
          Short lessons that make crypto make sense
        </p>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {completedCount === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Pick your first lesson. Each one takes about 2 minutes.
          </p>
        )}

        <div className="mt-5 space-y-3">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <LessonCard
                lesson={lesson}
                isCompleted={completedIds.includes(lesson.id)}
                isNext={lesson.id === nextLessonId}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
