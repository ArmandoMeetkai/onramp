import Dexie, { type EntityTable } from "dexie"

export interface UserProfile {
  id: string
  name: string
  experienceLevel: "new" | "curious" | "cautious" | "active"
  riskStyle: "conservative" | "moderate" | "aggressive"
  createdAt: Date
  lastActiveAt: Date
}

export interface UserProgress {
  userId: string
  cardsViewed: number
  simulationsRun: number
  explanationsOpened: number
  replaysCompleted: number
  streakDays: number
  lastStreakDate: string
  confidenceScore: number
  lessonsCompleted: string[]
}

export interface SimulationEntry {
  id: string
  userId: string
  scenarioId: string
  amount: number
  decisionType: "conservative" | "moderate" | "aggressive"
  bestCase: number
  worstCase: number
  timestamp: Date
}

export interface Holding {
  asset: string
  amount: number
  avgBuyPrice: number
}

export interface Transaction {
  id: string
  type: "buy" | "sell"
  asset: string
  amount: number
  price: number
  timestamp: Date
}

export interface PracticePortfolio {
  userId: string
  balance: number
  holdings: Holding[]
  transactions: Transaction[]
}

export interface PriceCacheEntry {
  id: string
  prices: Record<string, { price: number; change24h: number }>
  sparklines: Record<string, number[]>
  timestamp: number
}

export interface CompletedReplayEntry {
  id: string
  userId: string
  eventId: string
  decision: "buy" | "sell" | "hold" | "wait"
  completedAt: Date
}

const db = new Dexie("OnrampDB") as Dexie & {
  profiles: EntityTable<UserProfile, "id">
  progress: EntityTable<UserProgress, "userId">
  simulations: EntityTable<SimulationEntry, "id">
  portfolios: EntityTable<PracticePortfolio, "userId">
  priceCache: EntityTable<PriceCacheEntry, "id">
  completedReplays: EntityTable<CompletedReplayEntry, "id">
}

db.version(2).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
})

db.version(3).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
})

export { db }
