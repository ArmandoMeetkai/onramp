"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, RefreshCw, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { Sparkline } from "@/components/portfolio/Sparkline"
import { PriceChart } from "@/components/portfolio/PriceChart"
import { HoldingsList } from "@/components/portfolio/HoldingsList"
import { TransactionHistory } from "@/components/portfolio/TransactionHistory"
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary"
import { TradeSheet } from "@/components/portfolio/TradeSheet"
import { EmptyState } from "@/components/shared/EmptyState"
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner"
import { ReadyCTA } from "@/components/shared/ReadyCTA"
import { InfoTip } from "@/components/shared/InfoTip"
import { LearnChips } from "@/components/shared/LearnChips"
import { cn } from "@/lib/utils"
import { CoinIcon } from "@/components/shared/CoinIcon"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useUserStore } from "@/store/useUserStore"
import { usePriceStore } from "@/store/usePriceStore"

const ASSET_TAGLINES: Record<string, string> = {
  BTC: "Digital gold. Max supply: 21 million coins.",
  ETH: "Powers smart contracts and most DeFi apps.",
  SOL: "Fast transactions. Popular for apps and NFTs.",
}

const PRACTICE_LEARN_CHIPS = [
  { lessonId: "what-is-bitcoin", emoji: "🪙", label: "What is Bitcoin?" },
  { lessonId: "what-is-volatile", emoji: "📈", label: "What is volatility?" },
  { lessonId: "what-is-market-cap", emoji: "📊", label: "What is market cap?" },
  { lessonId: "what-is-blockchain", emoji: "🔗", label: "What is a blockchain?" },
]

function formatLastUpdated(timestamp: number | null): string {
  if (!timestamp) return "Loading prices..."
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return "Updated just now"
  if (diff < 3600) return `Updated ${Math.floor(diff / 60)} min ago`
  return `Updated ${Math.floor(diff / 3600)}h ago`
}

export default function PracticePage() {
  const [tradeOpen, setTradeOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<"BTC" | "ETH" | "SOL">("BTC")
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
  const getName = usePriceStore((s) => s.getName)

  useEffect(() => {
    if (profile && !portfolio) {
      initializePortfolio(profile.id)
    }
  }, [profile, portfolio, initializePortfolio])

  useEffect(() => {
    fetchPrices()
    fetchSparklines()

    // Prices: every 60s — sparklines: every 5min (historical data changes slowly)
    let priceInterval = setInterval(fetchPrices, 60_000)
    let sparklineInterval = setInterval(fetchSparklines, 5 * 60_000)

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(priceInterval)
        clearInterval(sparklineInterval)
      } else {
        fetchPrices()
        priceInterval = setInterval(fetchPrices, 60_000)
        sparklineInterval = setInterval(fetchSparklines, 5 * 60_000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      clearInterval(priceInterval)
      clearInterval(sparklineInterval)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [fetchPrices, fetchSparklines])

  const handleRefresh = useCallback(() => {
    fetchPrices()
    fetchSparklines()
  }, [fetchPrices, fetchSparklines])

  const totalValue = useMemo(() => {
    if (!portfolio) return 0
    const holdingsValue = portfolio.holdings.reduce((sum, h) => {
      const price = prices[h.asset]?.price ?? 0
      return sum + h.amount * price
    }, 0)
    return portfolio.balance + holdingsValue
  }, [portfolio, prices])

  // Per-holding value for the breakdown row
  const holdingBreakdown = useMemo(() => {
    if (!portfolio) return []
    return portfolio.holdings.map((h) => ({
      asset: h.asset,
      name: getName(h.asset),
      value: h.amount * (prices[h.asset]?.price ?? 0),
    }))
  }, [portfolio, prices, getName])

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
  const isFirstTime = portfolio.transactions.length === 0

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
              Offline. Showing last known prices
            </p>
          </div>
        )}

        {isStale && !isOffline && (
          <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-warning/10 px-3 py-2">
            <p className="text-xs text-warning">Prices may be outdated</p>
          </div>
        )}

        {/* First-time explainer card */}
        {isFirstTime && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 space-y-1"
          >
            <p className="text-sm font-semibold">💡 How this works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You start with <strong className="text-foreground">$10,000 in play money</strong>. 
              Buy and sell Bitcoin, Ethereum, or Solana to practice reading the market. 
              Nothing here is real. Experiment freely!
            </p>
          </motion.div>
        )}

        {/* Total value */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <InfoTip>
              <strong className="text-foreground">Total Value</strong> is the sum of your cash
              plus the current worth of all the crypto you hold. It changes as prices move.
              Even when you don&apos;t buy or sell anything.
            </InfoTip>
          </div>
          <motion.p
            className="font-heading text-4xl font-bold tracking-tight"
            key={totalValue.toFixed(2)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>

          {/* Value breakdown — shows how the total is composed */}
          <div className="mt-2 inline-flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Cash</span>
              <span className="font-medium text-foreground">
                ${portfolio.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <InfoTip>
                <strong className="text-foreground">Cash</strong> is the money you have
                not yet invested. When you buy crypto, cash goes down. When you sell, it goes
                back up. Think of it like your wallet inside the simulation.
              </InfoTip>
            </div>
            {holdingBreakdown.map((h) => (
              <div key={h.asset} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>+ {h.name}</span>
                <span className="font-medium text-foreground">
                  ${h.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {holdingBreakdown.length > 0 && (
              <div className="mt-0.5 flex items-center gap-1.5 border-t border-border/40 pt-0.5 text-xs">
                <span className="text-muted-foreground">= Total</span>
                <span className="font-semibold text-foreground">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Current prices — tap a card to see its chart */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Current Prices
              </h2>
              <InfoTip>
                These are <strong className="text-foreground">real market prices</strong> pulled
                live from CoinGecko every minute. The % shows how much each coin&apos;s price
                changed in the last 24 hours. Red means it dropped, green means it rose.
                Daily swings are normal.
              </InfoTip>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Live · CoinGecko</span>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label="Refresh prices"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Selectable price cards */}
          <div className="grid grid-cols-3 gap-2">
            {(["BTC", "ETH", "SOL"] as const).map((symbol) => {
              const p = prices[symbol]
              if (!p) return null
              const isUp = p.change24h >= 0
              const isSelected = selectedCoin === symbol
              return (
                <button
                  key={symbol}
                  onClick={() => setSelectedCoin(symbol)}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border p-3 text-center transition-all active:scale-95",
                    isSelected
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-border/60"
                  )}
                >
                  <CoinIcon symbol={symbol} size="sm" className="mb-1.5" />
                  <p className="text-[10px] font-medium text-muted-foreground leading-none">
                    {getName(symbol)}
                  </p>
                  <p className={cn("text-[10px] font-bold leading-none mt-0.5", isSelected ? "text-primary" : "text-muted-foreground")}>
                    {symbol}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    ${p.price.toLocaleString(undefined, { maximumFractionDigits: p.price < 10 ? 2 : 0 })}
                  </p>
                  <p className={`mt-0.5 text-[11px] font-medium ${isUp ? "text-success" : "text-danger"}`}>
                    {isUp ? "+" : ""}{p.change24h.toFixed(1)}% today
                  </p>
                  {isSelected && (
                    <div className="mt-1.5 h-0.5 w-full rounded-full bg-primary/40" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Per-coin chart panel — animates when coin changes */}
          <AnimatePresence mode="wait">
            {(sparklines[selectedCoin]?.length ?? 0) > 1 && (() => {
              const base = sparklines[selectedCoin]!
              const livePrice = prices[selectedCoin]?.price

              // Replace the last data point with the current live price so the
              // chart end always matches the price shown on the card above.
              const chartData = livePrice
                ? [...base.slice(0, -1), livePrice]
                : base

              const start = chartData[0]
              const end = chartData[chartData.length - 1]
              const isUp = end >= start
              const weekPct = (((end - start) / start) * 100).toFixed(2)

              return (
                <motion.div
                  key={selectedCoin}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 rounded-2xl border border-border bg-card px-4 pb-3 pt-4"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">{getName(selectedCoin)}</p>
                      <p className="text-xs text-muted-foreground">Last 7 days · real market price</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-semibold", isUp ? "text-success" : "text-danger")}>
                        {isUp ? "+" : ""}{weekPct}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        ${Math.round(start).toLocaleString()} → ${Math.round(end).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Chart with axes */}
                  <PriceChart data={chartData} positive={isUp} />

                  {/* Contextual note */}
                  <p className="mt-1 text-center text-[11px] text-muted-foreground">
                    {isUp
                      ? `${getName(selectedCoin)} is up this week — prices still change daily.`
                      : `${getName(selectedCoin)} dropped this week — volatility is normal in crypto.`}
                  </p>
                </motion.div>
              )
            })()}
          </AnimatePresence>

          <div className="mt-2 flex items-center justify-center gap-1">
            <p className="text-[11px] text-muted-foreground">
              {formatLastUpdated(lastUpdated)} · tap a coin to see its chart
            </p>
          </div>
        </div>

        {/* Holdings or empty state */}
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
            <EmptyState
              title="Ready to practice?"
              description="Your practice portfolio is empty. Start by buying your first crypto. It's just pretend money!"
              action={
                <Button
                  onClick={() => setTradeOpen(true)}
                  className="h-12 rounded-xl px-8 text-base font-semibold"
                >
                  Start Practicing
                </Button>
              }
            />
          )}
        </div>

        <Separator className="my-6" />

        <TransactionHistory transactions={portfolio.transactions} />

        <div className="mt-6">
          <PortfolioSummary transactions={portfolio.transactions} />
        </div>

        {/* Quick-learn chips */}
        <div className="mt-6">
          <LearnChips chips={PRACTICE_LEARN_CHIPS} heading="Not sure what any of this means?" />
        </div>

        {totalValue > 10500 && (
          <div className="mt-6">
            <ReadyCTA
              headline="You're getting good at this"
              subtext="Your practice portfolio is in profit"
              variant="subtle"
            />
          </div>
        )}

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
