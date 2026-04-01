"use client"

import { useUserStore } from "@/store/useUserStore"

export function useOnboarding() {
  const profile = useUserStore((s) => s.profile)
  const isLoading = useUserStore((s) => s.isLoading)

  return {
    needsOnboarding: !isLoading && profile === null,
    isLoading,
  }
}
