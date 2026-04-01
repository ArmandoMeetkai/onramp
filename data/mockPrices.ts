// Phase 5 will replace this with CoinGecko API

export interface AssetPrice {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  sparkline: number[]
}

export const mockPrices: Record<string, AssetPrice> = {
  BTC: {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 67_432.18,
    change24h: 2.14,
    sparkline: [
      62100, 62800, 63200, 62900, 63800, 64200, 63900, 64800, 65100, 64700,
      65300, 65800, 66100, 65700, 66400, 66800, 65900, 66200, 66700, 67100,
      66500, 66900, 67300, 66800, 67100, 67500, 67000, 67200, 67600, 67432,
    ],
  },
  ETH: {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3_521.47,
    change24h: -0.87,
    sparkline: [
      3380, 3420, 3450, 3410, 3480, 3510, 3470, 3530, 3560, 3520,
      3550, 3590, 3610, 3570, 3600, 3630, 3580, 3560, 3540, 3570,
      3550, 3530, 3560, 3540, 3520, 3510, 3530, 3540, 3520, 3521,
    ],
  },
  SOL: {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 142.85,
    change24h: 4.32,
    sparkline: [
      118, 121, 124, 122, 126, 129, 127, 131, 133, 130,
      132, 135, 137, 134, 136, 138, 135, 137, 139, 141,
      138, 140, 142, 139, 141, 143, 140, 141, 143, 142.85,
    ],
  },
}

export const lastUpdated = "March 31, 2026 at 2:15 PM"

export function getPrice(symbol: string): number {
  return mockPrices[symbol]?.price ?? 0
}

export function getAssetList(): AssetPrice[] {
  return Object.values(mockPrices)
}
