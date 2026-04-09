"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"
import { PageTransition } from "@/components/layout/PageTransition"
import { PredictionMarketCard } from "./PredictionMarketCard"
import { PredictionWalkthrough, useShouldShowWalkthrough, triggerWalkthroughReplay } from "./PredictionWalkthrough"
import { PredictionSummary } from "./PredictionSummary"
import { PredictionPortfolioChip } from "./PredictionPortfolioChip"
import { usePredictionStore } from "@/store/usePredictionStore"
import { useUserStore } from "@/store/useUserStore"
import { cn } from "@/lib/utils"
import type { PredictionMarket } from "@/data/predictionMarkets"

const statusFilters = [
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },
  { label: "All", value: "all" },
] as const

const assetFilters = [
  { label: "All", value: "all" },
  { label: "BTC", value: "BTC" },
  { label: "ETH", value: "ETH" },
  { label: "SOL", value: "SOL" },
] as const

type StatusFilter = (typeof statusFilters)[number]["value"]
type AssetFilter = "all" | "BTC" | "ETH" | "SOL"

interface PredictionHubContentProps {
  markets: PredictionMarket[]
}

export function PredictionHubContent({ markets }: PredictionHubContentProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active")
  const [assetFilter, setAssetFilter] = useState<AssetFilter>("all")
  const [walkthroughDone, setWalkthroughDone] = useState(false)
  const [showManualWalkthrough, setShowManualWalkthrough] = useState(false)
  const profileId = useUserStore((s) => s.profile?.id)
  const getPredictionForMarket = usePredictionStore((s) => s.getPredictionForMarket)
  const getMarketOdds = usePredictionStore((s) => s.getMarketOdds)
  const checkPriceResolutions = usePredictionStore((s) => s.checkPriceResolutions)
  const userPredictions = usePredictionStore((s) => s.userPredictions)

  const autoShowWalkthrough = useShouldShowWalkthrough(userPredictions.length > 0)
  const showWalkthrough = (autoShowWalkthrough || showManualWalkthrough) && !walkthroughDone

  const handleReplayWalkthrough = useCallback(() => {
    triggerWalkthroughReplay()
    setWalkthroughDone(false)
    setShowManualWalkthrough(true)
  }, [])


  useEffect(() => {
    if (profileId) {
      checkPriceResolutions(profileId)
    }
  }, [profileId, checkPriceResolutions])

  const filtered = markets.filter((market) => {
    const statusMatch = statusFilter === "all" || market.status === statusFilter
    const assetMatch = assetFilter === "all" || market.asset === assetFilter
    return statusMatch && assetMatch
  })

  return (
    <PageTransition>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Predictions
              </h1>
              <button
                onClick={handleReplayWalkthrough}
                aria-label="How it works"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-muted-foreground">
              Predict crypto outcomes. Learn to think probabilistically.
            </p>
          </div>
          <div id="pred-balance">
            <PredictionPortfolioChip />
          </div>
        </div>

        {/* Summary — only when user has predictions */}
        {userPredictions.length > 0 && <PredictionSummary />}

        {/* Filters */}
        <div id="pred-filters" className="mt-5 space-y-2">
          <div className="flex gap-2 overflow-x-auto">
            {assetFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setAssetFilter(filter.value)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  assetFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === filter.value
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((market, index) => (
            <motion.div
              key={market.id}
              id={index === 0 ? "pred-first-card" : undefined}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
            >
              <PredictionMarketCard
                market={market}
                odds={getMarketOdds(market.id)}
                userPrediction={getPredictionForMarket(market.id)}
              />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="text-4xl">🔮</span>
              <p className="mt-3 font-semibold">No predictions here yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {statusFilter === "resolved"
                  ? "No markets have been resolved yet. Check back soon."
                  : "Try a different filter to see more predictions."
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Walkthrough overlay */}
      {showWalkthrough && (
        <PredictionWalkthrough onComplete={() => { setWalkthroughDone(true); setShowManualWalkthrough(false) }} />
      )}
    </PageTransition>
  )
}
