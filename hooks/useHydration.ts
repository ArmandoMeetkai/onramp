"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useReplayStore } from "@/store/useReplayStore"
import { usePredictionStore } from "@/store/usePredictionStore"
import { usePredictionWalletStore } from "@/store/usePredictionWalletStore"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { formatCrypto } from "@/lib/utils"

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
            usePredictionWalletStore.getState().hydrate(profile.id),
            useTestnetWalletStore.getState().hydrate(profile.id),
          ])

          // Initialize prediction wallet if it doesn't exist yet
          if (!usePredictionWalletStore.getState().wallet) {
            await usePredictionWalletStore.getState().initializeWallet(profile.id)
          }

          // Apply any faucet drops left behind by /faucet on a prior visit so
          // the user sees their balance regardless of which page they land on.
          const drops = await useTestnetWalletStore.getState().processFaucetPending()
          if (drops > 0) {
            toast.success(`${drops} faucet drop${drops === 1 ? "" : "s"} received!`)
          }

          // Resolve any prediction markets whose date has passed.
          // Must run after hydrate so userPredictions are loaded.
          const resolved = await usePredictionStore.getState().checkPriceResolutions(profile.id)
          for (const r of resolved) {
            if (r.won) {
              toast.success(`You won! +${formatCrypto(r.payoutCrypto, r.asset)} ${r.asset}`, {
                description: r.question,
              })
            } else {
              toast.error("Market resolved against you", {
                description: r.question,
              })
            }
          }
        }
      } catch {
        setError("Unable to load your data. Storage may be unavailable.")
      } finally {
        setIsReady(true)
      }
    }
    hydrate()
  }, [hydrateUser])

  // App-wide listener: whenever the tab becomes visible (e.g., user returns
  // from the faucet opened in a new tab), pick up any pending drops. Works
  // from any page, not just /wallet.
  useEffect(() => {
    async function handleVisibility() {
      if (document.visibilityState !== "visible") return
      const drops = await useTestnetWalletStore.getState().processFaucetPending()
      if (drops > 0) {
        toast.success(`${drops} faucet drop${drops === 1 ? "" : "s"} received!`)
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  return { isReady, error }
}
