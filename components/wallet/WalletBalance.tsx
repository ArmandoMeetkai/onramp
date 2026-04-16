"use client"

import { motion } from "framer-motion"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { usePriceStore } from "@/store/usePriceStore"
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
  const getPrice = usePriceStore((s) => s.getPrice)

  const asset = chainUnits[activeChain]

  const { displayBalance, nativeAmount } = (() => {
    if (activeChain === "ethereum" && balances.ethereum !== null) {
      const amount = Number(balances.ethereum) / 1e18
      return { displayBalance: formatEthShort(balances.ethereum), nativeAmount: amount }
    }
    if (activeChain === "solana" && balances.solana !== null) {
      const amount = balances.solana / 1e9
      return { displayBalance: formatSolTokens(balances.solana), nativeAmount: amount }
    }
    if (activeChain === "bitcoin" && balances.bitcoin !== null) {
      const amount = balances.bitcoin / 1e8
      return { displayBalance: formatBtcTokens(balances.bitcoin), nativeAmount: amount }
    }
    return { displayBalance: "0", nativeAmount: 0 }
  })()

  const price = getPrice(asset)
  const usdValue = nativeAmount * price

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
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{asset}</p>
          {usdValue > 0 && (
            <p className="text-sm text-muted-foreground">
              ~${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
