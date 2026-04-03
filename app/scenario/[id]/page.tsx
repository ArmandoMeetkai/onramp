"use client"

import { use, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { ProbabilityBar } from "@/components/cards/ProbabilityBar"
import { SimulationSlider } from "@/components/cards/SimulationSlider"
import { ExplanationPanel } from "@/components/cards/ExplanationPanel"
import { GuidanceBadge } from "@/components/cards/GuidanceBadge"
import { SocialProof } from "@/components/cards/SocialProof"
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner"
import { CoinIcon } from "@/components/shared/CoinIcon"
import { InfoTip } from "@/components/shared/InfoTip"
import { getScenarioById } from "@/data/scenarios"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePriceStore } from "@/store/usePriceStore"
import { cn } from "@/lib/utils"

export default function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const scenario = getScenarioById(id)
  const profile = useUserStore((s) => s.profile)
  const incrementCardsViewed = useProgressStore((s) => s.incrementCardsViewed)
  const incrementSimulationsRun = useProgressStore((s) => s.incrementSimulationsRun)
  const incrementExplanationsOpened = useProgressStore((s) => s.incrementExplanationsOpened)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const prices = usePriceStore((s) => s.prices)
  const fetchPrices = usePriceStore((s) => s.fetchPrices)
  const hasTrackedView = useRef(false)

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  useEffect(() => {
    if (!hasTrackedView.current && scenario) {
      hasTrackedView.current = true
      incrementCardsViewed()
      updateStreak()
    }
  }, [scenario, incrementCardsViewed, updateStreak])

  const handleSimulate = useCallback(() => {
    incrementSimulationsRun()
  }, [incrementSimulationsRun])

  const handleExplanationOpen = useCallback(() => {
    incrementExplanationsOpened()
  }, [incrementExplanationsOpened])

  if (!scenario) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">Scenario not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This scenario may have been removed.
          </p>
          <button
            onClick={() => router.push("/explore")}
            className="mt-4 text-sm font-medium text-primary"
          >
            Back to Explore
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="py-4">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Asset badge with icon */}
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold"
          >
            <CoinIcon symbol={scenario.asset} size="xs" className="h-4 w-4 rounded-sm bg-transparent" />
            {scenario.asset}
          </Badge>

          <Badge variant="secondary" className="rounded-md text-xs">
            {scenario.difficulty === "beginner" ? "Beginner" : "Intermediate"}
          </Badge>

          {prices[scenario.asset] && (
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="rounded-md text-xs">
                ${prices[scenario.asset].price.toLocaleString()}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-md text-xs",
                  prices[scenario.asset].change24h >= 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                )}
              >
                {prices[scenario.asset].change24h >= 0 ? "+" : ""}
                {prices[scenario.asset].change24h.toFixed(1)}% today
              </Badge>
              <InfoTip>
                These are <strong className="text-foreground">live prices</strong> from
                CoinGecko. The % shows today&apos;s change. It doesn&apos;t affect the
                simulation below, which is based on the scenario&apos;s historical conditions.
              </InfoTip>
            </div>
          )}

          <span className="text-xs text-muted-foreground leading-6">
            Updated {scenario.updatedAt}
          </span>
        </div>

        <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight leading-tight">
          {scenario.title}
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          {scenario.description}
        </p>

        <Separator className="my-6" />

        <ProbabilityBar
          up={scenario.probability.up}
          flat={scenario.probability.flat}
          down={scenario.probability.down}
        />

        <div className="mt-6">
          <SimulationSlider scenario={scenario} onSimulate={handleSimulate} />
        </div>

        {/* CTA: connect simulation to practice */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground leading-snug">
            Want to try this with<br />real market prices?
          </p>
          <Link
            href="/practice"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
          >
            Go to Practice →
          </Link>
        </div>

        <div className="mt-6">
          <ExplanationPanel
            whyUp={scenario.explanation.whyUp}
            whyDown={scenario.explanation.whyDown}
            whatToWatch={scenario.explanation.whatToWatch}
            onOpen={handleExplanationOpen}
          />
        </div>

        <Separator className="my-6" />

        <GuidanceBadge
          guidance={scenario.guidance}
          userRiskStyle={profile?.riskStyle ?? "moderate"}
        />

        <div className="mt-6">
          <SocialProof
            usersWhoSimulated={scenario.socialProof.usersWhoSimulated}
            avgDecision={scenario.socialProof.avgDecision}
            communityNote={scenario.socialProof.communityNote}
          />
        </div>

        <div className="mt-4 rounded-xl bg-muted/50 p-3">
          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            These scenarios are educational. They are not financial advice or predictions.
          </p>
        </div>

        <DisclaimerBanner />
      </div>
    </PageTransition>
  )
}
