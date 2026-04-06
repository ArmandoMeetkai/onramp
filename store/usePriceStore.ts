import { create } from "zustand"
import { db } from "@/lib/db"
import { mockPrices as fallbackPrices } from "@/data/mockPrices"

interface PriceData {
  price: number
  change24h: number
}

interface PriceState {
  prices: Record<string, PriceData>
  sparklines: Record<string, number[]>
  lastUpdated: number | null
  isLoading: boolean
  isOffline: boolean
  isStale: boolean
  fetchPrices: () => Promise<void>
  fetchSparklines: () => Promise<void>
  getPrice: (symbol: string) => number
  getName: (symbol: string) => string
  getTagline: (symbol: string) => string
}

const STALE_THRESHOLD = 5 * 60 * 1000 // 5 minutes

const assetNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
}

const assetTaglines: Record<string, string> = {
  BTC: "The first cryptocurrency. Often called digital gold.",
  ETH: "A platform for apps and smart contracts. Powers most of DeFi.",
  SOL: "Built for speed and low fees. Popular for apps and NFTs.",
}

function fallbackPriceData(): Record<string, PriceData> {
  const result: Record<string, PriceData> = {}
  for (const [symbol, data] of Object.entries(fallbackPrices)) {
    result[symbol] = { price: data.price, change24h: data.change24h }
  }
  return result
}

function fallbackSparklineData(): Record<string, number[]> {
  const result: Record<string, number[]> = {}
  for (const [symbol, data] of Object.entries(fallbackPrices)) {
    result[symbol] = data.sparkline
  }
  return result
}

export const usePriceStore = create<PriceState>((set, get) => ({
  prices: fallbackPriceData(),
  sparklines: fallbackSparklineData(),
  lastUpdated: null,
  isLoading: false,
  isOffline: false,
  isStale: false,

  fetchPrices: async () => {
    set({ isLoading: true })

    try {
      if (!navigator.onLine) {
        set({ isOffline: true })
        // Try Dexie cache
        const cached = await db.priceCache.get("latest")
        if (cached) {
          set({
            prices: cached.prices as Record<string, PriceData>,
            lastUpdated: cached.timestamp,
            isStale: Date.now() - cached.timestamp > STALE_THRESHOLD,
            isLoading: false,
          })
          return
        }
        set({ isLoading: false })
        return
      }

      set({ isOffline: false })
      const response = await fetch("/api/prices")

      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()

      if (data.error) throw new Error(String(data.error))

      const priceData = data as Record<string, PriceData>

      const now = Date.now()

      // Save to Dexie cache
      await db.priceCache.put({
        id: "latest",
        prices: priceData,
        sparklines: get().sparklines,
        timestamp: now,
      })

      set({
        prices: priceData,
        lastUpdated: now,
        isStale: false,
        isLoading: false,
      })
    } catch {
      // Fall back to Dexie cache
      try {
        const cached = await db.priceCache.get("latest")
        if (cached) {
          set({
            prices: cached.prices as Record<string, PriceData>,
            lastUpdated: cached.timestamp,
            isStale: Date.now() - cached.timestamp > STALE_THRESHOLD,
            isLoading: false,
          })
          return
        }
      } catch {
        // Dexie error, use mock fallback
      }
      set({ isLoading: false })
    }
  },

  fetchSparklines: async () => {
    try {
      if (!navigator.onLine) return

      const response = await fetch("/api/prices/history")
      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      if (data.error) throw new Error(String(data.error))
      const sparklineData = data as Record<string, number[]>

      set({ sparklines: sparklineData })

      // Update cache with sparklines
      const cached = await db.priceCache.get("latest")
      if (cached) {
        await db.priceCache.put({ ...cached, sparklines: sparklineData })
      }
    } catch {
      // Keep existing sparklines (mock fallback)
      try {
        const cached = await db.priceCache.get("latest")
        if (cached?.sparklines && Object.keys(cached.sparklines).length > 0) {
          set({ sparklines: cached.sparklines })
        }
      } catch {
        // Keep mock data
      }
    }
  },

  getPrice: (symbol) => {
    return get().prices[symbol]?.price ?? fallbackPrices[symbol]?.price ?? 0
  },

  getName: (symbol) => {
    return assetNames[symbol] ?? symbol
  },

  getTagline: (symbol) => {
    return assetTaglines[symbol] ?? ""
  },
}))
