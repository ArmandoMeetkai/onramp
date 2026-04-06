"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReplayHeadline } from "@/data/replayEvents"

interface ReplayHeadlinesProps {
  headlines: ReplayHeadline[]
}

const sentimentColors: Record<string, string> = {
  bearish: "bg-danger/15 text-danger",
  bullish: "bg-success/15 text-success",
  neutral: "bg-muted text-muted-foreground",
}

const sentimentDots: Record<string, string> = {
  bearish: "bg-danger",
  bullish: "bg-success",
  neutral: "bg-muted-foreground/40",
}

export function ReplayHeadlines({ headlines }: ReplayHeadlinesProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Headlines
      </p>
      {headlines.map((headline, index) => (
        <motion.div
          key={`${headline.timestamp}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.4 }}
          className={cn(
            "rounded-xl px-4 py-3",
            sentimentColors[headline.sentiment]
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                sentimentDots[headline.sentiment]
              )}
            />
            <span className="text-[11px] font-medium opacity-70">
              {headline.source} · {new Date(headline.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug">{headline.text}</p>
        </motion.div>
      ))}
    </div>
  )
}
