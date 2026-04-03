export interface Lesson {
  id: string
  title: string
  emoji: string
  duration: string
  difficulty: "beginner" | "intermediate"
  content: string
  keyTakeaway: string
  relatedScenarios: string[]
}

export const lessons: Lesson[] = [
  {
    id: "what-is-bitcoin",
    title: "What is Bitcoin, really?",
    emoji: "🪙",
    duration: "2 min read",
    difficulty: "beginner",
    content: `Bitcoin is a type of digital money that exists only on the internet. Unlike regular money, no bank or government controls it. Instead, it runs on a network of thousands of computers around the world that work together to keep track of every transaction.

Think of it like a shared notebook that everyone can read but nobody can erase. When someone sends Bitcoin to another person, that transaction gets written into this notebook permanently.

Bitcoin was created in 2009 by someone using the name Satoshi Nakamoto. Nobody knows who this person really is. The key idea was to create money that does not need a middleman. No bank, no payment processor, just people sending value directly to each other.

There will only ever be 21 million Bitcoins. This limited supply is one reason some people think it could hold value over time, similar to how gold is valuable partly because there is a limited amount of it.

You do not need to buy a whole Bitcoin. You can buy a tiny fraction, even just a few dollars worth. This makes it accessible to anyone, regardless of budget.`,
    keyTakeaway: "Bitcoin is digital money that runs on a shared network with no central authority, and you can buy any fraction of one.",
    relatedScenarios: ["should-i-buy-bitcoin", "invest-50-or-wait"],
  },
  {
    id: "what-is-blockchain",
    title: "What is a blockchain?",
    emoji: "🔗",
    duration: "2 min read",
    difficulty: "beginner",
    content: `A blockchain is the technology that makes cryptocurrencies like Bitcoin possible. At its core, it is just a list of records called blocks that are linked together in order. Each block contains a bunch of transactions and a reference to the block before it, creating a chain.

What makes this special is that once a block is added to the chain, it cannot be changed or deleted. This is because every block contains a unique fingerprint (called a hash) that depends on the block before it. If someone tried to change an old block, all the fingerprints after it would break, and everyone on the network would notice.

Imagine a classroom where every student has a copy of the attendance sheet. If one student tries to change their record, all the other students would see the mismatch. That is basically how a blockchain works. Thousands of computers all hold the same copy, and they all keep each other honest.

This is why people say blockchain is "trustless." Not because it cannot be trusted, but because you do not need to trust any single person or company. The system itself ensures honesty.`,
    keyTakeaway: "A blockchain is a shared, unchangeable record of transactions that thousands of computers verify together.",
    relatedScenarios: ["is-ethereum-long-term"],
  },
  {
    id: "what-is-volatile",
    title: "What does 'volatile' mean?",
    emoji: "📈",
    duration: "2 min read",
    difficulty: "beginner",
    content: `When people say crypto is volatile, they mean its price can change a lot in a short time. A stock might go up or down 1-2% in a normal day. Bitcoin might move 5-10% in the same period. That is volatility.

This is not necessarily good or bad. It is just a characteristic of young, developing markets. Crypto markets are still relatively small compared to traditional financial markets, so it takes less money to move prices significantly.

Volatility can feel scary when prices drop, but it also means prices can rise quickly too. Many beginners make the mistake of checking prices constantly, which amplifies the emotional impact of normal market movements.

One helpful perspective: zoom out. A 10% drop in one day might look terrifying. But if you zoom out to a year, that same drop might be barely visible on the chart. Long-term investors often learn to treat volatility as background noise rather than a signal to act.

The most important thing to understand about volatility is that it is expected. If you invest in crypto, expect big swings. If that makes you uncomfortable, start with a very small amount so the dollar impact feels manageable.`,
    keyTakeaway: "Volatility means big price swings are normal in crypto. Expect them and avoid making emotional decisions.",
    relatedScenarios: ["market-dropped-15-percent", "everyone-talking-crypto"],
  },
  {
    id: "what-is-wallet",
    title: "What is a wallet?",
    emoji: "👛",
    duration: "2 min read",
    difficulty: "beginner",
    content: `A crypto wallet is not like a physical wallet. It does not actually hold your coins. Your coins live on the blockchain. Instead, a wallet holds your keys, which are like passwords that prove the coins belong to you.

There are two types of keys: a public key (like your email address, safe to share so people can send you crypto) and a private key (like your password, so never share this with anyone).

Wallets come in different forms. An app on your phone, a program on your computer, or even a physical USB-like device. The easiest way for beginners to start is through an exchange like Coinbase, which manages your wallet for you. This is called a custodial wallet because the exchange holds your keys.

More advanced users prefer non-custodial wallets where they control their own keys. This gives more control but also more responsibility. If you lose your private key, you lose access to your crypto permanently. There is no "forgot password" button.

For now, the most important thing is to understand that a wallet is just a way to access and manage your crypto. You do not need to set one up to start learning. That comes later when you are ready.`,
    keyTakeaway: "A wallet holds the keys that prove crypto is yours, and beginners can start with exchange-managed wallets.",
    relatedScenarios: ["invest-50-or-wait", "have-200-where-to-start"],
  },
  {
    id: "buying-crypto-explained",
    title: "What does 'buying crypto' actually mean?",
    emoji: "🛒",
    duration: "2 min read",
    difficulty: "beginner",
    content: `When you "buy Bitcoin," you are not getting a physical coin or even a digital file. You are getting an entry on the blockchain that says you own a certain amount of Bitcoin. Think of it like owning shares of a company. You do not hold the company, you hold a record of ownership.

The process is simpler than most people expect. You create an account on a crypto exchange (like Coinbase, Kraken, or Cash App), add money from your bank account, and then use that money to buy crypto. The whole process can take less than 10 minutes.

You do not need to buy a whole coin. Bitcoin might cost tens of thousands of dollars, but you can buy $10 worth. You will own a tiny fraction, for example 0.00015 Bitcoin. This is completely normal and how most people start.

When you buy, the exchange matches you with someone who is selling at that price. The exchange takes a small fee for facilitating this, usually between 0.5% and 2% of your purchase.

After buying, your crypto sits in your exchange account until you decide to sell it, move it to another wallet, or just hold it. There is no obligation to do anything with it.`,
    keyTakeaway: "Buying crypto means getting a record of ownership on the blockchain, and you can start with just a few dollars.",
    relatedScenarios: ["invest-50-or-wait", "have-200-where-to-start"],
  },
  {
    id: "what-is-ethereum",
    title: "What is Ethereum and how is it different?",
    emoji: "💎",
    duration: "3 min read",
    difficulty: "beginner",
    content: `Ethereum is the second-largest cryptocurrency after Bitcoin, but it is more than just digital money. While Bitcoin was designed primarily as a currency, Ethereum was built as a platform for running programs on the blockchain.

These programs are called smart contracts. Think of them as automatic agreements that execute themselves when certain conditions are met. For example, a smart contract could automatically send payment when a delivery is confirmed, without needing a bank or lawyer to oversee the process.

This makes Ethereum more like a global computer than a currency. Thousands of applications run on Ethereum, from decentralized finance tools to digital art marketplaces. The cryptocurrency itself (called Ether or ETH) is used to pay for running these applications on the network.

One key difference from Bitcoin: there is no fixed supply limit for Ethereum, though recent updates have actually made it slightly deflationary at times (more ETH is burned than created). Ethereum also switched from an energy-intensive process to a more efficient one in 2022, reducing its energy consumption by over 99%.

For beginners, the main thing to know is that Ethereum and Bitcoin serve different purposes. Bitcoin is often seen as digital gold, a store of value. Ethereum is more like a technology platform that happens to have its own currency.`,
    keyTakeaway: "Ethereum is a programmable blockchain platform, not just a currency. It powers thousands of applications.",
    relatedScenarios: ["is-ethereum-long-term", "what-is-dca"],
  },
  {
    id: "what-are-fees",
    title: "What are fees and why do they exist?",
    emoji: "💸",
    duration: "2 min read",
    difficulty: "beginner",
    content: `Every crypto transaction involves fees, and understanding them helps you avoid surprises. There are two main types of fees you will encounter.

Exchange fees are charged by platforms like Coinbase when you buy or sell crypto. These typically range from 0.5% to 2% of your transaction. So if you buy $100 of Bitcoin, you might pay $1 to $2 in fees. Some exchanges have lower fees if you use their advanced trading features.

Network fees (also called gas fees) are paid to the people who run the blockchain network. These fees compensate the computers that verify and record your transaction. Bitcoin fees are usually a few dollars per transaction regardless of size. Ethereum fees can vary wildly, from a few cents during quiet periods to $50 or more during busy times.

For beginners making small purchases through an exchange, you mainly need to worry about exchange fees. Network fees become more relevant when you start moving crypto between wallets or using decentralized applications.

A practical tip: if you are buying small amounts, percentage-based fees can eat into your investment significantly. Buying $10 of Bitcoin with a $2 fee means you are already down 20%. Many experienced users recommend making fewer, larger purchases to minimize the impact of fees.`,
    keyTakeaway: "Exchange fees (0.5-2%) and network fees exist for every transaction, so buying larger amounts less often reduces their impact.",
    relatedScenarios: ["invest-50-or-wait", "have-200-where-to-start"],
  },
  {
    id: "what-is-dca",
    title: "What is DCA (Dollar Cost Averaging)?",
    emoji: "📅",
    duration: "2 min read",
    difficulty: "intermediate",
    content: `Dollar Cost Averaging, or DCA, is one of the simplest investment strategies. Instead of trying to time the market by buying at the "perfect" moment, you invest a fixed amount on a regular schedule, say $25 every week or $100 every month.

The beauty of DCA is that it removes emotion from the equation. When prices are high, your fixed amount buys less crypto. When prices are low, it buys more. Over time, this averages out your purchase price, which is why it is called dollar cost averaging.

Here is a simple example: if you invest $100 per month and Bitcoin is at $60,000 one month and $40,000 the next, your average price is $48,000, not $50,000, because you bought more when it was cheaper.

DCA will not always beat buying all at once. In a steadily rising market, investing everything immediately would have been better. But DCA protects you from the worst-case scenario of investing everything right before a crash. For most people, especially beginners, the peace of mind is worth any potential missed gains.

Many exchanges let you set up automatic recurring purchases, making DCA completely hands-free. You set it and forget it.`,
    keyTakeaway: "DCA means investing a fixed amount on a regular schedule. It removes the stress of trying to time the market.",
    relatedScenarios: ["what-is-dca", "invest-50-or-wait"],
  },
  {
    id: "what-is-hodl",
    title: "What does 'HODL' mean?",
    emoji: "💪",
    duration: "2 min read",
    difficulty: "beginner",
    content: `HODL started as a typo. In 2013, a Bitcoin forum user posted a rant titled "I AM HODLING" during a price crash, meaning to write "holding." The misspelling became a meme and eventually a philosophy.

HODL now stands for "Hold On for Dear Life" and represents the strategy of buying crypto and holding it long-term, regardless of short-term price movements. Instead of trying to buy low and sell high (which is extremely difficult even for professionals), HODLers simply hold through the ups and downs.

The logic behind HODLing is that crypto markets are unpredictable in the short term but have historically trended upward over longer periods. Someone who bought Bitcoin in 2015 and held through multiple 50%+ crashes would still be significantly up today.

However, HODLing is not always the right approach. It works for assets you have researched and believe in long-term. It does not mean you should hold onto something that has fundamentally changed or that you bought without understanding.

The biggest challenge of HODLing is psychological. Watching your investment drop 30% and doing nothing goes against every instinct. But research consistently shows that emotional trading (panic selling during dips and FOMO buying during spikes) is one of the most reliable ways to lose money.`,
    keyTakeaway: "HODL means holding through market swings instead of panic trading. Emotional reactions often lead to worse outcomes.",
    relatedScenarios: ["market-dropped-15-percent", "everyone-talking-crypto"],
  },
  {
    id: "how-people-lose-money",
    title: "How do people lose money in crypto?",
    emoji: "⚠️",
    duration: "3 min read",
    difficulty: "beginner",
    content: `Understanding how people lose money is just as important as understanding how they make it. Here are the most common ways.

Panic selling is the number one way beginners lose money. They buy during excitement, watch the price drop 20-30%, and sell in fear. They lock in their losses instead of waiting for a potential recovery. The fix: only invest what you can afford to hold through rough patches.

FOMO buying means jumping in because everyone else is excited. By the time something is all over social media, the price is often already high. Many people who buy during hype peaks end up holding at a loss for a long time. The fix: stick to a plan and ignore the noise.

Scams and fraud are unfortunately common in crypto. Fake projects, phishing emails, and people promising guaranteed returns are all red flags. If someone says you can double your money with no risk, they are lying. The fix: never share your private keys, and be skeptical of anything that sounds too good to be true.

Investing more than you can afford is a recipe for disaster. When rent money is on the line, you are more likely to make emotional decisions. The fix: start small, use money you genuinely will not miss.

Ignoring fees can quietly eat your returns, especially on small transactions. The fix: understand the fee structure before you trade.

Not doing research means buying coins you do not understand because someone recommended them. The fix: if you cannot explain what a cryptocurrency does in one sentence, you probably should not buy it yet.`,
    keyTakeaway: "Most crypto losses come from emotional decisions, scams, and investing more than you can afford, not from the technology itself.",
    relatedScenarios: ["market-dropped-15-percent", "everyone-talking-crypto", "should-i-buy-bitcoin"],
  },
  {
    id: "what-is-solana",
    title: "What makes Solana different?",
    emoji: "⚡",
    duration: "2 min read",
    difficulty: "intermediate",
    content: `Solana is a blockchain that prioritizes speed and low cost. While Ethereum might handle around 15-30 transactions per second, Solana can handle thousands. And while an Ethereum transaction might cost several dollars in fees, a Solana transaction typically costs less than a penny.

This speed comes from a different technical approach. Solana uses a unique system called Proof of History that lets the network agree on the order of transactions much faster than other blockchains. Think of it like timestamps that let everyone agree on what happened when, without having long discussions about it.

The tradeoff is centralization. Solana requires powerful, expensive computers to run its network, which means fewer people can participate in maintaining it. Some critics argue this makes it less resilient and more vulnerable to outages, and indeed Solana has experienced several network shutdowns where the entire blockchain stopped working for hours.

Despite these challenges, Solana has attracted a large community of developers building fast, user-friendly applications. Games, payment systems, and social platforms have found a home on Solana because of its speed and low costs.

For beginners, Solana represents a different philosophy than Bitcoin or Ethereum, prioritizing speed over decentralization. Whether that tradeoff is worth it depends on what you value most.`,
    keyTakeaway: "Solana offers fast, cheap transactions but trades off some decentralization. It is a different approach than Bitcoin or Ethereum.",
    relatedScenarios: ["is-solana-worth-it"],
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
