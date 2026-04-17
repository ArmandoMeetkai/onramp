"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, Shield, Sparkles, Check, Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { WalletEducational } from "./WalletEducational"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"

type SetupStep = "explain" | "creating" | "success"

interface WalletSetupSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function WalletSetupSheet({
  open,
  onOpenChange,
  userId,
}: WalletSetupSheetProps) {
  const [step, setStep] = useState<SetupStep>("explain")
  const [error, setError] = useState<string | null>(null)
  const createWallet = useTestnetWalletStore((s) => s.createWallet)
  const wallet = useTestnetWalletStore((s) => s.wallet)

  const handleCreate = useCallback(async () => {
    setStep("creating")
    setError(null)
    try {
      await createWallet(userId)
      setStep("success")
    } catch {
      setError("Something went wrong. Please try again.")
      setStep("explain")
    }
  }, [createWallet, userId])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setStep("explain")
        setError(null)
      }
      onOpenChange(open)
    },
    [onOpenChange],
  )

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {step === "explain" && (
              <>
                <SheetHeader className="px-0">
                  <SheetTitle className="text-xl">
                    Your crypto wallet
                  </SheetTitle>
                  <SheetDescription>
                    A real wallet on the blockchain. Tokens are free from
                    faucets, no real money involved.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Wallet className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        ETH, SOL, and BTC wallets
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Get ETH, SOL, and BTC from faucets. Use them to make
                        predictions on real blockchain networks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Shield className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Safe and secure
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your wallet is created and encrypted on this device. No
                        one else has access to it.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Welcome bonus included
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your new wallet arrives with a starter balance: 0.05 ETH,
                        0.5 SOL, and 0.002 BTC — enough to start staking right away.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="mt-3 text-center text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleCreate}
                  className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
                >
                  Create my wallet
                </Button>
              </>
            )}

            {step === "creating" && (
              <div className="flex flex-col items-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="h-10 w-10 text-primary" />
                </motion.div>
                <p className="mt-4 font-heading text-lg font-bold">
                  Creating your wallet...
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generating a secure keypair on your device
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
                <h3 className="mt-4 font-heading text-xl font-bold">
                  Wallet created!
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your starter balance is ready: 0.05 ETH · 0.5 SOL · 0.002 BTC.
                </p>

                {wallet && (
                  <div className="mt-4 w-full rounded-xl bg-muted/50 px-4 py-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Your wallet address
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground break-all">
                      {wallet.address}
                    </p>
                  </div>
                )}

                <WalletEducational title="What's next?">
                  Head to <span className="font-semibold">Predict</span> to stake
                  your tokens. When you run out, the faucet on this page tops you
                  up for free.
                </WalletEducational>

                <Button
                  onClick={() => handleOpenChange(false)}
                  className="mt-4 h-12 w-full rounded-xl text-base font-semibold"
                >
                  Get started
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
