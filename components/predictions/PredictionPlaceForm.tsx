"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PredictionPlaceFormProps {
  asset: "BTC" | "ETH" | "SOL"
  holdingAmount: number
  currentPrice: number
  onPlace: (position: "yes" | "no", usdAmount: number) => Promise<boolean>
}

const USD_AMOUNTS = [10, 25, 50, 100] as const

function formatCrypto(amount: number, asset: string): string {
  if (asset === "BTC") return amount.toFixed(6)
  if (asset === "ETH") return amount.toFixed(4)
  return amount.toFixed(2)
}

export function PredictionPlaceForm({
  asset,
  holdingAmount,
  currentPrice,
  onPlace,
}: PredictionPlaceFormProps) {
  const [position, setPosition] = useState<"yes" | "no" | null>(null)
  const [usdAmount, setUsdAmount] = useState<number>(25)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const holdingUsdValue = holdingAmount * currentPrice
  const cryptoAmount = currentPrice > 0 ? usdAmount / currentPrice : 0
  const canPlace =
    position !== null &&
    holdingAmount > 0 &&
    cryptoAmount <= holdingAmount &&
    cryptoAmount > 0

  const hasNoHoldings = holdingAmount <= 0

  async function handleSubmit() {
    if (!canPlace || !position || isSubmitting) return
    setIsSubmitting(true)
    const success = await onPlace(position, usdAmount)
    if (!success) setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 space-y-5"
    >
      <p className="text-sm font-semibold">Make your prediction</p>

      {/* Holdings info */}
      <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Your {asset}</p>
          <p className="text-sm font-semibold">
            {formatCrypto(holdingAmount, asset)} {asset}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          ~${holdingUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      {hasNoHoldings ? (
        <Link
          href="/practice"
          className="group flex items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4 transition-all hover:border-accent/50 active:scale-[0.98]"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">You don&apos;t hold any {asset} yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap here to buy {asset} in your practice portfolio, then come back to predict.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <>
          {/* YES / NO toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setPosition("yes")}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-200",
                position === "yes"
                  ? "bg-success text-success-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              YES
            </button>
            <button
              onClick={() => setPosition("no")}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-200",
                position === "no"
                  ? "bg-danger text-danger-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              NO
            </button>
          </div>

          {/* Amount selection — USD with crypto equivalent */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              How much {asset} to predict with
            </p>
            <div className="flex gap-2">
              {USD_AMOUNTS.map((a) => {
                const crypto = currentPrice > 0 ? a / currentPrice : 0
                const tooMuch = crypto > holdingAmount
                return (
                  <button
                    key={a}
                    onClick={() => setUsdAmount(a)}
                    disabled={tooMuch}
                    className={cn(
                      "flex-1 flex flex-col items-center rounded-xl py-2 transition-all duration-200",
                      usdAmount === a
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                      tooMuch && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <span className="text-sm font-semibold">${a}</span>
                    <span className="text-[10px] opacity-70">
                      {formatCrypto(crypto, asset)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          {position && (
            <div className="rounded-xl bg-muted/30 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                You&apos;re predicting <span className="font-semibold text-foreground">{position.toUpperCase()}</span> with
              </p>
              <p className="mt-1 text-lg font-bold">
                {formatCrypto(cryptoAmount, asset)} {asset}
              </p>
              <p className="text-xs text-muted-foreground">~${usdAmount}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!canPlace || isSubmitting}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {isSubmitting
              ? "Placing..."
              : position
                ? `Predict ${position.toUpperCase()} with ${formatCrypto(cryptoAmount, asset)} ${asset}`
                : "Choose YES or NO"
            }
          </Button>
        </>
      )}
    </motion.div>
  )
}
