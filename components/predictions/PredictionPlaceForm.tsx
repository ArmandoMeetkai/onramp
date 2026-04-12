"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
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
}

const USD_AMOUNTS = [10, 25, 50, 100] as const

const COIN_LABELS: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
}

export function PredictionPlaceForm({ holdings, onPlace, onBuy }: PredictionPlaceFormProps) {
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
    // Always reset — on success the parent unmounts this form;
    // on failure it stays visible and the button must re-enable
    setIsSubmitting(false)
  }

  if (!hasAnyHoldings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <p className="text-sm font-semibold mb-3">Make your prediction</p>
        <button
          onClick={onBuy}
          className="group flex w-full items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-left transition-all hover:border-accent/50 active:scale-[0.98]"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">Buy crypto to start predicting</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You need BTC, ETH, or SOL in your prediction wallet. Tap here to buy some, then come back to stake it on your prediction.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        </button>
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

      {/* Coin selector */}
      <div id="pred-coin-selector">
        <div className="flex items-center gap-1.5 mb-2">
          <p className="text-xs font-medium text-muted-foreground">Predict with</p>
          <InfoTip label="">
            Choose which coin you want to put on the line. The number below each coin is the total value you hold in that crypto, converted to USD. Only coins you already own are available.
          </InfoTip>
        </div>
        <div className="flex gap-2">
          {holdings.map((h) => (
            <div key={h.asset} className="flex-1 flex flex-col gap-1">
              <button
                onClick={() => {
                  if (h.amount <= 0) return
                  setSelectedAsset(h.asset)
                  setPosition(null)
                }}
                disabled={h.amount <= 0}
                className={cn(
                  "w-full rounded-xl py-2.5 px-3 text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-0.5",
                  selectedAsset === h.asset
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                  h.amount <= 0 && "opacity-40 cursor-not-allowed"
                )}
              >
                <span>{h.asset}</span>
                <span className="text-[10px] font-normal opacity-70">
                  {h.amount > 0
                    ? `$${(h.amount * h.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    : "none"}
                </span>
              </button>
              {h.amount <= 0 && (
                <button
                  onClick={onBuy}
                  className="text-center text-[10px] text-primary underline decoration-dotted underline-offset-2"
                >
                  Buy {h.asset}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected coin balance */}
      <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">{COIN_LABELS[selectedAsset]} balance</p>
          <p className="text-sm font-semibold">
            {formatCrypto(holdingAmount, selectedAsset)} {selectedAsset}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          ~${holdingUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      {hasNoHoldings ? (
        <button
          onClick={onBuy}
          className="group flex w-full items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-left transition-all hover:border-accent/50 active:scale-[0.98]"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">You don&apos;t have any {selectedAsset} yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buy {selectedAsset} to stake on this prediction, or choose another coin above.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : (
        <>
          {/* YES / NO */}
          <div id="pred-yes-no">
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-xs font-medium text-muted-foreground">Your prediction</p>
              <InfoTip label="">
                Read the question at the top of the page. If you think it will happen, tap YES. If you think it won&apos;t, tap NO. There&apos;s no partial answer, just your best call.
              </InfoTip>
            </div>
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
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-xs font-medium text-muted-foreground">Amount to stake</p>
              <InfoTip label="">
                This is how much crypto you&apos;re risking. The small number below each button shows the equivalent crypto amount. If your prediction is correct, you get this back plus a bonus from people who predicted wrong.
              </InfoTip>
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
            <div className="mt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={holdingUsdValue}
                  step="any"
                  placeholder="Custom amount"
                  value={customInput}
                  onChange={(e) => {
                    const val = e.target.value
                    setCustomInput(val)
                    const num = parseFloat(val)
                    if (!isNaN(num) && num > 0) {
                      setUsdAmount(num)
                      setIsCustom(true)
                    } else if (val === "") {
                      // Reset to default preset when input is cleared
                      setIsCustom(false)
                      setUsdAmount(25)
                    }
                  }}
                  onFocus={() => {
                    if (customInput) setIsCustom(true)
                  }}
                  className="h-10 rounded-xl pl-7 text-sm"
                />
              </div>
              {isCustom && customInput && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatCrypto(cryptoAmount, selectedAsset)} {selectedAsset}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {position && (
            <div className="rounded-xl bg-muted/30 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Predicting <span className="font-semibold text-foreground">{position.toUpperCase()}</span> · staking
              </p>
              <p className="mt-1 text-lg font-bold">
                {formatCrypto(cryptoAmount, selectedAsset)} {selectedAsset}
              </p>
              <p className="text-xs text-muted-foreground">~${usdAmount}</p>
            </div>
          )}

          {/* Reasoning */}
          {position && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-xs font-medium text-muted-foreground">Why do you think this?</p>
                <span className="text-[10px] text-muted-foreground/60">Optional</span>
              </div>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder={`I'm predicting ${position.toUpperCase()} because...`}
                maxLength={280}
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground/50">
                {reasoning.length}/280
              </p>
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
                ? `Confirm ${position.toUpperCase()} · ${formatCrypto(cryptoAmount, selectedAsset)} ${selectedAsset}`
                : "Choose YES or NO"
            }
          </Button>
        </>
      )}
    </motion.div>
  )
}
