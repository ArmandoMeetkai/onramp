import { create } from "zustand"
import { db, type UserProfile } from "@/lib/db"

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  hydrate: () => Promise<void>
  setProfile: (profile: UserProfile) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  clearProfile: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: true,

  hydrate: async () => {
    try {
      const profiles = await db.profiles.toArray()
      set({ profile: profiles[0] ?? null, isLoading: false })
    } catch {
      set({ profile: null, isLoading: false })
      throw new Error("Failed to hydrate user profile")
    }
  },

  setProfile: async (profile) => {
    set({ profile })
    try {
      await db.profiles.put(profile)
    } catch {
      console.error("Failed to persist user profile")
    }
  },

  updateProfile: async (updates) => {
    const current = get().profile
    if (!current) return
    const updated = { ...current, ...updates, lastActiveAt: new Date() }
    set({ profile: updated })
    try {
      await db.profiles.put(updated)
    } catch {
      console.error("Failed to persist profile update")
    }
  },

  clearProfile: async () => {
    const current = get().profile
    set({ profile: null })
    if (current) {
      try {
        await db.profiles.delete(current.id)
      } catch {
        console.error("Failed to delete profile from storage")
      }
    }
  },
}))
