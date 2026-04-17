"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useReplayStore } from "@/store/useReplayStore"
import { usePredictionStore } from "@/store/usePredictionStore"
import { usePredictionWalletStore } from "@/store/usePredictionWalletStore"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { formatCrypto } from "@/lib/utils"

async function drainFaucetPending() {
  const drops = await useTestnetWalletStore.getState().processFaucetPending()
  if (drops > 0) {
    toast.success(`${drops} faucet drop${drops === 1 ? "" : "s"} received!`)
  }
}

export function useHydration() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hydrateUser = useUserStore((s) => s.hydrate)
  const pathname = usePathname()
  const isFirstPathname = useRef(true)

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
          await drainFaucetPending()

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

  // Faucet drops can land while the user is off on /faucet (standalone route).
  // We cover three return paths:
  //   1. New-tab faucet → tab switch — visibilitychange
  //   2. pageshow bfcache restore — some browsers use this for back/forward
  //   3. In-tab SPA navigation (back button from /faucet → /wallet) — pathname
  // All three call the same drain fn; localStorage is cleared in the store so
  // duplicate triggers are a no-op.
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "visible") drainFaucetPending()
    }
    function onPageShow() { drainFaucetPending() }
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("pageshow", onPageShow)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pageshow", onPageShow)
    }
  }, [])

  useEffect(() => {
    // Skip the initial pathname so we don't double-drain with the boot hydrate.
    if (isFirstPathname.current) {
      isFirstPathname.current = false
      return
    }
    drainFaucetPending()
  }, [pathname])

  return { isReady, error }
}
