"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Wallet } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InfoTip } from "@/components/shared/InfoTip"
import { cn, formatCrypto } from "@/lib/utils"

export interface HoldingWithPrice {
  asset: "BTC" | "ETH" | "SOL"
  amount: number
  price: number
}

interface PredictionPlaceFormProps {
  holdings: HoldingWithPrice[]
  onPlace: (position: "yes" | "no", asset: "BTC" | "ETH" | "SOL", usdAmount: number, reasoning?: string) => Promise<boolean>
  onBuy?: () => void
  walletLink?: string
}

const USD_AMOUNTS = [10, 25, 50, 100] as const

export function PredictionPlaceForm({ holdings, onPlace, onBuy, walletLink }: PredictionPlaceFormProps) {
  const firstWithBalance = holdings.find((h) => h.amount > 0)
  const [selectedAsset, setSelectedAsset] = useState<"BTC" | "ETH" | "SOL">(
    firstWithBalance?.asset ?? "BTC"
  )
  const [position, setPosition] = useState<"yes" | "no" | null>(null)
  const [usdAmount, setUsdAmount] = useState<number>(25)
  const [customInput, setCustomInput] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [reasoning, setReasoning] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const holding = holdings.find((h) => h.asset === selectedAsset)
  const holdingAmount = holding?.amount ?? 0
  const currentPrice = holding?.price ?? 0

  const holdingUsdValue = holdingAmount * currentPrice
  const cryptoAmount = currentPrice > 0 ? usdAmount / currentPrice : 0

  const hasAnyHoldings = holdings.some((h) => h.amount > 0)
  const hasNoHoldings = holdingAmount <= 0
  const canPlace = position !== null && !hasNoHoldings && cryptoAmount <= holdingAmount && cryptoAmount > 0

  async function handleSubmit() {
    if (!canPlace || !position || isSubmitting) return
    setIsSubmitting(true)
    await onPlace(position, selectedAsset, usdAmount, reasoning.trim() || undefined)
    setIsSubmitting(false)
  }

  // No holdings at all — show CTA to get tokens
  if (!hasAnyHoldings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <p className="text-sm font-semibold mb-3">Make your prediction</p>
        {walletLink ? (
          <Link
            href={walletLink}
            className="group flex w-full items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-left transition-all hover:border-accent/50 active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Get tokens to start predicting</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Get free ETH, SOL, or BTC from the faucet, then come back to stake.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : onBuy ? (
          <button
            onClick={onBuy}
            className="group flex w-full items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-left transition-all hover:border-accent/50 active:scale-[0.98]"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">Buy crypto to start predicting</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You need BTC, ETH, or SOL in your wallet to make a prediction.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : null}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 space-y-5"
    >
      <p className="text-sm font-semibold">Make your prediction</p>

      {/* Coin selector — shows balance in crypto, not USD */}
      <div id="pred-coin-selector">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Choose coin
        </p>
        <div className="flex gap-2">
          {holdings.map((h) => {
            const hasFunds = h.amount > 0
            return (
              <button
                key={h.asset}
                onClick={() => {
                  if (!hasFunds) return
                  setSelectedAsset(h.asset)
                  setPosition(null)
                }}
                disabled={!hasFunds}
                className={cn(
                  "flex-1 rounded-xl py-3 px-2 transition-all duration-200 flex flex-col items-center gap-1",
                  selectedAsset === h.asset && hasFunds
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                  !hasFunds && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className="text-sm font-bold">{h.asset}</span>
                <span className="text-[10px] font-medium opacity-80">
                  {hasFunds
                    ? `${formatCrypto(h.amount, h.asset)} ${h.asset}`
                    : "0"}
                </span>
              </button>
            )
          })}
        </div>

        {/* Get coins link for empty ones */}
        {holdings.some((h) => h.amount <= 0) && walletLink && (
          <Link
            href={walletLink}
            className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
          >
            <Wallet className="h-3 w-3" />
            Get more coins from faucet
          </Link>
        )}
      </div>

      {/* Balance summary */}
      <div className="rounded-xl bg-muted/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Your {selectedAsset} balance</p>
          <p className="text-xs text-muted-foreground">
            ~${holdingUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <p className="mt-1 text-lg font-bold">
          {formatCrypto(holdingAmount, selectedAsset)} {selectedAsset}
        </p>
      </div>

      {hasNoHoldings ? (
        walletLink ? (
          <Link
            href={walletLink}
            className="group flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-left transition-all hover:border-accent/50 active:scale-[0.98]"
          >
            <Wallet className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Get {selectedAsset} from faucet</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Or choose another coin above
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-accent" />
          </Link>
        ) : onBuy ? (
          <button
            onClick={onBuy}
            className="group flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-left transition-all hover:border-accent/50 active:scale-[0.98]"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">Buy {selectedAsset} first</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Or choose another coin above</p>
            </div>
            <ArrowRight className="h-4 w-4 text-accent" />
          </button>
        ) : null
      ) : (
        <>
          {/* YES / NO */}
          <div id="pred-yes-no">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Your prediction
            </p>
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
          </div>

          {/* Amount */}
          <div id="pred-amount">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Amount to stake</p>
              <p className="text-[10px] text-muted-foreground">
                Max: ~${Math.floor(holdingUsdValue)}
              </p>
            </div>
            <div className="flex gap-2">
              {USD_AMOUNTS.map((a) => {
                const crypto = currentPrice > 0 ? a / currentPrice : 0
                const tooMuch = crypto > holdingAmount
                return (
                  <button
                    key={a}
                    onClick={() => {
                      setUsdAmount(a)
                      setIsCustom(false)
                      setCustomInput("")
                    }}
                    disabled={tooMuch}
                    className={cn(
                      "flex-1 flex flex-col items-center rounded-xl py-2 transition-all duration-200",
                      !isCustom && usdAmount === a
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                      tooMuch && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <span className="text-sm font-semibold">${a}</span>
                    <span className="text-[10px] opacity-70">
                      {formatCrypto(crypto, selectedAsset)}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-2 relative">
              <Input
                type="number"
                inputMode="decimal"
                min={1}
                max={holdingUsdValue}
                step="any"
                placeholder={`e.g. $${Math.min(Math.floor(holdingUsdValue / 2), 50)} = ${formatCrypto(currentPrice > 0 ? Math.min(Math.floor(holdingUsdValue / 2), 50) / currentPrice : 0, selectedAsset)} ${selectedAsset}`}
                value={customInput}
                onChange={(e) => {
                  const val = e.target.value
                  setCustomInput(val)
                  const num = parseFloat(val)
                  if (!isNaN(num) && num > 0) {
                    setUsdAmount(num)
                    setIsCustom(true)
                  } else if (val === "") {
                    setIsCustom(false)
                    setUsdAmount(25)
                  }
                }}
                className="h-10 rounded-xl text-sm"
              />
              {isCustom && customInput && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  = {formatCrypto(cryptoAmount, selectedAsset)} {selectedAsset}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {position && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                You are betting <span className="font-semibold text-foreground">{position.toUpperCase()}</span>
              </p>
              <p className="mt-1 text-xl font-bold">
                {formatCrypto(cryptoAmount, selectedAsset)} {selectedAsset}
              </p>
              <p className="text-xs text-muted-foreground">~${usdAmount.toLocaleString()}</p>
            </div>
          )}

          {/* Reasoning */}
          {position && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-xs font-medium text-muted-foreground">Why? (optional)</p>
              </div>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder={`I think ${position.toUpperCase()} because...`}
                maxLength={280}
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
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
                ? `Stake ${formatCrypto(cryptoAmount, selectedAsset)} ${selectedAsset}`
                : "Choose YES or NO"
            }
          </Button>
        </>
      )}
    </motion.div>
  )
}
