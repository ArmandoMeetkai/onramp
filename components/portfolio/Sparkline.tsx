"use client"

import { cn } from "@/lib/utils"

interface SparklineProps {
  data: number[]
  className?: string
  positive?: boolean
}

export function Sparkline({ data, className, positive = true }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const width = 200
  const height = 40
  const padding = 2

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const pathD = `M ${points.join(" L ")}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-10 w-full", className)}
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill="none"
        stroke={positive ? "var(--success)" : "var(--danger)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
