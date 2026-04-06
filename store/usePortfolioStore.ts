import { create } from "zustand"
import { db, type PracticePortfolio, type Holding, type Transaction } from "@/lib/db"
import { usePriceStore } from "./usePriceStore"

const INITIAL_BALANCE = 10_000

interface PortfolioState {
  portfolio: PracticePortfolio | null
  hydrate: (userId: string) => Promise<void>
  initializePortfolio: (userId: string) => Promise<void>
  buy: (asset: string, usdAmount: number) => Promise<boolean>
  sell: (asset: string, usdAmount: number) => Promise<boolean>
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: null,

  hydrate: async (userId) => {
    try {
      const portfolio = await db.portfolios.get(userId)
      set({ portfolio: portfolio ?? null })
    } catch {
      set({ portfolio: null })
    }
  },

  initializePortfolio: async (userId) => {
    try {
      const existing = await db.portfolios.get(userId)
      if (existing) {
        set({ portfolio: existing })
        return
      }
    } catch {
      // continue to create default
    }
    const portfolio: PracticePortfolio = {
      userId,
      balance: INITIAL_BALANCE,
      holdings: [],
      transactions: [],
    }
    set({ portfolio })
    try {
      await db.portfolios.put(portfolio)
    } catch {
      console.error("Failed to persist initial portfolio")
    }
  },

  buy: async (asset, usdAmount) => {
    const current = get().portfolio
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

    const updated: PracticePortfolio = {
      ...current,
      balance: current.balance - usdAmount,
      holdings,
      transactions: [transaction, ...current.transactions],
    }

    set({ portfolio: updated })
    try {
      await db.portfolios.put(updated)
    } catch {
      console.error("Failed to persist buy transaction")
    }
    return true
  },

  sell: async (asset, usdAmount) => {
    const current = get().portfolio
    if (!current || usdAmount <= 0) return false

    const price = usePriceStore.getState().getPrice(asset)
    if (price <= 0) return false

    const holding = current.holdings.find((h) => h.asset === asset)
    if (!holding || holding.amount <= 0) return false

    // If selling ~all, sell everything to avoid dust
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

    const updated: PracticePortfolio = {
      ...current,
      balance: current.balance + actualUsdAmount,
      holdings,
      transactions: [transaction, ...current.transactions],
    }

    set({ portfolio: updated })
    try {
      await db.portfolios.put(updated)
    } catch {
      console.error("Failed to persist sell transaction")
    }
    return true
  },
}))
