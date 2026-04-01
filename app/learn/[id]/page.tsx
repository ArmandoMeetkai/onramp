"use client"

import { use, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { getLessonById } from "@/data/lessons"
import { getScenarioById } from "@/data/scenarios"
import { useProgressStore } from "@/store/useProgressStore"

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const lesson = getLessonById(id)
  const progress = useProgressStore((s) => s.progress)
  const completeLesson = useProgressStore((s) => s.completeLesson)
  const updateStreak = useProgressStore((s) => s.updateStreak)

  const isCompleted = progress?.lessonsCompleted.includes(id) ?? false
  const [justCompleted, setJustCompleted] = useState(false)

  const handleComplete = useCallback(async () => {
    await completeLesson(id)
    await updateStreak()
    setJustCompleted(true)
    setTimeout(() => router.push("/learn"), 1500)
  }, [id, completeLesson, updateStreak, router])

  if (!lesson) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">Lesson not found</p>
          <button
            onClick={() => router.push("/learn")}
            className="mt-4 text-sm font-medium text-primary"
          >
            Back to Learn
          </button>
        </div>
      </PageTransition>
    )
  }

  const relatedScenarios = lesson.relatedScenarios
    .map(getScenarioById)
    .filter(Boolean)

  return (
    <PageTransition>
      <div className="py-4">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-3xl">{lesson.emoji}</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-md text-xs">
              {lesson.duration}
            </Badge>
            <Badge variant="secondary" className="rounded-md text-xs">
              {lesson.difficulty === "beginner" ? "Beginner" : "Intermediate"}
            </Badge>
          </div>
        </div>

        <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight leading-tight">
          {lesson.title}
        </h1>

        <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-foreground/90">
          {lesson.content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-secondary p-5">
          <p className="text-sm font-semibold text-primary">Key Takeaway</p>
          <p className="mt-1.5 text-sm leading-relaxed">{lesson.keyTakeaway}</p>
        </div>

        {relatedScenarios.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <p className="mb-3 text-sm font-semibold text-muted-foreground">
                Related Scenarios
              </p>
              <div className="space-y-2">
                {relatedScenarios.map((scenario) =>
                  scenario ? (
                    <Link
                      key={scenario.id}
                      href={`/scenario/${scenario.id}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30"
                    >
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{scenario.title}</span>
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          </>
        )}

        <div className="mt-8">
          {justCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center rounded-2xl bg-success/10 p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                <Check className="h-6 w-6 text-success" />
              </div>
              <p className="mt-3 font-semibold text-success">
                Lesson complete!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Great job — you are building real understanding.
              </p>
            </motion.div>
          ) : isCompleted ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-success" />
              Already completed
            </div>
          ) : (
            <Button
              onClick={handleComplete}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              Mark as Complete
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
