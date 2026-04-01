# ONRAMP — The First Safe Place to Think Before Entering Crypto

## Master Build Prompt for Claude Code

> **Agent**: Claude Code (Max Plan)
> **Approach**: 6 sequential phases — each must compile and run before moving to the next
> **Runtime**: `bun` (preferred) or `npm`
> **Validation**: After each phase, run `bun run build` and `bun run dev` to confirm zero errors

---

## AGENT ROLE

You are a **Staff-level Full-Stack Engineer and Blockchain/Crypto Domain Expert** with 12+ years of production experience. You operate at the intersection of Web3 knowledge, modern frontend engineering, and AI-augmented product development.

### Your technical identity

- **Blockchain & Crypto expertise**: Deep understanding of Bitcoin, Ethereum, Solana, DeFi protocols, wallet architecture, consensus mechanisms, tokenomics, and the entire Web3 ecosystem. You understand the space well enough to simplify it for absolute beginners without losing accuracy. You know the difference between what's hype and what's fundamental.

- **Senior Frontend Engineer**: You are an expert in Next.js 15+ (App Router), React 19, TypeScript (strict mode), Tailwind CSS 4, and the modern React ecosystem (Zustand, Framer Motion, shadcn/ui). You write code the way a principal engineer at Vercel or Linear would — precise, minimal, intentional.

- **AI-integrated development**: You leverage AI APIs (Anthropic Claude, OpenAI) as first-class product features, not afterthoughts. You understand prompt engineering, streaming responses, token management, and how to build safe, bounded AI experiences within consumer products.

- **2026 technology awareness**: You stay current with the latest in: React Server Components, Partial Prerendering, Edge Runtime, Bun, Deno, Turbopack, Biome, and modern CSS (container queries, `@layer`, `color-mix()`). You don't use deprecated patterns or legacy approaches.

### Your engineering principles

You write code as if every file will be reviewed by a senior engineer at Stripe. These are non-negotiable:

1. **DRY (Don't Repeat Yourself)** — Extract shared logic into hooks, utilities, and composable components. If you write the same pattern twice, abstract it on the third occurrence. Never copy-paste between components.

2. **Single Responsibility** — Every file, function, component, and hook does ONE thing well. A component renders UI. A hook manages state logic. A utility computes values. They don't cross boundaries.

3. **Clean Code** — Meaningful variable and function names that read like prose. No abbreviations (`usr`, `btn`, `hdlr`). No magic numbers. No dead code. No commented-out blocks. If it's not used, delete it.

4. **Composition over inheritance** — Build small, focused components and compose them. Prefer `children` and render props over deep prop drilling. Use compound component patterns when appropriate.

5. **Type safety** — Leverage TypeScript's type system fully. No `any`. No `as` casts unless absolutely necessary (and documented why). Use discriminated unions, generics, and `satisfies` operator. Export all interfaces from a central `types/` location.

6. **Colocation** — Keep related code together. Styles with components. Tests with modules. Types with their domain. Don't create a `types/` folder with 50 unrelated interfaces.

7. **Explicit over implicit** — No hidden side effects. No mutations. Pure functions wherever possible. State changes are intentional and traceable.

8. **Error boundaries** — Every async operation has error handling. Every API call has a fallback. Every user-facing state has loading, success, error, and empty variants. Never show a blank screen.

9. **Performance by default** — Lazy load routes. Memoize expensive computations. Debounce inputs. Use `React.memo` only when profiling shows it's needed, not preemptively. Optimize images. Minimize bundle size.

10. **Semantic HTML & Accessibility** — Use the right HTML elements (`button` not `div onClick`). ARIA labels on interactive elements. Keyboard navigation. Focus management. Color contrast WCAG AA minimum.

### Your code style

```typescript
// ✅ YOUR style — clean, typed, composable
export function useSimulation(scenario: DecisionScenario) {
  const [amount, setAmount] = useState(scenario.simulationRange.defaultAmount)

  const outcomes = useMemo(() => ({
    bestCase: amount * scenario.outcomes.bestCase.multiplier,
    worstCase: amount * scenario.outcomes.worstCase.multiplier,
  }), [amount, scenario.outcomes])

  return { amount, setAmount, outcomes } as const
}

// ❌ NOT your style — sloppy, untyped, repetitive
export function useSimulation(s: any) {
  const [amt, setAmt] = useState(100)
  const best = amt * s.outcomes.bestCase.multiplier
  const worst = amt * s.outcomes.worstCase.multiplier
  return { amt, setAmt, best, worst }
}
```

### Your decision-making framework

When faced with a technical choice:

1. **Choose boring technology** — Use well-documented, battle-tested solutions. No experimental packages in production code.
2. **Fewer dependencies** — If you can write it in 20 lines, don't install a package. Exception: complex domains (dates, crypto, PDF generation).
3. **Optimize for readability** — Code is read 10x more than it's written. Clever one-liners that save 2 lines but cost 10 seconds of comprehension are not worth it.
4. **Ship incrementally** — Each phase must compile and run. Don't build the whole castle before testing the foundation.
5. **When in doubt, simplify** — If a component is getting complex, break it into smaller pieces. If a function is longer than 40 lines, it probably does too much.

---

## PRODUCT CONTEXT

Onramp is a beginner-friendly learning, simulation, and decision-support Progressive Web App for people who are curious about crypto but haven't taken the first step. It is NOT a trading platform, wallet, exchange, or technical crypto tool.

**Core positioning**: "The first safe place to think before entering crypto."

**Target user**: Someone who has heard about Bitcoin, feels curious but confused, and doesn't know where to start. They are intimidated by existing crypto apps, overwhelmed by jargon, and afraid of making a costly mistake.

**What Onramp does**:

- Helps users understand simple crypto-related scenarios in plain language
- Lets them simulate outcomes safely with fake money
- Reduces fear and confusion through emotional clarity
- Builds confidence through progressive learning
- Includes an AI assistant (Claude API) for conversational guidance
- Gradually prepares users to make their own informed decisions

**What Onramp is NOT**:

- Not a dashboard or analytics tool
- Not a portfolio tracker
- Not a trading simulator that mimics exchange UIs
- Not a learn-and-earn platform
- Not a tool for experienced crypto users

---

## TECH STACK

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4+ |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Local Persistence | Dexie.js (IndexedDB) |
| Icons | lucide-react |
| Utilities | clsx + tailwind-merge |
| Animation | Framer Motion (subtle only) |
| AI Chat | Anthropic Claude API (claude-sonnet-4-20250514) |
| PWA | next-pwa or manual manifest + service worker |
| Package Manager | bun |

**Do NOT use**: Prisma, any database, authentication services, wallet SDKs, web3 libraries, ethers.js, wagmi, or any crypto integration. No backend beyond the Claude API call.

---

## UI / UX DESIGN DIRECTION

### Visual Identity

Onramp must feel like a premium fintech learning app — NOT a crypto app.

**Color palette** (warm, trustworthy, non-crypto):

```
--background:      #FAFAF8    (warm white)
--surface:         #FFFFFF
--surface-elevated: #F5F3EF   (warm cream)
--primary:         #2D5A3D    (deep sage green — trust, growth)
--primary-soft:    #E8F0EB    (light sage)
--accent:          #D4874E    (warm amber — action, warmth)
--accent-soft:     #FDF0E6
--text-primary:    #1A1A18    (near black, warm)
--text-secondary:  #6B6B65    (warm gray)
--text-muted:      #9C9C94
--border:          #E8E6E1
--success:         #3D8B5E
--warning:         #D4874E
--danger:          #C0504D
--info:            #4A7FA5

Dark mode (warm dark, NOT crypto-bro black):
--background:      #141413
--surface:         #1C1C1A
--surface-elevated: #242422
--text-primary:    #EDEDE8
--text-secondary:  #9C9C94
--border:          #2E2E2B
```

**Typography**:

- Font: Inter (body) + DM Sans or Plus Jakarta Sans (headings)
- Base size: 16px minimum
- Headlines: 24–36px, semi-bold to bold
- Body: 16–18px, regular weight
- Line height: 1.5–1.7 for body text
- Letter spacing: slight negative on headlines (-0.01em to -0.02em)

**Design principles**:

1. **Generous whitespace** — more than you think is necessary
2. **Large tap targets** — minimum 44px on mobile
3. **Rounded corners** — 12–16px on cards, 8px on buttons
4. **Soft shadows** — `shadow-sm` to `shadow-md`, never harsh
5. **Subtle depth** — floating cards with layered elevation
6. **Dark-first design** — design dark mode first, adapt to light
7. **No neon, no gradients, no glow effects** — zero crypto-bro aesthetics
8. **Motion with purpose** — Framer Motion for page transitions, card reveals, and feedback states only. No decorative animation.

**Design references** (NOT crypto apps):

- Headspace — calm, trustworthy, human
- Linear — precision, clean hierarchy, dark mode done right
- Duolingo — progressive learning, friendly encouragement
- Revolut — clean fintech, clear data presentation
- Apple Health — clear data storytelling, not data visualization

**Anti-references** (DO NOT look like these):

- Binance, Coinbase Pro, TradingView — too technical
- Any app with candlestick charts, green/red tickers, or order books
- Dark neon crypto dashboards
- Generic admin/dashboard templates

---

## DATA MODEL

### User Profile (Dexie — local)

```typescript
interface UserProfile {
  id: string                // uuid
  name: string
  experienceLevel: 'new' | 'curious' | 'cautious' | 'active'
  riskStyle: 'conservative' | 'moderate' | 'aggressive'
  createdAt: Date
  lastActiveAt: Date
}
```

### User Progress (Dexie — local)

```typescript
interface UserProgress {
  userId: string
  cardsViewed: number
  simulationsRun: number
  explanationsOpened: number
  streakDays: number
  lastStreakDate: string    // ISO date string
  confidenceScore: number  // 0-100
  lessonsCompleted: string[] // lesson IDs
}
```

### Simulation History (Dexie — local)

```typescript
interface SimulationEntry {
  id: string
  userId: string
  scenarioId: string
  amount: number
  decisionType: 'conservative' | 'moderate' | 'aggressive'
  bestCase: number
  worstCase: number
  timestamp: Date
}
```

### Practice Portfolio (Dexie — local)

```typescript
interface PracticePortfolio {
  userId: string
  balance: number          // starting: 10000 (simulated USD)
  holdings: {
    asset: string          // 'BTC' | 'ETH' | 'SOL'
    amount: number
    avgBuyPrice: number
  }[]
  transactions: {
    id: string
    type: 'buy' | 'sell'
    asset: string
    amount: number
    price: number
    timestamp: Date
  }[]
}
```

### Decision Scenario (static mock data)

```typescript
interface DecisionScenario {
  id: string
  title: string                    // human-friendly, no jargon
  subtitle: string                 // one-line context
  description: string              // 2-3 sentences, plain English
  asset: 'BTC' | 'ETH' | 'SOL'
  probability: {
    up: number                     // 0-100
    flat: number
    down: number
  }
  simulationRange: {
    min: number                    // e.g. 10
    max: number                    // e.g. 500
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
  socialProof: {                   // mock data
    usersWhoSimulated: number
    avgDecision: string
    communityNote: string
  }
  tags: string[]
  difficulty: 'beginner' | 'intermediate'
  updatedAt: string                // display only
}
```

---

## COPY / TONE GUIDELINES

**Voice**: A calm, knowledgeable friend who happens to understand crypto. Never condescending, never hype-driven, never pushy.

**Good examples**:

- "This looks a bit uncertain right now"
- "Most beginners start with a small amount to get comfortable"
- "If this had been real, here's what might have happened"
- "There's no rush — take your time to understand this"
- "The market is unpredictable, but understanding it doesn't have to be"

**Bad examples**:

- "High volatility due to macroeconomic factors" ❌
- "HODL and you'll be fine" ❌
- "This is a great buying opportunity" ❌
- "Don't miss out" ❌
- "To the moon" ❌

**Disclaimers** (must appear naturally in UI, not hidden in footers):

- Practice Portfolio: "This is a simulation. No real money is involved."
- Decision Cards: "These scenarios are educational. They are not financial advice or predictions."
- AI Chat: "I'm an AI assistant here to help you learn. I cannot predict the market or give financial advice."

---

## PROJECT STRUCTURE

```
onramp/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── explore/
│   │   └── page.tsx
│   ├── scenario/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── practice/
│   │   └── page.tsx
│   ├── learn/
│   │   └── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   └── PageTransition.tsx
│   ├── cards/
│   │   ├── DecisionCard.tsx
│   │   ├── ProbabilityBar.tsx
│   │   ├── SimulationSlider.tsx
│   │   ├── ExplanationPanel.tsx
│   │   ├── GuidanceBadge.tsx
│   │   └── SocialProof.tsx
│   ├── portfolio/
│   │   ├── PracticePortfolioCard.tsx
│   │   ├── HoldingsList.tsx
│   │   ├── TransactionHistory.tsx
│   │   └── PortfolioSummary.tsx
│   ├── learn/
│   │   ├── LessonCard.tsx
│   │   ├── ProgressRing.tsx
│   │   └── ConceptTooltip.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── onboarding/
│   │   ├── OnboardingFlow.tsx
│   │   ├── OnboardingStep.tsx
│   │   └── ProfileSetup.tsx
│   └── shared/
│       ├── DisclaimerBanner.tsx
│       ├── ConfidenceScore.tsx
│       ├── StreakBadge.tsx
│       └── EmptyState.tsx
├── data/
│   ├── scenarios.ts
│   ├── lessons.ts
│   └── mockPrices.ts
├── store/
│   ├── useUserStore.ts
│   ├── usePortfolioStore.ts
│   ├── useProgressStore.ts
│   └── useChatStore.ts
├── lib/
│   ├── db.ts                  # Dexie database setup
│   ├── claude.ts              # Claude API helper
│   ├── calculations.ts        # simulation math
│   └── utils.ts               # clsx + twMerge
├── hooks/
│   ├── useOnboarding.ts
│   ├── useStreak.ts
│   ├── useConfidence.ts
│   └── useSimulation.ts
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── .env.local                 # ANTHROPIC_API_KEY
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## PHASE 1 — Foundation & Onboarding

**Goal**: Scaffold the project, install all dependencies, set up theming, navigation, layout shell, Dexie database, Zustand stores, and onboarding flow. The app should run, display a home page, and allow a user to complete onboarding and have their profile persisted in IndexedDB.

### Tasks

1. **Initialize project**

```bash
bunx create-next-app@latest onramp --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd onramp
```

2. **Install all dependencies**

```bash
bun add zustand dexie dexie-react-hooks lucide-react clsx tailwind-merge framer-motion
bunx shadcn@latest init
```

Install shadcn/ui components needed:

```bash
bunx shadcn@latest add button card dialog input label slider badge separator sheet tabs progress
```

3. **Configure Tailwind** with the custom color palette from the UI direction above. Implement CSS variables for both light and dark mode. Dark mode should use `class` strategy.

4. **Set up Dexie database** (`lib/db.ts`) with tables for: `profiles`, `progress`, `simulations`, `portfolios`. Define versioned schema.

5. **Set up Zustand stores** with Dexie persistence:
   - `useUserStore` — current user profile, CRUD operations
   - `useProgressStore` — progress tracking, streak logic, confidence score
   - `usePortfolioStore` — practice portfolio state
   - Stores should hydrate from Dexie on app load

6. **Build layout shell**:
   - `AppShell.tsx` — main wrapper with padding, max-width (480px mobile-first), centered
   - `Header.tsx` — app name "Onramp", minimal, with profile avatar/icon
   - `BottomNav.tsx` — 5 tabs: Home, Explore, Practice, Learn, Chat — using lucide-react icons. Active state with primary color fill. Mobile-fixed at bottom.
   - `PageTransition.tsx` — Framer Motion fade/slide for route changes

7. **Build onboarding flow** (shown on first visit, before home):
   - 4 steps, full-screen cards with smooth transitions:
     - Step 1: Welcome — "Welcome to Onramp. A safe place to explore crypto at your own pace." + name input
     - Step 2: Experience — "How familiar are you with crypto?" → 4 options (new / curious / cautious / active) as large tappable cards
     - Step 3: Risk style — "How do you feel about risk?" → 3 options (conservative / moderate / aggressive) with friendly descriptions
     - Step 4: Ready — "You're all set, [name]. Let's start exploring." + CTA button
   - Persist profile to Dexie on completion
   - Skip onboarding if profile exists in Dexie

8. **Build home page** (post-onboarding):
   - Greeting: "Hey [name]" with time-of-day context (Good morning/afternoon/evening)
   - Confidence score ring (visual, not just a number)
   - Streak badge
   - Quick actions: "Explore scenarios", "Practice trading", "Ask a question"
   - Disclaimer footer: "Onramp is for learning only. Nothing here is financial advice."

### Done criteria

- `bun run build` passes with zero errors
- `bun run dev` shows the app
- First visit → onboarding flow → home page
- Profile persists across page refresh
- Light/dark mode toggle works
- Bottom navigation renders and routes work (pages can be empty placeholders)
- Mobile-first responsive layout (max-width 480px centered, full-width on mobile)

---

## PHASE 2 — Decision Cards & Scenarios

**Goal**: Build the Explore page with Decision Cards. Users can browse scenarios, view probability visualizations, run simulations with the slider, read explanations, and see guidance badges. All data is mock but realistic.

### Tasks

1. **Create mock scenario data** (`data/scenarios.ts`) — at least 7 scenarios:

   - "Should I buy Bitcoin right now?"
   - "Is Ethereum a good long-term choice?"
   - "The market dropped 15% — should I panic?"
   - "Should I invest $50 or wait?"
   - "Is Solana worth looking into?"
   - "Everyone is talking about crypto — should I follow?"
   - "I have $200 — where do I start?"

   Each scenario must have complete data matching the `DecisionScenario` interface. Probabilities should feel realistic. Explanations should be written in the calm, human tone defined above.

2. **Build DecisionCard component**:
   - Card with rounded corners (16px), soft shadow, warm surface background
   - Title (large, bold) + subtitle (muted)
   - Asset badge (BTC/ETH/SOL) — subtle, not a price ticker
   - Difficulty badge (beginner/intermediate)
   - Tap to expand or navigate to detail page

3. **Build Explore page** (`app/explore/page.tsx`):
   - Header: "Explore Scenarios"
   - Subtitle: "Real questions, safe answers"
   - Filter chips: All / Bitcoin / Ethereum / Solana / Beginner
   - Vertical list of DecisionCards with staggered fade-in animation (Framer Motion)

4. **Build Scenario Detail page** (`app/scenario/[id]/page.tsx`):
   - Full scenario view with all sub-components below
   - Smooth page transition from explore

5. **Build ProbabilityBar component**:
   - Horizontal stacked bar showing Up (green) / Flat (gray) / Down (red)
   - Soft colors, not harsh — use the palette's success/muted/danger
   - Labels below with percentages
   - NOT a chart — a simple, clear visual bar
   - Label: "What people are seeing" (not "probability" — too technical)

6. **Build SimulationSlider component**:
   - Slider from $10 to $500 (step: $10)
   - Large, draggable thumb with haptic feel (visual feedback)
   - Real-time display above slider: current amount
   - Below slider: two outcome cards side by side
     - Best case: green tint, shows potential gain
     - Worst case: red tint, shows potential loss
   - Header: "If this had been real..."
   - Calculation: `amount * multiplier` from scenario data
   - Animate number changes with Framer Motion

7. **Build ExplanationPanel component**:
   - Collapsed by default
   - Button: "Explain this simply" with ChevronDown icon
   - Expands smoothly (Framer Motion) to show:
     - "Why it might go up" — with TrendingUp icon
     - "Why it might go down" — with TrendingDown icon
     - "What to watch for" — with Eye icon
   - Text must be plain, human, no jargon

8. **Build GuidanceBadge component**:
   - Three horizontal badges: Conservative / Moderate / Aggressive
   - User's risk style is highlighted by default
   - Each shows a one-line recommendation from scenario data
   - Tapping one shows full guidance text below

9. **Build SocialProof component**:
   - Small section at bottom of scenario:
   - "[X] people explored this scenario"
   - "Most chose: [decision type]"
   - Community note in quotes
   - All mock data — clearly not real-time

10. **Track progress**: When a user views a card, runs a simulation, or opens an explanation, update the progress store and persist to Dexie.

### Done criteria

- `bun run build` passes with zero errors
- Explore page shows 7+ scenario cards with filtering
- Tapping a card navigates to detail page
- Probability bar renders correctly
- Simulation slider works with real-time outcome updates
- Explanation panel expands/collapses smoothly
- Guidance badges highlight user's risk style
- Progress updates persist in Dexie
- All components match the warm, premium UI direction — no crypto-bro aesthetics

---

## PHASE 3 — Practice Portfolio

**Goal**: Build the Practice Portfolio page where users can simulate buying and selling crypto with fake money. This is NOT a trading interface — it's a simple, educational experience.

### Tasks

1. **Create mock price data** (`data/mockPrices.ts`):
   - Static current prices for BTC, ETH, SOL
   - Historical price array (30 data points) for simple sparkline
   - Include a `lastUpdated` timestamp (static but displayed)
   - Comment in code: "Phase 5 will replace this with CoinGecko API"

2. **Initialize portfolio**: On first visit to Practice page, create a portfolio with $10,000 simulated balance if none exists.

3. **Build Practice page** (`app/practice/page.tsx`):
   - Header: "Practice Portfolio"
   - Prominent disclaimer: "This is a simulation. No real money is involved."
   - Total balance display (large number, animated on change)
   - Simple line sparkline for portfolio value (last 7 simulated days)
   - Holdings list below
   - "Start Practicing" CTA if portfolio is empty

4. **Build HoldingsList component**:
   - Each holding shows: asset icon/name, amount held, current value, gain/loss percentage
   - Gain/loss shown in green/red with soft background
   - Simple, not a trading dashboard — no candlesticks, no order books
   - Tap holding for detail (optional in this phase)

5. **Build simple Buy/Sell flow**:
   - NOT a trading form. A conversational, step-by-step flow:
     - Step 1: Choose asset (BTC / ETH / SOL) — large tappable cards
     - Step 2: Choose action (Buy / Sell) — two large buttons
     - Step 3: Enter amount (USD) — simple input with preset amounts ($10, $25, $50, $100)
     - Step 4: Confirm — summary card showing what they'll "get" + disclaimer
   - Use a Sheet (bottom drawer) for this flow, not a separate page
   - After confirmation: update portfolio in Dexie, show success state with confetti-free feedback (subtle checkmark animation)

6. **Build TransactionHistory component**:
   - Simple list of past transactions
   - Each shows: Buy/Sell badge, asset, amount, price at time, date
   - Empty state: "No transactions yet. Try buying your first asset!"

7. **Build PortfolioSummary component**:
   - "Your Learning Summary" section at bottom
   - Cards viewed, simulations run, transactions made
   - "What you've learned so far" — dynamic text based on activity:
     - 0 transactions: "You haven't started yet. That's okay — there's no rush."
     - 1-3 transactions: "You're getting comfortable with the basics."
     - 4+ transactions: "You're building confidence. Keep exploring!"

### Done criteria

- `bun run build` passes with zero errors
- Practice page shows simulated balance and holdings
- Buy/Sell flow works end-to-end via bottom sheet
- Transactions persist in Dexie across refresh
- Holdings update correctly after transactions
- Portfolio summary reflects actual user activity
- All UI feels calm and educational, not like a trading terminal
- Disclaimer is always visible on the Practice page

---

## PHASE 4 — Learn Section & AI Chat

**Goal**: Build the Learn page with micro-lessons and the AI Chat feature powered by Claude API. The Learn section provides structured educational content. The Chat provides open-ended conversational guidance.

### Tasks

1. **Create lesson data** (`data/lessons.ts`) — at least 10 micro-lessons:
   - "What is Bitcoin, really?"
   - "What is a blockchain?"
   - "What does 'volatile' mean?"
   - "What is a wallet?"
   - "What does 'buying crypto' actually mean?"
   - "What is Ethereum and how is it different?"
   - "What are fees and why do they exist?"
   - "What is DCA (Dollar Cost Averaging)?"
   - "What does 'HODL' mean?"
   - "How do people lose money in crypto?"

   Each lesson:
   ```typescript
   interface Lesson {
     id: string
     title: string
     emoji: string              // visual identifier
     duration: string           // "2 min read"
     difficulty: 'beginner' | 'intermediate'
     content: string            // markdown-like plain text, 150-300 words
     keyTakeaway: string        // one sentence summary
     relatedScenarios: string[] // scenario IDs
   }
   ```

2. **Build Learn page** (`app/learn/page.tsx`):
   - Header: "Learn at Your Pace"
   - Subtitle: "Short lessons that make crypto make sense"
   - Progress bar showing lessons completed / total
   - Vertical list of LessonCards
   - Completed lessons have a checkmark overlay
   - Suggested next lesson highlighted

3. **Build LessonCard component**:
   - Emoji + title + duration + difficulty badge
   - Completed state with subtle green check
   - Locked state for lessons beyond user's level (optional, can be all unlocked)

4. **Build Lesson detail view**:
   - Clean reading experience — large text, generous line height
   - "Key takeaway" box at the end with a different background
   - "Related scenarios" links at bottom
   - "Mark as complete" button → updates progress, shows encouraging message
   - Track in Dexie

5. **Build ConfidenceScore component**:
   - Visual ring/meter (not just a number)
   - Score calculated from: `(cardsViewed * 2) + (simulationsRun * 3) + (explanationsOpened * 2) + (lessonsCompleted * 5)` capped at 100
   - Labels: 0-20 "Just starting", 21-40 "Getting curious", 41-60 "Building knowledge", 61-80 "Growing confident", 81-100 "Ready to explore"
   - Animate changes with Framer Motion

6. **Build Streak system**:
   - A "day" counts if user performs at least ONE of: view a card, run a simulation, complete a lesson, or send a chat message
   - Compare `lastStreakDate` with today
   - If consecutive day: increment streak
   - If same day: no change
   - If gap > 1 day: reset to 1
   - Display streak on home page with fire icon and count
   - Encourage message: "You're on a [X]-day streak! Keep exploring."

7. **Set up Claude API integration**:

   Create API route `app/api/chat/route.ts`:

   ```typescript
   // POST handler
   // Accepts: { messages: Array<{role, content}>, userProfile: {experienceLevel, riskStyle} }
   // Calls Anthropic API with system prompt tailored to user's level
   // Returns streamed response
   ```

   System prompt for Claude:
   ```
   You are Onramp's learning assistant. You help beginners understand crypto
   concepts in plain, calm language. You NEVER give financial advice, price
   predictions, or tell users what to buy or sell. You explain concepts,
   answer questions, and help users think through decisions on their own.

   User's experience level: {experienceLevel}
   User's risk style: {riskStyle}

   Rules:
   - Use simple, jargon-free language
   - If you must use a technical term, explain it immediately
   - Never say "you should buy/sell"
   - Always remind users this is educational
   - Be warm, patient, and encouraging
   - Keep responses concise (2-4 paragraphs max)
   - If asked about specific price predictions, politely decline and explain why
   ```

8. **Build Chat page** (`app/chat/page.tsx`):
   - Header: "Ask Anything"
   - Subtitle: "I'm here to help you learn, not to give advice"
   - Chat interface with message bubbles
   - User messages on right, AI on left
   - Typing indicator while Claude responds
   - Pre-built starter questions as tappable chips:
     - "What is Bitcoin?"
     - "Is crypto safe?"
     - "How do I start?"
     - "What's the risk?"
   - Persistent disclaimer at top: "I'm an AI learning assistant. I cannot predict markets or give financial advice."

9. **Build ChatInterface, ChatMessage, ChatInput components**:
   - ChatMessage: different styles for user vs assistant
   - ChatInput: text input + send button, disabled while loading
   - Auto-scroll to latest message
   - Store chat history in Zustand (not persisted to Dexie — fresh each session)

### Done criteria

- `bun run build` passes with zero errors
- Learn page shows 10+ lessons with progress tracking
- Completing a lesson updates progress and confidence score
- Confidence score ring animates and shows correct label
- Streak system works correctly across days
- Chat page sends messages to Claude API and receives responses
- Chat has appropriate disclaimers and starter questions
- Claude responses are warm, educational, and never give financial advice
- API key is read from `.env.local` (ANTHROPIC_API_KEY)

---

## PHASE 5 — CoinGecko API Integration

**Goal**: Replace mock price data with real data from CoinGecko's free API. This makes the Practice Portfolio dynamic and the Decision Cards feel alive. The app still works offline with cached/fallback data.

### Tasks

1. **Create CoinGecko API service** (`lib/coingecko.ts`):
   - Use CoinGecko free API (no auth required): `https://api.coingecko.com/api/v3/`
   - Endpoints needed:
     - `/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`
     - `/coins/{id}/market_chart?vs_currency=usd&days=30` (for sparklines)
   - Implement via Next.js API routes to avoid CORS:
     - `app/api/prices/route.ts` — current prices
     - `app/api/prices/history/route.ts` — historical prices
   - Rate limiting: cache responses for 60 seconds minimum (CoinGecko free tier: 10-30 calls/minute)
   - Error handling: if API fails, fall back to last cached data or mock data

2. **Create price caching layer**:
   - Cache prices in Dexie table `priceCache`
   - On fetch: save to cache with timestamp
   - On failure: serve from cache
   - If no cache and no API: use mock data as final fallback

3. **Update Practice Portfolio**:
   - Holdings now show real current prices
   - Portfolio value updates with real prices
   - Sparkline uses real 30-day data
   - Buy/Sell uses current market price
   - Add "Last updated: X minutes ago" label
   - Add subtle loading state while fetching prices

4. **Update Decision Cards**:
   - Add current price display to scenario detail pages
   - Add 24h change percentage badge
   - Note: probabilities and guidance remain mock/editorial — they do NOT come from the API

5. **Add price refresh logic**:
   - Auto-refresh prices every 60 seconds when app is in foreground
   - Manual pull-to-refresh on Practice page
   - Visual indicator when prices are stale (> 5 minutes old)

6. **Offline fallback**:
   - If device is offline, show cached prices with "Offline — showing last known prices" banner
   - All features remain functional with cached data

### Done criteria

- `bun run build` passes with zero errors
- Practice Portfolio shows real BTC/ETH/SOL prices
- Prices refresh automatically and on manual refresh
- Buy/Sell flow uses live prices
- Sparklines show real 30-day data
- App works offline with cached prices
- API errors are handled gracefully with fallback to cache/mock
- No API keys needed for CoinGecko (free tier)
- Rate limiting prevents exceeding free tier limits

---

## PHASE 6 — PWA, Polish & Final QA

**Goal**: Make the app installable as a PWA, polish all UI details, add missing states (empty, error, loading), ensure dark mode is complete, and verify everything works end-to-end.

### Tasks

1. **PWA Setup**:
   - Create `public/manifest.json`:
     ```json
     {
       "name": "Onramp",
       "short_name": "Onramp",
       "description": "The first safe place to think before entering crypto",
       "start_url": "/",
       "display": "standalone",
       "background_color": "#141413",
       "theme_color": "#2D5A3D",
       "icons": [
         { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
         { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
       ]
     }
     ```
   - Create service worker or use `next-pwa` package
   - Cache app shell and static assets for offline use
   - Cache API responses as described in Phase 5
   - Add `<meta>` tags for iOS PWA support

2. **Create app icons**:
   - Generate simple SVG-based icons (192 and 512)
   - Design: the letter "O" in the primary sage green on a warm dark background, modern and clean

3. **Dark mode completion**:
   - Audit every component for dark mode consistency
   - Ensure all text is readable in both modes
   - Shadows adjust for dark mode (lighter, more subtle)
   - Cards should have visible but subtle borders in dark mode

4. **Loading states**:
   - Skeleton loaders for: Decision Cards, Portfolio balance, Price data, Lesson list
   - Use shadcn/ui Skeleton component
   - Loading spinner for: Chat responses, Buy/Sell confirmation

5. **Empty states** (important for feeling like a real product):
   - Explore: "Scenarios are loading..." (skeleton)
   - Practice Portfolio (no holdings): "Your practice portfolio is empty. Start by buying your first crypto — it's just pretend money!"
   - Transaction history (empty): "No transactions yet. When you're ready, try buying a small amount."
   - Chat (no messages): starter question chips + "Ask me anything about crypto. There are no silly questions."
   - Learn (no lessons completed): "Pick your first lesson. Each one takes about 2 minutes."

6. **Error states**:
   - API failure: "We couldn't load the latest prices. Showing last known data."
   - Chat API failure: "I'm having trouble connecting. Try again in a moment."
   - Generic: friendly message + retry button, never a raw error

7. **Micro-interactions and polish**:
   - Button press: subtle scale down (0.97) on click
   - Card hover (desktop): slight elevation increase
   - Tab switch: smooth indicator animation
   - Number changes: count-up animation (prices, balances)
   - Page transitions: fade + slight upward slide (200ms)
   - Success states: soft checkmark animation, not confetti

8. **Accessibility**:
   - All interactive elements have proper `aria-labels`
   - Color contrast meets WCAG AA
   - Focus states visible in keyboard navigation
   - Slider is keyboard-accessible
   - Screen reader friendly structure

9. **Final QA checklist**:
   - [ ] Onboarding flow works perfectly on first visit
   - [ ] Profile persists across refresh
   - [ ] All 7+ scenarios render with complete data
   - [ ] Simulation slider works on mobile (touch) and desktop (mouse)
   - [ ] Explanation panels expand/collapse smoothly
   - [ ] Practice Portfolio buy/sell flow works end-to-end
   - [ ] Real prices load and refresh (with fallback)
   - [ ] Chat sends and receives messages correctly
   - [ ] All 10+ lessons are readable and completable
   - [ ] Confidence score updates correctly
   - [ ] Streak system tracks days properly
   - [ ] Dark mode works on all pages
   - [ ] PWA is installable (check Chrome DevTools > Application)
   - [ ] App works offline (basic functionality)
   - [ ] No TypeScript errors (`bun run build`)
   - [ ] No console errors in browser
   - [ ] Mobile responsive (test at 375px, 390px, 414px widths)
   - [ ] All disclaimers are visible and appropriate
   - [ ] No "crypto-bro" aesthetics anywhere

### Done criteria

- `bun run build` passes with zero errors and zero warnings
- App is installable as PWA on mobile
- All features work offline with graceful degradation
- Dark mode is complete and consistent
- All empty/error/loading states are implemented
- App feels like a real, polished fintech product — not a template or prototype
- The overall experience communicates: "This is a safe place to learn about crypto at your own pace"

---

## RUNNING THE APP

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Development
bun run dev

# Build
bun run build

# Start production
bun run start
```

---

## IMPORTANT NOTES FOR CLAUDE CODE

1. **Execute phases sequentially**. Do NOT start a phase until the previous phase's done criteria are met.

2. **Run `bun run build` after every phase**. Fix all errors before moving on. This is non-negotiable.

3. **Mobile-first always**. Design for 375px first, then scale up. The app is primarily a mobile experience.

4. **No shortcuts on UI quality**. If a component looks like a generic template, redo it. The design direction section is detailed for a reason — follow it closely.

5. **Keep the tone human**. Every string in the app should feel like it was written by a thoughtful person, not generated by AI.

6. **Disclaimers are not optional**. Financial education products need clear disclaimers. Integrate them naturally into the UI — don't hide them in footers.

7. **When in doubt, be calm**. The entire product philosophy is about reducing anxiety. If a UI element feels busy, stressful, or overwhelming — simplify it.

8. **Dark mode is not an afterthought**. Design dark-first. The dark palette is intentionally warm (not pure black) to maintain the calm, trustworthy feeling.

9. **Test Dexie persistence**. After every phase that writes to Dexie, refresh the page and confirm data survives.

10. **The AI chat must NEVER give financial advice**. The system prompt is strict about this. Test with adversarial prompts like "Should I buy Bitcoin right now?" and ensure Claude declines appropriately.
