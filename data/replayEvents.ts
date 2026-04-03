export interface ReplayHeadline {
  source: string
  text: string
  timestamp: string
  sentiment: "bearish" | "bullish" | "neutral"
}

export interface ReplayDecisionOption {
  id: "buy" | "sell" | "hold" | "wait"
  label: string
  emoji: string
  rationale: string
}

export interface ReplayPhase {
  id: string
  label: string
  dateRange: { start: string; end: string }
  priceData: number[]
  headlines: ReplayHeadline[]
  context: string
  decisionPrompt?: string
  decisionOptions?: ReplayDecisionOption[]
}

export interface ReplayOutcome {
  decisionId: "buy" | "sell" | "hold" | "wait"
  priceDataAfter: number[]
  resultDescription: string
  multiplier: number
  lessonsLearned: string[]
  expertNote: string
}

export interface ReplayEvent {
  id: string
  title: string
  subtitle: string
  asset: string
  date: string
  category: "crash" | "milestone" | "event"
  difficulty: "beginner" | "intermediate"
  coverEmoji: string
  briefSummary: string
  phases: ReplayPhase[]
  outcomes: ReplayOutcome[]
  whatActuallyHappened: string
  tags: string[]
  relatedLessonIds: string[]
  relatedScenarioIds: string[]
}

export const replayEvents: ReplayEvent[] = [
  {
    id: "terra-luna-crash",
    title: "The Terra Luna Collapse",
    subtitle: "May 2022: When $40 billion vanished in 72 hours",
    asset: "LUNA",
    date: "May 9, 2022",
    category: "crash",
    difficulty: "intermediate",
    coverEmoji: "💥",
    briefSummary:
      "Terra's algorithmic stablecoin UST lost its $1 peg, triggering a death spiral that wiped out LUNA from $80 to fractions of a penny. It was one of crypto's biggest collapses ever.",
    phases: [
      {
        id: "buildup",
        label: "The Warning Signs",
        dateRange: { start: "2022-05-01", end: "2022-05-07" },
        priceData: [77.5, 79.2, 80.1, 78.4, 77.0, 74.3, 68.2],
        headlines: [
          {
            source: "CoinDesk",
            text: "Large UST withdrawals from Anchor Protocol raise eyebrows",
            timestamp: "2022-05-03",
            sentiment: "bearish",
          },
          {
            source: "The Block",
            text: "Whale moves $285M UST out of Anchor, but Terra community unfazed",
            timestamp: "2022-05-05",
            sentiment: "neutral",
          },
          {
            source: "Twitter",
            text: "Do Kwon: 'By my hand, $DAI will die.' Confidence in Terra remains sky-high",
            timestamp: "2022-05-06",
            sentiment: "bullish",
          },
        ],
        context:
          "Terra's LUNA token sits at $80, and its stablecoin UST is supposedly pegged to $1. Anchor Protocol offers 20% APY on UST deposits. Too good to be true? Large withdrawals are happening, but the Terra community dismisses concerns. You hold $100 worth of LUNA.",
      },
      {
        id: "crisis",
        label: "The Death Spiral",
        dateRange: { start: "2022-05-08", end: "2022-05-12" },
        priceData: [64.0, 30.2, 16.8, 2.1, 0.12],
        headlines: [
          {
            source: "Reuters",
            text: "Terra's UST stablecoin breaks dollar peg, drops to $0.68",
            timestamp: "2022-05-09",
            sentiment: "bearish",
          },
          {
            source: "CoinDesk",
            text: "LUNA crashes 96% as Terra's algorithmic stablecoin enters death spiral",
            timestamp: "2022-05-11",
            sentiment: "bearish",
          },
          {
            source: "Bloomberg",
            text: "$40 billion wiped from Terra ecosystem in 72 hours",
            timestamp: "2022-05-12",
            sentiment: "bearish",
          },
        ],
        context:
          "UST has broken its dollar peg and fallen to $0.68. LUNA is being minted endlessly to try to restore the peg, but it is only crashing the price further. Panic selling is everywhere. Social media is flooded with people who have lost their life savings.",
        decisionPrompt:
          "It's May 9, 2022. UST just broke its peg. LUNA is falling fast. You have $100 in LUNA. What do you do?",
        decisionOptions: [
          {
            id: "buy",
            label: "Buy the dip",
            emoji: "🤑",
            rationale: "LUNA has survived dips before. This is a buying opportunity at a huge discount.",
          },
          {
            id: "sell",
            label: "Sell everything",
            emoji: "🚨",
            rationale: "A broken stablecoin peg is a red flag. Better to take whatever is left.",
          },
          {
            id: "hold",
            label: "Hold steady",
            emoji: "💎",
            rationale: "Do Kwon will fix this. The Luna Foundation Guard has reserves.",
          },
          {
            id: "wait",
            label: "Wait and watch",
            emoji: "👀",
            rationale: "Too much chaos right now. Let the dust settle before doing anything.",
          },
        ],
      },
      {
        id: "aftermath",
        label: "The Aftermath",
        dateRange: { start: "2022-05-13", end: "2022-05-20" },
        priceData: [0.04, 0.001, 0.0002, 0.00015, 0.0001, 0.00008, 0.00006, 0.00005],
        headlines: [
          {
            source: "The Verge",
            text: "Terra blockchain halted as LUNA price approaches zero",
            timestamp: "2022-05-13",
            sentiment: "bearish",
          },
          {
            source: "CNBC",
            text: "Crypto industry reels from Terra collapse as calls for regulation intensify",
            timestamp: "2022-05-16",
            sentiment: "neutral",
          },
        ],
        context:
          "LUNA has effectively gone to zero. The Terra blockchain was halted. Billions in value evaporated. Investigations into Do Kwon and Terraform Labs have begun. This event would later be cited as a key catalyst for the broader 2022 crypto crash.",
      },
    ],
    outcomes: [
      {
        decisionId: "buy",
        priceDataAfter: [0.12, 0.04, 0.001, 0.0002, 0.0001, 0.00005],
        resultDescription:
          "If you bought $100 more at $64, you would have gotten ~1.56 LUNA. Within days, that was worth less than $0.001. Your total investment of $200 became essentially $0.",
        multiplier: 0.0,
        lessonsLearned: [
          "Not every dip is a buying opportunity. Some are the start of a collapse",
          "Algorithmic stablecoins carry systemic risk that can wipe out an entire ecosystem",
          "When a project's fundamental mechanism (the peg) breaks, technical recovery is unlikely",
        ],
        expertNote:
          "Experienced traders recognized the death spiral pattern early. Once UST broke its peg and LUNA minting accelerated, the math made recovery impossible. Most professionals exited within hours.",
      },
      {
        decisionId: "sell",
        priceDataAfter: [0.12, 0.04, 0.001, 0.0002, 0.0001, 0.00005],
        resultDescription:
          "If you sold at $64 on May 9, you recovered about $80 of your original $100. Not great, but you saved $80 that would have gone to $0.",
        multiplier: 0.8,
        lessonsLearned: [
          "Cutting losses early is one of the hardest but most valuable skills in investing",
          "Recognizing systemic risk (broken peg) vs normal volatility can save your portfolio",
          "It is better to sell at a small loss than hold to zero",
        ],
        expertNote:
          "Selling at a 20% loss feels painful, but it is infinitely better than a 100% loss. Professional traders use stop-losses precisely for moments like this.",
      },
      {
        decisionId: "hold",
        priceDataAfter: [0.12, 0.04, 0.001, 0.0002, 0.0001, 0.00005],
        resultDescription:
          "If you held, your $100 in LUNA went from $64 to effectively $0 within days. Diamond hands does not work when the project fundamentally collapses.",
        multiplier: 0.0,
        lessonsLearned: [
          "'Diamond hands' is only a strategy when the underlying project is sound",
          "Loyalty to a project should never override evidence of systemic failure",
          "There is a difference between short-term volatility and existential risk",
        ],
        expertNote:
          "Holding through a death spiral is different from holding through normal market volatility. The key distinction is whether the project's core mechanism is still functioning.",
      },
      {
        decisionId: "wait",
        priceDataAfter: [0.12, 0.04, 0.001, 0.0002, 0.0001, 0.00005],
        resultDescription:
          "If you waited, you watched your $100 position fall to $0 over the next few days. By the time the dust settled, there was nothing left to act on.",
        multiplier: 0.0,
        lessonsLearned: [
          "In a fast-moving crisis, inaction is itself a decision, and often the worst one",
          "Having a plan before a crisis hits is essential. Deciding during panic is too late",
          "Speed matters when systemic risk is unfolding",
        ],
        expertNote:
          "Waiting for clarity is usually wise, but in a death spiral measured in hours, not days, hesitation meant total loss. Pre-set stop-losses would have acted automatically.",
      },
    ],
    whatActuallyHappened:
      "LUNA went from $80 to effectively $0 in under a week. UST never recovered its peg. Over $40 billion in value was destroyed. Do Kwon was later arrested and charged with fraud. The collapse triggered a chain reaction that contributed to the broader 2022 crypto crash, including the fall of Three Arrows Capital and the FTX exchange.",
    tags: ["crash", "stablecoin", "algorithmic", "LUNA", "UST"],
    relatedLessonIds: ["what-is-volatile", "how-people-lose-money"],
    relatedScenarioIds: ["market-dropped-15"],
  },
  {
    id: "bitcoin-halving-2024",
    title: "The Bitcoin Halving",
    subtitle: "April 2024: When Bitcoin's supply got cut in half",
    asset: "BTC",
    date: "April 19, 2024",
    category: "milestone",
    difficulty: "beginner",
    coverEmoji: "⛏️",
    briefSummary:
      "Every four years, Bitcoin's mining reward is cut in half. The 2024 halving reduced the reward from 6.25 to 3.125 BTC per block. Historically, halvings have preceded massive price increases, but would this time be different?",
    phases: [
      {
        id: "anticipation",
        label: "The Buildup",
        dateRange: { start: "2024-03-15", end: "2024-04-15" },
        priceData: [68200, 69500, 71200, 70800, 69000, 67500, 71800, 73750, 69400, 67200, 65800, 63900, 64200, 66500, 63800, 64800, 65400, 66200, 64900, 63100, 64200, 65100, 66800, 63500, 64100, 64800, 65200, 63800, 63500, 64200, 63900],
        headlines: [
          {
            source: "Bloomberg",
            text: "Bitcoin nears $74K as halving hype drives institutional buying",
            timestamp: "2024-03-14",
            sentiment: "bullish",
          },
          {
            source: "CoinDesk",
            text: "Bitcoin ETFs see record $1B daily inflows ahead of halving",
            timestamp: "2024-03-25",
            sentiment: "bullish",
          },
          {
            source: "CNBC",
            text: "Analysts debate: Is the halving already priced in?",
            timestamp: "2024-04-10",
            sentiment: "neutral",
          },
        ],
        context:
          "Bitcoin has been on a tear, hitting a new all-time high above $73,000 in March. Spot Bitcoin ETFs have been approved and are seeing massive inflows. Everyone is talking about the halving, and the question is whether the anticipated price rise is already priced in. You have $100 worth of BTC.",
      },
      {
        id: "halving-day",
        label: "Halving Day",
        dateRange: { start: "2024-04-16", end: "2024-04-30" },
        priceData: [63200, 63900, 62500, 64200, 66700, 64400, 63600, 63800, 64000, 63200, 62800, 63500, 64800, 63000, 63300],
        headlines: [
          {
            source: "Reuters",
            text: "Bitcoin halving complete: block reward now 3.125 BTC",
            timestamp: "2024-04-20",
            sentiment: "neutral",
          },
          {
            source: "CoinTelegraph",
            text: "Post-halving sell-off: Bitcoin dips below $63K as miners adjust",
            timestamp: "2024-04-22",
            sentiment: "bearish",
          },
          {
            source: "The Block",
            text: "Analysts say real halving impact typically takes 6-12 months to materialize",
            timestamp: "2024-04-25",
            sentiment: "neutral",
          },
        ],
        context:
          "The halving has happened. Block rewards are now 3.125 BTC instead of 6.25. But the price hasn't exploded upward. In fact, it dipped slightly. Many retail investors expected an immediate moonshot. The market seems underwhelmed. Was it all just hype?",
        decisionPrompt:
          "It's April 22, 2024. The halving just happened but BTC dipped to $63K. What do you do with your $100 in Bitcoin?",
        decisionOptions: [
          {
            id: "buy",
            label: "Buy more BTC",
            emoji: "📈",
            rationale: "Halving effects take months. This dip is a gift before the next bull run.",
          },
          {
            id: "sell",
            label: "Sell: it was priced in",
            emoji: "📉",
            rationale: "The market already rallied before the halving. The event is over, so is the hype.",
          },
          {
            id: "hold",
            label: "Hold and be patient",
            emoji: "⏳",
            rationale: "Previous halvings took 12-18 months to show their full impact. Just wait.",
          },
          {
            id: "wait",
            label: "Wait for a bigger dip",
            emoji: "🎯",
            rationale: "It might drop further. Wait for a better entry point.",
          },
        ],
      },
      {
        id: "aftermath",
        label: "The Months After",
        dateRange: { start: "2024-05-01", end: "2024-12-31" },
        priceData: [57800, 60800, 67500, 62200, 59400, 57100, 64800, 68200, 63500, 58900, 54800, 57200, 60800, 63700, 68500, 71200, 69800, 72500, 90800, 96400, 93800],
        headlines: [
          {
            source: "Bloomberg",
            text: "Bitcoin surges past $90K as post-halving rally materializes",
            timestamp: "2024-11-15",
            sentiment: "bullish",
          },
        ],
        context:
          "After months of sideways movement and even a dip below $55K in the summer, Bitcoin eventually surged to over $90K by November 2024, validating the historical pattern of post-halving rallies, but only for those with patience.",
      },
    ],
    outcomes: [
      {
        decisionId: "buy",
        priceDataAfter: [57800, 60800, 67500, 62200, 59400, 57100, 64800, 68200, 63500, 58900, 54800, 57200, 60800, 63700, 68500, 71200, 69800, 72500, 90800, 96400],
        resultDescription:
          "If you bought $100 more at $63K, your total $200 investment grew to about $306 by November when BTC hit $96K, a 53% gain. But you had to endure a summer dip below $55K first.",
        multiplier: 1.53,
        lessonsLearned: [
          "Halving effects are real but take months, not days, to play out",
          "Buying when others are disappointed can be a strong strategy",
          "You need emotional resilience to hold through dips after buying",
        ],
        expertNote:
          "Dollar-cost averaging around the halving is what most experienced investors did. They didn't try to time the exact bottom. They spread their buying over weeks and months.",
      },
      {
        decisionId: "sell",
        priceDataAfter: [57800, 60800, 67500, 62200, 59400, 57100, 64800, 68200, 63500, 58900, 54800, 57200, 60800, 63700, 68500, 71200, 69800, 72500, 90800, 96400],
        resultDescription:
          "If you sold at $63K, you locked in your $100. Meanwhile, BTC went on to hit $96K, a 53% gain you missed. Selling before a historically bullish event was premature.",
        multiplier: 1.0,
        lessonsLearned: [
          "Short-term thinking can cause you to miss long-term trends",
          "Historical patterns do not guarantee the future, but they are worth considering",
          "Selling based on a few days of price action after a major event is usually too hasty",
        ],
        expertNote:
          "The 'buy the rumor, sell the news' strategy works for short-term traders, but Bitcoin halvings have historically produced returns over 12-18 months, not days.",
      },
      {
        decisionId: "hold",
        priceDataAfter: [57800, 60800, 67500, 62200, 59400, 57100, 64800, 68200, 63500, 58900, 54800, 57200, 60800, 63700, 68500, 71200, 69800, 72500, 90800, 96400],
        resultDescription:
          "If you held your $100, it grew to about $153 by November when BTC hit $96K. Patience paid off, though you had to sit through a nerve-wracking summer dip below $55K.",
        multiplier: 1.53,
        lessonsLearned: [
          "Patience is often the most profitable strategy in crypto",
          "Market cycles take months to unfold, not days or weeks",
          "Having conviction based on fundamentals (supply reduction) can guide you through uncertainty",
        ],
        expertNote:
          "HODLing through the halving has been the winning strategy in every previous cycle (2012, 2016, 2020). The key is having a thesis and sticking to it.",
      },
      {
        decisionId: "wait",
        priceDataAfter: [57800, 60800, 67500, 62200, 59400, 57100, 64800, 68200, 63500, 58900, 54800, 57200, 60800, 63700, 68500, 71200, 69800, 72500, 90800, 96400],
        resultDescription:
          "If you waited, you might have bought at $55K in the summer dip, turning $100 into about $175 by November. But only if you actually acted. Many waiters never find the 'perfect' entry and miss the move entirely.",
        multiplier: 1.35,
        lessonsLearned: [
          "Waiting for a dip can work, but you need a plan for when to actually buy",
          "The 'perfect' entry point rarely feels perfect in the moment",
          "DCA (Dollar Cost Averaging) removes the stress of timing decisions",
        ],
        expertNote:
          "The summer 2024 dip was actually a great buying opportunity, but very few people bought because sentiment was extremely negative at $55K. This is the classic paradox: the best prices feel the scariest.",
      },
    ],
    whatActuallyHappened:
      "Bitcoin dropped slightly after the April 2024 halving, dipped to around $55K in the summer, then rallied to over $96K by late November. The pattern was consistent with previous halvings, with a delayed but significant price increase driven by reduced supply and growing institutional demand through Bitcoin ETFs.",
    tags: ["halving", "bitcoin", "supply", "milestone"],
    relatedLessonIds: ["what-is-bitcoin", "what-is-dca"],
    relatedScenarioIds: ["should-i-buy-bitcoin", "invest-50-or-wait"],
  },
  {
    id: "ftx-collapse",
    title: "The FTX Collapse",
    subtitle: "November 2022: When the second-largest exchange imploded",
    asset: "BTC",
    date: "November 8, 2022",
    category: "crash",
    difficulty: "intermediate",
    coverEmoji: "🏚️",
    briefSummary:
      "FTX, the second-largest crypto exchange, collapsed in days after revelations that customer funds were used to prop up its sister company Alameda Research. Founder Sam Bankman-Fried was arrested and later convicted of fraud.",
    phases: [
      {
        id: "bombshell",
        label: "The Bombshell",
        dateRange: { start: "2022-11-01", end: "2022-11-06" },
        priceData: [20500, 20200, 21100, 20800, 20300, 21000],
        headlines: [
          {
            source: "CoinDesk",
            text: "Leaked balance sheet: Alameda Research holds billions in illiquid FTT tokens",
            timestamp: "2022-11-02",
            sentiment: "bearish",
          },
          {
            source: "Twitter",
            text: "CZ (Binance CEO): 'We will liquidate all our remaining FTT holdings'",
            timestamp: "2022-11-06",
            sentiment: "bearish",
          },
          {
            source: "The Block",
            text: "FTX users begin withdrawing funds as concerns mount over solvency",
            timestamp: "2022-11-06",
            sentiment: "bearish",
          },
        ],
        context:
          "CoinDesk has published a bombshell report showing that Alameda Research's balance sheet is largely composed of FTT, the token created by FTX itself. It is uncomfortably circular. Then Binance CEO CZ tweets that he will dump all of Binance's FTT holdings. A bank run begins on FTX. Bitcoin is at $21K. You hold $100 in BTC on a non-FTX exchange.",
      },
      {
        id: "bank-run",
        label: "The Bank Run",
        dateRange: { start: "2022-11-07", end: "2022-11-11" },
        priceData: [20900, 18500, 17200, 16800, 15600],
        headlines: [
          {
            source: "Bloomberg",
            text: "FTX halts customer withdrawals amid liquidity crisis",
            timestamp: "2022-11-08",
            sentiment: "bearish",
          },
          {
            source: "Reuters",
            text: "Binance walks away from FTX rescue deal after due diligence",
            timestamp: "2022-11-09",
            sentiment: "bearish",
          },
          {
            source: "CNBC",
            text: "FTX files for bankruptcy as Sam Bankman-Fried resigns as CEO",
            timestamp: "2022-11-11",
            sentiment: "bearish",
          },
        ],
        context:
          "FTX has frozen withdrawals. $6 billion was requested in 72 hours, and they do not have the money. Binance briefly offered to buy FTX but pulled out after seeing the books. FTX is filing for bankruptcy. The entire crypto market is in free fall. BTC drops from $21K to $15.6K.",
        decisionPrompt:
          "It's November 9, 2022. FTX is collapsing. Bitcoin has crashed to $17K. You hold $100 in BTC (on a different exchange). What do you do?",
        decisionOptions: [
          {
            id: "buy",
            label: "Buy the fear",
            emoji: "🦈",
            rationale: "Bitcoin itself isn't broken. FTX is a company problem, not a Bitcoin problem.",
          },
          {
            id: "sell",
            label: "Sell to safety",
            emoji: "🛡️",
            rationale: "Who knows how far this goes? Other exchanges might be next. Get out entirely.",
          },
          {
            id: "hold",
            label: "Hold through the storm",
            emoji: "⚓",
            rationale: "Bitcoin survived Mt. Gox, China bans, and COVID crash. It will survive this.",
          },
          {
            id: "wait",
            label: "Wait for the bottom",
            emoji: "⏰",
            rationale: "It might get worse before it gets better. Let the contagion play out first.",
          },
        ],
      },
      {
        id: "aftermath",
        label: "Recovery & Reckoning",
        dateRange: { start: "2022-11-12", end: "2023-03-15" },
        priceData: [16500, 16800, 16200, 16600, 16500, 16700, 16800, 17100, 16900, 17200, 17600, 19800, 21500, 22100, 23000, 23800, 24200, 25100],
        headlines: [
          {
            source: "DOJ",
            text: "Sam Bankman-Fried arrested in Bahamas on fraud charges",
            timestamp: "2022-12-12",
            sentiment: "neutral",
          },
          {
            source: "Bloomberg",
            text: "Bitcoin recovers to $25K as market finds its footing post-FTX",
            timestamp: "2023-02-15",
            sentiment: "bullish",
          },
        ],
        context:
          "FTX's collapse sent shockwaves through crypto. Multiple firms with FTX exposure went bankrupt. But Bitcoin itself continued to function perfectly, and not a single block was missed. By early 2023, BTC had recovered to $25K, and by late 2024 it would hit all-time highs above $90K.",
      },
    ],
    outcomes: [
      {
        decisionId: "buy",
        priceDataAfter: [17200, 16500, 16800, 16600, 16700, 17100, 17600, 19800, 21500, 23000, 24200, 25100],
        resultDescription:
          "If you bought $100 more at $17K, your total $200 grew to about $295 by March 2023. By late 2024, it would be worth over $1,100. Buying during maximum fear was extremely profitable.",
        multiplier: 1.48,
        lessonsLearned: [
          "Distinguish between a company failing and a technology failing. FTX broke, not Bitcoin",
          "Maximum fear often creates maximum opportunity (for those with cash and conviction)",
          "Understanding what you own and why helps you act rationally during panic",
        ],
        expertNote:
          "Warren Buffett's famous advice, 'Be fearful when others are greedy, and greedy when others are fearful,' applied perfectly here. Bitcoin's fundamentals were unchanged by FTX's fraud.",
      },
      {
        decisionId: "sell",
        priceDataAfter: [17200, 16500, 16800, 16600, 16700, 17100, 17600, 19800, 21500, 23000, 24200, 25100],
        resultDescription:
          "If you sold at $17K, you took an approximately 20% loss. BTC then recovered to $25K within months and later surged past $90K. The fear was justified for FTX users, but not for those holding BTC elsewhere.",
        multiplier: 0.81,
        lessonsLearned: [
          "Panic selling during a crisis often locks in losses that would have recovered",
          "Your risk depends on WHERE you hold, not just WHAT you hold",
          "Self-custody and diversified exchange usage reduce contagion risk",
        ],
        expertNote:
          "The lesson of FTX wasn't 'sell crypto.' It was 'don't trust centralized exchanges with all your funds.' Those who held BTC in self-custody wallets were completely unaffected.",
      },
      {
        decisionId: "hold",
        priceDataAfter: [17200, 16500, 16800, 16600, 16700, 17100, 17600, 19800, 21500, 23000, 24200, 25100],
        resultDescription:
          "If you held through the storm, your $100 initially dropped to about $74, but recovered to about $120 by March 2023. By late 2024, it would be worth over $450. Patience won.",
        multiplier: 1.2,
        lessonsLearned: [
          "Bitcoin has survived every crisis thrown at it, including the collapse of major exchanges",
          "Short-term pain does not negate long-term thesis",
          "Having a plan before a crisis makes it easier to hold through one",
        ],
        expertNote:
          "Long-term Bitcoin holders (HODLers) are used to 50%+ drawdowns. The FTX crash was painful but relatively small compared to the 2018 bear market (84% drop) or the COVID crash (50% in 2 days).",
      },
      {
        decisionId: "wait",
        priceDataAfter: [17200, 16500, 16800, 16600, 16700, 17100, 17600, 19800, 21500, 23000, 24200, 25100],
        resultDescription:
          "If you waited, you might have bought near the bottom around $16.5K in late November, turning $100 into about $152 by March 2023. Good entry, but waiting also risked missing the recovery entirely.",
        multiplier: 1.2,
        lessonsLearned: [
          "Waiting can work if you have a plan and follow through",
          "The bottom is only obvious in hindsight. It never feels like the bottom at the time",
          "Dollar-cost averaging removes the stress of trying to time the perfect entry",
        ],
        expertNote:
          "The actual bottom ($15.5K) lasted only a few days. Most people who 'waited for the bottom' did not actually buy there because it felt too scary. DCA would have been more reliable.",
      },
    ],
    whatActuallyHappened:
      "FTX filed for bankruptcy on November 11, 2022. Over $8 billion in customer funds were missing. Sam Bankman-Fried was arrested in December 2022, convicted of fraud in November 2023, and sentenced to 25 years in prison. Bitcoin's price bottomed around $15,500 and began a steady recovery, eventually reaching new all-time highs above $90K by late 2024.",
    tags: ["crash", "exchange", "fraud", "FTX", "contagion"],
    relatedLessonIds: ["what-is-a-wallet", "how-people-lose-money"],
    relatedScenarioIds: ["market-dropped-15"],
  },
  {
    id: "bitcoin-ath-2021",
    title: "Bitcoin's All-Time High",
    subtitle: "November 2021: The peak of the bull run",
    asset: "BTC",
    date: "November 10, 2021",
    category: "milestone",
    difficulty: "beginner",
    coverEmoji: "🎢",
    briefSummary:
      "Bitcoin hit $69,000 on November 10, 2021, a new all-time high fueled by institutional adoption, Coinbase's IPO, and El Salvador making it legal tender. But what came next was a brutal 18-month crash to $15,500.",
    phases: [
      {
        id: "euphoria",
        label: "Peak Euphoria",
        dateRange: { start: "2021-10-15", end: "2021-11-10" },
        priceData: [57300, 60300, 62800, 63200, 61600, 62200, 60800, 63400, 61800, 66000, 64300, 63100, 64400, 65500, 67500, 66200, 64800, 66000, 62800, 64400, 66900, 68500, 67100, 65400, 67800, 69000],
        headlines: [
          {
            source: "CNBC",
            text: "Bitcoin hits all-time high of $69,000 as crypto market cap surpasses $3 trillion",
            timestamp: "2021-11-10",
            sentiment: "bullish",
          },
          {
            source: "Bloomberg",
            text: "Analysts predict Bitcoin could reach $100K by end of 2021",
            timestamp: "2021-11-09",
            sentiment: "bullish",
          },
          {
            source: "Twitter",
            text: "Plan B stock-to-flow model predicts $98K Bitcoin by December, and it has never been wrong before",
            timestamp: "2021-11-05",
            sentiment: "bullish",
          },
        ],
        context:
          "Bitcoin has hit a new all-time high of $69,000. Crypto Twitter is euphoric. Everyone is predicting $100K by year's end. Your neighbor, your Uber driver, and your coworker are all buying Bitcoin. You have $100 in BTC and are feeling great about it.",
      },
      {
        id: "peak-decision",
        label: "At the Top",
        dateRange: { start: "2021-11-11", end: "2021-11-25" },
        priceData: [64400, 63800, 64000, 65500, 63200, 60200, 58700, 56900, 57800, 56400, 58000, 57200, 55800, 56700, 57100],
        headlines: [
          {
            source: "CoinDesk",
            text: "Bitcoin pulls back from $69K as analysts call it 'healthy consolidation'",
            timestamp: "2021-11-12",
            sentiment: "neutral",
          },
          {
            source: "The Block",
            text: "Leverage in crypto markets reaches all-time highs, raising danger of cascading liquidations",
            timestamp: "2021-11-18",
            sentiment: "bearish",
          },
          {
            source: "Reuters",
            text: "Fed signals faster tapering and potential rate hikes in 2022",
            timestamp: "2021-11-24",
            sentiment: "bearish",
          },
        ],
        context:
          "Bitcoin has dropped from $69K to around $57K. Some say it is just a healthy pullback before $100K. But leverage is at extreme levels, and the Federal Reserve is signaling it will raise interest rates aggressively in 2022. A few bearish voices are emerging, but they are drowned out by $100K predictions.",
        decisionPrompt:
          "It's November 15, 2021. Bitcoin is at $63K after touching $69K. Everyone says $100K is inevitable. You have $100 in BTC. What do you do?",
        decisionOptions: [
          {
            id: "buy",
            label: "Buy more: $100K is coming",
            emoji: "🚀",
            rationale: "Every dip in this bull run has been a buying opportunity. Why would this be different?",
          },
          {
            id: "sell",
            label: "Take profits",
            emoji: "💰",
            rationale: "Up 300% this year. The euphoria feels unsustainable. Lock in some gains.",
          },
          {
            id: "hold",
            label: "Hold for $100K",
            emoji: "💎",
            rationale: "Don't sell before the top. Stock-to-flow says $100K. Trust the model.",
          },
          {
            id: "wait",
            label: "Wait for clearer signals",
            emoji: "🔍",
            rationale: "The Fed news is concerning. Wait to see how rates affect the market.",
          },
        ],
      },
      {
        id: "long-decline",
        label: "The Long Decline",
        dateRange: { start: "2021-11-26", end: "2022-06-30" },
        priceData: [54200, 49500, 46200, 42500, 37600, 38200, 42000, 38900, 35400, 30100, 28800, 29200, 20100, 19800],
        headlines: [
          {
            source: "CNBC",
            text: "Bitcoin crashes below $35K, down 50% from November high",
            timestamp: "2022-01-22",
            sentiment: "bearish",
          },
          {
            source: "Bloomberg",
            text: "Bitcoin drops below $20K for first time since 2020 as crypto winter arrives",
            timestamp: "2022-06-18",
            sentiment: "bearish",
          },
        ],
        context:
          "What followed the $69K high was an 18-month decline. Fed rate hikes, the Terra/Luna collapse, and leveraged positions unwinding drove BTC from $69K all the way down to $15,500 by November 2022. The $100K prediction never materialized, at least not in this cycle.",
      },
    ],
    outcomes: [
      {
        decisionId: "buy",
        priceDataAfter: [63200, 54200, 49500, 46200, 42500, 37600, 38200, 35400, 30100, 28800, 20100, 19800],
        resultDescription:
          "If you bought $100 more at $63K, your total $200 dropped to about $63 by June 2022, a 68% loss. Buying at the top of euphoria is one of the most expensive mistakes in investing.",
        multiplier: 0.32,
        lessonsLearned: [
          "When 'everyone' is buying and predictions are wildly optimistic, extreme caution is warranted",
          "FOMO (Fear of Missing Out) is the most expensive emotion in crypto",
          "Extreme bullish consensus often marks the top, not the beginning, of a rally",
        ],
        expertNote:
          "The 'taxi driver indicator,' when people who never discuss markets start giving crypto tips, has historically been a reliable sign of a market top. Professional traders call this 'distribution phase.'",
      },
      {
        decisionId: "sell",
        priceDataAfter: [63200, 54200, 49500, 46200, 42500, 37600, 38200, 35400, 30100, 28800, 20100, 19800],
        resultDescription:
          "If you sold at $63K, you locked in your $100. While BTC dropped 70% over the next year, your money was safe. This was one of the few times selling was clearly the right call.",
        multiplier: 1.0,
        lessonsLearned: [
          "Taking profits is not the same as giving up. It is risk management",
          "Nobody went broke by taking profits",
          "Recognizing euphoria and choosing to act on caution takes courage",
        ],
        expertNote:
          "Very few people actually sell near the top. The fear of missing further gains (what if it does hit $100K?) is psychologically more powerful than the fear of losing what you have. This is why having a plan matters.",
      },
      {
        decisionId: "hold",
        priceDataAfter: [63200, 54200, 49500, 46200, 42500, 37600, 38200, 35400, 30100, 28800, 20100, 19800],
        resultDescription:
          "If you held, your $100 dropped to about $31 by June 2022. It did eventually recover, and BTC hit $90K+ by late 2024, but it took 3 years. The emotional toll of watching 70% of your investment disappear was enormous.",
        multiplier: 0.31,
        lessonsLearned: [
          "Holding works long-term, but the psychological cost of a 70% drawdown is brutal",
          "Models and predictions are not guarantees. The stock-to-flow model was wrong",
          "Having a time horizon matters: 3 years to recovery is long for most people",
        ],
        expertNote:
          "Long-term holders who bought at the 2017 peak ($20K) also saw a 84% crash before eventual recovery. If you believe in the long-term thesis and can handle the drawdown, holding works, but it requires genuine conviction, not hope.",
      },
      {
        decisionId: "wait",
        priceDataAfter: [63200, 54200, 49500, 46200, 42500, 37600, 38200, 35400, 30100, 28800, 20100, 19800],
        resultDescription:
          "If you waited, you avoided buying more at the top. If you held your existing $100, it still dropped with the market. But at least you didn't double down at $63K. The Fed signals were a legitimate red flag.",
        multiplier: 0.31,
        lessonsLearned: [
          "Macro factors (interest rates, Fed policy) significantly affect crypto prices",
          "Waiting is sometimes the best decision, especially when red flags are emerging",
          "Not every opportunity requires action. Sometimes the best trade is no trade",
        ],
        expertNote:
          "The Fed's pivot to tightening monetary policy was the biggest macro headwind of 2022. Experienced traders watch central bank signals closely because cheap money drives risk assets up, and expensive money drives them down.",
      },
    ],
    whatActuallyHappened:
      "Bitcoin's November 2021 high of $69,000 was followed by an 18-month bear market. The price dropped to $15,500 by November 2022, a 77% decline. The crash was driven by Fed rate hikes, the Terra/Luna collapse, Three Arrows Capital bankruptcy, and the FTX fraud. BTC eventually recovered and surpassed $90K by late 2024.",
    tags: ["milestone", "ATH", "FOMO", "bull-run", "crash"],
    relatedLessonIds: ["what-is-volatile", "what-is-hodl", "how-people-lose-money"],
    relatedScenarioIds: ["fomo-hype", "should-i-buy-bitcoin"],
  },
  {
    id: "ethereum-merge",
    title: "The Ethereum Merge",
    subtitle: "September 2022: The biggest upgrade in crypto history",
    asset: "ETH",
    date: "September 15, 2022",
    category: "event",
    difficulty: "intermediate",
    coverEmoji: "🔀",
    briefSummary:
      "Ethereum transitioned from Proof of Work to Proof of Stake, eliminating 99.95% of its energy use. It was the most complex live upgrade in blockchain history. But what happened to ETH's price surprised many.",
    phases: [
      {
        id: "buildup",
        label: "The Anticipation",
        dateRange: { start: "2022-08-01", end: "2022-09-14" },
        priceData: [1680, 1820, 1640, 1700, 1900, 1780, 1660, 1720, 1580, 1620, 1710, 1590, 1680, 1640, 1720, 1600, 1580, 1620, 1640, 1580, 1600, 1580, 1640, 1590, 1610, 1580, 1550, 1560, 1590, 1600, 1610, 1640, 1650, 1620, 1600, 1590, 1610, 1630, 1670, 1640, 1610, 1590, 1600, 1580, 1620],
        headlines: [
          {
            source: "Ethereum Foundation",
            text: "The Merge is confirmed for September 15 as Ethereum moves to Proof of Stake",
            timestamp: "2022-08-11",
            sentiment: "bullish",
          },
          {
            source: "CoinDesk",
            text: "Ethereum rally: ETH jumps 90% from June lows on Merge excitement",
            timestamp: "2022-08-14",
            sentiment: "bullish",
          },
          {
            source: "Bloomberg",
            text: "Will the Merge be a 'buy the rumor, sell the news' event? Analysts divided",
            timestamp: "2022-09-10",
            sentiment: "neutral",
          },
        ],
        context:
          "Ethereum's long-awaited transition to Proof of Stake is days away. ETH rallied 90% from its June lows on the hype alone. Some say the upgrade will make ETH deflationary and drive prices higher. Others warn it could be a classic 'buy the rumor, sell the news' event. You hold $100 in ETH.",
      },
      {
        id: "merge-day",
        label: "Merge Day",
        dateRange: { start: "2022-09-15", end: "2022-09-30" },
        priceData: [1590, 1470, 1330, 1290, 1320, 1340, 1310, 1280, 1330, 1290, 1310, 1350, 1320, 1280, 1310, 1340],
        headlines: [
          {
            source: "Reuters",
            text: "Ethereum Merge complete: network transitions to Proof of Stake successfully",
            timestamp: "2022-09-15",
            sentiment: "bullish",
          },
          {
            source: "CoinTelegraph",
            text: "ETH drops 15% post-Merge: 'Buy the rumor, sell the news' plays out",
            timestamp: "2022-09-17",
            sentiment: "bearish",
          },
          {
            source: "The Block",
            text: "Macro headwinds overshadow Merge success as Fed raises rates again",
            timestamp: "2022-09-22",
            sentiment: "bearish",
          },
        ],
        context:
          "The Merge was a technical success, and not a single transaction was lost. But ETH dropped 15% in the week following the upgrade. The macro environment (Fed rate hikes, rising inflation) overshadowed the technical achievement. Many retail investors who bought for the Merge are now underwater.",
        decisionPrompt:
          "It's September 17, 2022. The Merge was successful, but ETH dropped 15% to $1,330. Was it 'buy the rumor, sell the news' or is this a buying opportunity?",
        decisionOptions: [
          {
            id: "buy",
            label: "Buy: the tech upgrade matters",
            emoji: "💡",
            rationale: "The Merge was the most important upgrade ever. The market will catch up to the fundamentals.",
          },
          {
            id: "sell",
            label: "Sell: classic sell the news",
            emoji: "📰",
            rationale: "The Merge was priced in. ETH rallied 90% before it. The hype is over.",
          },
          {
            id: "hold",
            label: "Hold: focus on long term",
            emoji: "🧊",
            rationale: "One week of price action means nothing. Proof of Stake makes ETH fundamentally stronger.",
          },
          {
            id: "wait",
            label: "Wait: macro is too uncertain",
            emoji: "📊",
            rationale: "The Fed is raising rates aggressively. Wait until macro conditions improve.",
          },
        ],
      },
      {
        id: "aftermath",
        label: "What Followed",
        dateRange: { start: "2022-10-01", end: "2023-04-15" },
        priceData: [1280, 1310, 1340, 1250, 1210, 1260, 1230, 1580, 1530, 1660, 1610, 1650, 1720, 1850, 1920, 2100],
        headlines: [
          {
            source: "CoinDesk",
            text: "Ethereum becomes net deflationary for first time since the Merge",
            timestamp: "2023-01-15",
            sentiment: "bullish",
          },
          {
            source: "Bloomberg",
            text: "ETH staking surges past $40B as Shapella upgrade enables withdrawals",
            timestamp: "2023-04-12",
            sentiment: "bullish",
          },
        ],
        context:
          "ETH continued to decline through October-November 2022 (FTX collapse dragged everything down), hitting lows around $1,100. But by April 2023, ETH had recovered to $2,100. The Merge's benefits, including reduced energy use, lower issuance, and staking yield, gradually attracted institutional interest.",
      },
    ],
    outcomes: [
      {
        decisionId: "buy",
        priceDataAfter: [1330, 1280, 1210, 1260, 1580, 1660, 1720, 1920, 2100],
        resultDescription:
          "If you bought $100 more at $1,330, your total $200 grew to about $316 by April 2023. The fundamentals eventually won, but you had to endure further drops first (ETH hit $1,100 in November).",
        multiplier: 1.58,
        lessonsLearned: [
          "Fundamental improvements do eventually affect price, but timing is unpredictable",
          "Buying after a 'sell the news' dip on a genuinely positive event can be profitable",
          "You need conviction and patience when the market disagrees with your thesis",
        ],
        expertNote:
          "The Merge was a genuine technological leap, reducing Ethereum's energy consumption by 99.95%. Investors who understood the technical significance bought the dip, while traders who only followed price action sold.",
      },
      {
        decisionId: "sell",
        priceDataAfter: [1330, 1280, 1210, 1260, 1580, 1660, 1720, 1920, 2100],
        resultDescription:
          "If you sold at $1,330, you locked in about $84 of your original $100 (an 16% loss from when ETH was at ~$1,590). ETH did drop further to $1,100, but then recovered to $2,100, which means gains you missed.",
        multiplier: 0.84,
        lessonsLearned: [
          "'Buy the rumor, sell the news' is a real pattern, but it does not mean the news is bad",
          "Short-term trading patterns can conflict with long-term value creation",
          "Selling a fundamentally stronger asset because of short-term price action is risky",
        ],
        expertNote:
          "The 'sell the news' pattern played out perfectly in the short term. But the Merge made ETH fundamentally more valuable (less inflation, staking yield). Short-term traders won the week but lost the year.",
      },
      {
        decisionId: "hold",
        priceDataAfter: [1330, 1280, 1210, 1260, 1580, 1660, 1720, 1920, 2100],
        resultDescription:
          "If you held your $100, it dropped to about $69 in November 2022 (FTX crash), but recovered to about $132 by April 2023. Holding through the noise worked, but required nerves of steel.",
        multiplier: 1.32,
        lessonsLearned: [
          "Focusing on fundamentals over price action is the hallmark of experienced investors",
          "Technology upgrades create value over months and years, not days",
          "Holding through a bear market is emotionally exhausting but often rewarding",
        ],
        expertNote:
          "The Merge reduced ETH issuance significantly. Combined with EIP-1559 fee burning, ETH became deflationary during periods of high activity. This supply dynamic is what long-term holders were positioning for.",
      },
      {
        decisionId: "wait",
        priceDataAfter: [1330, 1280, 1210, 1260, 1580, 1660, 1720, 1920, 2100],
        resultDescription:
          "If you waited, you could have bought at $1,100 in November 2022, turning $100 into about $191 by April 2023. The macro concern was valid; waiting for better conditions paid off.",
        multiplier: 1.5,
        lessonsLearned: [
          "Macro conditions (interest rates, Fed policy) matter more than any single event",
          "Sometimes the best strategy is patience, even when others are acting",
          "Understanding the broader economic context helps you make better crypto decisions",
        ],
        expertNote:
          "The investors who performed best during the Merge period were those who understood that macro headwinds (Fed tightening) would suppress prices regardless of Ethereum's technical improvements. They waited and bought lower.",
      },
    ],
    whatActuallyHappened:
      "The Merge was executed flawlessly on September 15, 2022. ETH dropped 15% in the following week, a textbook 'sell the news' event. The broader market continued declining due to macro headwinds and the FTX collapse in November. ETH hit a low of about $1,100 before recovering to $2,100 by April 2023 and eventually surpassing $3,500 in 2024.",
    tags: ["event", "ethereum", "merge", "proof-of-stake", "upgrade"],
    relatedLessonIds: ["what-is-ethereum", "what-are-fees"],
    relatedScenarioIds: ["is-ethereum-good-long-term"],
  },
]

export function getReplayEventById(id: string): ReplayEvent | undefined {
  return replayEvents.find((e) => e.id === id)
}
