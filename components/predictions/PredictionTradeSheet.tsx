"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, TrendingUp } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InfoTip } from "@/components/shared/InfoTip"
import { cn, formatCrypto } from "@/lib/utils"
import { usePredictionWalletStore } from "@/store/usePredictionWalletStore"
import { usePriceStore } from "@/store/usePriceStore"
import { TradeAssetStep } from "@/components/portfolio/trade/TradeAssetStep"
import { TradeConfirmStep } from "@/components/portfolio/trade/TradeConfirmStep"

type TradeAction = "buy" | "sell"
type TradeStep = "asset" | "action" | "amount" | "confirm" | "success"

interface PredictionTradeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const presetAmounts = [10, 25, 50, 100]

export function PredictionTradeSheet({ open, onOpenChange }: PredictionTradeSheetProps) {
  const [step, setStep] = useState<TradeStep>("asset")
  const [selectedAsset, setSelectedAsset] = useState("")
  const [action, setAction] = useState<TradeAction>("buy")
  const [amount, setAmount] = useState("")

  const wallet = usePredictionWalletStore((s) => s.wallet)
  const buy = usePredictionWalletStore((s) => s.buy)
  const sell = usePredictionWalletStore((s) => s.sell)
  const getPrice = usePriceStore((s) => s.getPrice)
  const getName = usePriceStore((s) => s.getName)

  const holdings = wallet?.holdings ?? []
  const price = getPrice(selectedAsset)
  const usdAmount = parseFloat(amount) || 0
  const cryptoAmount = price > 0 ? usdAmount / price : 0

  const holding = holdings.find((h) => h.asset === selectedAsset)
  const holdingValue = holding ? holding.amount * price : 0
  const maxSellAmount = Math.round(holdingValue * 100) / 100

  const canProceed = (() => {
    if (usdAmount <= 0) return false
    if (action === "buy") return usdAmount <= (wallet?.balance ?? 0)
    return usdAmount <= maxSellAmount + 0.01
  })()

  const reset = useCallback(() => {
    setStep("asset")
    setSelectedAsset("")
    setAction("buy")
    setAmount("")
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) reset()
      onOpenChange(open)
    },
    [onOpenChange, reset]
  )

  const handleSelectAsset = useCallback((symbol: string) => {
    setSelectedAsset(symbol)
    setStep("action")
  }, [])

  const handleSelectAction = useCallback((a: TradeAction) => {
    setAction(a)
    setAmount("")
    setStep("amount")
  }, [])

  const handleConfirm = useCallback(async () => {
    const success =
      action === "buy"
        ? await buy(selectedAsset, usdAmount)
        : await sell(selectedAsset, usdAmount)

    if (success) {
      setStep("success")
    }
  }, [action, buy, sell, selectedAsset, usdAmount])

  const goBack = useCallback(() => {
    if (step === "action") setStep("asset")
    else if (step === "amount") setStep("action")
    else if (step === "confirm") setStep("amount")
  }, [step])

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        {step !== "asset" && step !== "success" && (
          <button
            onClick={goBack}
            className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {step === "asset" && (
              <TradeAssetStep onSelect={handleSelectAsset} />
            )}

            {step === "action" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>
                    What would you like to do with {getName(selectedAsset)}?
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSelectAction("buy")}
                    className="h-16 rounded-2xl text-base font-semibold"
                  >
                    Buy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelectAction("sell")}
                    disabled={!holding || holding.amount <= 0}
                    className="h-16 rounded-2xl text-base font-semibold"
                  >
                    Sell
                  </Button>
                </div>
                {(!holding || holding.amount <= 0) && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    You don&apos;t have any {getName(selectedAsset)} to sell yet
                  </p>
                )}
              </>
            )}

            {step === "amount" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>How much to {action}?</SheetTitle>
                  <SheetDescription>
                    {action === "buy"
                      ? `Available: $${(wallet?.balance ?? 0).toFixed(2)}`
                      : `Holdings worth: $${maxSellAmount.toFixed(2)}`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => {
                        const v = e.target.value
                        if (v === "" || /^\d*\.?\d*$/.test(v)) setAmount(v)
                      }}
                      className="h-14 rounded-xl pl-8 text-center text-2xl font-bold"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(String(preset))}
                        className={cn(
                          "flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                          amount === String(preset) && "border-primary bg-secondary"
                        )}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>

                  {usdAmount > 0 && price > 0 && (
                    <div className="rounded-xl bg-muted/40 px-3 py-2.5 text-center space-y-0.5">
                      <p className="text-sm text-muted-foreground">
                        You&apos;ll {action === "buy" ? "get" : "sell"}{" "}
                        <strong className="text-foreground">
                          {formatCrypto(cryptoAmount, selectedAsset)} {selectedAsset}
                        </strong>
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-xs text-muted-foreground">
                          You can own any fraction of a coin
                        </p>
                        <InfoTip>
                          You don&apos;t need to buy a whole Bitcoin.
                          0.01 BTC is worth 1% of one Bitcoin. The value is proportional.
                        </InfoTip>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setStep("confirm")}
                    disabled={!canProceed}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    Review {action === "buy" ? "Purchase" : "Sale"}
                  </Button>
                </div>
              </>
            )}

            {step === "confirm" && (
              <TradeConfirmStep
                action={action}
                assetName={getName(selectedAsset)}
                usdAmount={usdAmount}
                cryptoAmount={cryptoAmount}
                symbol={selectedAsset}
                price={price}
                onConfirm={handleConfirm}
              />
            )}

            {step === "success" && (
              <div className="flex flex-col items-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
                >
                  <Check className="h-8 w-8 text-success" />
                </motion.div>
                <h3 className="mt-4 font-heading text-xl font-bold">
                  {action === "buy" ? "Purchase" : "Sale"} complete!
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your prediction wallet has been updated.
                </p>

                {action === "buy" && (
                  <div className="mt-4 w-full rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                    <TrendingUp className="inline h-3.5 w-3.5 text-accent mr-1" />
                    <strong className="text-foreground">Ready to predict?</strong>{" "}
                    You can now stake your {getName(selectedAsset)} on any active market.
                  </div>
                )}

                <Button
                  onClick={() => handleOpenChange(false)}
                  className="mt-4 h-12 w-full rounded-xl text-base font-semibold"
                >
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
