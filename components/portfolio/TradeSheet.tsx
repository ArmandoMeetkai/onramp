"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowLeft } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePortfolioStore } from "@/store/usePortfolioStore"
import { useProgressStore } from "@/store/useProgressStore"
import { usePriceStore } from "@/store/usePriceStore"
import type { Holding } from "@/lib/db"

type TradeAction = "buy" | "sell"
type TradeStep = "asset" | "action" | "amount" | "confirm" | "success"

interface TradeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  holdings: Holding[]
}

const assets = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
  { symbol: "SOL", name: "Solana", icon: "◎" },
] as const

const presetAmounts = [10, 25, 50, 100]

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
    return usdAmount <= maxSellAmount + 0.01 // tolerance for rounding
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
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4" showCloseButton={false}>
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
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>Choose an asset</SheetTitle>
                  <SheetDescription>What would you like to trade?</SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {assets.map(({ symbol, name, icon }) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelectAsset(symbol)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-xl font-bold">
                        {icon}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${getPrice(symbol).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
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
                  <SheetTitle>
                    How much to {action}?
                  </SheetTitle>
                  <SheetDescription>
                    {action === "buy"
                      ? `Available: $${(portfolio?.balance ?? 0).toFixed(2)}`
                      : `Holdings worth: $${maxSellAmount.toFixed(2)}`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
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
                    <p className="text-center text-sm text-muted-foreground">
                      ≈ {cryptoAmount < 0.001
                        ? cryptoAmount.toFixed(6)
                        : cryptoAmount < 1
                          ? cryptoAmount.toFixed(4)
                          : cryptoAmount.toFixed(2)}{" "}
                      {selectedAsset}
                    </p>
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
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>Confirm your {action}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Asset</span>
                      <span className="font-semibold">{getName(selectedAsset)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Action</span>
                      <span className="font-semibold capitalize">{action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-semibold">${usdAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        You&apos;ll {action === "buy" ? "get" : "return"}
                      </span>
                      <span className="font-semibold">
                        {cryptoAmount < 0.001
                          ? cryptoAmount.toFixed(6)
                          : cryptoAmount < 1
                            ? cryptoAmount.toFixed(4)
                            : cryptoAmount.toFixed(2)}{" "}
                        {selectedAsset}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price per coin</span>
                      <span className="font-semibold">${price.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    This is a simulation. No real money is involved.
                  </p>
                  <Button
                    onClick={handleConfirm}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    Confirm {action === "buy" ? "Purchase" : "Sale"}
                  </Button>
                </div>
              </>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center py-6">
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
                  Your practice portfolio has been updated
                </p>
                <Button
                  onClick={() => handleOpenChange(false)}
                  className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
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
