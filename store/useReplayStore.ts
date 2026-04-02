import { create } from "zustand"
import { db, type CompletedReplayEntry } from "@/lib/db"

interface ReplayState {
  activeEventId: string | null
  currentPhaseIndex: number
  userDecision: "buy" | "sell" | "hold" | "wait" | null
  isRevealing: boolean
  isComplete: boolean
  completedReplays: CompletedReplayEntry[]

  startReplay: (eventId: string) => void
  advancePhase: () => void
  makeDecision: (decision: "buy" | "sell" | "hold" | "wait") => void
  revealOutcome: () => void
  completeReplay: (userId: string) => Promise<void>
  resetReplay: () => void
  hydrate: (userId: string) => Promise<void>
  isEventCompleted: (eventId: string) => boolean
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  activeEventId: null,
  currentPhaseIndex: 0,
  userDecision: null,
  isRevealing: false,
  isComplete: false,
  completedReplays: [],

  startReplay: (eventId) => {
    set({
      activeEventId: eventId,
      currentPhaseIndex: 0,
      userDecision: null,
      isRevealing: false,
      isComplete: false,
    })
  },

  advancePhase: () => {
    set((state) => ({
      currentPhaseIndex: state.currentPhaseIndex + 1,
    }))
  },

  makeDecision: (decision) => {
    set({ userDecision: decision })
  },

  revealOutcome: () => {
    set({ isRevealing: true })
  },

  completeReplay: async (userId) => {
    const { activeEventId, userDecision, completedReplays } = get()
    if (!activeEventId || !userDecision) return

    const entry: CompletedReplayEntry = {
      id: `${userId}-${activeEventId}`,
      userId,
      eventId: activeEventId,
      decision: userDecision,
      completedAt: new Date(),
    }

    await db.completedReplays.put(entry)

    const alreadyCompleted = completedReplays.some(
      (r) => r.eventId === activeEventId
    )

    set({
      isComplete: true,
      isRevealing: false,
      completedReplays: alreadyCompleted
        ? completedReplays.map((r) =>
            r.eventId === activeEventId ? entry : r
          )
        : [...completedReplays, entry],
    })
  },

  resetReplay: () => {
    set({
      activeEventId: null,
      currentPhaseIndex: 0,
      userDecision: null,
      isRevealing: false,
      isComplete: false,
    })
  },

  hydrate: async (userId) => {
    const entries = await db.completedReplays
      .where("userId")
      .equals(userId)
      .toArray()
    set({ completedReplays: entries })
  },

  isEventCompleted: (eventId) => {
    return get().completedReplays.some((r) => r.eventId === eventId)
  },
}))
