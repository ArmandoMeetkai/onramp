"use client"

import Link from "next/link"
import { Compass, BarChart3, MessageCircle, Clock, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { ConfidenceScore } from "@/components/shared/ConfidenceScore"
import { StreakBadge } from "@/components/shared/StreakBadge"
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner"

function getGreeting(name: string): string {
  const hour = new Date().getHours()
  const timeGreeting =
    hour >= 5 && hour < 12 ? "Good morning" :
    hour >= 12 && hour < 17 ? "Good afternoon" :
    "Good evening"
  return `${timeGreeting}, ${name}`
}

function getSubgreeting(): string {
  const messages = [
    "Ready to learn something new?",
    "Take your time — there's no rush.",
    "Every small step builds confidence.",
    "Curiosity is your superpower.",
  ]
  const index = new Date().getDate() % messages.length
  return messages[index]
}

const quickActions = [
  {
    href: "/explore",
    icon: Compass,
    title: "Explore scenarios",
    description: "See real questions about crypto",
  },
  {
    href: "/practice",
    icon: BarChart3,
    title: "Practice trading",
    description: "Try buying and selling with fake money",
  },
  {
    href: "/replay",
    icon: Clock,
    title: "Time travel",
    description: "Relive real crypto events and decide",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    title: "Ask a question",
    description: "Chat with your learning assistant",
  },
] as const

export function HomeContent() {
  const profile = useUserStore((s) => s.profile)
  const progress = useProgressStore((s) => s.progress)

  if (!profile) return null

  return (
    <motion.div
      className="py-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="font-heading text-3xl font-bold tracking-tight leading-tight">
        {getGreeting(profile.name)}
      </h1>
      <p className="mt-2 text-base text-muted-foreground leading-relaxed">
        {getSubgreeting()}
      </p>

      <div className="mt-10 flex flex-col items-center">
        <ConfidenceScore score={progress?.confidenceScore ?? 0} />
      </div>

      <div className="mt-8">
        <StreakBadge streakDays={progress?.streakDays ?? 0} />
      </div>

      <div className="mt-10 space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Quick actions
        </h2>
        {quickActions.map(({ href, icon: Icon, title, description }, index) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
          >
            <Link
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold leading-snug">{title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </Link>
          </motion.div>
        ))}
      </div>

      <DisclaimerBanner />
    </motion.div>
  )
}
