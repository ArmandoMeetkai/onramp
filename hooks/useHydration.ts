"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useReplayStore } from "@/store/useReplayStore"

export function useHydration() {
  const [isReady, setIsReady] = useState(false)
  const hydrateUser = useUserStore((s) => s.hydrate)

  useEffect(() => {
    async function hydrate() {
      await hydrateUser()
      const profile = useUserStore.getState().profile
      if (profile) {
        await Promise.all([
          useProgressStore.getState().hydrate(profile.id),
          usePortfolioStore.getState().hydrate(profile.id),
          useReplayStore.getState().hydrate(profile.id),
        ])
      }
      setIsReady(true)
    }
    hydrate()
  }, [hydrateUser])

  return isReady
}
