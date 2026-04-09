"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useReplayStore } from "@/store/useReplayStore"
import { usePredictionStore } from "@/store/usePredictionStore"

export function useHydration() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hydrateUser = useUserStore((s) => s.hydrate)

  useEffect(() => {
    async function hydrate() {
      try {
        await hydrateUser()
        const profile = useUserStore.getState().profile
        if (profile) {
          await Promise.all([
            useProgressStore.getState().hydrate(profile.id),
            usePortfolioStore.getState().hydrate(profile.id),
            useReplayStore.getState().hydrate(profile.id),
            usePredictionStore.getState().hydrate(profile.id),
          ])
        }
      } catch {
        setError("Unable to load your data. Storage may be unavailable.")
      } finally {
        setIsReady(true)
      }
    }
    hydrate()
  }, [hydrateUser])

  return { isReady, error }
}
