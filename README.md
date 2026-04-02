# Onramp

**The first safe place to think before entering crypto.**

A beginner-friendly Progressive Web App for learning about cryptocurrency. Onramp helps users understand crypto concepts, simulate trading with fake money, and build confidence — without the pressure of real financial decisions.

## Features

### Decision Scenarios
Explore real questions like "Should I buy Bitcoin?" with probability visualization, simulation sliders, and plain-language explanations. Each scenario includes best/worst case outcomes, expert guidance based on your risk style, and community insights.

### Scenario Replay — Time Travel
Relive 5 real crypto events and make decisions as if you were there:

| Event | Date | What happened |
|-------|------|---------------|
| Terra Luna Collapse | May 2022 | $40B wiped out in 72 hours |
| Bitcoin Halving | April 2024 | Mining reward cut in half |
| FTX Collapse | November 2022 | Second-largest exchange imploded |
| Bitcoin All-Time High | November 2021 | $69K peak, then 77% crash |
| Ethereum Merge | September 2022 | Biggest blockchain upgrade ever |

Each replay is a 3-phase experience: see real price charts and headlines build up, make your decision (buy/sell/hold/wait) at the critical moment, then watch the animated outcome reveal what would have happened to your $100.

### Practice Portfolio
Start with $10,000 of simulated money. Buy and sell BTC, ETH, and SOL at real-time prices from CoinGecko. Track holdings, view 7-day price charts, and review transaction history.

### Micro-Lessons
11 short lessons covering Bitcoin, blockchain, volatility, wallets, fees, DCA, Ethereum, Solana, and more. Each takes about 2 minutes and includes a key takeaway and links to related scenarios.

### AI Chat
Ask anything about crypto. Powered by Claude API with guardrails — it explains concepts in plain language but never gives financial advice or price predictions.

### Confidence Score & Streaks
Your confidence score (0-100) grows as you explore scenarios, run simulations, complete lessons, and finish replays. Daily streaks encourage habit formation.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State | Zustand |
| Local Storage | Dexie.js (IndexedDB) |
| Animations | Framer Motion |
| AI | Anthropic Claude API |
| Prices | CoinGecko API (free tier) |
| Testing | Playwright (59 E2E tests) |
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

## Project Structure

```
app/
  ├── page.tsx              # Home (onboarding or dashboard)
  ├── explore/              # Browse decision scenarios
  ├── scenario/[id]/        # Scenario detail with simulation
  ├── replay/               # Time Travel hub
  ├── replay/[eventId]/     # Replay experience (3 phases)
  ├── practice/             # Portfolio with live prices
  ├── learn/                # Lesson list with progress
  ├── learn/[id]/           # Lesson detail
  ├── chat/                 # AI chat assistant
  ├── profile/              # User stats and activity
  └── api/                  # Chat (Claude), prices (CoinGecko)

components/
  ├── cards/                # DecisionCard, ProbabilityBar, SimulationSlider
  ├── replay/               # ReplayPriceChart, ReplayDecisionPanel, ReplayOutcomeReveal
  ├── portfolio/            # TradeSheet, HoldingsList, PriceChart
  ├── learn/                # LessonCard
  ├── chat/                 # ChatMessage, ChatInput
  ├── home/                 # HomeContent
  ├── onboarding/           # 4-step onboarding flow
  ├── layout/               # AppShell, Header, BottomNav
  └── shared/               # ConfidenceScore, StreakBadge, CoinIcon, InfoTip

store/                      # Zustand stores (user, progress, portfolio, chat, price, replay)
data/                       # Static scenarios, lessons, replay events
e2e/                        # Playwright E2E tests
```

## Design

Warm fintech aesthetic inspired by Headspace and Linear — not a crypto dashboard. Sage green + warm amber palette, dark-first design, generous whitespace, rounded corners, and calm copy that reduces anxiety.

## Architecture

- **Client-side persistence** — All user data (profile, progress, portfolio, transactions, completed replays) stored in IndexedDB via Dexie. No backend database needed.
- **Real-time prices** — CoinGecko API proxied through Next.js API routes with server-side caching (60s prices, 10min history). Falls back to mock data when offline or rate-limited.
- **AI Chat** — Streaming responses via SSE from Claude API with a system prompt that prevents financial advice.
- **Scenario Replay** — Hardcoded historical price data and real headlines for 5 events. Fully offline. Three-phase experience (setup, decision, outcome) with animated SVG price charts.
- **PWA** — Service worker with stale-while-revalidate for static assets and network-first for API routes. Installable on mobile and desktop.

## Testing

```bash
# Run all E2E tests
npx playwright test

# Run specific suite
npx playwright test e2e/replay.spec.ts

# Run with browser visible
npx playwright test --headed

# Run with UI mode
npx playwright test --ui
```

59 Playwright E2E tests covering: onboarding (4), navigation (8), explore/scenarios (8), practice portfolio (11), learn/lessons (8), chat (5), profile (6), and scenario replay (9).
