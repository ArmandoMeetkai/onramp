# Onramp

**The first safe place to think before entering crypto.**

A beginner-friendly Progressive Web App for learning about cryptocurrency. Onramp helps users understand crypto concepts, simulate trading with fake money, and build confidence — without the pressure of real financial decisions.

## Features

- **Decision Scenarios** — Explore real questions like "Should I buy Bitcoin?" with probability visualization, simulation sliders, and plain-language explanations
- **Practice Portfolio** — Buy and sell BTC, ETH, and SOL with $10,000 of simulated money. Real-time prices from CoinGecko
- **Micro-Lessons** — 11 short lessons covering Bitcoin, blockchain, wallets, fees, DCA, and more
- **AI Chat** — Ask anything about crypto. Powered by Claude API with guardrails to never give financial advice
- **Confidence Score & Streaks** — Track your learning progress and build daily habits
- **PWA** — Installable on mobile, works offline with cached data

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State | Zustand |
| Local Storage | Dexie.js (IndexedDB) |
| AI | Anthropic Claude API |
| Prices | CoinGecko API (free tier) |
| Package Manager | Bun |

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Development
bun run dev

# Production
bun run build
bun run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design

Warm fintech aesthetic inspired by Headspace and Linear — not a crypto dashboard. Sage green + warm amber palette, dark-first design, generous whitespace, rounded corners, and calm copy that reduces anxiety.

## Architecture

- **Client-side persistence** — All user data (profile, progress, portfolio, transactions) stored in IndexedDB via Dexie. No backend database needed.
- **Real-time prices** — CoinGecko API proxied through Next.js API routes with server-side caching (60s prices, 10min history). Falls back to mock data when offline or rate-limited.
- **AI Chat** — Streaming responses via SSE from Claude API with a system prompt that prevents financial advice.
- **PWA** — Service worker with stale-while-revalidate for static assets and network-first for API routes.
