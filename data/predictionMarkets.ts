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
  {
    id: "btc-dominance-50-q3-2026",
    question: "Will Bitcoin dominance drop below 50% by September 2026?",
    description:
      "Bitcoin dominance measures BTC's share of the total crypto market cap. It has been above 50% for most of 2025. Will altcoins reclaim market share?",
    category: "event",
    status: "active",
    resolutionDate: "2026-09-30T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if Bitcoin's market dominance (per CoinGecko) falls below 50% at any point before September 30, 2026.",
    educationalContext:
      "Bitcoin dominance is a key indicator of market sentiment. When BTC dominance rises, it usually means investors are moving from altcoins into Bitcoin (a 'risk-off' move). When it falls, money flows into smaller coins (a 'risk-on' move). Historically, BTC dominance drops during the later stages of bull markets when speculation peaks. Understanding this cycle helps you time your entries into altcoins.",
    factors: [
      {
        label: "Bull market cycle position",
        description:
          "In past cycles, BTC dominance dropped from 60%+ to below 40% during peak altseason. If we're entering that phase, dominance could fall sharply.",
        sentiment: "bullish",
      },
      {
        label: "ETF-driven BTC inflows",
        description:
          "Spot Bitcoin ETFs channel institutional money specifically into BTC, not altcoins. This structural demand could keep dominance elevated.",
        sentiment: "bearish",
      },
      {
        label: "L1 ecosystem growth",
        description:
          "Ethereum, Solana, and other L1s are growing independently. Strong DeFi and app ecosystems attract capital away from BTC.",
        sentiment: "bullish",
      },
    ],
    asset: "BTC",
    initialYesPercent: 40,
    coverEmoji: "👑",
    difficulty: "intermediate",
    tags: ["bitcoin", "dominance", "altseason"],
    relatedLessonIds: ["what-is-bitcoin", "what-is-volatile"],
  },
  {
    id: "defi-tvl-200b-2026",
    question: "Will total DeFi TVL exceed $200 billion by end of 2026?",
    description:
      "DeFi (Decentralized Finance) total value locked has been growing steadily. Can the ecosystem double from current levels to surpass $200B?",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the total DeFi TVL across all chains (per DeFiLlama) exceeds $200 billion at any point by December 31, 2026.",
    educationalContext:
      "TVL (Total Value Locked) measures how much crypto is deposited into DeFi protocols like lending platforms, DEXs, and yield farms. Higher TVL signals more trust and adoption. It's one of the best metrics for measuring real usage of blockchain technology beyond speculation. However, TVL can be inflated by leverage and token price increases, so context matters.",
    factors: [
      {
        label: "RWA tokenization trend",
        description:
          "Real World Assets (US Treasuries, real estate) being tokenized on-chain are bringing billions in new TVL from traditional finance.",
        sentiment: "bullish",
      },
      {
        label: "Restaking growth",
        description:
          "EigenLayer and similar restaking protocols have attracted tens of billions. This trend could accelerate TVL growth significantly.",
        sentiment: "bullish",
      },
      {
        label: "Smart contract risk",
        description:
          "DeFi protocols are still vulnerable to hacks and exploits. A major hack could shake confidence and reduce TVL.",
        sentiment: "bearish",
      },
    ],
    asset: "ETH",
    initialYesPercent: 55,
    coverEmoji: "🏦",
    difficulty: "intermediate",
    tags: ["defi", "tvl", "adoption"],
    relatedLessonIds: ["what-is-ethereum", "what-is-blockchain"],
  },
  {
    id: "eth-l2-fees-flip-2026",
    question: "Will Ethereum L2s process more transactions than mainnet by Q3 2026?",
    description:
      "Layer 2 networks like Arbitrum, Base, and Optimism are handling increasing transaction volume. Will they overtake Ethereum mainnet?",
    category: "event",
    status: "active",
    resolutionDate: "2026-09-30T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the combined daily transaction count of the top 5 Ethereum L2s exceeds Ethereum mainnet's daily transaction count for 7 consecutive days before September 30, 2026.",
    educationalContext:
      "Layer 2 networks are built on top of Ethereum to make transactions faster and cheaper. They bundle many transactions together and submit them to Ethereum mainnet for security. Think of Ethereum as the highway and L2s as express lanes. The 'flippening' of L2 transactions over mainnet would signal that Ethereum's scaling strategy is working as intended.",
    factors: [
      {
        label: "Base ecosystem explosion",
        description:
          "Coinbase's Base L2 has seen massive adoption in consumer apps, social protocols, and memecoins, driving daily transactions into the millions.",
        sentiment: "bullish",
      },
      {
        label: "EIP-4844 cost reduction",
        description:
          "Proto-danksharding (EIP-4844) dramatically reduced L2 posting costs, making L2s 10-100x cheaper than mainnet. This accelerates migration.",
        sentiment: "bullish",
      },
      {
        label: "Mainnet resilience",
        description:
          "High-value DeFi transactions and NFT mints still prefer mainnet for maximum security. Some activity will never move to L2s.",
        sentiment: "bearish",
      },
    ],
    asset: "ETH",
    initialYesPercent: 65,
    coverEmoji: "🔗",
    difficulty: "intermediate",
    tags: ["ethereum", "layer2", "scaling"],
    relatedLessonIds: ["what-is-ethereum", "what-is-blockchain"],
  },
  {
    id: "stablecoin-mcap-250b-2026",
    question: "Will stablecoin total market cap exceed $250 billion by end of 2026?",
    description:
      "Stablecoins (USDT, USDC, etc.) are the backbone of crypto trading. Their market cap has been growing steadily. Can they reach $250B?",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the combined market capitalization of all stablecoins (per CoinGecko) exceeds $250 billion at any point by December 31, 2026.",
    educationalContext:
      "Stablecoins are cryptocurrencies pegged to the US dollar. They serve as the 'cash' of the crypto world -- used for trading, lending, and payments. Growing stablecoin supply is one of the most reliable indicators of money flowing into crypto. When stablecoin market cap increases, it usually means new capital is entering the market, which historically precedes price increases.",
    factors: [
      {
        label: "Regulatory clarity",
        description:
          "If the US passes stablecoin legislation, it could unlock institutional issuers (banks) to create regulated stablecoins, massively expanding supply.",
        sentiment: "bullish",
      },
      {
        label: "Emerging market adoption",
        description:
          "People in countries with unstable currencies increasingly use USDT as a dollar substitute. This organic demand drives growth regardless of crypto market conditions.",
        sentiment: "bullish",
      },
      {
        label: "CBDC competition",
        description:
          "Central Bank Digital Currencies could compete with stablecoins if governments push their own digital dollars.",
        sentiment: "bearish",
      },
    ],
    asset: "BTC",
    initialYesPercent: 60,
    coverEmoji: "💵",
    difficulty: "beginner",
    tags: ["stablecoin", "adoption", "market-cap"],
    relatedLessonIds: ["what-is-bitcoin", "what-are-fees"],
  },
  {
    id: "btc-halving-effect-2026",
    question: "Will Bitcoin reach a new all-time high within 18 months of the 2024 halving?",
    description:
      "The Bitcoin halving in April 2024 cut mining rewards in half. Historically, new ATHs follow within 12-18 months. Will the pattern hold?",
    category: "price",
    status: "active",
    resolutionDate: "2026-10-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the CoinGecko BTC/USD spot price exceeds $109,000 (the previous ATH) at any point by October 31, 2026.",
    resolutionAsset: "BTC",
    resolutionThreshold: 109000,
    resolutionDirection: "above",
    asset: "BTC",
    educationalContext:
      "Bitcoin halvings occur every ~4 years and cut the block reward miners receive by 50%. This reduces new BTC supply. The three previous halvings (2012, 2016, 2020) were each followed by massive bull runs within 12-18 months. However, past performance doesn't guarantee future results. Each cycle has had diminishing returns, and market conditions are always different.",
    factors: [
      {
        label: "Historical pattern",
        description:
          "After every halving, BTC has set a new ATH within 18 months. The 2024 halving occurred in April, so the window extends to October 2025 -- but macro delays could push it further.",
        sentiment: "bullish",
      },
      {
        label: "Supply shock mechanics",
        description:
          "Miners now earn 3.125 BTC per block instead of 6.25. With constant or growing demand and less new supply, basic economics suggests price should increase.",
        sentiment: "bullish",
      },
      {
        label: "Diminishing returns",
        description:
          "Each cycle's percentage gains have been smaller. The 2012 halving saw 9,000%+ gains, 2016 saw ~3,000%, 2020 saw ~700%. The trend suggests smaller moves ahead.",
        sentiment: "bearish",
      },
      {
        label: "Macro headwinds",
        description:
          "High interest rates, geopolitical instability, or a recession could override the halving narrative. Crypto doesn't exist in a vacuum.",
        sentiment: "neutral",
      },
    ],
    initialYesPercent: 68,
    coverEmoji: "⛏️",
    difficulty: "beginner",
    tags: ["bitcoin", "halving", "ath", "cycle"],
    relatedLessonIds: ["what-is-bitcoin", "what-is-volatile"],
  },
  {
    id: "sol-defi-tvl-flip-eth-l2-2026",
    question: "Will Solana's DeFi TVL surpass any single Ethereum L2 by end of 2026?",
    description:
      "Solana has been rapidly growing its DeFi ecosystem. Can it surpass the TVL of Arbitrum, Base, or Optimism?",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if Solana's total DeFi TVL (per DeFiLlama) exceeds that of any individual Ethereum L2 (Arbitrum, Base, or Optimism) at any point by December 31, 2026.",
    educationalContext:
      "This market tests whether Solana can compete with Ethereum's Layer 2 ecosystem in real DeFi usage. TVL is a measure of how much capital users trust a blockchain with. Solana's advantage is speed and low fees natively; Ethereum L2s achieve similar performance but inherit Ethereum's security. The winner often depends on which ecosystem attracts the best applications and developers.",
    factors: [
      {
        label: "Solana DeFi momentum",
        description:
          "Jupiter, Marinade, and Raydium have grown Solana's DeFi rapidly. The ecosystem is attracting top-tier developers and protocols.",
        sentiment: "bullish",
      },
      {
        label: "Arbitrum's head start",
        description:
          "Arbitrum has the most mature L2 DeFi ecosystem with protocols like GMX and Aave deployments. Its TVL lead is substantial.",
        sentiment: "bearish",
      },
      {
        label: "Network reliability",
        description:
          "Solana's history of outages makes some institutional DeFi users hesitant to deploy large amounts of capital.",
        sentiment: "bearish",
      },
    ],
    asset: "SOL",
    initialYesPercent: 52,
    coverEmoji: "🏁",
    difficulty: "intermediate",
    tags: ["solana", "defi", "layer2", "competition"],
    relatedLessonIds: ["what-is-solana", "what-is-ethereum"],
  },
  {
    id: "crypto-adoption-1b-users-2026",
    question: "Will global crypto users exceed 1 billion by end of 2026?",
    description:
      "Crypto adoption has been growing steadily, with estimates of 500-600 million users globally in 2024. Can the industry double its user base?",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if any major research firm (Chainalysis, Statista, or Triple-A) publishes a report estimating global crypto users at 1 billion or more by December 31, 2026.",
    educationalContext:
      "Crypto adoption is measured by the number of people who own, use, or interact with cryptocurrency. This includes everything from holding Bitcoin to using a DeFi app to playing a blockchain game. The internet took about 15 years to reach 1 billion users (1995-2005). Crypto has been around since 2009 and is at roughly 500-600 million. Reaching 1 billion would be a major milestone, signaling mainstream acceptance.",
    factors: [
      {
        label: "Emerging market demand",
        description:
          "Countries like Nigeria, India, Brazil, and Philippines have rapidly growing crypto adoption driven by remittances, currency instability, and mobile-first economies.",
        sentiment: "bullish",
      },
      {
        label: "Institutional on-ramps",
        description:
          "ETFs, PayPal, Venmo, and Revolut make buying crypto trivial for mainstream users. Lower friction = faster adoption.",
        sentiment: "bullish",
      },
      {
        label: "UX barriers remain",
        description:
          "Wallets, seed phrases, gas fees, and bridge complexity still scare away non-technical users. Until UX matches Web2 apps, mass adoption is limited.",
        sentiment: "bearish",
      },
      {
        label: "Regulatory crackdowns",
        description:
          "Some countries (China, India) have imposed restrictions on crypto. Hostile regulation in large markets could slow growth significantly.",
        sentiment: "bearish",
      },
    ],
    asset: "BTC",
    initialYesPercent: 45,
    coverEmoji: "🌍",
    difficulty: "beginner",
    tags: ["adoption", "global", "milestone"],
    relatedLessonIds: ["what-is-bitcoin", "what-is-blockchain"],
  },
  {
    id: "eth-deflationary-2026",
    question: "Will Ethereum's total supply be lower at end of 2026 than start of 2026?",
    description:
      "Since The Merge, Ethereum burns ETH through fees. If burns exceed new issuance, ETH becomes deflationary. Will 2026 be a net-deflationary year?",
    category: "event",
    status: "active",
    resolutionDate: "2026-12-31T23:59:59Z",
    resolutionCriteria:
      "Resolves YES if the total ETH supply on December 31, 2026 is lower than the total ETH supply on January 1, 2026 (per ultrasound.money or Etherscan).",
    educationalContext:
      "Ethereum introduced a fee-burning mechanism (EIP-1559) in 2021. Every transaction burns a portion of the gas fee, permanently removing ETH from circulation. After The Merge in 2022, ETH switched from Proof of Work to Proof of Stake, dramatically reducing new issuance from ~13,000 ETH/day to ~1,700 ETH/day. When burns exceed issuance, ETH supply shrinks -- making it 'ultrasound money'. This is significant because most assets (including Bitcoin) only increase in supply.",
    factors: [
      {
        label: "Network activity drives burns",
        description:
          "More transactions = more fees burned. A bull market with high DeFi and NFT activity could push burns well above issuance.",
        sentiment: "bullish",
      },
      {
        label: "L2 migration reduces mainnet burns",
        description:
          "As users move to L2s, mainnet transactions decrease. Fewer mainnet transactions = fewer burns. EIP-4844 made L2s very cheap, accelerating this shift.",
        sentiment: "bearish",
      },
      {
        label: "Blob fee revenue",
        description:
          "L2s pay blob fees to Ethereum mainnet. As L2 volume grows, blob fee burns could partially offset the reduction in mainnet transaction burns.",
        sentiment: "neutral",
      },
    ],
    asset: "ETH",
    initialYesPercent: 42,
    coverEmoji: "🔥",
    difficulty: "intermediate",
    tags: ["ethereum", "supply", "deflationary", "burn"],
    relatedLessonIds: ["what-is-ethereum", "what-are-fees"],
  },
]

// Weekly markets resolve 7 days from the start of the current week (Monday).
// They auto-rotate so users always have a short-term market to engage with.
function getWeekStartISO(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split("T")[0]
}

function getWeekEndISO(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 0 : 7 - day // Sunday
  const sunday = new Date(now)
  sunday.setDate(now.getDate() + diff)
  return `${sunday.toISOString().split("T")[0]}T23:59:59Z`
}

function generateWeeklyMarkets(): PredictionMarket[] {
  const weekId = getWeekStartISO().replace(/-/g, "")
  const resolutionDate = getWeekEndISO()

  return [
    {
      id: `btc-weekly-${weekId}`,
      question: "Will Bitcoin end this week higher than it started?",
      description:
        "A short-term prediction on Bitcoin's weekly price action. This market resolves based on whether BTC's price at the end of Sunday is higher than at the start of Monday.",
      category: "price",
      status: "active",
      resolutionDate,
      resolutionCriteria:
        "Resolves YES if the CoinGecko BTC/USD spot price on Sunday 23:59 UTC is higher than the price at the start of Monday 00:00 UTC of the same week.",
      resolutionAsset: "BTC",
      resolutionThreshold: 0, // Resolved by comparing start vs end — threshold set dynamically
      resolutionDirection: "above",
      asset: "BTC",
      educationalContext:
        "Short-term price movements are notoriously hard to predict. They are influenced by news events, market sentiment, whale movements, and macroeconomic data releases. This market teaches you that even experts often get weekly predictions wrong, and that humility about short-term price action is a critical skill.",
      factors: [
        {
          label: "Market momentum",
          description:
            "Is BTC trending up or down entering this week? Momentum often persists short-term, but reversals happen without warning.",
          sentiment: "neutral",
        },
        {
          label: "News catalysts",
          description:
            "Major announcements, regulatory actions, or macro data (CPI, jobs report, Fed meetings) can swing the price either direction within hours.",
          sentiment: "neutral",
        },
        {
          label: "Weekend liquidity",
          description:
            "Crypto markets trade 24/7, but weekends often have lower liquidity. This can cause sharper price moves in both directions.",
          sentiment: "neutral",
        },
      ],
      initialYesPercent: 50,
      coverEmoji: "📊",
      difficulty: "beginner",
      tags: ["bitcoin", "price", "weekly"],
      relatedLessonIds: ["what-is-bitcoin", "what-is-volatile"],
    },
    {
      id: `eth-weekly-${weekId}`,
      question: "Will Ethereum end this week higher than it started?",
      description:
        "A short-term prediction on Ethereum's weekly performance. This teaches you to think about what drives short-term price action versus long-term fundamentals.",
      category: "price",
      status: "active",
      resolutionDate,
      resolutionCriteria:
        "Resolves YES if the CoinGecko ETH/USD spot price on Sunday 23:59 UTC is higher than the price at the start of Monday 00:00 UTC of the same week.",
      resolutionAsset: "ETH",
      resolutionThreshold: 0,
      resolutionDirection: "above",
      asset: "ETH",
      educationalContext:
        "Ethereum often correlates with Bitcoin in the short term but can diverge based on ETH-specific catalysts like network upgrades, Layer 2 adoption metrics, or staking yield changes. Learning to separate correlated movement from independent fundamentals is a key crypto analysis skill.",
      factors: [
        {
          label: "BTC correlation",
          description:
            "ETH historically moves with BTC 70-80% of the time. If BTC drops, ETH usually follows, but the magnitude can differ.",
          sentiment: "neutral",
        },
        {
          label: "Network activity",
          description:
            "Gas fees, active addresses, and L2 transaction volume signal real demand. Higher activity generally supports the price.",
          sentiment: "neutral",
        },
        {
          label: "Staking dynamics",
          description:
            "Over 25% of ETH is staked. Large unstaking events can create sell pressure, while increasing stake rates reduce circulating supply.",
          sentiment: "neutral",
        },
      ],
      initialYesPercent: 50,
      coverEmoji: "💎",
      difficulty: "beginner",
      tags: ["ethereum", "price", "weekly"],
      relatedLessonIds: ["what-is-ethereum", "what-is-volatile"],
    },
    {
      id: `sol-weekly-${weekId}`,
      question: "Will Solana end this week higher than it started?",
      description:
        "A short-term prediction on Solana's weekly price movement. Solana tends to be more volatile than BTC or ETH, making weekly predictions especially challenging.",
      category: "price",
      status: "active",
      resolutionDate,
      resolutionCriteria:
        "Resolves YES if the CoinGecko SOL/USD spot price on Sunday 23:59 UTC is higher than the price at the start of Monday 00:00 UTC of the same week.",
      resolutionAsset: "SOL",
      resolutionThreshold: 0,
      resolutionDirection: "above",
      asset: "SOL",
      educationalContext:
        "Solana is a high-throughput blockchain known for fast transactions and low fees. Its token (SOL) tends to be more volatile than BTC or ETH because it has a smaller market cap. This means bigger percentage swings in both directions, which makes predictions riskier but also more educational about volatility.",
      factors: [
        {
          label: "Higher volatility",
          description:
            "SOL's smaller market cap means it can move 10-15% in a week when BTC moves 3-5%. This amplifies both upside and downside.",
          sentiment: "neutral",
        },
        {
          label: "Ecosystem momentum",
          description:
            "DeFi TVL, NFT volume, and new project launches on Solana signal ecosystem health. Strong activity often precedes price increases.",
          sentiment: "neutral",
        },
        {
          label: "Token unlocks",
          description:
            "Scheduled token unlocks from the Solana Foundation or early investors can create short-term sell pressure.",
          sentiment: "bearish",
        },
      ],
      initialYesPercent: 50,
      coverEmoji: "⚡",
      difficulty: "beginner",
      tags: ["solana", "price", "weekly"],
      relatedLessonIds: ["what-is-solana", "what-is-volatile"],
    },
  ]
}

// All markets: static long-term + dynamic weekly
export const allMarkets: PredictionMarket[] = [
  ...generateWeeklyMarkets(),
  ...predictionMarkets,
]

export function getMarketById(id: string): PredictionMarket | undefined {
  return allMarkets.find((m) => m.id === id)
}
