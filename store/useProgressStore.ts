import { create } from "zustand"
import { db, type UserProgress } from "@/lib/db"

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0]
}

function getYesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split("T")[0]
}

function calculateConfidence(progress: UserProgress): number {
  const score =
    progress.cardsViewed * 2 +
    progress.simulationsRun * 3 +
    progress.explanationsOpened * 2 +
    progress.lessonsCompleted.length * 5 +
    (progress.replaysCompleted ?? 0) * 4
  return Math.min(100, score)
}

interface ProgressState {
  progress: UserProgress | null
  hydrate: (userId: string) => Promise<void>
  initializeProgress: (userId: string) => Promise<void>
  incrementCardsViewed: () => Promise<void>
  incrementSimulationsRun: () => Promise<void>
  incrementExplanationsOpened: () => Promise<void>
  completeLesson: (lessonId: string) => Promise<void>
  incrementReplaysCompleted: () => Promise<void>
  updateStreak: () => Promise<void>
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,

  hydrate: async (userId) => {
    try {
      const progress = await db.progress.get(userId)
      set({ progress: progress ?? null })
    } catch {
      set({ progress: null })
    }
  },

  initializeProgress: async (userId) => {
    try {
      const existing = await db.progress.get(userId)
      if (existing) {
        set({ progress: existing })
        return
      }
    } catch {
      // continue to create default
    }
    const progress: UserProgress = {
      userId,
      cardsViewed: 0,
      simulationsRun: 0,
      explanationsOpened: 0,
      replaysCompleted: 0,
      streakDays: 0,
      lastStreakDate: "",
      confidenceScore: 0,
      lessonsCompleted: [],
    }
    set({ progress })
    try {
      await db.progress.put(progress)
    } catch {
      console.error("Failed to persist initial progress")
    }
  },

  incrementCardsViewed: async () => {
    const current = get().progress
    if (!current) return
    const updated = {
      ...current,
      cardsViewed: current.cardsViewed + 1,
    }
    updated.confidenceScore = calculateConfidence(updated)
    set({ progress: updated })
    try {
      await db.progress.put(updated)
    } catch {
      console.error("Failed to persist progress update")
    }
  },

  incrementSimulationsRun: async () => {
    const current = get().progress
    if (!current) return
    const updated = {
      ...current,
      simulationsRun: current.simulationsRun + 1,
    }
    updated.confidenceScore = calculateConfidence(updated)
    set({ progress: updated })
    try {
      await db.progress.put(updated)
    } catch {
      console.error("Failed to persist progress update")
    }
  },

  incrementExplanationsOpened: async () => {
    const current = get().progress
    if (!current) return
    const updated = {
      ...current,
      explanationsOpened: current.explanationsOpened + 1,
    }
    updated.confidenceScore = calculateConfidence(updated)
    set({ progress: updated })
    try {
      await db.progress.put(updated)
    } catch {
      console.error("Failed to persist progress update")
    }
  },

  completeLesson: async (lessonId) => {
    const current = get().progress
    if (!current) return
    if (current.lessonsCompleted.includes(lessonId)) return
    const updated = {
      ...current,
      lessonsCompleted: [...current.lessonsCompleted, lessonId],
    }
    updated.confidenceScore = calculateConfidence(updated)
    set({ progress: updated })
    try {
      await db.progress.put(updated)
    } catch {
      console.error("Failed to persist lesson completion")
    }
  },

  incrementReplaysCompleted: async () => {
    const current = get().progress
    if (!current) return
    const updated = {
      ...current,
      replaysCompleted: (current.replaysCompleted ?? 0) + 1,
    }
    updated.confidenceScore = calculateConfidence(updated)
    set({ progress: updated })
    try {
      await db.progress.put(updated)
    } catch {
      console.error("Failed to persist progress update")
    }
  },

  updateStreak: async () => {
    const current = get().progress
    if (!current) return
    const today = getTodayISO()
    if (current.lastStreakDate === today) return

    const yesterday = getYesterdayISO()
    const streakDays =
      current.lastStreakDate === yesterday
        ? current.streakDays + 1
        : 1

    const updated = { ...current, streakDays, lastStreakDate: today }
    set({ progress: updated })
    try {
      await db.progress.put(updated)
    } catch {
      console.error("Failed to persist streak update")
    }
  },
}))
