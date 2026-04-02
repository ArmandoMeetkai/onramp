"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface PriceChartProps {
  data: number[]
  positive?: boolean
  className?: string
}

function formatYLabel(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`
  return `$${n.toFixed(n < 10 ? 2 : 0)}`
}

/**
 * Sparkline chart with labeled Y (price) and X (day) axes and subtle grid lines.
 */
export function PriceChart({ data, positive = true, className }: PriceChartProps) {
  const points = useMemo(() => {
    if (data.length < 2) return null

    const min = Math.min(...data)
    const max = Math.max(...data)
    const rawRange = max - min || 1

    // 8% padding on both sides of the Y range so the line never clips the border
    const yMin = min - rawRange * 0.08
    const yMax = max + rawRange * 0.08
    const yRange = yMax - yMin

    const W = 240   // plot area width
    const H = 70    // plot area height

    return {
      path: data
        .map((v, i) => {
          const x = (i / (data.length - 1)) * W
          const y = (1 - (v - yMin) / yRange) * H
          return `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(" "),
      last: {
        x: W,
        y: ((1 - (data[data.length - 1] - yMin) / yRange) * H).toFixed(1),
      },
      // 3 Y axis ticks: top, middle, bottom
      yTicks: [
        { value: yMax, pct: 0 },
        { value: (yMin + yMax) / 2, pct: 50 },
        { value: yMin, pct: 100 },
      ],
      // 4 X axis ticks evenly spaced
      xTicks: [0, 1, 2, 3].map((i) => ({
        index: Math.round((i / 3) * (data.length - 1)),
        pct: (i / 3) * 100,
      })),
      W,
      H,
      yMin,
      yMax,
      yRange,
    }
  }, [data])

  if (!points || data.length < 2) return null

  const { path, last, yTicks, xTicks, W, H } = points
  const color = positive ? "var(--success)" : "var(--danger)"

  // SVG layout constants
  const padLeft = 40   // space for Y labels
  const padBottom = 18 // space for X labels
  const padTop = 4
  const padRight = 6
  const totalW = padLeft + W + padRight
  const totalH = padTop + H + padBottom

  // Convert plot-space (0..W, 0..H) to SVG space
  const svgX = (px: number) => padLeft + px
  const svgY = (py: number) => padTop + py

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="w-full"
        style={{ height: "120px" }}
        aria-hidden="true"
      >
        {/* Horizontal grid lines + Y labels */}
        {yTicks.map(({ value, pct }) => {
          const py = (pct / 100) * H
          return (
            <g key={pct}>
              <line
                x1={padLeft}
                y1={svgY(py)}
                x2={padLeft + W}
                y2={svgY(py)}
                stroke="currentColor"
                className="text-border"
                strokeWidth="0.4"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 3}
                y={svgY(py)}
                dominantBaseline="middle"
                textAnchor="end"
                fontSize="6.5"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {formatYLabel(value)}
              </text>
            </g>
          )
        })}

        {/* Price line */}
        <g transform={`translate(${padLeft}, ${padTop})`}>
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Current price dot */}
          <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
        </g>

        {/* X labels */}
        {xTicks.map(({ index, pct }) => {
          const daysAgo = Math.round(((data.length - 1 - index) / (data.length - 1)) * 7)
          const label = daysAgo === 0 ? "Now" : `${daysAgo}d ago`
          return (
            <text
              key={index}
              x={svgX((pct / 100) * W)}
              y={totalH - 2}
              dominantBaseline="auto"
              textAnchor={pct === 0 ? "start" : pct === 100 ? "end" : "middle"}
              fontSize="6.5"
              fill="currentColor"
              className="text-muted-foreground"
            >
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
