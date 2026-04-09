"use client"

import Link from "next/link"
import { ChevronRight, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PredictionOddsBar } from "./PredictionOddsBar"
import { cn } from "@/lib/utils"
import type { PredictionMarket } from "@/data/predictionMarkets"
import type { UserPrediction } from "@/lib/db"

interface PredictionMarketCardProps {
  market: PredictionMarket
  odds: { yesPercent: number; noPercent: number }
  userPrediction?: UserPrediction
}

function getTimeRemaining(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return "Ended"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 30) return `${Math.floor(days / 30)}mo left`
  if (days > 0) return `${days}d left`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return `${hours}h left`
}

const categoryLabels: Record<string, string> = {
  price: "Price",
  event: "Event",
  community: "Community",
}

export function PredictionMarketCard({
  market,
  odds,
  userPrediction,
}: PredictionMarketCardProps) {
  const isResolved = market.status === "resolved" || userPrediction?.resolved
  const userWon = userPrediction?.resolved && (userPrediction.payoutCrypto ?? 0) > 0

  return (
    <Link
      href={`/predictions/${market.id}`}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-all duration-200 hover:border-primary/30 active:scale-[0.98]",
        isResolved
          ? userWon
            ? "border-success/30"
            : "border-border"
          : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">
          {market.coverEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-snug text-sm">{market.question}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[11px] font-bold">
              {market.asset}
            </Badge>
            <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[11px]">
              {categoryLabels[market.category]}
            </Badge>
            <span className="text-[11px] text-muted-foreground">
              {getTimeRemaining(market.resolutionDate)}
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 mt-1" />
      </div>

      <PredictionOddsBar
        yesPercent={odds.yesPercent}
        noPercent={odds.noPercent}
        userPosition={userPrediction?.position}
      />

      {userPrediction && (
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] border-0",
              userPrediction.position === "yes"
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger"
            )}
          >
            You: {userPrediction.position.toUpperCase()} · {(userPrediction.cryptoAmount ?? 0).toFixed(userPrediction.asset === "BTC" ? 6 : 4)} {userPrediction.asset ?? ""}
          </Badge>
          {isResolved && (
            <Badge
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] border-0",
                userWon ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
              )}
            >
              {userWon ? (
                <><Check className="mr-1 inline h-3 w-3" />Won +{((userPrediction.payoutCrypto ?? 0) - (userPrediction.cryptoAmount ?? 0)).toFixed(userPrediction.asset === "BTC" ? 6 : 4)} {userPrediction.asset ?? ""}</>
              ) : (
                <><X className="mr-1 inline h-3 w-3" />Lost {(userPrediction.cryptoAmount ?? 0).toFixed(userPrediction.asset === "BTC" ? 6 : 4)} {userPrediction.asset ?? ""}</>
              )}
            </Badge>
          )}
        </div>
      )}
    </Link>
  )
}
