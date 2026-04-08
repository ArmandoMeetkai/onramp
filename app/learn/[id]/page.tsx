"use client"

import { use, useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, BookOpen, Clock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { PageTransition } from "@/components/layout/PageTransition"
import { getLessonById, lessons } from "@/data/lessons"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (navTimerRef.current) clearTimeout(navTimerRef.current)
    }
  }, [])

  const currentIndex = lessons.findIndex((l) => l.id === id)
  const nextLesson = lessons[currentIndex + 1] ?? null
  const lessonNumber = currentIndex + 1
  const totalLessons = lessons.length

  const navTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleComplete = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setJustCompleted(true)

    try {
      await completeLesson(id)
      await updateStreak()
      navTimerRef.current = setTimeout(() => router.push("/learn"), 1500)
    } catch {
      if (mountedRef.current) {
        setIsSubmitting(false)
        setJustCompleted(false)
      }
    }
  }, [id, completeLesson, updateStreak, router, isSubmitting, nextLesson])

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

  const paragraphs = lesson.content.split("\n\n")

  return (
    <PageTransition>
      <div className="py-4">
        <button
          onClick={() => window.history.length > 1 ? router.back() : router.push("/learn")}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 text-center"
        >
          <span className="text-5xl">{lesson.emoji}</span>
          <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight leading-tight">
            {lesson.title}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {lesson.duration}
            </span>
            <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px]">
              {lesson.difficulty === "beginner" ? "Beginner" : "Intermediate"}
            </Badge>
            <span>Lesson {lessonNumber} of {totalLessons}</span>
          </div>
          <div className="mt-4">
            <Progress value={(lessonNumber / totalLessons) * 100} className="h-1" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 space-y-5"
        >
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.8] text-foreground/85"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Key takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-primary">Key Takeaway</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{lesson.keyTakeaway}</p>
        </motion.div>

        {/* Related scenarios */}
        {relatedScenarios.length > 0 && (
          <>
            <Separator className="my-8" />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Try these scenarios
              </p>
              <div className="space-y-2">
                {relatedScenarios.map((scenario) =>
                  scenario ? (
                    <Link
                      key={scenario.id}
                      href={`/scenario/${scenario.id}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 active:scale-[0.98]"
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{scenario.title}</span>
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          </>
        )}

        {/* Completion area */}
        <div className="mt-8 space-y-3">
          {justCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center rounded-2xl bg-success/10 p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                <Check className="h-6 w-6 text-success" />
              </div>
              <p className="mt-3 font-semibold text-success">Lesson complete!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Great job! You are building real understanding.
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
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {isSubmitting ? "Completing..." : "Mark as Complete"}
            </Button>
          )}

          {/* Next lesson navigation */}
          {nextLesson ? (
            <Link
              href={`/learn/${nextLesson.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30 active:scale-[0.98]"
            >
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Next lesson
                </p>
                <p className="text-sm font-semibold">
                  {nextLesson.emoji} {nextLesson.title}
                </p>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            </Link>
          ) : (
            <Link
              href="/learn"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:border-primary/30"
            >
              <Check className="h-4 w-4 text-success" />
              All lessons done! Back to list
            </Link>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
