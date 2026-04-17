"use client"

import { useCallback } from "react"
import { motion } from "framer-motion"
import { Droplets } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { WalletEducational } from "./WalletEducational"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"

export function WalletFaucetCard() {
  const wallet = useTestnetWalletStore((s) => s.wallet)
  const activeChain = useTestnetWalletStore((s) => s.activeChain)

  const address =
    activeChain === "ethereum"
      ? wallet?.address
      : activeChain === "solana"
        ? wallet?.solana?.address
        : wallet?.bitcoin?.address

  // Pending faucet drops are processed app-wide in useHydration — this card
  // is purely the CTA that sends users to /faucet.
  const handleOpen = useCallback(async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      toast.success("Address copied! Opening faucet...")
    } catch {}
    window.open(`/faucet?chain=${activeChain}&address=${encodeURIComponent(address)}`, "_blank")
  }, [address, activeChain])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Droplets className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Get coins</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Request free ETH, SOL, or BTC from the testnet faucet.
            </p>
          </div>
        </div>

        <Button
          onClick={handleOpen}
          className="mt-4 h-11 w-full rounded-xl font-semibold"
        >
          Get coins
        </Button>
      </div>

      <WalletEducational title="What is a faucet?">
        A faucet gives you free testnet tokens. Paste your wallet address,
        choose a network, and receive tokens instantly. They work like real
        crypto but have no monetary value.
      </WalletEducational>
    </motion.div>
  )
}
