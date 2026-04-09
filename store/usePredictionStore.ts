import { create } from "zustand"
import { db, type UserPrediction } from "@/lib/db"
import { getMarketById, predictionMarkets } from "@/data/predictionMarkets"
import { usePriceStore } from "./usePriceStore"
import { usePortfolioStore } from "./usePortfolioStore"

interface PredictionState {
  userPredictions: UserPrediction[]

  hydrate: (userId: string) => Promise<void>
  placePrediction: (
    userId: string,
    marketId: string,
    position: "yes" | "no",
    asset: "BTC" | "ETH" | "SOL",
    usdAmount: number
  ) => Promise<boolean>
  resolveMarket: (
    userId: string,
    marketId: string,
    outcome: "yes" | "no"
  ) => Promise<void>
  checkPriceResolutions: (userId: string) => Promise<void>

  getPredictionForMarket: (marketId: string) => UserPrediction | undefined
  getMarketOdds: (marketId: string) => { yesPercent: number; noPercent: number }
  getPredictionAccuracy: () => { total: number; correct: number; rate: number }
  getPredictionStats: () => {
    perCoin: Record<"BTC" | "ETH" | "SOL", { staked: number; returned: number; net: number }>
    totalNetUsd: number
    counts: { total: number; wins: number; losses: number; pending: number }
  }
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  userPredictions: [],

  hydrate: async (userId) => {
    try {
      const all = await db.userPredictions
        .where("userId")
        .equals(userId)
        .toArray()

      // Clean up predictions from old schema (missing cryptoAmount)
      const valid = all.filter((p) => p.cryptoAmount != null)
      const invalid = all.filter((p) => p.cryptoAmount == null)

      if (invalid.length > 0) {
        await db.userPredictions.bulkDelete(invalid.map((p) => p.id))
      }

      set({ userPredictions: valid })
    } catch {
      set({ userPredictions: [] })
    }
  },

  placePrediction: async (userId, marketId, position, asset, usdAmount) => {
    const { userPredictions } = get()
    const market = getMarketById(marketId)
    if (!market) return false

    const portfolio = usePortfolioStore.getState().portfolio
    if (!portfolio) return false

    const price = usePriceStore.getState().getPrice(asset)
    if (price <= 0) return false

    const cryptoAmount = usdAmount / price

    // Check user has enough of this asset
    const holding = portfolio.holdings.find((h) => h.asset === asset)
    if (!holding || holding.amount < cryptoAmount) return false

    if (userPredictions.some((p) => p.marketId === marketId)) return false

    const prediction: UserPrediction = {
      id: `${userId}-${marketId}`,
      userId,
      marketId,
      position,
      asset,
      cryptoAmount,
      priceAtPrediction: price,
      timestamp: new Date(),
      resolved: false,
      payoutCrypto: null,
    }

    // Debit from holdings
    const updatedHoldings = portfolio.holdings
      .map((h) =>
        h.asset === asset
          ? { ...h, amount: h.amount - cryptoAmount }
          : h
      )
      .filter((h) => h.amount > 0.000001)

    const updatedPortfolio = { ...portfolio, holdings: updatedHoldings }
    usePortfolioStore.setState({ portfolio: updatedPortfolio })

    set({ userPredictions: [...userPredictions, prediction] })

    try {
      await Promise.all([
        db.userPredictions.put(prediction),
        db.portfolios.put(updatedPortfolio),
      ])
    } catch {
      console.error("Failed to persist prediction")
    }

    return true
  },

  resolveMarket: async (userId, marketId, outcome) => {
    const { userPredictions } = get()

    const prediction = userPredictions.find(
      (p) => p.marketId === marketId && !p.resolved
    )
    if (!prediction) return

    const odds = get().getMarketOdds(marketId)
    const userWon = prediction.position === outcome

    const sidePercent =
      prediction.position === "yes" ? odds.yesPercent : odds.noPercent
    const payoutCrypto = userWon
      ? prediction.cryptoAmount * (100 / sidePercent)
      : 0

    const resolved: UserPrediction = {
      ...prediction,
      resolved: true,
      payoutCrypto,
    }

    const updatedPredictions = userPredictions.map((p) =>
      p.id === prediction.id ? resolved : p
    )

    // Credit winnings back to holdings
    if (payoutCrypto > 0) {
      const portfolio = usePortfolioStore.getState().portfolio
      if (portfolio) {
        const existingIndex = portfolio.holdings.findIndex(
          (h) => h.asset === prediction.asset
        )
        const holdings = [...portfolio.holdings]

        if (existingIndex >= 0) {
          const existing = holdings[existingIndex]
          holdings[existingIndex] = {
            ...existing,
            amount: existing.amount + payoutCrypto,
          }
        } else {
          const price = usePriceStore.getState().getPrice(prediction.asset)
          holdings.push({
            asset: prediction.asset,
            amount: payoutCrypto,
            avgBuyPrice: price > 0 ? price : prediction.priceAtPrediction,
          })
        }

        const updatedPortfolio = { ...portfolio, holdings }
        usePortfolioStore.setState({ portfolio: updatedPortfolio })
        try {
          await db.portfolios.put(updatedPortfolio)
        } catch {
          console.error("Failed to persist payout")
        }
      }
    }

    set({ userPredictions: updatedPredictions })

    try {
      await db.userPredictions.put(resolved)
    } catch {
      console.error("Failed to persist market resolution")
    }
  },

  checkPriceResolutions: async (userId) => {
    const { userPredictions } = get()
    const now = new Date()

    for (const market of predictionMarkets) {
      if (market.status !== "active") continue
      if (new Date(market.resolutionDate) > now) continue

      const prediction = userPredictions.find(
        (p) => p.marketId === market.id && !p.resolved
      )
      if (!prediction) continue

      let outcome: "yes" | "no" | null = null

      if (
        market.category === "price" &&
        market.resolutionAsset &&
        market.resolutionThreshold != null &&
        market.resolutionDirection
      ) {
        const price = usePriceStore.getState().getPrice(market.resolutionAsset)
        if (price > 0) {
          const above = price >= market.resolutionThreshold
          outcome =
            (market.resolutionDirection === "above" && above) ||
            (market.resolutionDirection === "below" && !above)
              ? "yes"
              : "no"
        }
      } else if (market.resolvedOutcome) {
        outcome = market.resolvedOutcome
      }

      if (outcome) {
        await get().resolveMarket(userId, market.id, outcome)
      }
    }
  },

  getPredictionForMarket: (marketId) => {
    return get().userPredictions.find((p) => p.marketId === marketId)
  },

  getMarketOdds: (marketId) => {
    const market = getMarketById(marketId)
    if (!market) return { yesPercent: 50, noPercent: 50 }

    let yesPercent = market.initialYesPercent

    const prediction = get().userPredictions.find((p) => p.marketId === marketId)
    if (prediction) {
      yesPercent += prediction.position === "yes" ? 3 : -3
    }

    yesPercent = Math.max(5, Math.min(95, yesPercent))

    return { yesPercent, noPercent: 100 - yesPercent }
  },

  getPredictionAccuracy: () => {
    const resolved = get().userPredictions.filter((p) => p.resolved)
    const correct = resolved.filter(
      (p) => p.payoutCrypto !== null && p.payoutCrypto > 0
    )
    return {
      total: resolved.length,
      correct: correct.length,
      rate: resolved.length > 0 ? correct.length / resolved.length : 0,
    }
  },

  getPredictionStats: () => {
    const predictions = get().userPredictions
    const assets = ["BTC", "ETH", "SOL"] as const

    const perCoin = Object.fromEntries(
      assets.map((a) => [a, { staked: 0, returned: 0, net: 0 }])
    ) as Record<"BTC" | "ETH" | "SOL", { staked: number; returned: number; net: number }>

    let wins = 0
    let losses = 0
    let pending = 0

    for (const p of predictions) {
      const coin = p.asset
      if (!perCoin[coin]) continue

      if (!p.resolved) {
        perCoin[coin].staked += p.cryptoAmount
        pending++
      } else {
        const payout = p.payoutCrypto ?? 0
        perCoin[coin].staked += p.cryptoAmount
        perCoin[coin].returned += payout
        perCoin[coin].net += payout - p.cryptoAmount
        if (payout > 0) wins++
        else losses++
      }
    }

    // Total net P&L in USD using current prices
    const totalNetUsd = assets.reduce((sum, a) => {
      const price = usePriceStore.getState().getPrice(a)
      return sum + perCoin[a].net * price
    }, 0)

    return {
      perCoin,
      totalNetUsd,
      counts: { total: predictions.length, wins, losses, pending },
    }
  },
}))
