# Feature: Prediction Markets Lite

## Context

Onramp es una app educativa de crypto para beginners. Los usuarios ya pasaron por onboarding, lecciones, replays, practice portfolio y se registraron con su email. Ahora necesitamos un producto post-login diferenciado. El usuario eligio **Prediction Markets Lite** con alcance **global desde dia 1**.

**Concepto**: Mercados de prediccion simplificados donde usuarios predicen outcomes de crypto (Si/No). Empezamos con puntos (sin dinero real) para evitar regulacion. Cada prediccion tiene contenido educativo. Es "Polymarket meets Duolingo" para beginners.

---

## Fase 1: Foundation (Data + DB + Store)

### 1.1 Tipos y DB -- `lib/db.ts`
Agregar interfaces y bump a version 4:

```typescript
// Nuevas interfaces
export interface UserPrediction {
  id: string                    // `${userId}-${marketId}`
  userId: string
  marketId: string
  position: "yes" | "no"
  amount: number                // puntos apostados (10-100)
  timestamp: Date
  resolved: boolean
  payout: number | null
}

export interface PointsLedgerEntry {
  id: string
  userId: string
  amount: number                // + earned, - spent
  source: "lesson" | "replay" | "scenario" | "simulation" | "prediction_win" | "prediction_loss" | "daily_login" | "initial"
  description: string
  timestamp: Date
}

// Agregar al tipo db:
userPredictions: EntityTable<UserPrediction, "id">
pointsLedger: EntityTable<PointsLedgerEntry, "id">

// db.version(4)
db.version(4).stores({
  profiles: "id, name",
  progress: "userId",
  simulations: "id, userId, scenarioId, timestamp",
  portfolios: "userId",
  priceCache: "id",
  completedReplays: "id, userId, eventId",
  userPredictions: "id, userId, marketId, timestamp",
  pointsLedger: "id, userId, source, timestamp",
})
```

### 1.2 Datos de mercados -- `data/predictionMarkets.ts` (NUEVO)
3-5 mercados curados hardcoded (patron de `data/replayEvents.ts`):

```typescript
export interface PredictionMarket {
  id: string
  question: string
  description: string
  category: "price" | "event" | "community"
  status: "active" | "resolved"
  resolutionDate: string            // ISO date
  resolutionCriteria: string
  resolutionAsset?: string          // "BTC" | "ETH" | "SOL"
  resolutionThreshold?: number
  resolutionDirection?: "above" | "below"
  resolvedOutcome?: "yes" | "no"
  educationalContext: string
  factors: { label: string; description: string; sentiment: "bullish" | "bearish" | "neutral" }[]
  initialYesPercent: number         // odds seed (ej: 62 = 62% yes)
  coverEmoji: string
  difficulty: "beginner" | "intermediate"
  tags: string[]
  relatedLessonIds: string[]
}
```

Ejemplos de mercados:
- "Will Bitcoin be above $100,000 by June 30, 2026?" (price, auto-resolve)
- "Will the SEC approve a Solana ETF by Q4 2026?" (event, manual)
- "Will Ethereum gas fees average below $1 this month?" (price, auto-resolve)
- "Will Bitcoin dominance be above 55% by end of Q2 2026?" (event, manual)
- "Will a new top-10 cryptocurrency emerge by end of 2026?" (event, manual)

### 1.3 Store -- `store/usePredictionStore.ts` (NUEVO)
Patron de `store/useReplayStore.ts`: hydrate de Dexie, persist, acciones.

**State**:
- `userPredictions: UserPrediction[]`
- `pointsBalance: number`
- `pointsLedger: PointsLedgerEntry[]`

**Actions**:
- `hydrate(userId)` -- carga predictions y puntos de Dexie
- `initializePoints(userId)` -- 100 puntos iniciales + credito retroactivo por actividades existentes
- `placePrediction(userId, marketId, position, amount)` -- crea prediccion, debita puntos
- `earnPoints(userId, amount, source, description)` -- credita puntos al ledger
- `resolveMarket(userId, marketId, outcome)` -- resuelve prediccion, calcula payout
- `checkPriceResolutions(userId)` -- compara precios CoinGecko con thresholds

**Derived**:
- `getPredictionForMarket(marketId)` -- prediccion del usuario para un mercado
- `getMarketOdds(marketId)` -- odds ajustadas (initialYesPercent +/- 5% segun prediccion local)
- `getPredictionAccuracy()` -- total, correctas, rate

**Odds / Payout**:
- Odds inician del `initialYesPercent` del mercado + ajuste local de +/-5%
- Payout: `amount * (100 / sidePercent)` -- contrarian picks pagan mas
- Loss = 0 payout (pierde lo apostado)

### 1.4 Hydration -- `hooks/useHydration.ts` (MODIFICAR)
Agregar al `Promise.all`:
```typescript
usePredictionStore.getState().hydrate(profile.id),
```

---

## Fase 2: Hub Page (`/predictions`)

### Archivos nuevos:
- `app/predictions/page.tsx` -- server component, importa markets, renderiza hub
- `app/predictions/layout.tsx` -- metadata
- `components/predictions/PredictionHubContent.tsx` -- client, filtros + lista
- `components/predictions/PredictionMarketCard.tsx` -- card por mercado (patron de `ReplayEventCard`)
- `components/predictions/PredictionOddsBar.tsx` -- barra horizontal YES/NO visual
- `components/predictions/PointsBalance.tsx` -- badge reutilizable de puntos

### UX del hub:
- Header con titulo + PointsBalance
- Filter tabs: "Active" | "Resolved" | "All"
- Lista de PredictionMarketCard con staggered framer-motion
- Cada card: emoji, pregunta, PredictionOddsBar, tiempo restante, badge de categoria
- Si el usuario ya predijo: badge "You: YES/NO"
- Si resuelto: badge de resultado

---

## Fase 3: Detail Page (`/predictions/[marketId]`)

### Archivos nuevos:
- `app/predictions/[marketId]/page.tsx` -- client component (patron de `replay/[eventId]`)
- `components/predictions/PredictionDetailContent.tsx` -- contenido completo
- `components/predictions/PredictionPlaceForm.tsx` -- YES/NO toggle + slider puntos (10-100) + confirmar
- `components/predictions/PredictionEducational.tsx` -- contexto educativo + factores con sentiment dots
- `components/predictions/PredictionOddsHistory.tsx` -- sparkline de odds (referencia: `ReplayPriceChart`)

### UX del detail:
1. Back button (patron ArrowLeft existente)
2. Header: pregunta, descripcion, tiempo restante, status
3. PredictionOddsBar (version grande)
4. PredictionEducational -- contexto + factores expandibles
5. PredictionPlaceForm -- si activo y sin prediccion
6. Si ya predijo: muestra posicion + estado de espera
7. Si resuelto: PredictionResolutionBanner

---

## Fase 4: Resolution + Payouts

### Archivos nuevos:
- `components/predictions/PredictionResolutionBanner.tsx` -- resultado + payout + wrap-up educativo

### Logica:
- **Price markets**: `checkPriceResolutions()` compara `usePriceStore.getPrice(asset)` con threshold cuando `resolutionDate <= now`
- **Event markets**: `resolvedOutcome` se hardcodea en `predictionMarkets.ts` cuando el equipo lo actualiza
- **Triggers**: en hydrate, en fetch de precios, al navegar a `/predictions`
- **Idempotente**: solo resuelve predictions con `resolved: false`

---

## Fase 5: Integration con features existentes

### Archivos a modificar:

| Archivo | Cambio |
|---------|--------|
| `components/home/HomeContent.tsx` | Agregar quick action: `{ href: "/predictions", icon: TrendingUp, title: "Predict outcomes", description: "Test your crypto knowledge with predictions" }` |
| `app/profile/page.tsx` | Agregar stats de predicciones (accuracy, total, puntos) + `PredictionHistoryList` |
| `store/useProgressStore.ts` | Agregar puntos en `completeLesson` (+15pts), `incrementReplaysCompleted` (+20pts), `incrementSimulationsRun` (+10pts) |
| `app/api/chat/route.ts` | Extender system prompt: "Users can see prediction markets. Discuss factors educationally but never tell them which way to predict." |

### Points Economy:

| Actividad | Puntos |
|-----------|--------|
| Signup bonus | 100 |
| Completar leccion | 15 |
| Completar replay | 20 |
| Ver scenario | 5 |
| Correr simulacion | 10 |
| Login diario (streak) | 10 |
| Ganar prediccion | payout proporcional |

- Min apuesta: 10 pts, Max: 100 pts
- 1 prediccion por mercado por usuario
- Bootstrap: usuarios existentes reciben credito retroactivo por actividades completadas

### Confidence Score update:
Agregar a `calculateConfidence` en `useProgressStore.ts`:
```
+ (predictionsCorrect * 3)  // max ~15 pts de predicciones
```

---

## Fase 6: Polish

- Animaciones Framer Motion: staggered cards, odds bar transitions, confetti en win
- Empty states, loading skeletons, error handling
- Dark mode verification
- PWA offline: mercados legibles offline, predicciones en queue

---

## Archivos criticos (referencia de patrones existentes)

| Archivo | Para que |
|---------|----------|
| `lib/db.ts` | Modificar: agregar tablas v4 |
| `data/replayEvents.ts` | Patron para `data/predictionMarkets.ts` |
| `store/useReplayStore.ts` | Patron para `store/usePredictionStore.ts` |
| `hooks/useHydration.ts` | Modificar: agregar hydrate predictions |
| `components/home/HomeContent.tsx` | Modificar: agregar quick action |
| `app/replay/page.tsx` + `components/replay/` | Patron para hub + detail pages |
| `components/replay/ReplayPriceChart.tsx` | Referencia para odds history chart |
| `store/useProgressStore.ts` | Modificar: integrar puntos + confidence |

---

## Verificacion

1. `bun run build` pasa sin errores despues de cada fase
2. Dexie migration de v3 a v4 no rompe datos existentes
3. Flujo completo: ver mercados -> elegir uno -> leer educativo -> predecir -> ver puntos debitados -> (simular resolucion) -> ver payout
4. Puntos se acreditan al completar lecciones/replays existentes
5. Hub filtra correctamente por Active/Resolved
6. Profile muestra stats de predicciones
7. Responsive + dark mode correcto
8. Offline: mercados visibles, predicciones guardadas localmente
