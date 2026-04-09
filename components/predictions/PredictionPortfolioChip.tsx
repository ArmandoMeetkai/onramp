"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { ChevronDown, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { usePriceStore } from "@/store/usePriceStore"
import { cn } from "@/lib/utils"

const ASSETS = ["BTC", "ETH", "SOL"] as const

const COIN_COLORS: Record<string, string> = {
  BTC: "text-[oklch(0.72_0.12_55)]",
  ETH: "text-[oklch(0.65_0.1_280)]",
  SOL: "text-[oklch(0.72_0.15_310)]",
}

function formatCrypto(amount: number, asset: string): string {
  if (asset === "BTC") return amount.toFixed(6)
  if (asset === "ETH") return amount.toFixed(4)
  return amount.toFixed(2)
}

export function PredictionPortfolioChip() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const portfolio = usePortfolioStore((s) => s.portfolio)
  const getPrice = usePriceStore((s) => s.getPrice)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const breakdown = useMemo(() => {
    if (!portfolio) return []
    return ASSETS.map((asset) => {
      const holding = portfolio.holdings.find((h) => h.asset === asset)
      const amount = holding?.amount ?? 0
      const price = getPrice(asset)
      const usdValue = amount * price
      return { asset, amount, price, usdValue }
    }).filter((c) => c.amount > 0)
  }, [portfolio, getPrice])

  const cashBalance = portfolio?.balance ?? 0
  const holdingsUsd = breakdown.reduce((s, c) => s + c.usdValue, 0)
  const totalUsd = cashBalance + holdingsUsd

  return (
    <div ref={ref} className="relative">
      {/* Chip trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200",
          "bg-accent/15 text-accent px-3 py-1 text-xs",
          open && "bg-accent/25"
        )}
        aria-expanded={open}
        aria-label="View portfolio breakdown"
      >
        ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-30 w-64 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Portfolio
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Holdings */}
            <div className="px-4 py-3 space-y-3">
              {breakdown.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No crypto holdings yet
                </p>
              ) : (
                breakdown.map((coin) => (
                  <div key={coin.asset} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-bold w-7", COIN_COLORS[coin.asset])}>
                        {coin.asset}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatCrypto(coin.amount, coin.asset)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold">
                      ${coin.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))
              )}

              {/* Cash row */}
              {cashBalance > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold w-7 text-muted-foreground">USD</span>
                    <span className="text-xs text-muted-foreground">Cash</span>
                  </div>
                  <span className="text-xs font-semibold">
                    ${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground">Total value</p>
              <p className="text-sm font-bold text-accent">
                ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
