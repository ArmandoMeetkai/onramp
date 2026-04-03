export interface DecisionScenario {
  id: string
  title: string
  subtitle: string
  description: string
  asset: "BTC" | "ETH" | "SOL"
  probability: {
    up: number
    flat: number
    down: number
  }
  simulationRange: {
    min: number
    max: number
    defaultAmount: number
  }
  outcomes: {
    bestCase: { multiplier: number; description: string }
    worstCase: { multiplier: number; description: string }
  }
  explanation: {
    whyUp: string
    whyDown: string
    whatToWatch: string
  }
  guidance: {
    conservative: string
    moderate: string
    aggressive: string
  }
  socialProof: {
    usersWhoSimulated: number
    avgDecision: string
    communityNote: string
  }
  tags: string[]
  difficulty: "beginner" | "intermediate"
  updatedAt: string
}

export const scenarios: DecisionScenario[] = [
  {
    id: "should-i-buy-bitcoin",
    title: "Should I buy Bitcoin right now?",
    subtitle: "The most common question beginners ask",
    description:
      "Bitcoin is the most well-known cryptocurrency. It has been around since 2009 and is often the first crypto people consider. But timing any purchase is tricky, even for experts.",
    asset: "BTC",
    probability: { up: 45, flat: 25, down: 30 },
    simulationRange: { min: 10, max: 500, defaultAmount: 50 },
    outcomes: {
      bestCase: {
        multiplier: 1.35,
        description: "Bitcoin has historically had strong recovery periods after dips. A 35% gain over several months is within the range of what has happened before.",
      },
      worstCase: {
        multiplier: 0.7,
        description: "Bitcoin can drop 30% or more in a short period. This has happened multiple times throughout its history and is considered normal volatility.",
      },
    },
    explanation: {
      whyUp: "Growing institutional adoption, limited supply of 21 million coins, and increasing mainstream acceptance could push the price higher over time.",
      whyDown: "Regulatory uncertainty, market sentiment shifts, and competition from other cryptocurrencies could cause the price to fall.",
      whatToWatch: "Pay attention to major news about regulation, large companies adopting or dropping Bitcoin, and overall economic conditions.",
    },
    guidance: {
      conservative: "Consider starting with a very small amount you are completely comfortable losing. There is no rush to buy.",
      moderate: "A small, regular purchase over time (sometimes called dollar-cost averaging) can reduce the impact of price swings.",
      aggressive: "If you have done your research and understand the risks, buying during a dip can be an opportunity. But never invest more than you can afford to lose.",
    },
    socialProof: {
      usersWhoSimulated: 2847,
      avgDecision: "moderate",
      communityNote: "Most people started with $25 or less just to get comfortable with the process.",
    },
    tags: ["bitcoin", "beginner", "buying"],
    difficulty: "beginner",
    updatedAt: "March 2026",
  },
  {
    id: "is-ethereum-long-term",
    title: "Is Ethereum a good long-term choice?",
    subtitle: "Understanding the second-largest cryptocurrency",
    description:
      "Ethereum is more than just a currency. It powers apps, contracts, and other tokens. Many people see it as a long-term technology bet, not just a price speculation.",
    asset: "ETH",
    probability: { up: 50, flat: 20, down: 30 },
    simulationRange: { min: 10, max: 500, defaultAmount: 100 },
    outcomes: {
      bestCase: {
        multiplier: 1.5,
        description: "Ethereum has shown strong growth during periods of high developer activity and network upgrades. A 50% gain over a year is within historical range.",
      },
      worstCase: {
        multiplier: 0.6,
        description: "Like all crypto, Ethereum can lose significant value. A 40% decline has occurred during broader market downturns.",
      },
    },
    explanation: {
      whyUp: "Ethereum hosts the most decentralized applications and smart contracts. Ongoing network upgrades aim to make it faster and cheaper, which could increase demand.",
      whyDown: "Competing blockchains like Solana offer faster, cheaper transactions. If developers move to other platforms, Ethereum could lose its edge.",
      whatToWatch: "Look for news about Ethereum upgrades, developer activity on the network, and how fees compare to competitors.",
    },
    guidance: {
      conservative: "Learn about what Ethereum does before putting any money in. Understanding the technology helps you make better decisions.",
      moderate: "If you believe in the technology, a small position held for at least a year gives you time to ride out short-term volatility.",
      aggressive: "Ethereum's ecosystem is the largest in crypto. If you are comfortable with risk, a meaningful allocation could pay off long-term.",
    },
    socialProof: {
      usersWhoSimulated: 2134,
      avgDecision: "moderate",
      communityNote: "People who held Ethereum for over a year reported feeling more confident about their understanding of crypto.",
    },
    tags: ["ethereum", "long-term", "technology"],
    difficulty: "beginner",
    updatedAt: "March 2026",
  },
  {
    id: "market-dropped-15-percent",
    title: "The market dropped 15%. Should I panic?",
    subtitle: "What to do when prices fall sharply",
    description:
      "Seeing your investment drop can feel scary. But in crypto, double-digit swings happen regularly. Understanding how to react, or not react, is one of the most important skills.",
    asset: "BTC",
    probability: { up: 40, flat: 30, down: 30 },
    simulationRange: { min: 10, max: 500, defaultAmount: 100 },
    outcomes: {
      bestCase: {
        multiplier: 1.25,
        description: "Markets often recover after sharp drops. Historically, panic selling during dips has been one of the most common ways people lock in losses.",
      },
      worstCase: {
        multiplier: 0.75,
        description: "Sometimes a drop is the beginning of a longer decline. The market could fall another 25% before stabilizing.",
      },
    },
    explanation: {
      whyUp: "Drops of 15% are common in crypto and often followed by recoveries. Many experienced investors see dips as buying opportunities.",
      whyDown: "A 15% drop could signal deeper problems, like regulatory crackdowns or major exchange failures, that lead to further declines.",
      whatToWatch: "Look at why the drop happened. Was it a single event, or part of a broader trend? Check if the overall market is falling or just specific coins.",
    },
    guidance: {
      conservative: "Do nothing. Seriously. If you already invested only what you can afford to lose, the best move is often to wait and not make emotional decisions.",
      moderate: "Review your position calmly. If the fundamentals have not changed, consider holding. Some people use dips to buy a little more at lower prices.",
      aggressive: "Sharp drops can be opportunities if you have done your research. But only add more if you truly understand the risks and have money you can lose.",
    },
    socialProof: {
      usersWhoSimulated: 3521,
      avgDecision: "conservative",
      communityNote: "The most common advice from experienced users: \"Don't check prices every hour. Zoom out.\"",
    },
    tags: ["bitcoin", "volatility", "emotions"],
    difficulty: "beginner",
    updatedAt: "March 2026",
  },
  {
    id: "invest-50-or-wait",
    title: "Should I invest $50 or wait?",
    subtitle: "Starting small versus waiting for the right moment",
    description:
      "Many beginners wait for the 'perfect' time to start. But research shows that time in the market often matters more than timing the market, especially with small amounts.",
    asset: "BTC",
    probability: { up: 45, flat: 30, down: 25 },
    simulationRange: { min: 10, max: 500, defaultAmount: 50 },
    outcomes: {
      bestCase: {
        multiplier: 1.2,
        description: "A small investment that grows 20% turns $50 into $60. Not life-changing, but it gives you real experience with how crypto works.",
      },
      worstCase: {
        multiplier: 0.8,
        description: "A 20% loss on $50 means losing $10. That is the cost of a coffee and a sandwich, a small price for learning.",
      },
    },
    explanation: {
      whyUp: "Starting with a small amount removes the pressure of timing it perfectly. You gain experience and can always add more later.",
      whyDown: "Any amount can lose value. But with $50, the downside is limited and manageable for most people.",
      whatToWatch: "Focus less on the price and more on the learning experience. How does it feel to own crypto? What did you learn about the process?",
    },
    guidance: {
      conservative: "Start with the minimum amount your platform allows. The goal is not to get rich. It is to learn how buying and holding crypto actually works.",
      moderate: "$50 is a reasonable starting point. Enough to feel real, small enough that a loss will not hurt. Consider it tuition for crypto education.",
      aggressive: "If $50 feels too small to learn from, start with an amount that feels meaningful to you, but never more than you would be okay losing entirely.",
    },
    socialProof: {
      usersWhoSimulated: 4102,
      avgDecision: "moderate",
      communityNote: "Most people who started with $50 or less said they wished they had started sooner, regardless of what the price did.",
    },
    tags: ["bitcoin", "beginner", "getting-started"],
    difficulty: "beginner",
    updatedAt: "March 2026",
  },
  {
    id: "is-solana-worth-it",
    title: "Is Solana worth looking into?",
    subtitle: "A faster, cheaper alternative to Ethereum",
    description:
      "Solana is known for fast transactions and low fees. It has grown quickly and attracted many developers. But it has also faced criticism for network outages and centralization concerns.",
    asset: "SOL",
    probability: { up: 40, flat: 20, down: 40 },
    simulationRange: { min: 10, max: 500, defaultAmount: 50 },
    outcomes: {
      bestCase: {
        multiplier: 1.6,
        description: "Solana has shown explosive growth during bull markets. Its speed and low costs attract developers and users, which can drive significant price increases.",
      },
      worstCase: {
        multiplier: 0.5,
        description: "Solana is riskier than Bitcoin or Ethereum. It has dropped 50% or more during downturns and has experienced network outages that shook confidence.",
      },
    },
    explanation: {
      whyUp: "Solana processes thousands of transactions per second at very low cost. Its growing ecosystem of apps and games could drive adoption and value.",
      whyDown: "The network has experienced outages, raising reliability concerns. It is also more centralized than Bitcoin or Ethereum, which some see as a risk.",
      whatToWatch: "Monitor network stability, developer activity, and how Solana handles competition from Ethereum and other fast blockchains.",
    },
    guidance: {
      conservative: "Solana is higher risk than Bitcoin or Ethereum. If you are new to crypto, consider learning about the larger coins first before exploring alternatives.",
      moderate: "If you want exposure to Solana, keep it as a small portion of your practice portfolio. Diversification reduces risk.",
      aggressive: "Solana's speed and ecosystem growth make it an interesting bet. But be prepared for higher volatility, both up and down.",
    },
    socialProof: {
      usersWhoSimulated: 1876,
      avgDecision: "moderate",
      communityNote: "Users who explored Solana often said they appreciated learning about different blockchain approaches.",
    },
    tags: ["solana", "technology", "comparison"],
    difficulty: "intermediate",
    updatedAt: "March 2026",
  },
  {
    id: "everyone-talking-crypto",
    title: "Everyone is talking about crypto. Should I follow?",
    subtitle: "Understanding social pressure and FOMO",
    description:
      "When everyone around you is excited about crypto, it can feel like you are missing out. But making decisions based on hype rather than understanding is one of the most common mistakes in investing.",
    asset: "BTC",
    probability: { up: 35, flat: 25, down: 40 },
    simulationRange: { min: 10, max: 500, defaultAmount: 50 },
    outcomes: {
      bestCase: {
        multiplier: 1.15,
        description: "Sometimes the crowd is right and prices continue to rise. A 15% gain is possible if momentum continues.",
      },
      worstCase: {
        multiplier: 0.65,
        description: "Historically, when everyone is talking about an investment, prices are often already high. A 35% drop after peak hype is common.",
      },
    },
    explanation: {
      whyUp: "Widespread interest can bring more buyers into the market, pushing prices higher in the short term. Mainstream adoption is generally positive long-term.",
      whyDown: "When excitement peaks, prices often follow. Many people buy at the top because of social pressure, then sell at a loss when the hype fades.",
      whatToWatch: "Are people talking about the technology and real use cases, or just about getting rich quick? The quality of the conversation tells you a lot.",
    },
    guidance: {
      conservative: "Take a breath. There is no rush. If crypto is a good investment today, it will still be there next week. Use this time to learn, not to buy.",
      moderate: "It is okay to start exploring, but do it on your own terms. Set a small budget, learn the basics, and ignore the noise.",
      aggressive: "Social momentum can create opportunities, but be honest about your reasons for buying. FOMO is not a strategy.",
    },
    socialProof: {
      usersWhoSimulated: 3298,
      avgDecision: "conservative",
      communityNote: "Users who waited and learned first reported making more confident decisions when they eventually did invest.",
    },
    tags: ["bitcoin", "psychology", "fomo"],
    difficulty: "beginner",
    updatedAt: "March 2026",
  },
  {
    id: "have-200-where-to-start",
    title: "I have $200. Where do I start?",
    subtitle: "Making the most of a small budget",
    description:
      "With $200, you have enough to learn meaningful lessons about crypto without taking on too much risk. The key is deciding how to split it and what to focus on.",
    asset: "BTC",
    probability: { up: 45, flat: 25, down: 30 },
    simulationRange: { min: 10, max: 500, defaultAmount: 200 },
    outcomes: {
      bestCase: {
        multiplier: 1.3,
        description: "A diversified $200 investment could grow to $260. More importantly, you will have hands-on experience with multiple assets.",
      },
      worstCase: {
        multiplier: 0.72,
        description: "A broad market downturn could reduce your $200 to about $144. Diversification helps, but it does not eliminate risk.",
      },
    },
    explanation: {
      whyUp: "Splitting across multiple assets reduces the impact of any single coin dropping. If one goes down, another might go up or stay stable.",
      whyDown: "In a broad market downturn, most cryptocurrencies fall together. Diversification helps with individual coin risk, not market-wide risk.",
      whatToWatch: "Focus on understanding each asset you buy. Why did you choose it? What makes it different? This builds knowledge, not just a portfolio.",
    },
    guidance: {
      conservative: "Put most in Bitcoin, a small amount in Ethereum. Keep it simple. The goal is learning, not maximizing returns.",
      moderate: "Consider splitting: 50% Bitcoin, 30% Ethereum, 20% Solana. This gives you exposure to different types of crypto while keeping most in established coins.",
      aggressive: "You could allocate more to higher-risk assets like Solana for potentially higher returns, but understand that the downside is also larger.",
    },
    socialProof: {
      usersWhoSimulated: 2567,
      avgDecision: "moderate",
      communityNote: "The most popular split was 60% BTC, 30% ETH, 10% SOL among users with a $200 budget.",
    },
    tags: ["bitcoin", "ethereum", "solana", "beginner", "diversification"],
    difficulty: "beginner",
    updatedAt: "March 2026",
  },
  {
    id: "what-is-dca",
    title: "Should I buy all at once or a little each week?",
    subtitle: "Understanding dollar-cost averaging",
    description:
      "Dollar-cost averaging means investing a fixed amount on a regular schedule, regardless of price. It is one of the most recommended strategies for beginners because it removes the stress of timing.",
    asset: "ETH",
    probability: { up: 50, flat: 25, down: 25 },
    simulationRange: { min: 10, max: 500, defaultAmount: 100 },
    outcomes: {
      bestCase: {
        multiplier: 1.25,
        description: "Regular buying over time smooths out price spikes. You end up with a solid average price and less stress about daily movements.",
      },
      worstCase: {
        multiplier: 0.82,
        description: "Even with DCA, a prolonged downturn will result in losses. But your average cost will be lower than if you had bought everything at the peak.",
      },
    },
    explanation: {
      whyUp: "DCA takes emotion out of investing. You buy more when prices are low and less when prices are high, naturally improving your average cost over time.",
      whyDown: "In a steadily rising market, DCA can result in a higher average cost than buying all at once. But for beginners, the peace of mind is worth it.",
      whatToWatch: "The key metric is your average purchase price over time, not what the price does on any single day.",
    },
    guidance: {
      conservative: "DCA is perfect for conservative investors. Set up a small weekly purchase and forget about daily price movements.",
      moderate: "Consider buying a fixed amount each week or month. It is boring, and that is exactly the point. Boring strategies often work best.",
      aggressive: "Even aggressive investors benefit from DCA. You can always add extra during significant dips while maintaining your regular schedule.",
    },
    socialProof: {
      usersWhoSimulated: 1923,
      avgDecision: "moderate",
      communityNote: "Users who tried DCA in their practice portfolio said it helped them stop worrying about picking the perfect moment.",
    },
    tags: ["ethereum", "strategy", "dca"],
    difficulty: "intermediate",
    updatedAt: "March 2026",
  },
]

export function getScenarioById(id: string): DecisionScenario | undefined {
  return scenarios.find((s) => s.id === id)
}
