import { NextResponse } from "next/server"
import { mockPrices } from "@/data/mockPrices"

const COINGECKO_BASE = "https://api.coingecko.com/api/v3"
const CACHE_TTL = 60_000 // 60 seconds

let cachedData: { data: unknown; timestamp: number } | null = null

export async function GET() {
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedData.data)
  }

  try {
    const response = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const raw = await response.json()

    const data = {
      BTC: {
        price: raw.bitcoin?.usd ?? 0,
        change24h: raw.bitcoin?.usd_24h_change ?? 0,
      },
      ETH: {
        price: raw.ethereum?.usd ?? 0,
        change24h: raw.ethereum?.usd_24h_change ?? 0,
      },
      SOL: {
        price: raw.solana?.usd ?? 0,
        change24h: raw.solana?.usd_24h_change ?? 0,
      },
    }

    cachedData = { data, timestamp: Date.now() }

    return NextResponse.json(data)
  } catch {
    if (cachedData) {
      return NextResponse.json(cachedData.data)
    }
    // Fall back to mock prices
    const fallback: Record<string, { price: number; change24h: number }> = {}
    for (const [symbol, data] of Object.entries(mockPrices)) {
      fallback[symbol] = { price: data.price, change24h: data.change24h }
    }
    return NextResponse.json(fallback)
  }
}
