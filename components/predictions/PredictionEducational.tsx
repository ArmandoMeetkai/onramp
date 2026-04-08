"use client"

import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PredictionMarketFactor } from "@/data/predictionMarkets"

interface PredictionEducationalProps {
  context: string
  factors: PredictionMarketFactor[]
}

const sentimentColors: Record<string, string> = {
  bullish: "bg-success",
  bearish: "bg-danger",
  neutral: "bg-muted-foreground",
}

const sentimentLabels: Record<string, string> = {
  bullish: "Bullish",
  bearish: "Bearish",
  neutral: "Neutral",
}

export function PredictionEducational({ context, factors }: PredictionEducationalProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-primary">What you should know</p>
        </div>
        <p className="text-sm leading-relaxed">{context}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Key factors
        </p>
        <div className="space-y-4">
          {factors.map((factor, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-1.5 flex flex-col items-center gap-1">
                <div className={cn("h-2.5 w-2.5 rounded-full", sentimentColors[factor.sentiment])} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{factor.label}</p>
                  <span className={cn(
                    "text-[10px] font-medium uppercase tracking-wide",
                    factor.sentiment === "bullish" ? "text-success" :
                    factor.sentiment === "bearish" ? "text-danger" : "text-muted-foreground"
                  )}>
                    {sentimentLabels[factor.sentiment]}
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {factor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
