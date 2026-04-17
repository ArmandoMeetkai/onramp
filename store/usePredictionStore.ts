import { create } from "zustand"
import { db, type UserPrediction, type PriceSnapshot, type TestnetChain } from "@/lib/db"
import { getMarketById, allMarkets } from "@/data/predictionMarkets"
import { usePriceStore } from "./usePriceStore"
import { usePredictionWalletStore } from "./usePredictionWalletStore"
import { useTestnetWalletStore } from "./useTestnetWalletStore"
import { useProgressStore } from "./useProgressStore"
import { WEI_PER_ETH, LAMPORTS_PER_SOL, SATS_PER_BTC } from "@/lib/testnet"

type Asset = "BTC" | "ETH" | "SOL"
const ASSET_TO_CHAIN: Record<Asset, TestnetChain> = { ETH: "ethereum", SOL: "solana", BTC: "bitcoin" }
const BASE_UNITS_PER_ASSET: Record<Asset, number> = { ETH: WEI_PER_ETH, SOL: LAMPORTS_PER_SOL, BTC: SATS_PER_BTC }

/** Mirrors useTestnetGraduation. Kept in sync so staking debits the wallet
 *  whose balance the form just displayed. */
function isUserGraduated(predictionsCount: number): boolean {
  const testnetWallet = useTestnetWalletStore.getState().wallet
  if (!testnetWallet) return false
  const progress = useProgressStore.getState().progress
  if (!progress) return false
  return progress.confidenceScore >= 50
    && progress.lessonsCompleted.length >= 3
    && predictionsCount >= 2
}

export interface ResolvedMarketResult {
  marketId: string
  question: string
  outcome: "yes" | "no"
  won: boolean
  payoutCrypto: number
  asset: string
}

interface PredictionState {
  userPredictions: UserPrediction[]

  hydrate: (userId: string) => Promise<void>
  placePrediction: (
    userId: string,
    marketId: string,
    position: "yes" | "no",
    asset: "BTC" | "ETH" | "SOL",
    usdAmount: number,
    reasoning?: string
  ) => Promise<boolean>
  resolveMarket: (
    userId: string,
    marketId: string,
    outcome: "yes" | "no"
  ) => Promise<void>
  checkPriceResolutions: (userId: string) => Promise<ResolvedMarketResult[]>

  getPredictionForMarket: (marketId: string) => UserPrediction | undefined
  getMarketOdds: (marketId: string) => { yesPercent: number; noPercent: number }
  getPredictionAccuracy: () => { total: number; correct: number; rate: number }
  getPredictionStats: () => {
    perCoin: Record<"BTC" | "ETH" | "SOL", { staked: number; returned: number; net: number }>
    totalNetUsd: number
    counts: { total: number; wins: number; losses: number; pending: number }
  }
  getCalibrationData: () => {
    buckets: { label: string; midpoint: number; total: number; correct: number; rate: number }[]
    brierScore: number
  }
}

// Module-level lock: prevents concurrent resolveMarket calls on the same market
const resolvingMarkets = new Set<string>()

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
        console.warn(`[Predictions] Removing ${invalid.length} predictions from old schema (missing cryptoAmount)`)
        await db.userPredictions.bulkDelete(invalid.map((p) => p.id))
      }

      set({ userPredictions: valid })
    } catch {
      set({ userPredictions: [] })
    }
  },

  placePrediction: async (userId, marketId, position, asset, usdAmount, reasoning) => {
    const { userPredictions } = get()
    const market = getMarketById(marketId)
    if (!market) return false
    if (userPredictions.some((p) => p.marketId === marketId)) return false

    const price = usePriceStore.getState().getPrice(asset)
    if (price <= 0) return false

    const cryptoAmount = usdAmount / price

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
      ...(reasoning ? { reasoning } : {}),
    }

    // Graduated users stake from the testnet wallet; non-graduated from the
    // practice wallet. Must match usePredictionHoldings so we debit the same
    // balance the user saw in the form.
    if (isUserGraduated(userPredictions.length)) {
      const chain = ASSET_TO_CHAIN[asset]
      const rawUnits = Math.floor(cryptoAmount * BASE_UNITS_PER_ASSET[asset]).toString()
      const success = await useTestnetWalletStore.getState().debitBalance(chain, rawUnits)
      if (!success) return false

      set({ userPredictions: [...userPredictions, prediction] })
      try {
        await db.userPredictions.put(prediction)
      } catch {
        // Prediction persistence failed — refund the testnet debit and roll back memory
        await useTestnetWalletStore.getState().creditBalance(chain, rawUnits)
        set({ userPredictions })
        console.error("Failed to persist prediction — rolled back")
        return false
      }
      return true
    }

    const wallet = usePredictionWalletStore.getState().wallet
    if (!wallet) return false

    const holding = wallet.holdings.find((h) => h.asset === asset)
    if (!holding || holding.amount < cryptoAmount) return false

    const updatedHoldings = wallet.holdings
      .map((h) =>
        h.asset === asset
          ? { ...h, amount: h.amount - cryptoAmount }
          : h
      )
      .filter((h) => h.amount > 0.000001)

    const updatedWallet = { ...wallet, holdings: updatedHoldings }

    usePredictionWalletStore.setState({ wallet: updatedWallet })
    set({ userPredictions: [...userPredictions, prediction] })

    try {
      await db.transaction("rw", db.userPredictions, db.predictionWallets, async () => {
        await db.userPredictions.put(prediction)
        await db.predictionWallets.put(updatedWallet)
      })
    } catch {
      usePredictionWalletStore.setState({ wallet })
      set({ userPredictions })
      console.error("Failed to persist prediction — rolled back")
      return false
    }

    return true
  },

  resolveMarket: async (_userId, marketId, outcome) => {
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

    const asset = prediction.asset as Asset
    // Graduated users receive their payout in the testnet wallet; non-graduated
    // in the practice wallet. Matches the wallet debited at placePrediction time
    // (best-effort: uses current graduation state).
    const graduated = isUserGraduated(userPredictions.length)

    let updatedWallet = null as ReturnType<typeof usePredictionWalletStore.getState>["wallet"]
    if (payoutCrypto > 0 && !graduated) {
      const wallet = usePredictionWalletStore.getState().wallet
      if (wallet) {
        const existingIndex = wallet.holdings.findIndex(
          (h) => h.asset === asset
        )
        const holdings = [...wallet.holdings]

        if (existingIndex >= 0) {
          const existing = holdings[existingIndex]
          const currentPrice = usePriceStore.getState().getPrice(asset)
          const payoutPrice = currentPrice > 0 ? currentPrice : prediction.priceAtPrediction
          const totalCost = existing.avgBuyPrice * existing.amount + payoutPrice * payoutCrypto
          const totalAmount = existing.amount + payoutCrypto
          holdings[existingIndex] = {
            ...existing,
            amount: totalAmount,
            avgBuyPrice: totalAmount > 0 ? totalCost / totalAmount : payoutPrice,
          }
        } else {
          const price = usePriceStore.getState().getPrice(asset)
          holdings.push({
            asset,
            amount: payoutCrypto,
            avgBuyPrice: price > 0 ? price : prediction.priceAtPrediction,
          })
        }

        updatedWallet = { ...wallet, holdings }
      }
    }

    try {
      if (updatedWallet) {
        await db.transaction("rw", db.userPredictions, db.predictionWallets, async () => {
          await db.userPredictions.put(resolved)
          await db.predictionWallets.put(updatedWallet!)
        })
      } else {
        await db.userPredictions.put(resolved)
      }
    } catch {
      console.error("Failed to persist market resolution — no state change applied")
      return
    }

    set({ userPredictions: updatedPredictions })
    if (updatedWallet) {
      usePredictionWalletStore.setState({ wallet: updatedWallet })
    }
    if (payoutCrypto > 0 && graduated) {
      const chain = ASSET_TO_CHAIN[asset]
      const rawUnits = Math.floor(payoutCrypto * BASE_UNITS_PER_ASSET[asset]).toString()
      await useTestnetWalletStore.getState().creditBalance(chain, rawUnits)
    }

    // Recalculate confidence score since prediction accuracy changed
    const progress = useProgressStore.getState().progress
    if (progress) {
      const { total, correct } = get().getPredictionAccuracy()
      const score = Math.min(
        100,
        progress.cardsViewed * 2 +
        progress.simulationsRun * 3 +
        progress.explanationsOpened * 2 +
        progress.lessonsCompleted.length * 5 +
        (progress.replaysCompleted ?? 0) * 4 +
        total * 3 +
        correct * 5
      )
      if (score !== progress.confidenceScore) {
        const updated = { ...progress, confidenceScore: score }
        useProgressStore.setState({ progress: updated })
        db.progress.put(updated).catch(() => {})
      }
    }
  },

  checkPriceResolutions: async (userId) => {
    const { userPredictions } = get()
    const now = new Date()
    const resolved: ResolvedMarketResult[] = []

    for (const market of allMarkets) {
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
        // Use a persisted snapshot so the resolution price is locked the first
        // time we detect the market has passed its date. This prevents the
        // outcome from flipping if the user opens the app days later when the
        // live price has moved.
        let snapshot: PriceSnapshot | undefined
        try {
          snapshot = await db.priceSnapshots.get(market.id)
        } catch {
          // Table may not exist yet on first upgrade
        }

        let price: number
        if (snapshot) {
          price = snapshot.price
        } else {
          price = usePriceStore.getState().getPrice(market.resolutionAsset)
          if (price > 0) {
            try {
              await db.priceSnapshots.put({
                marketId: market.id,
                asset: market.resolutionAsset,
                price,
                capturedAt: new Date(),
              })
            } catch {
              // Non-critical — resolve with live price this time
            }
          }
        }

        if (price > 0) {
          // Weekly markets use threshold 0 — compare closing price against the
          // price the user saw when they placed their prediction (week open proxy)
          const threshold = market.resolutionThreshold === 0
            ? prediction.priceAtPrediction
            : market.resolutionThreshold
          const above = price >= threshold
          outcome =
            (market.resolutionDirection === "above" && above) ||
            (market.resolutionDirection === "below" && !above)
              ? "yes"
              : "no"
        }
      } else if (market.resolvedOutcome) {
        outcome = market.resolvedOutcome
      }

      if (outcome && !resolvingMarkets.has(market.id)) {
        resolvingMarkets.add(market.id)
        try {
          await get().resolveMarket(userId, market.id, outcome)
          // Read the resolved prediction from store — single source of truth
          const resolvedPrediction = get().userPredictions.find(
            (p) => p.id === prediction.id
          )
          if (resolvedPrediction?.resolved) {
            resolved.push({
              marketId: market.id,
              question: market.question,
              outcome,
              won: (resolvedPrediction.payoutCrypto ?? 0) > 0,
              payoutCrypto: resolvedPrediction.payoutCrypto ?? 0,
              asset: prediction.asset,
            })
          }
        } finally {
          resolvingMarkets.delete(market.id)
        }
      }
    }

    return resolved
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

  getCalibrationData: () => {
    const resolved = get().userPredictions.filter((p) => p.resolved)
    if (resolved.length === 0) {
      return { buckets: [], brierScore: 0 }
    }

    // Group resolved predictions into confidence buckets.
    // The user's implied confidence is the odds % of the side they chose.
    const bucketDefs = [
      { label: "5-25%", min: 5, max: 25, midpoint: 15 },
      { label: "25-50%", min: 25, max: 50, midpoint: 37.5 },
      { label: "50-75%", min: 50, max: 75, midpoint: 62.5 },
      { label: "75-95%", min: 75, max: 95, midpoint: 85 },
    ]

    const buckets = bucketDefs.map((def) => ({ ...def, total: 0, correct: 0, rate: 0 }))

    let brierSum = 0

    for (const p of resolved) {
      const odds = get().getMarketOdds(p.marketId)
      const sidePercent = p.position === "yes" ? odds.yesPercent : odds.noPercent
      const won = (p.payoutCrypto ?? 0) > 0

      // Find the matching bucket (last bucket includes upper bound: 75-95)
      for (const bucket of buckets) {
        const isLastBucket = bucket === buckets[buckets.length - 1]
        const inBucket = isLastBucket
          ? sidePercent >= bucket.min && sidePercent <= bucket.max
          : sidePercent >= bucket.min && sidePercent < bucket.max
        if (inBucket) {
          bucket.total++
          if (won) bucket.correct++
          break
        }
      }

      // Brier score: mean squared error between predicted probability and outcome
      const predicted = sidePercent / 100
      const actual = won ? 1 : 0
      brierSum += (predicted - actual) ** 2
    }

    // Calculate rates
    for (const bucket of buckets) {
      bucket.rate = bucket.total > 0 ? bucket.correct / bucket.total : 0
    }

    return {
      buckets: buckets.filter((b) => b.total > 0),
      brierScore: brierSum / resolved.length,
    }
  },
}))
