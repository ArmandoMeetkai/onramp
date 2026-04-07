"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePriceStore } from "@/store/usePriceStore"
import { TradeAssetStep } from "./trade/TradeAssetStep"
import { TradeConfirmStep } from "./trade/TradeConfirmStep"
import { TradeSuccessStep } from "./trade/TradeSuccessStep"
import type { Holding } from "@/lib/db"

type TradeAction = "buy" | "sell"
type TradeStep = "asset" | "action" | "amount" | "confirm" | "success"

interface TradeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  holdings: Holding[]
}

const presetAmounts = [10, 25, 50, 100]

function formatCrypto(n: number): string {
  if (n < 0.001) return n.toFixed(6)
  if (n < 1) return n.toFixed(4)
  return n.toFixed(2)
}

export function TradeSheet({ open, onOpenChange, holdings }: TradeSheetProps) {
  const [step, setStep] = useState<TradeStep>("asset")
  const [selectedAsset, setSelectedAsset] = useState("")
  const [action, setAction] = useState<TradeAction>("buy")
  const [amount, setAmount] = useState("")

  const portfolio = usePortfolioStore((s) => s.portfolio)
  const buy = usePortfolioStore((s) => s.buy)
  const sell = usePortfolioStore((s) => s.sell)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const getPrice = usePriceStore((s) => s.getPrice)
  const getName = usePriceStore((s) => s.getName)

  const price = getPrice(selectedAsset)
  const usdAmount = parseFloat(amount) || 0
  const cryptoAmount = price > 0 ? usdAmount / price : 0

  const holding = holdings.find((h) => h.asset === selectedAsset)
  const holdingValue = holding ? holding.amount * price : 0
  const maxSellAmount = Math.round(holdingValue * 100) / 100

  const canProceed = (() => {
    if (usdAmount <= 0) return false
    if (action === "buy") return usdAmount <= (portfolio?.balance ?? 0)
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
      await updateStreak()
      setStep("success")
    }
  }, [action, buy, sell, selectedAsset, usdAmount, updateStreak])

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
                <div className="mt-4 rounded-xl bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Buying</strong> means you spend some of your
                  cash to own a piece of {getName(selectedAsset)}.{" "}
                  <strong className="text-foreground">Selling</strong> converts it back to cash.
                  You can own a tiny fraction — you don&apos;t need to buy a whole coin.
                </div>
              </>
            )}

            {step === "amount" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>How much to {action}?</SheetTitle>
                  <SheetDescription>
                    {action === "buy"
                      ? `Available cash: $${(portfolio?.balance ?? 0).toFixed(2)}`
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
                        You&apos;ll receive{" "}
                        <strong className="text-foreground">
                          {formatCrypto(cryptoAmount)} {selectedAsset}
                        </strong>
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-xs text-muted-foreground">
                          Fractions are totally normal in crypto
                        </p>
                        <InfoTip>
                          You don&apos;t need to buy a whole Bitcoin or Ethereum.
                          You can own <strong className="text-foreground">any fraction</strong>,
                          down to very small amounts. The value is proportional.
                          0.01 BTC is worth 1% of one Bitcoin.
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
              <TradeSuccessStep
                action={action}
                symbol={selectedAsset}
                onClose={() => handleOpenChange(false)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
