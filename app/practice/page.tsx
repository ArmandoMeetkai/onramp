"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, RefreshCw, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { Sparkline } from "@/components/portfolio/Sparkline"
import { HoldingsList } from "@/components/portfolio/HoldingsList"
import { TransactionHistory } from "@/components/portfolio/TransactionHistory"
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary"
import { TradeSheet } from "@/components/portfolio/TradeSheet"
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useUserStore } from "@/store/useUserStore"
import { usePriceStore } from "@/store/usePriceStore"

function formatLastUpdated(timestamp: number | null): string {
  if (!timestamp) return "Loading prices..."
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return "Updated just now"
  if (diff < 3600) return `Updated ${Math.floor(diff / 60)} min ago`
  return `Updated ${Math.floor(diff / 3600)}h ago`
}

export default function PracticePage() {
  const [tradeOpen, setTradeOpen] = useState(false)
  const portfolio = usePortfolioStore((s) => s.portfolio)
  const initializePortfolio = usePortfolioStore((s) => s.initializePortfolio)
  const profile = useUserStore((s) => s.profile)

  const prices = usePriceStore((s) => s.prices)
  const sparklines = usePriceStore((s) => s.sparklines)
  const lastUpdated = usePriceStore((s) => s.lastUpdated)
  const isLoading = usePriceStore((s) => s.isLoading)
  const isOffline = usePriceStore((s) => s.isOffline)
  const isStale = usePriceStore((s) => s.isStale)
  const fetchPrices = usePriceStore((s) => s.fetchPrices)
  const fetchSparklines = usePriceStore((s) => s.fetchSparklines)

  useEffect(() => {
    if (profile && !portfolio) {
      initializePortfolio(profile.id)
    }
  }, [profile, portfolio, initializePortfolio])

  // Fetch prices on mount and auto-refresh every 60s
  useEffect(() => {
    fetchPrices()
    fetchSparklines()

    const interval = setInterval(fetchPrices, 60_000)
    return () => clearInterval(interval)
  }, [fetchPrices, fetchSparklines])

  const handleRefresh = useCallback(() => {
    fetchPrices()
    fetchSparklines()
  }, [fetchPrices, fetchSparklines])

  // Memoize total value to avoid recalculating on every render
  const totalValue = useMemo(() => {
    if (!portfolio) return 0
    const holdingsValue = portfolio.holdings.reduce((sum, h) => {
      const price = prices[h.asset]?.price ?? 0
      return sum + h.amount * price
    }, 0)
    return portfolio.balance + holdingsValue
  }, [portfolio, prices])

  // Use BTC sparkline as portfolio proxy
  const btcSparkline = useMemo(() => sparklines.BTC ?? [], [sparklines])

  if (!portfolio) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </PageTransition>
    )
  }

  const hasHoldings = portfolio.holdings.length > 0

  return (
    <PageTransition>
      <div className="py-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Practice Portfolio
        </h1>
        <div className="mt-2 rounded-xl bg-accent/10 px-3 py-2">
          <p className="text-center text-xs font-medium text-accent">
            This is a simulation. No real money is involved.
          </p>
        </div>

        {isOffline && (
          <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-muted px-3 py-2">
            <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Offline — showing last known prices
            </p>
          </div>
        )}

        {isStale && !isOffline && (
          <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-warning/10 px-3 py-2">
            <p className="text-xs text-warning">
              Prices may be outdated
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <motion.p
            className="font-heading text-4xl font-bold tracking-tight"
            key={totalValue.toFixed(2)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cash: ${portfolio.balance.toFixed(2)}
          </p>
        </div>

        {btcSparkline.length > 1 && (
          <div className="mt-4">
            <Sparkline data={btcSparkline} positive={totalValue >= 10000} />
          </div>
        )}

        <div className="mt-1 flex items-center justify-center gap-2">
          <p className="text-xs text-muted-foreground">
            {formatLastUpdated(lastUpdated)}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Refresh prices"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Current Prices
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {(["BTC", "ETH", "SOL"] as const).map((symbol) => {
              const p = prices[symbol]
              if (!p) return null
              const isUp = p.change24h >= 0
              return (
                <div key={symbol} className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">{symbol}</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    ${p.price.toLocaleString(undefined, { maximumFractionDigits: p.price < 10 ? 2 : 0 })}
                  </p>
                  <p className={`mt-0.5 text-[11px] font-medium ${isUp ? "text-success" : "text-danger"}`}>
                    {isUp ? "+" : ""}{p.change24h.toFixed(1)}%
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          {hasHoldings ? (
            <div className="space-y-6">
              <HoldingsList holdings={portfolio.holdings} />

              <Button
                onClick={() => setTradeOpen(true)}
                className="h-12 w-full rounded-xl text-base font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Buy or Sell
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-lg font-semibold">Ready to practice?</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your practice portfolio is empty. Start by buying your first crypto — it&apos;s just pretend money!
              </p>
              <Button
                onClick={() => setTradeOpen(true)}
                className="mt-4 h-12 rounded-xl px-8 text-base font-semibold"
              >
                Start Practicing
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        <TransactionHistory transactions={portfolio.transactions} />

        <div className="mt-6">
          <PortfolioSummary transactions={portfolio.transactions} />
        </div>

        <DisclaimerBanner />
      </div>

      <TradeSheet
        open={tradeOpen}
        onOpenChange={setTradeOpen}
        holdings={portfolio.holdings}
      />
    </PageTransition>
  )
}
