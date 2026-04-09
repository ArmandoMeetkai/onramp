export interface PredictionMarketFactor {
  label: string
  description: string
  sentiment: "bullish" | "bearish" | "neutral"
}

export interface PredictionMarket {
  id: string
  question: string
  description: string
  category: "price" | "event" | "community"
  status: "active" | "resolved"
  resolutionDate: string
  resolutionCriteria: string
  resolutionAsset?: string
  resolutionThreshold?: number
  resolutionDirection?: "above" | "below"
  resolvedOutcome?: "yes" | "no"
  educationalContext: string
  factors: PredictionMarketFactor[]
  asset: "BTC" | "ETH" | "SOL"
  initialYesPercent: number
  coverEmoji: string
  difficulty: "beginner" | "intermediate"
  tags: string[]
  relatedLessonIds: string[]
}

export const predictionMarkets: PredictionMarket[] = [
  {
    id: "btc-100k-q2-2026",
    question: "Will Bitcoin be above $100,000 by June 30, 2026?",
    description:
      "Bitcoin has been on a strong run since the 2024 halving. Can it sustain momentum above the six-figure mark through the first half of 2026?",
    category: "price",
    status: "active",
    resolutionDate: "2026-06-30T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the CoinGecko BTC/USD spot price is at or above $100,000 at any point on June 30, 2026 UTC.",
    resolutionAsset: "BTC",
    resolutionThreshold: 100000,
    resolutionDirection: "above",
    asset: "BTC",
    educationalContext:
      "Bitcoin moves in roughly 4-year cycles tied to its halving events, which cut the mining reward in half. The most recent halving was in April 2024. Historically, Bitcoin has reached new all-time highs 12-18 months after each halving. However, past performance never guarantees future results, and macro factors like interest rates and regulation play a huge role.",
    factors: [
      {
        label: "Post-halving cycle",
        description:
          "The 2024 halving reduced new BTC supply from 6.25 to 3.125 per block. Previous halvings preceded major bull runs within 12-18 months.",
        sentiment: "bullish",
      },
      {
        label: "Institutional adoption",
        description:
          "Spot Bitcoin ETFs launched in 2024 brought billions in institutional inflows. Continued adoption could sustain demand pressure.",
        sentiment: "bullish",
      },
      {
        label: "Macro interest rates",
        description:
          "Central bank rate decisions affect risk assets. Higher-for-longer rates could suppress speculative demand for crypto.",
        sentiment: "neutral",
      },
      {
        label: "Regulatory uncertainty",
        description:
          "Global crypto regulation is still evolving. Unexpected crackdowns or favorable legislation could swing the market either direction.",
        sentiment: "neutral",
      },
    ],
    initialYesPercent: 62,
    coverEmoji: "🎯",
    difficulty: "beginner",
    tags: ["bitcoin", "price", "halving"],
    relatedLessonIds: ["what-is-bitcoin", "what-is-volatile"],
  },
  {
    id: "sol-etf-2026",
    question: "Will the SEC approve a spot Solana ETF by December 2026?",
    description:
      "After approving spot Bitcoin and Ethereum ETFs, the crypto industry is pushing for a Solana ETF. The SEC has been cautious about altcoin ETFs.",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the U.S. SEC officially approves at least one spot Solana ETF for trading on a U.S. exchange by December 31, 2026.",
    educationalContext:
      "An ETF (Exchange-Traded Fund) lets traditional investors buy crypto exposure through their regular brokerage account, without managing wallets or private keys. The SEC approved spot Bitcoin ETFs in January 2024 and spot Ethereum ETFs in May 2024. A Solana ETF would be a major legitimization signal, but the SEC has historically been cautious about assets it might consider securities.",
    factors: [
      {
        label: "BTC & ETH ETF precedent",
        description:
          "The SEC already approved spot ETFs for Bitcoin and Ethereum, establishing a regulatory pathway. This could make Solana approval more likely.",
        sentiment: "bullish",
      },
      {
        label: "Securities classification risk",
        description:
          "The SEC has suggested some altcoins may be securities. If Solana's SOL token is classified as a security, an ETF approval becomes much harder.",
        sentiment: "bearish",
      },
      {
        label: "Political landscape",
        description:
          "U.S. crypto policy depends heavily on the administration and SEC leadership. A crypto-friendly chair could accelerate approvals.",
        sentiment: "neutral",
      },
    ],
    asset: "SOL",
    initialYesPercent: 45,
    coverEmoji: "⚖️",
    difficulty: "intermediate",
    tags: ["solana", "regulation", "etf"],
    relatedLessonIds: ["what-is-solana", "what-is-ethereum"],
  },
  {
    id: "eth-below-btc-ratio",
    question: "Will Ethereum outperform Bitcoin in Q3 2026?",
    description:
      "The ETH/BTC ratio has been declining. Will Ethereum reverse this trend and outperform Bitcoin during Q3 2026?",
    category: "price",
    status: "active",
    resolutionDate: "2026-09-30T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if Ethereum's percentage price change from July 1 to September 30, 2026 is greater than Bitcoin's percentage price change over the same period, based on CoinGecko closing prices.",
    educationalContext:
      "When people say one crypto 'outperforms' another, they mean its price went up more (or down less) in percentage terms. The ETH/BTC ratio tracks how Ethereum performs relative to Bitcoin. A rising ratio means ETH is gaining ground. Historically, altcoins like ETH tend to outperform BTC during the late stages of bull markets, but this pattern is not guaranteed.",
    factors: [
      {
        label: "ETH/BTC ratio trend",
        description:
          "The ratio has been declining since the Merge in 2022. A reversal would require a catalyst like a major Ethereum upgrade or DeFi boom.",
        sentiment: "bearish",
      },
      {
        label: "Layer 2 ecosystem growth",
        description:
          "Ethereum's L2s (Arbitrum, Base, Optimism) are growing rapidly. Increased activity could drive ETH demand through fee burns.",
        sentiment: "bullish",
      },
      {
        label: "Bitcoin dominance cycle",
        description:
          "In past cycles, Bitcoin dominance peaks before altcoins rally. If BTC dominance starts declining, ETH could benefit.",
        sentiment: "neutral",
      },
    ],
    asset: "ETH",
    initialYesPercent: 38,
    coverEmoji: "⚔️",
    difficulty: "intermediate",
    tags: ["ethereum", "bitcoin", "comparison"],
    relatedLessonIds: ["what-is-ethereum", "what-is-bitcoin"],
  },
  {
    id: "crypto-crash-20-pct",
    question: "Will the total crypto market drop 20%+ before August 2026?",
    description:
      "Crypto markets are volatile. Will we see a major correction of 20% or more in total market cap before August 2026?",
    category: "event",
    status: "active",
    resolutionDate: "2026-08-01T00:00:00Z",
    resolutionCriteria:
      "Resolves YES if the total cryptocurrency market capitalization (per CoinGecko) drops 20% or more from its highest point in 2026 at any time before August 1, 2026.",
    educationalContext:
      "A 20% drop is often called a 'correction' in traditional markets, but in crypto, drops of this size are quite common, even in bull markets. Bitcoin has historically seen 30-40% pullbacks during every bull cycle. Understanding that volatility is normal helps you avoid panic selling. The key question isn't whether corrections happen, but how you react when they do.",
    factors: [
      {
        label: "Historical volatility",
        description:
          "Bitcoin has experienced 20%+ corrections in every single bull market cycle. They are a feature, not a bug, of crypto markets.",
        sentiment: "bullish",
      },
      {
        label: "Leverage in the system",
        description:
          "High leverage in crypto derivatives markets can amplify sell-offs. Cascading liquidations can turn a small dip into a major correction.",
        sentiment: "bullish",
      },
      {
        label: "Macro stability",
        description:
          "If the global economy remains stable and interest rates stay predictable, crypto may avoid a large correction.",
        sentiment: "bearish",
      },
    ],
    asset: "BTC",
    initialYesPercent: 72,
    coverEmoji: "📉",
    difficulty: "beginner",
    tags: ["market", "volatility", "crash"],
    relatedLessonIds: ["what-is-volatile", "how-people-lose-money"],
  },
  {
    id: "stablecoin-regulation-2026",
    question: "Will the U.S. pass a stablecoin regulation bill by end of 2026?",
    description:
      "Congress has been debating stablecoin legislation for years. Will they finally pass a comprehensive bill?",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the U.S. Congress passes and the President signs into law a bill that specifically regulates stablecoin issuers by December 31, 2026.",
    educationalContext:
      "Stablecoins are cryptocurrencies pegged to a stable asset, usually the US dollar. USDT (Tether) and USDC (Circle) are the largest, with over $150B combined. They're the backbone of crypto trading and DeFi. The collapse of TerraUSD in 2022 showed what happens when a stablecoin fails. Regulation would set reserve requirements and consumer protections, potentially making stablecoins safer but also more restricted.",
    factors: [
      {
        label: "Bipartisan support",
        description:
          "Stablecoin regulation has more bipartisan support than other crypto legislation. Both parties see it as a national security and dollar dominance issue.",
        sentiment: "bullish",
      },
      {
        label: "Congressional gridlock",
        description:
          "The U.S. Congress has a poor track record of passing crypto legislation. Political dynamics could stall even popular bills.",
        sentiment: "bearish",
      },
      {
        label: "Industry lobbying",
        description:
          "Major stablecoin issuers (Circle, Tether) and banks are actively lobbying for clear rules, increasing the chances of legislation.",
        sentiment: "bullish",
      },
    ],
    asset: "BTC",
    initialYesPercent: 55,
    coverEmoji: "🏛️",
    difficulty: "intermediate",
    tags: ["regulation", "stablecoin", "policy"],
    relatedLessonIds: ["what-is-bitcoin", "what-are-fees"],
  },
  {
    id: "eth-5k-q3-2026",
    question: "Will Ethereum be above $5,000 by September 2026?",
    description:
      "Ethereum hasn't touched $5,000 since late 2021. With Layer 2 growth, ETF inflows, and the deflationary burn mechanism, can ETH reclaim and hold five figures?",
    category: "price",
    status: "active",
    resolutionDate: "2026-09-30T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the CoinGecko ETH/USD spot price is at or above $5,000 at any point on September 30, 2026 UTC.",
    resolutionAsset: "ETH",
    resolutionThreshold: 5000,
    resolutionDirection: "above",
    educationalContext:
      "Ethereum is the largest smart contract platform, hosting most of DeFi and NFTs. After 'The Merge' in 2022, ETH became deflationary when network usage is high — more ETH gets burned in fees than created. Ethereum's price depends on network activity, L2 adoption, institutional demand via ETFs, and competition from chains like Solana. The $5K level is significant because it represents the all-time high zone.",
    factors: [
      {
        label: "ETF demand",
        description:
          "Spot Ethereum ETFs were approved in 2024. Sustained institutional inflows could drive price higher over time.",
        sentiment: "bullish",
      },
      {
        label: "Deflationary burns",
        description:
          "When the network is busy, ETH supply decreases. Higher activity = less supply = price pressure upward.",
        sentiment: "bullish",
      },
      {
        label: "L2 competition",
        description:
          "Layer 2s like Arbitrum and Base handle more transactions, but this means less fee revenue on mainnet. Could reduce burn rate.",
        sentiment: "bearish",
      },
      {
        label: "Solana competition",
        description:
          "Solana has been taking market share in DeFi and NFTs. If developers and users migrate, ETH demand could stagnate.",
        sentiment: "bearish",
      },
    ],
    asset: "ETH",
    initialYesPercent: 42,
    coverEmoji: "💎",
    difficulty: "beginner",
    tags: ["ethereum", "price", "etf"],
    relatedLessonIds: ["what-is-ethereum", "what-is-volatile"],
  },
  {
    id: "sol-300-q3-2026",
    question: "Will Solana be above $300 by September 2026?",
    description:
      "Solana has been one of the best performing major cryptocurrencies. After recovering from the FTX crash, can it break through $300 and stay there?",
    category: "price",
    status: "active",
    resolutionDate: "2026-09-30T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the CoinGecko SOL/USD spot price is at or above $300 at any point on September 30, 2026 UTC.",
    resolutionAsset: "SOL",
    resolutionThreshold: 300,
    resolutionDirection: "above",
    educationalContext:
      "Solana is a high-speed blockchain that processes thousands of transactions per second at very low fees. It nearly died after FTX collapsed in 2022 (FTX/Alameda held massive SOL positions), but the community rebuilt. Solana now leads in DeFi trading volume, compressed NFTs, and consumer apps. Its price depends on ecosystem growth, validator economics, network uptime, and whether a spot SOL ETF gets approved.",
    factors: [
      {
        label: "Ecosystem momentum",
        description:
          "Solana leads in DEX volume and has the fastest-growing developer ecosystem. More apps = more demand for SOL.",
        sentiment: "bullish",
      },
      {
        label: "Potential ETF approval",
        description:
          "Multiple firms have filed for a spot Solana ETF. Approval would unlock institutional capital and validate SOL as an asset class.",
        sentiment: "bullish",
      },
      {
        label: "Network outage risk",
        description:
          "Solana has experienced several network outages in the past. A major outage during a bull market could damage confidence.",
        sentiment: "bearish",
      },
      {
        label: "Token unlock pressure",
        description:
          "Large token unlocks from early investors and the Solana Foundation could create selling pressure at higher prices.",
        sentiment: "bearish",
      },
    ],
    asset: "SOL",
    initialYesPercent: 48,
    coverEmoji: "⚡",
    difficulty: "beginner",
    tags: ["solana", "price", "ecosystem"],
    relatedLessonIds: ["what-is-solana", "what-is-volatile"],
  },
]

export function getMarketById(id: string): PredictionMarket | undefined {
  return predictionMarkets.find((m) => m.id === id)
}
