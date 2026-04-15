"use client"

import { useMemo } from "react"
import { usePredictionWalletStore } from "@/store/usePredictionWalletStore"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { usePriceStore } from "@/store/usePriceStore"
import { useTestnetGraduation } from "./useTestnetGraduation"
import { formatEthShort } from "@/lib/testnet"
import { formatSolTokens } from "@/lib/solana"
import { formatBtcTokens } from "@/lib/bitcoin"
import type { HoldingWithPrice } from "@/components/predictions/PredictionPlaceForm"

const ASSETS = ["BTC", "ETH", "SOL"] as const

/**
 * Returns the holdings to use for predictions, depending on graduation status.
 * - Non-graduated: uses fake prediction wallet (usePredictionWalletStore)
 * - Graduated: uses real testnet wallet balances
 */
export function usePredictionHoldings() {
  const { isEligible, hasWallet } = useTestnetGraduation()
  const isGraduated = isEligible && hasWallet

  const fakeWallet = usePredictionWalletStore((s) => s.wallet)
  const testnetWallet = useTestnetWalletStore((s) => s.wallet)
  const testnetBalances = useTestnetWalletStore((s) => s.balances)
  const getPrice = usePriceStore((s) => s.getPrice)

  const holdings: HoldingWithPrice[] = useMemo(() => {
    if (isGraduated) {
      // Map testnet balances to holdings format
      return ASSETS.map((asset) => {
        let amount = 0
        if (asset === "ETH" && testnetBalances.ethereum !== null) {
          // Convert wei to ETH
          amount = Number(testnetBalances.ethereum) / 1e18
        } else if (asset === "SOL" && testnetBalances.solana !== null) {
          // Convert lamports to SOL
          amount = testnetBalances.solana / 1e9
        } else if (asset === "BTC" && testnetBalances.bitcoin !== null) {
          // Convert satoshis to BTC
          amount = testnetBalances.bitcoin / 1e8
        }
        return { asset, amount, price: getPrice(asset) }
      })
    }

    // Non-graduated: use fake wallet
    return ASSETS.map((asset) => ({
      asset,
      amount: fakeWallet?.holdings.find((h) => h.asset === asset)?.amount ?? 0,
      price: getPrice(asset),
    }))
  }, [isGraduated, fakeWallet, testnetBalances, getPrice])

  const cashBalance = isGraduated ? 0 : (fakeWallet?.balance ?? 0)

  const totalUsd = useMemo(() => {
    const holdingsUsd = holdings.reduce((s, h) => s + h.amount * h.price, 0)
    return cashBalance + holdingsUsd
  }, [holdings, cashBalance])

  const formatBalance = (asset: string, amount: number): string => {
    if (isGraduated) {
      if (asset === "ETH") return formatEthShort(BigInt(Math.floor(amount * 1e18)))
      if (asset === "SOL") return formatSolTokens(Math.floor(amount * 1e9))
      if (asset === "BTC") return formatBtcTokens(Math.floor(amount * 1e8))
    }
    return amount.toFixed(asset === "BTC" ? 6 : 4)
  }

  return {
    isGraduated,
    holdings,
    cashBalance,
    totalUsd,
    formatBalance,
    testnetAddress: testnetWallet?.address ?? null,
  }
}
