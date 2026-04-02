"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ReplayPriceChartProps {
  priceData: number[]
  decisionIndex?: number
  animate?: boolean
  positive?: boolean
  label?: string
}

const CHART_WIDTH = 320
const CHART_HEIGHT = 120
const PADDING_X = 8
const PADDING_Y = 12

export function ReplayPriceChart({
  priceData,
  decisionIndex,
  animate = true,
  positive,
  label,
}: ReplayPriceChartProps) {
  const { path, minPrice, maxPrice, isUp } = useMemo(() => {
    if (priceData.length < 2) return { path: "", minPrice: 0, maxPrice: 0, isUp: true }

    const min = Math.min(...priceData)
    const max = Math.max(...priceData)
    const range = max - min || 1

    const points = priceData.map((price, i) => {
      const x = PADDING_X + (i / (priceData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)
      const y = PADDING_Y + (1 - (price - min) / range) * (CHART_HEIGHT - 2 * PADDING_Y)
      return { x, y }
    })

    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ")

    return {
      path: d,
      minPrice: min,
      maxPrice: max,
      isUp: priceData[priceData.length - 1] >= priceData[0],
    }
  }, [priceData])

  const isPositive = positive ?? isUp

  const decisionX = useMemo(() => {
    if (decisionIndex === undefined || priceData.length < 2) return null
    return PADDING_X + (decisionIndex / (priceData.length - 1)) * (CHART_WIDTH - 2 * PADDING_X)
  }, [decisionIndex, priceData.length])

  if (priceData.length < 2) return null

  const startPrice = priceData[0]
  const endPrice = priceData[priceData.length - 1]
  const pctChange = (((endPrice - startPrice) / startPrice) * 100).toFixed(1)

  return (
    <div className="rounded-2xl border border-border bg-card px-3 pb-2 pt-3">
      {label && (
        <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      )}

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">
          ${startPrice.toLocaleString()}
        </span>
        <span
          className={cn(
            "text-xs font-semibold",
            isPositive ? "text-success" : "text-danger"
          )}
        >
          {isPositive ? "+" : ""}{pctChange}% → ${endPrice.toLocaleString()}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full"
        aria-hidden="true"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={PADDING_X}
            x2={CHART_WIDTH - PADDING_X}
            y1={PADDING_Y + pct * (CHART_HEIGHT - 2 * PADDING_Y)}
            y2={PADDING_Y + pct * (CHART_HEIGHT - 2 * PADDING_Y)}
            stroke="currentColor"
            strokeOpacity={0.06}
            strokeWidth={0.5}
          />
        ))}

        {/* Decision point marker */}
        {decisionX !== null && (
          <>
            <line
              x1={decisionX}
              x2={decisionX}
              y1={PADDING_Y}
              y2={CHART_HEIGHT - PADDING_Y}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="3 3"
              className="text-accent"
            />
            <circle
              cx={decisionX}
              cy={PADDING_Y + (1 - (priceData[decisionIndex!] - minPrice) / (maxPrice - minPrice || 1)) * (CHART_HEIGHT - 2 * PADDING_Y)}
              r={4}
              className={cn("fill-accent")}
            />
          </>
        )}

        {/* Price line */}
        <motion.path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(isPositive ? "text-success" : "text-danger")}
          initial={animate ? { pathLength: 0 } : undefined}
          animate={{ pathLength: 1 }}
          transition={{ duration: animate ? 2 : 0, ease: "easeOut" }}
        />
      </svg>

      {/* Y-axis labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>${minPrice.toLocaleString()}</span>
        <span>${maxPrice.toLocaleString()}</span>
      </div>
    </div>
  )
}
