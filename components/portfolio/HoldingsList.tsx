"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Holding } from "@/lib/db"
import { usePriceStore } from "@/store/usePriceStore"
import { InfoTip } from "@/components/shared/InfoTip"
import { CoinIcon } from "@/components/shared/CoinIcon"

interface HoldingsListProps {
  holdings: Holding[]
}

const assetTaglines: Record<string, string> = {
  BTC: "Digital gold. Max supply: 21 million.",
  ETH: "Powers smart contracts and apps.",
  SOL: "Fast & low-cost transactions.",
}

function formatCryptoAmount(amount: number, symbol: string): string {
  const formatted =
    amount < 0.001
      ? amount.toFixed(6)
      : amount < 1
        ? amount.toFixed(4)
        : amount.toFixed(2)
  return `${formatted} ${symbol}`
}

export function HoldingsList({ holdings }: HoldingsListProps) {
  const getPrice = usePriceStore((s) => s.getPrice)
  const getName = usePriceStore((s) => s.getName)

  if (holdings.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your Holdings
          </h2>
          <InfoTip>
            <strong className="text-foreground">Holdings</strong> are the coins you currently
            own. You can sell them at any time. Their value changes as market prices move,
            even while you sleep.
          </InfoTip>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[10px] font-medium text-success">Live</span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Values update automatically every minute with real market prices.
      </p>

      <div className="space-y-2">
        {holdings.map((holding) => {
          const currentPrice = getPrice(holding.asset)
          const currentValue = holding.amount * currentPrice
          const costBasis = holding.amount * holding.avgBuyPrice
          const gainLoss = costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0
          const isPositive = gainLoss >= 0

          return (
            <div
              key={holding.asset}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CoinIcon symbol={holding.asset} size="md" />
                  <div>
                    <p className="font-semibold">{getName(holding.asset)}</p>
                    <p className="text-xs text-muted-foreground">
                      {assetTaglines[holding.asset] ?? ""}
                    </p>
                  </div>
                </div>
              <div className="text-right">
                <motion.p
                  key={currentValue.toFixed(2)}
                  className="font-semibold"
                  initial={{ opacity: 0.4, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ${currentValue.toFixed(2)}
                </motion.p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-success" : "text-danger"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {gainLoss.toFixed(1)}% since bought
                </p>
              </div>
              </div>

              {/* Secondary row: amount + avg buy price */}
              <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2.5">
                <p className="text-xs text-muted-foreground">
                  You own:{" "}
                  <span className="font-medium text-foreground">
                    {formatCryptoAmount(holding.amount, holding.asset)}
                  </span>
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">
                    Avg. paid: ${holding.avgBuyPrice.toLocaleString(undefined, { maximumFractionDigits: holding.avgBuyPrice < 10 ? 4 : 0 })}
                  </p>
                  <InfoTip>
                    <strong className="text-foreground">Average price paid</strong> is what
                    you paid per coin on average. If the current price is higher, you&apos;re
                    in profit. If it&apos;s lower, you&apos;re at a loss, for now.
                  </InfoTip>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
