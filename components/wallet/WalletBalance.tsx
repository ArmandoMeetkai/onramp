"use client"

import { motion } from "framer-motion"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { formatEthShort } from "@/lib/testnet"
import { formatSolTokens } from "@/lib/solana"
import { formatBtcTokens } from "@/lib/bitcoin"

const chainUnits = {
  ethereum: "ETH",
  solana: "SOL",
  bitcoin: "BTC",
} as const

export function WalletBalance() {
  const balances = useTestnetWalletStore((s) => s.balances)
  const activeChain = useTestnetWalletStore((s) => s.activeChain)

  const displayBalance = (() => {
    if (activeChain === "ethereum") {
      return balances.ethereum !== null ? formatEthShort(balances.ethereum) : "0"
    }
    if (activeChain === "solana") {
      return balances.solana !== null ? formatSolTokens(balances.solana) : "0"
    }
    if (activeChain === "bitcoin") {
      return balances.bitcoin !== null ? formatBtcTokens(balances.bitcoin) : "0"
    }
    return "0"
  })()

  return (
    <motion.div
      key={activeChain}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-transparent border border-primary/20 p-5"
    >
      <p className="text-xs font-medium text-muted-foreground">Balance</p>
      <div className="mt-2">
        <p className="font-heading text-3xl font-bold tracking-tight">
          {displayBalance}
        </p>
        <p className="text-sm text-muted-foreground">{chainUnits[activeChain]}</p>
      </div>
    </motion.div>
  )
}
