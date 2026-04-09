"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/PageTransition"
import { PredictionMarketCard } from "./PredictionMarketCard"
import { PredictionWalkthrough, useShouldShowWalkthrough } from "./PredictionWalkthrough"
import { PredictionSummary } from "./PredictionSummary"
import { PredictionPortfolioChip } from "./PredictionPortfolioChip"
import { usePredictionStore } from "@/store/usePredictionStore"
import { usePortfolioStore } from "@/store/usePortfolioStore"
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
  const profile = useUserStore((s) => s.profile)
  const _portfolioBalance = usePortfolioStore((s) => s.portfolio?.balance ?? 0)
  const getPredictionForMarket = usePredictionStore((s) => s.getPredictionForMarket)
  const getMarketOdds = usePredictionStore((s) => s.getMarketOdds)
  const checkPriceResolutions = usePredictionStore((s) => s.checkPriceResolutions)
  const userPredictions = usePredictionStore((s) => s.userPredictions)

  const showWalkthrough = useShouldShowWalkthrough(userPredictions.length > 0)

  useEffect(() => {
    if (profile) {
      checkPriceResolutions(profile.id)
    }
  }, [profile, checkPriceResolutions])

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
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Predictions
            </h1>
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

        {/* Asset filter */}
        <div id="pred-filters" className="mt-5">
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

        {/* Status filter */}
        <div className="mt-2 flex gap-2">
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

      {/* Walkthrough overlay — first time only */}
      {showWalkthrough && !walkthroughDone && (
        <PredictionWalkthrough onComplete={() => setWalkthroughDone(true)} />
      )}
    </PageTransition>
  )
}
