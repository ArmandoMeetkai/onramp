"use client"

import Link from "next/link"
import { ChevronRight, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PredictionOddsBar } from "./PredictionOddsBar"
import { cn, formatCrypto, getTimeRemaining } from "@/lib/utils"
import type { PredictionMarket } from "@/data/predictionMarkets"
import type { UserPrediction } from "@/lib/db"

interface PredictionMarketCardProps {
  market: PredictionMarket
  odds: { yesPercent: number; noPercent: number }
  userPrediction?: UserPrediction
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
            : userPrediction?.resolved
              ? "border-danger/20"
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
            You: {userPrediction.position.toUpperCase()} · {formatCrypto(userPrediction.cryptoAmount ?? 0, userPrediction.asset ?? "SOL")} {userPrediction.asset ?? "?"}
          </Badge>
          {isResolved && (
            <Badge
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] border-0",
                userWon ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
              )}
            >
              {userWon ? (
                <><Check className="mr-1 inline h-3 w-3" />Won +{formatCrypto((userPrediction.payoutCrypto ?? 0) - (userPrediction.cryptoAmount ?? 0), userPrediction.asset ?? "SOL")} {userPrediction.asset ?? "?"}</>
              ) : (
                <><X className="mr-1 inline h-3 w-3" />Lost {formatCrypto(userPrediction.cryptoAmount ?? 0, userPrediction.asset ?? "SOL")} {userPrediction.asset ?? "?"}</>
              )}
            </Badge>
          )}
        </div>
      )}
    </Link>
  )
}
