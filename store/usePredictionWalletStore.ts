import { create } from "zustand"
import { db, type PredictionWallet, type Holding, type Transaction } from "@/lib/db"
import { usePriceStore } from "./usePriceStore"

const INITIAL_BALANCE = 1_000

interface PredictionWalletState {
  wallet: PredictionWallet | null
  hydrate: (userId: string) => Promise<void>
  initializeWallet: (userId: string) => Promise<void>
  buy: (asset: string, usdAmount: number) => Promise<boolean>
  sell: (asset: string, usdAmount: number) => Promise<boolean>
}

export const usePredictionWalletStore = create<PredictionWalletState>((set, get) => ({
  wallet: null,

  hydrate: async (userId) => {
    try {
      const wallet = await db.predictionWallets.get(userId)
      set({ wallet: wallet ?? null })
    } catch {
      set({ wallet: null })
    }
  },

  initializeWallet: async (userId) => {
    try {
      const existing = await db.predictionWallets.get(userId)
      if (existing) {
        set({ wallet: existing })
        return
      }
    } catch {
      // continue to create default
    }
    const wallet: PredictionWallet = {
      userId,
      balance: INITIAL_BALANCE,
      holdings: [],
      transactions: [],
    }
    set({ wallet })
    try {
      await db.predictionWallets.put(wallet)
    } catch {
      console.error("Failed to persist initial prediction wallet")
    }
  },

  buy: async (asset, usdAmount) => {
    const current = get().wallet
    if (!current || usdAmount <= 0 || usdAmount > current.balance) return false

    const price = usePriceStore.getState().getPrice(asset)
    if (price <= 0) return false

    const cryptoAmount = usdAmount / price

    const existingIndex = current.holdings.findIndex((h) => h.asset === asset)
    const holdings: Holding[] = [...current.holdings]

    if (existingIndex >= 0) {
      const existing = holdings[existingIndex]
      const totalAmount = existing.amount + cryptoAmount
      const totalCost = existing.avgBuyPrice * existing.amount + price * cryptoAmount
      holdings[existingIndex] = {
        asset,
        amount: totalAmount,
        avgBuyPrice: totalCost / totalAmount,
      }
    } else {
      holdings.push({ asset, amount: cryptoAmount, avgBuyPrice: price })
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "buy",
      asset,
      amount: cryptoAmount,
      price,
      timestamp: new Date(),
    }

    const updated: PredictionWallet = {
      ...current,
      balance: current.balance - usdAmount,
      holdings,
      transactions: [transaction, ...current.transactions].slice(0, 500),
    }

    set({ wallet: updated })
    try {
      await db.predictionWallets.put(updated)
    } catch {
      set({ wallet: current })
      console.error("Failed to persist prediction wallet buy — rolled back")
      return false
    }
    return true
  },

  sell: async (asset, usdAmount) => {
    const current = get().wallet
    if (!current || usdAmount <= 0) return false

    const price = usePriceStore.getState().getPrice(asset)
    if (price <= 0) return false

    const holding = current.holdings.find((h) => h.asset === asset)
    if (!holding || holding.amount <= 0) return false

    const maxSellableUsd = holding.amount * price
    const isSellingAll = usdAmount >= maxSellableUsd * 0.999
    const cryptoAmount = isSellingAll ? holding.amount : usdAmount / price

    if (cryptoAmount > holding.amount * 1.001) return false

    const remainingAmount = isSellingAll ? 0 : holding.amount - cryptoAmount
    const actualUsdAmount = isSellingAll ? maxSellableUsd : usdAmount

    const holdings: Holding[] = current.holdings
      .map((h) =>
        h.asset === asset
          ? { ...h, amount: remainingAmount }
          : h
      )
      .filter((h) => h.amount > 0.000001)

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "sell",
      asset,
      amount: cryptoAmount,
      price,
      timestamp: new Date(),
    }

    const updated: PredictionWallet = {
      ...current,
      balance: current.balance + actualUsdAmount,
      holdings,
      transactions: [transaction, ...current.transactions].slice(0, 500),
    }

    set({ wallet: updated })
    try {
      await db.predictionWallets.put(updated)
    } catch {
      set({ wallet: current })
      console.error("Failed to persist prediction wallet sell — rolled back")
      return false
    }
    return true
  },
}))
