"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { truncateAddress } from "@/lib/testnet"
import { cn } from "@/lib/utils"
import { WalletBalance } from "./WalletBalance"
import { WalletAddress } from "./WalletAddress"
import { WalletFaucetCard } from "./WalletFaucetCard"
import { WalletTransactionList } from "./WalletTransactionList"
import { WalletSendSheet } from "./WalletSendSheet"
import { WalletReceiveSheet } from "./WalletReceiveSheet"
import type { TestnetChain } from "@/lib/db"

const chains: { id: TestnetChain; label: string; short: string }[] = [
  { id: "ethereum", label: "Ethereum", short: "ETH" },
  { id: "solana", label: "Solana", short: "SOL" },
  { id: "bitcoin", label: "Bitcoin", short: "BTC" },
]

export function WalletDashboard() {
  const wallet = useTestnetWalletStore((s) => s.wallet)
  const activeChain = useTestnetWalletStore((s) => s.activeChain)
  const setActiveChain = useTestnetWalletStore((s) => s.setActiveChain)
  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)

  if (!wallet) return null

  const activeAddress =
    activeChain === "ethereum"
      ? wallet.address
      : activeChain === "solana"
        ? wallet.solana?.address
        : wallet.bitcoin?.address

  return (
    <div className="py-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">Your wallet</h1>
            <p className="text-xs text-muted-foreground font-mono">
              {activeAddress ? truncateAddress(activeAddress) : ""}
            </p>
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">
            Testnet
          </span>
        </div>
      </motion.div>

      {/* Chain tabs */}
      <div className="flex rounded-xl bg-muted/50 p-1">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => setActiveChain(chain.id)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
              activeChain === chain.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {chain.short}
          </button>
        ))}
      </div>

      {/* Balance */}
      <WalletBalance />

      {/* Send / Receive buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => setSendOpen(true)}
          className="h-12 rounded-xl text-base font-semibold"
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button
          variant="outline"
          onClick={() => setReceiveOpen(true)}
          className="h-12 rounded-xl text-base font-semibold"
        >
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Receive
        </Button>
      </div>

      {/* Address */}
      <WalletAddress />

      {/* Faucet */}
      <WalletFaucetCard />

      {/* Transaction history */}
      <WalletTransactionList />

      {/* Sheets */}
      <WalletSendSheet open={sendOpen} onOpenChange={setSendOpen} />
      <WalletReceiveSheet open={receiveOpen} onOpenChange={setReceiveOpen} />
    </div>
  )
}
