"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
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
import { CoinIcon } from "@/components/shared/CoinIcon"
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
  {
    symbol: "BTC",
    name: "Bitcoin",
    tagline: "The first cryptocurrency. Often called digital gold.",
    lessonId: "what-is-bitcoin",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    tagline: "A platform for apps and smart contracts. Powers most of DeFi.",
    lessonId: "what-is-blockchain",
  },
  {
    symbol: "SOL",
    name: "Solana",
    tagline: "Built for speed and low fees. Popular for apps and NFTs.",
    lessonId: "what-is-market-cap",
  },
] as const

const presetAmounts = [10, 25, 50, 100]

const successLearnLinks: Record<string, { lessonId: string; label: string }> = {
  BTC: { lessonId: "what-is-bitcoin", label: "Learn about Bitcoin" },
  ETH: { lessonId: "what-is-blockchain", label: "Learn about blockchains" },
  SOL: { lessonId: "what-is-market-cap", label: "Learn about market cap" },
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

  function formatCrypto(n: number): string {
    if (n < 0.001) return n.toFixed(6)
    if (n < 1) return n.toFixed(4)
    return n.toFixed(2)
  }

  const learnLink = successLearnLinks[selectedAsset]

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
            {/* Step 1: Pick an asset */}
            {step === "asset" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>Choose a cryptocurrency</SheetTitle>
                  <SheetDescription>
                    Not sure which to pick? Tap any option to learn more.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {assets.map(({ symbol, name, tagline }) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelectAsset(symbol)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
                    >
                      <CoinIcon symbol={symbol} size="lg" />
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-semibold">{name}</p>
                          <p className="text-xs text-muted-foreground">{symbol}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">
                          {tagline}
                        </p>
                        <p className="mt-0.5 text-xs font-medium">
                          ${getPrice(symbol).toLocaleString()} per coin
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Buy or sell */}
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

                {/* Mini explainer */}
                <div className="mt-4 rounded-xl bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Buying</strong> means you spend some of your
                  cash to own a piece of {getName(selectedAsset)}.{" "}
                  <strong className="text-foreground">Selling</strong> converts it back to cash.
                  You can own a tiny fraction — you don&apos;t need to buy a whole coin.
                </div>
              </>
            )}

            {/* Step 3: Enter amount */}
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

            {/* Step 4: Confirm */}
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
                      <span className="text-sm text-muted-foreground">You spend</span>
                      <span className="font-semibold">${usdAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        You {action === "buy" ? "receive" : "return"}
                      </span>
                      <span className="font-semibold">
                        {formatCrypto(cryptoAmount)} {selectedAsset}
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

            {/* Step 5: Success */}
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
                  Your practice portfolio has been updated.
                </p>

                {action === "buy" && (
                  <div className="mt-4 w-full rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                    💡 <strong className="text-foreground">What just happened?</strong>{" "}
                    Some of your cash was exchanged for a fraction of{" "}
                    {getName(selectedAsset)}. Its value will rise and fall with the
                    market. Watch it in Your Holdings.
                  </div>
                )}

                {learnLink && (
                  <Link
                    href={`/learn/${learnLink.lessonId}`}
                    onClick={() => handleOpenChange(false)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <BookOpen className="h-4 w-4 text-primary" />
                    {learnLink.label}
                  </Link>
                )}

                <Button
                  onClick={() => handleOpenChange(false)}
                  className="mt-3 h-12 w-full rounded-xl text-base font-semibold"
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
