"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
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

        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {completedCount === 0
                    ? "Start learning"
                    : completedCount === totalCount
                      ? "All done!"
                      : `${completedCount} of ${totalCount} completed`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedCount === 0
                    ? "Pick your first lesson. Each takes about 2 minutes"
                    : completedCount === totalCount
                      ? "You've completed every lesson. Amazing!"
                      : `${totalCount - completedCount} lessons remaining`}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="mt-3 h-1.5" />
        </motion.div>

        {/* Lesson list */}
        <div className="mt-6 space-y-2.5">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + index * 0.03 }}
            >
              <LessonCard
                lesson={lesson}
                isCompleted={completedIds.includes(lesson.id)}
                isNext={lesson.id === nextLessonId}
                lessonNumber={index + 1}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
