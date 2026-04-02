# Onramp

**The first safe place to think before entering crypto.**

A beginner-friendly Progressive Web App for learning about cryptocurrency. Onramp helps users understand crypto concepts, simulate trading with fake money, and build confidence — without the pressure of real financial decisions.

## Features

- **Decision Scenarios** — Explore real questions like "Should I buy Bitcoin?" with probability visualization, simulation sliders, and plain-language explanations
- **Scenario Replay (Time Travel)** — Relive 5 real crypto events (Terra Luna crash, Bitcoin halving 2024, FTX collapse, Bitcoin ATH 2021, Ethereum Merge). Make decisions at the critical moment and see what would have happened to your money
- **Practice Portfolio** — Buy and sell BTC, ETH, and SOL with $10,000 of simulated money. Real-time prices from CoinGecko
- **Micro-Lessons** — 11 short lessons covering Bitcoin, blockchain, wallets, fees, DCA, and more
- **AI Chat** — Ask anything about crypto. Powered by Claude API with guardrails to never give financial advice
- **Confidence Score & Streaks** — Track your learning progress and build daily habits
- **E2E Testing** — 59 Playwright tests covering all user flows end-to-end
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

- **Client-side persistence** — All user data (profile, progress, portfolio, transactions, completed replays) stored in IndexedDB via Dexie. No backend database needed.
- **Real-time prices** — CoinGecko API proxied through Next.js API routes with server-side caching (60s prices, 10min history). Falls back to mock data when offline or rate-limited.
- **AI Chat** — Streaming responses via SSE from Claude API with a system prompt that prevents financial advice.
- **Scenario Replay** — Hardcoded historical price data and real headlines for 5 events. Fully offline. Three-phase experience (setup, decision, outcome) with animated charts.
- **PWA** — Service worker with stale-while-revalidate for static assets and network-first for API routes.

## Testing

```bash
# Run all E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

59 Playwright E2E tests covering: onboarding, navigation, explore/scenarios, practice portfolio, learn/lessons, chat, profile, and scenario replay.
