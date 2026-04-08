"use client"

import { motion } from "framer-motion"
import { Check, X, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserPrediction } from "@/lib/db"

interface PredictionResolutionBannerProps {
  prediction: UserPrediction
  resolvedOutcome: "yes" | "no"
  currentPrice: number
}

function fmtCrypto(amount: number, asset: string): string {
  if (asset === "BTC") return amount.toFixed(6)
  if (asset === "ETH") return amount.toFixed(4)
  return amount.toFixed(2)
}

export function PredictionResolutionBanner({
  prediction,
  resolvedOutcome,
  currentPrice,
}: PredictionResolutionBannerProps) {
  const userWon = prediction.position === resolvedOutcome
  const payoutCrypto = prediction.payoutCrypto ?? 0
  const netCrypto = payoutCrypto - prediction.cryptoAmount
  const price = currentPrice > 0 ? currentPrice : prediction.priceAtPrediction

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl p-6 text-center",
        userWon ? "bg-success/10" : "bg-danger/10"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
          userWon ? "bg-success/20" : "bg-danger/20"
        )}
      >
        {userWon ? (
          <Trophy className="h-7 w-7 text-success" />
        ) : (
          <X className="h-7 w-7 text-danger" />
        )}
      </div>

      <p className={cn("mt-3 text-lg font-bold", userWon ? "text-success" : "text-danger")}>
        {userWon ? "You got it right!" : "Not this time"}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        The answer was <span className="font-semibold">{resolvedOutcome.toUpperCase()}</span>.
        You predicted <span className="font-semibold">{prediction.position.toUpperCase()}</span>.
      </p>

      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Spent</p>
          <p className="font-semibold">
            {fmtCrypto(prediction.cryptoAmount, prediction.asset)} {prediction.asset}
          </p>
          <p className="text-[11px] text-muted-foreground">
            ~${Math.round(prediction.cryptoAmount * price)}
          </p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-muted-foreground">{userWon ? "Payout" : "Lost"}</p>
          <p className={cn("font-semibold", userWon ? "text-success" : "text-danger")}>
            {userWon
              ? `+${fmtCrypto(netCrypto, prediction.asset)} ${prediction.asset}`
              : `-${fmtCrypto(prediction.cryptoAmount, prediction.asset)} ${prediction.asset}`
            }
          </p>
          <p className="text-[11px] text-muted-foreground">
            ~${Math.round((userWon ? netCrypto : prediction.cryptoAmount) * price)}
          </p>
        </div>
      </div>

      {userWon && (
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-success">
          <Check className="h-3 w-3" />
          {fmtCrypto(payoutCrypto, prediction.asset)} {prediction.asset} added to your holdings
        </div>
      )}
    </motion.div>
  )
}
