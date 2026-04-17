"use client"

import { motion } from "framer-motion"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { usePriceStore } from "@/store/usePriceStore"
import { formatEthShort, baseUnitsToAmount } from "@/lib/testnet"
import { formatSolTokens } from "@/lib/solana"
import { formatBtcTokens } from "@/lib/bitcoin"

const chainUnits = {
  ethereum: "ETH",
  solana: "SOL",
  bitcoin: "BTC",
} as const

const chainNetwork = {
  ethereum: "Sepolia",
  solana: "Devnet",
  bitcoin: "Testnet",
} as const

export function WalletBalance() {
  const balances = useTestnetWalletStore((s) => s.balances)
  const activeChain = useTestnetWalletStore((s) => s.activeChain)
  const getPrice = usePriceStore((s) => s.getPrice)

  const asset = chainUnits[activeChain]

  const { displayBalance, nativeAmount } = (() => {
    if (activeChain === "ethereum" && balances.ethereum !== null) {
      return {
        displayBalance: formatEthShort(balances.ethereum),
        nativeAmount: baseUnitsToAmount("ethereum", balances.ethereum),
      }
    }
    if (activeChain === "solana" && balances.solana !== null) {
      return {
        displayBalance: formatSolTokens(balances.solana),
        nativeAmount: baseUnitsToAmount("solana", balances.solana),
      }
    }
    if (activeChain === "bitcoin" && balances.bitcoin !== null) {
      return {
        displayBalance: formatBtcTokens(balances.bitcoin),
        nativeAmount: baseUnitsToAmount("bitcoin", balances.bitcoin),
      }
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
          <p className="text-sm text-muted-foreground">
            {asset}
            <span className="ml-1 text-[11px] font-medium opacity-70">· {chainNetwork[activeChain]}</span>
          </p>
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
