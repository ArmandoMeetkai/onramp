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
    const profiles = await db.profiles.toArray()
    set({
      profile: profiles[0] ?? null,
      isLoading: false,
    })
  },

  setProfile: async (profile) => {
    await db.profiles.put(profile)
    set({ profile })
  },

  updateProfile: async (updates) => {
    const current = get().profile
    if (!current) return
    const updated = { ...current, ...updates, lastActiveAt: new Date() }
    await db.profiles.put(updated)
    set({ profile: updated })
  },

  clearProfile: async () => {
    const current = get().profile
    if (current) {
      await db.profiles.delete(current.id)
    }
    set({ profile: null })
  },
}))
