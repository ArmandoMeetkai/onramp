"use client"

import { motion } from "framer-motion"
import { PriceChart } from "./PriceChart"
import { cn } from "@/lib/utils"

interface CoinChartPanelProps {
  symbol: string
  name: string
  sparkline: number[]
  livePrice?: number
}

export function CoinChartPanel({ symbol, name, sparkline, livePrice }: CoinChartPanelProps) {
  const chartData = livePrice
    ? [...sparkline.slice(0, -1), livePrice]
    : sparkline

  const start = chartData[0]
  const end = chartData[chartData.length - 1]
  const isUp = end >= start
  const monthPct = (((end - start) / start) * 100).toFixed(2)

  return (
    <motion.div
      key={symbol}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="mt-3 rounded-2xl border border-border bg-card px-4 pb-3 pt-4"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">Last 30 days · real market price</p>
        </div>
        <div className="text-right">
          <p className={cn("text-sm font-semibold", isUp ? "text-success" : "text-danger")}>
            {isUp ? "+" : ""}{monthPct}%
          </p>
          <p className="text-[11px] text-muted-foreground">
            ${Math.round(start).toLocaleString()} → ${Math.round(end).toLocaleString()}
          </p>
        </div>
      </div>

      <PriceChart data={chartData} positive={isUp} />

      <p className="mt-1 text-center text-[11px] text-muted-foreground">
        {isUp
          ? `${name} is up this month — prices still change daily.`
          : `${name} dropped this month — volatility is normal in crypto.`}
      </p>
    </motion.div>
  )
}
