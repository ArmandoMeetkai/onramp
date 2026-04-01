import { NextResponse } from "next/server"
import { mockPrices } from "@/data/mockPrices"

const COINGECKO_BASE = "https://api.coingecko.com/api/v3"
const CACHE_TTL = 600_000 // 10 minutes for historical data

const coinIds: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
}

let cachedHistory: { data: Record<string, number[]>; timestamp: number } | null = null

function getFallbackSparklines(): Record<string, number[]> {
  const result: Record<string, number[]> = {}
  for (const [symbol, data] of Object.entries(mockPrices)) {
    result[symbol] = data.sparkline
  }
  return result
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function GET() {
  if (cachedHistory && Date.now() - cachedHistory.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedHistory.data)
  }

  try {
    const results: Record<string, number[]> = {}

    for (const [symbol, id] of Object.entries(coinIds)) {
      const response = await fetch(
        `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=30`,
        { next: { revalidate: 600 } }
      )

      if (!response.ok) {
        throw new Error(`CoinGecko history error: ${response.status}`)
      }

      const raw = await response.json()
      const prices = (raw.prices as [number, number][]) ?? []

      const step = Math.max(1, Math.floor(prices.length / 30))
      results[symbol] = prices
        .filter((_, i) => i % step === 0)
        .slice(0, 30)
        .map(([, price]) => Math.round(price * 100) / 100)

      // Rate limit: wait between calls
      await delay(2000)
    }

    cachedHistory = { data: results, timestamp: Date.now() }
    return NextResponse.json(results)
  } catch {
    // Return cached data if available, otherwise mock fallback
    if (cachedHistory) {
      return NextResponse.json(cachedHistory.data)
    }
    return NextResponse.json(getFallbackSparklines())
  }
}
