"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"
import { usePredictionStore } from "@/store/usePredictionStore"
import { usePriceStore } from "@/store/usePriceStore"
import { cn, formatCrypto } from "@/lib/utils"

const ASSETS = ["BTC", "ETH", "SOL"] as const

export function PredictionSummary() {
  // Subscribe to the raw data so useMemo recomputes when either changes
  const userPredictions = usePredictionStore((s) => s.userPredictions)
  const getPredictionStats = usePredictionStore((s) => s.getPredictionStats)
  const btcPrice = usePriceStore((s) => s.getPrice("BTC"))
  const ethPrice = usePriceStore((s) => s.getPrice("ETH"))
  const solPrice = usePriceStore((s) => s.getPrice("SOL"))

  const stats = useMemo(
    () => getPredictionStats(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userPredictions, getPredictionStats, btcPrice, ethPrice, solPrice]
  )

  const { perCoin, totalNetUsd, counts } = stats

  // Only show coins the user has interacted with
  const activeCoins = ASSETS.filter(
    (a) => perCoin[a].staked > 0
  )

  if (counts.total === 0) return null

  const isPositive = totalNetUsd > 0
  const isNeutral = totalNetUsd === 0

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your predictions</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {counts.wins > 0 && (
            <span className="flex items-center gap-1 text-success font-medium">
              <TrendingUp className="h-3 w-3" />
              {counts.wins}W
            </span>
          )}
          {counts.losses > 0 && (
            <span className="flex items-center gap-1 text-danger font-medium">
              <TrendingDown className="h-3 w-3" />
              {counts.losses}L
            </span>
          )}
          {counts.pending > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {counts.pending} pending
            </span>
          )}
        </div>
      </div>

      {/* Per-coin breakdown */}
      {activeCoins.length > 0 && (
        <div className="space-y-2">
          {activeCoins.map((asset) => {
            const coin = perCoin[asset]
            const hasResolved = coin.returned > 0 || (coin.staked > 0 && coin.net < 0)
            // netUsd comes pre-calculated from getPredictionStats via live prices
            const netUsd = coin.net * (asset === "BTC" ? btcPrice : asset === "ETH" ? ethPrice : solPrice)
            const coinPositive = coin.net > 0
            const coinNeutral = coin.net === 0

            return (
              <div
                key={asset}
                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold w-7">{asset}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {hasResolved ? "Staked" : "In play"}: {formatCrypto(coin.staked, asset)} {asset}
                    </p>
                    {hasResolved && (
                      <p className="text-xs text-muted-foreground">
                        Returned: {formatCrypto(coin.returned, asset)} {asset}
                      </p>
                    )}
                  </div>
                </div>

                {hasResolved ? (
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-bold",
                        coinPositive ? "text-success" : coinNeutral ? "text-muted-foreground" : "text-danger"
                      )}
                    >
                      {coinPositive ? "+" : ""}{formatCrypto(coin.net, asset)} {asset}
                    </p>
                    <p
                      className={cn(
                        "text-[10px]",
                        coinPositive ? "text-success/70" : coinNeutral ? "text-muted-foreground" : "text-danger/70"
                      )}
                    >
                      {netUsd >= 0 ? "+" : ""}${Math.abs(netUsd).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Pending</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Total net P&L — only if at least one resolved */}
      {(counts.wins + counts.losses) > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">Total net P&L</p>
          <p
            className={cn(
              "text-sm font-bold",
              isPositive ? "text-success" : isNeutral ? "text-muted-foreground" : "text-danger"
            )}
          >
            {isPositive ? "+" : ""}${totalNetUsd.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}
