"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/PageTransition"
import { PredictionMarketCard } from "./PredictionMarketCard"
import { PredictionWalkthrough, useShouldShowWalkthrough, WALKTHROUGH_HUB_KEY } from "./PredictionWalkthrough"
import { PredictionSummary } from "./PredictionSummary"
import { PredictionCalibration } from "./PredictionCalibration"
import { PredictionPortfolioChip } from "./PredictionPortfolioChip"
import { PredictionTradeSheet } from "./PredictionTradeSheet"
import { usePredictionStore } from "@/store/usePredictionStore"
import { useUserStore } from "@/store/useUserStore"
import { cn, formatCrypto } from "@/lib/utils"
import { HelpCircle, Sparkles, ArrowRight } from "lucide-react"
import { usePredictionHoldings } from "@/hooks/usePredictionHoldings"
import { ModeTag } from "@/components/shared/ModeTag"
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

function readSession<T>(key: string, fallback: T): T {
  try { const v = sessionStorage.getItem(key); return v ? (v as T) : fallback } catch { return fallback }
}

export function PredictionHubContent({ markets }: PredictionHubContentProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => readSession("pred-status-filter", "active" as StatusFilter))
  const [assetFilter, setAssetFilter] = useState<AssetFilter>(() => readSession("pred-asset-filter", "all" as AssetFilter))
  const [walkthroughDone, setWalkthroughDone] = useState(false)
  const [forceWalkthrough, setForceWalkthrough] = useState(false)
  const [tradeOpen, setTradeOpen] = useState(false)
  const profileId = useUserStore((s) => s.profile?.id)
  const getPredictionForMarket = usePredictionStore((s) => s.getPredictionForMarket)
  const getMarketOdds = usePredictionStore((s) => s.getMarketOdds)
  const checkPriceResolutions = usePredictionStore((s) => s.checkPriceResolutions)
  const userPredictions = usePredictionStore((s) => s.userPredictions)
  const { isGraduated, cashBalance, holdings } = usePredictionHoldings()
  const hasAnyHoldings = holdings.some((h) => h.amount > 0)
  const isBrandNew = !isGraduated && userPredictions.length === 0 && !hasAnyHoldings && cashBalance > 0

  // Persist filters to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem("pred-status-filter", statusFilter) } catch {}
  }, [statusFilter])
  useEffect(() => {
    try { sessionStorage.setItem("pred-asset-filter", assetFilter) } catch {}
  }, [assetFilter])

  const autoShowWalkthrough = useShouldShowWalkthrough(userPredictions.length > 0)
  const showWalkthrough = autoShowWalkthrough || forceWalkthrough

  function handleReplayWalkthrough() {
    try {
      localStorage.removeItem(WALKTHROUGH_HUB_KEY)
    } catch {
      // Safari Private Browsing
    }
    setWalkthroughDone(false)
    setForceWalkthrough(true)
  }

  useEffect(() => {
    if (profileId) {
      checkPriceResolutions(profileId).then((resolved) => {
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
      })
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
              <ModeTag />
              <button
                onClick={handleReplayWalkthrough}
                aria-label="How it works"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your prediction balance to stake crypto on outcomes.
            </p>
          </div>
          <div id="pred-balance">
            <PredictionPortfolioChip onBuy={() => setTradeOpen(true)} />
          </div>
        </div>

        {/* Welcome banner — only for brand-new users who haven't bought crypto or predicted yet */}
        {isBrandNew && (
          <motion.button
            onClick={() => setTradeOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="group mt-5 flex w-full items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/10 active:scale-[0.99]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">
                You have ${cashBalance.toLocaleString()} to start
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Buy BTC, ETH, or SOL here, then stake it on a prediction below.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )}

        {/* Summary & Calibration — only when user has predictions */}
        {userPredictions.length > 0 && (
          <div className="mt-5 space-y-3">
            <PredictionSummary />
            <PredictionCalibration />
          </div>
        )}

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

      {/* Walkthrough overlay — first time only */}
      {showWalkthrough && !walkthroughDone && (
        <PredictionWalkthrough onComplete={() => { setWalkthroughDone(true); setForceWalkthrough(false); window.scrollTo(0, 0) }} />
      )}

      <PredictionTradeSheet open={tradeOpen} onOpenChange={setTradeOpen} />
    </PageTransition>
  )
}
