"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { events } from "@/lib/analytics"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { ReadyHero } from "@/components/ready/ReadyHero"
import { ConfidenceScore } from "@/components/shared/ConfidenceScore"
import { useProgressStore } from "@/store/useProgressStore"

const WAITLIST_KEY = "onramp-waitlist-email"

export default function ReadyPage() {
  const router = useRouter()
  const progress = useProgressStore((s) => s.progress)

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(WAITLIST_KEY)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = email.trim()
      if (!trimmed || isSubmitting) return

      setIsSubmitting(true)
      try {
        await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed }),
        })
        localStorage.setItem(WAITLIST_KEY, trimmed)
        setIsSubmitted(true)
        events.waitlistJoined()
      } catch {
        // Fallback to localStorage only
        localStorage.setItem(WAITLIST_KEY, trimmed)
        setIsSubmitted(true)
      } finally {
        setIsSubmitting(false)
      }
    },
    [email, isSubmitting]
  )

  const confidenceScore = progress?.confidenceScore ?? 0
  const replaysCompleted = progress?.replaysCompleted ?? 0
  const lessonsCompleted = progress?.lessonsCompleted.length ?? 0

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

        {/* Hero illustration */}
        <ReadyHero />

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Ready to make it real?
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
            We&apos;re building a way for you to invest for real, with the same
            calm, safe experience. Be the first to know.
          </p>
        </motion.div>

        {/* User's progress — proof they're ready */}
        {confidenceScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8"
          >
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Your progress so far
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-[200px]">
                <ConfidenceScore score={confidenceScore} />
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-6 text-center">
              <div>
                <p className="font-heading text-lg font-bold">{lessonsCompleted}</p>
                <p className="text-[11px] text-muted-foreground">Lessons</p>
              </div>
              <div>
                <p className="font-heading text-lg font-bold">{replaysCompleted}</p>
                <p className="text-[11px] text-muted-foreground">Replays</p>
              </div>
            </div>
          </motion.div>
        )}

        <Separator className="my-8" />

        {/* Waitlist form or success state */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {isSubmitted ? (
            <div className="flex flex-col items-center rounded-2xl bg-success/10 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20"
              >
                <Check className="h-6 w-6 text-success" />
              </motion.div>
              <p className="mt-3 font-semibold text-success">
                You&apos;re on the list!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll reach out when it&apos;s time.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Join the waitlist</p>
              </div>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl text-center text-base"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="h-12 w-full rounded-xl text-base font-semibold"
              >
                {isSubmitting ? "Joining..." : "Join the Waitlist"}
              </Button>
            </form>
          )}
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
          No financial advice. No pressure. Just the next step when you&apos;re ready.
        </p>
      </div>
    </PageTransition>
  )
}
