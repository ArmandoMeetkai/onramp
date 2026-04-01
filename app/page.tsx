"use client"

import { useOnboarding } from "@/hooks/useOnboarding"
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow"
import { HomeContent } from "@/components/home/HomeContent"

export default function HomePage() {
  const { needsOnboarding } = useOnboarding()

  if (needsOnboarding) {
    return <OnboardingFlow />
  }

  return <HomeContent />
}
