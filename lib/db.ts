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

export interface UserPrediction {
  id: string
  userId: string
  marketId: string
  position: "yes" | "no"
  asset: "BTC" | "ETH" | "SOL"
  cryptoAmount: number
  priceAtPrediction: number
  timestamp: Date
  resolved: boolean
  payoutCrypto: number | null
  reasoning?: string
}

export interface PredictionWallet {
  userId: string
  balance: number
  holdings: Holding[]
  transactions: Transaction[]
}

export interface PriceSnapshot {
  marketId: string
  asset: string
  price: number
  capturedAt: Date
}

export interface ChainKeys {
  address: string
  encryptedKey: string
  salt: string
  iv: string
}

export interface TestnetBalances {
  ethereum: string  // wei as string (bigint serialized)
  solana: number    // lamports
  bitcoin: number   // satoshis
}

export interface TestnetWallet {
  userId: string
  /** Ethereum Sepolia */
  address: string
  encryptedPrivateKey: string
  encryptionSalt: string
  encryptionIV: string
  /** Solana Devnet */
  solana: ChainKeys | null
  /** Bitcoin Testnet */
  bitcoin: ChainKeys | null
  /** Persisted balances */
  balances: TestnetBalances
  createdAt: Date
}

export type TestnetChain = "ethereum" | "solana" | "bitcoin"

export interface TestnetTransaction {
  id: string
  userId: string
  chain: TestnetChain
  type: "faucet" | "send" | "receive"
  hash: string
  to: string
  from: string
  amount: string
  status: "pending" | "confirmed" | "failed"
  timestamp: Date
}

const db = new Dexie("OnrampDB") as Dexie & {
  profiles: EntityTable<UserProfile, "id">
  progress: EntityTable<UserProgress, "userId">
  simulations: EntityTable<SimulationEntry, "id">
  portfolios: EntityTable<PracticePortfolio, "userId">
  priceCache: EntityTable<PriceCacheEntry, "id">
  completedReplays: EntityTable<CompletedReplayEntry, "id">
  userPredictions: EntityTable<UserPrediction, "id">
  priceSnapshots: EntityTable<PriceSnapshot, "marketId">
  predictionWallets: EntityTable<PredictionWallet, "userId">
  testnetWallets: EntityTable<TestnetWallet, "userId">
  testnetTransactions: EntityTable<TestnetTransaction, "id">
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

db.version(4).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
  userPredictions: "id, userId, marketId, timestamp",
})

db.version(5).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
  userPredictions: "id, userId, marketId, timestamp",
  priceSnapshots: "marketId",
})

db.version(6).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
  userPredictions: "id, userId, marketId, timestamp",
  priceSnapshots: "marketId",
  predictionWallets: "userId",
})

db.version(7).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
  userPredictions: "id, userId, marketId, timestamp",
  priceSnapshots: "marketId",
  predictionWallets: "userId",
  testnetWallets: "userId",
  testnetTransactions: "id, userId, hash, timestamp",
})

db.version(8).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
  userPredictions: "id, userId, marketId, timestamp",
  priceSnapshots: "marketId",
  predictionWallets: "userId",
  testnetWallets: "userId",
  testnetTransactions: "id, userId, chain, hash, timestamp",
}).upgrade((tx) => {
  // Migrate existing transactions to include chain field
  return tx.table("testnetTransactions").toCollection().modify((t: Record<string, unknown>) => {
    if (!t.chain) t.chain = "ethereum"
    if (t.amountWei && !t.amount) {
      t.amount = t.amountWei
      delete t.amountWei
    }
  }).catch((err) => {
    console.warn("[DB v8] Migration failed, continuing:", err)
  })
})

export { db }
