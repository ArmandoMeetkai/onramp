"use client"

import { cn } from "@/lib/utils"
import type { Holding } from "@/lib/db"
import { usePriceStore } from "@/store/usePriceStore"

interface HoldingsListProps {
  holdings: Holding[]
}

const assetIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  SOL: "◎",
}

export function HoldingsList({ holdings }: HoldingsListProps) {
  const getPrice = usePriceStore((s) => s.getPrice)
  const getName = usePriceStore((s) => s.getName)

  if (holdings.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Your Holdings
      </h2>
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
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg font-bold">
                  {assetIcons[holding.asset] ?? holding.asset[0]}
                </div>
                <div>
                  <p className="font-semibold">{getName(holding.asset)}</p>
                  <p className="text-sm text-muted-foreground">
                    {holding.amount < 0.001
                      ? holding.amount.toFixed(6)
                      : holding.amount < 1
                        ? holding.amount.toFixed(4)
                        : holding.amount.toFixed(2)}{" "}
                    {holding.asset}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${currentValue.toFixed(2)}</p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-success" : "text-danger"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {gainLoss.toFixed(1)}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
