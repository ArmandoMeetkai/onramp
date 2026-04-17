"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WalletEducational } from "./WalletEducational"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { truncateAddress, baseUnitsToAmount } from "@/lib/testnet"
import { isValidSolAddress } from "@/lib/solana"
import { isValidBtcTestnetAddress } from "@/lib/bitcoin"

type SendStep = "address" | "amount" | "confirm" | "sending" | "success"

interface WalletSendSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const presetsByChain = {
  ethereum: ["0.001", "0.005", "0.01", "0.05"],
  solana: ["0.01", "0.05", "0.1", "0.5"],
  bitcoin: ["0.0001", "0.0005", "0.001", "0.005"],
} as const

const chainLabels = {
  ethereum: "ETH",
  solana: "SOL",
  bitcoin: "BTC",
} as const

function isValidAddressForChain(value: string, chain: string): boolean {
  if (chain === "ethereum") return /^0x[a-fA-F0-9]{40}$/.test(value)
  if (chain === "solana") return isValidSolAddress(value)
  if (chain === "bitcoin") return isValidBtcTestnetAddress(value)
  return false
}

export function WalletSendSheet({ open, onOpenChange }: WalletSendSheetProps) {
  const [step, setStep] = useState<SendStep>("address")
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeChain = useTestnetWalletStore((s) => s.activeChain)
  const balances = useTestnetWalletStore((s) => s.balances)
  const sendTransaction = useTestnetWalletStore((s) => s.sendTransaction)

  const presets = presetsByChain[activeChain]
  const chainLabel = chainLabels[activeChain]

  const currentBalance = baseUnitsToAmount(activeChain, balances[activeChain])

  const parsedAmount = Number.parseFloat(amount) || 0
  const hasAmount = parsedAmount > 0
  const exceedsBalance = parsedAmount > currentBalance

  const reset = useCallback(() => {
    setStep("address")
    setToAddress("")
    setAmount("")
    setTxHash(null)
    setError(null)
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) reset()
      onOpenChange(open)
    },
    [onOpenChange, reset],
  )

  const handleConfirm = useCallback(async () => {
    setStep("sending")
    setError(null)

    const hash = await sendTransaction(activeChain, toAddress, amount)

    if (hash) {
      setTxHash(hash)
      setStep("success")
    } else {
      setError("Transaction failed. Please try again.")
      setStep("confirm")
    }
  }, [sendTransaction, activeChain, toAddress, amount])

  const goBack = useCallback(() => {
    if (step === "amount") setStep("address")
    else if (step === "confirm") setStep("amount")
  }, [step])

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        {step !== "address" && step !== "success" && step !== "sending" && (
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
            {step === "address" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle className="text-xl">Send {chainLabel}</SheetTitle>
                  <SheetDescription>
                    Enter the wallet address you want to send to.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="send-address"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Recipient address
                    </label>
                    <Input
                      id="send-address"
                      type="text"
                      placeholder={activeChain === "ethereum" ? "0x..." : activeChain === "solana" ? "Base58 address..." : "tb1... or m/n..."}
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value.trim())}
                      className="mt-1 h-12 rounded-xl font-mono text-sm"
                      autoFocus
                    />
                    {toAddress.length > 2 && !isValidAddressForChain(toAddress, activeChain) && (
                      <p className="mt-1 text-xs text-destructive">
                        Enter a valid {chainLabel} address
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => setStep("amount")}
                    disabled={!isValidAddressForChain(toAddress, activeChain)}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === "amount" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>How much {chainLabel} to send?</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-4">
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
                    className="h-14 rounded-xl text-center text-2xl font-bold"
                    autoFocus
                  />

                  <p className="text-xs text-muted-foreground text-right">
                    Balance: {currentBalance.toFixed(activeChain === "bitcoin" ? 8 : 4)} {chainLabel}
                  </p>

                  <div className="flex gap-2">
                    {presets.map((preset) => {
                      const tooMuch = Number.parseFloat(preset) > currentBalance
                      return (
                        <button
                          key={preset}
                          onClick={() => !tooMuch && setAmount(preset)}
                          disabled={tooMuch}
                          className={`flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted ${
                            amount === preset ? "border-primary bg-secondary" : ""
                          } ${tooMuch ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          {preset}
                        </button>
                      )
                    })}
                  </div>

                  {exceedsBalance && hasAmount && (
                    <p className="text-sm text-destructive">
                      Not enough {chainLabel}. Your balance is {currentBalance.toFixed(activeChain === "bitcoin" ? 8 : 4)}.
                    </p>
                  )}

                  <Button
                    onClick={() => setStep("confirm")}
                    disabled={!hasAmount || exceedsBalance}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    Review
                  </Button>
                </div>
              </>
            )}

            {step === "confirm" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle>Confirm transaction</SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-muted/40 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">To</span>
                      <span className="font-mono text-sm">
                        {truncateAddress(toAddress)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-sm font-semibold">
                        {amount} {chainLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="text-xs text-muted-foreground">
                        {activeChain === "ethereum" ? "Sepolia" : activeChain === "solana" ? "Devnet" : "Testnet"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-2.5">
                    <p className="text-xs text-muted-foreground">
                      This transaction uses testnet tokens. No real money is involved.
                    </p>
                  </div>

                  {error && (
                    <p className="text-center text-sm text-destructive">{error}</p>
                  )}

                  <Button
                    onClick={handleConfirm}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    Send now
                  </Button>
                </div>
              </>
            )}

            {step === "sending" && (
              <div className="flex flex-col items-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-10 w-10 text-primary" />
                </motion.div>
                <p className="mt-4 font-heading text-lg font-bold">Sending...</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Processing your transaction
                </p>
              </div>
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
                <h3 className="mt-4 font-heading text-xl font-bold">Sent!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Transaction recorded. Your balance was updated.
                </p>

                <WalletEducational title="What just happened?">
                  In this demo, transactions are recorded locally — the hash
                  looks real but isn&apos;t broadcast to the live testnet, so
                  it won&apos;t show up on block explorers. In a production
                  build, signing and broadcasting would use the installed
                  chain SDKs.
                </WalletEducational>

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
