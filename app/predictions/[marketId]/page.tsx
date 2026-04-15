"use client"

import { use, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Check, Lock, HelpCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"
import { PredictionOddsBar } from "@/components/predictions/PredictionOddsBar"
import { PredictionEducational } from "@/components/predictions/PredictionEducational"
import { PredictionPlaceForm } from "@/components/predictions/PredictionPlaceForm"
import { PredictionResolutionBanner } from "@/components/predictions/PredictionResolutionBanner"
import { getMarketById } from "@/data/predictionMarkets"
import { usePredictionStore } from "@/store/usePredictionStore"
import { usePriceStore } from "@/store/usePriceStore"
import { useUserStore } from "@/store/useUserStore"
import { usePredictionHoldings } from "@/hooks/usePredictionHoldings"
import { PredictionFormWalkthrough } from "@/components/predictions/PredictionFormWalkthrough"
import { PredictionTradeSheet } from "@/components/predictions/PredictionTradeSheet"
import { useShouldShowFormWalkthrough, WALKTHROUGH_FORM_KEY } from "@/components/predictions/PredictionWalkthrough"
import { getTimeRemaining } from "@/lib/utils"

export default function PredictionDetailPage({
  params,
}: {
  params: Promise<{ marketId: string }>
}) {
  const { marketId } = use(params)
  const router = useRouter()
  const market = getMarketById(marketId)
  const profile = useUserStore((s) => s.profile)

  const { isGraduated, holdings: predictionHoldings } = usePredictionHoldings()
  const getPrice = usePriceStore((s) => s.getPrice)
  const getPredictionForMarket = usePredictionStore((s) => s.getPredictionForMarket)
  const getMarketOdds = usePredictionStore((s) => s.getMarketOdds)
  const placePrediction = usePredictionStore((s) => s.placePrediction)

  const userPrediction = getPredictionForMarket(marketId)
  const odds = getMarketOdds(marketId)
  const [justPlaced, setJustPlaced] = useState(false)
  const [tradeOpen, setTradeOpen] = useState(false)
  const [formWalkthroughDone, setFormWalkthroughDone] = useState(false)
  const [forceFormWalkthrough, setForceFormWalkthrough] = useState(false)
  const autoShowFormWalkthrough = useShouldShowFormWalkthrough()
  const showFormWalkthrough = autoShowFormWalkthrough || forceFormWalkthrough

  const handlePlace = useCallback(
    async (position: "yes" | "no", asset: "BTC" | "ETH" | "SOL", amount: number, reasoning?: string): Promise<boolean> => {
      if (!profile) return false
      const success = await placePrediction(profile.id, marketId, position, asset, amount, reasoning)
      if (success) setJustPlaced(true)
      return success
    },
    [profile, marketId, placePrediction]
  )

  if (!market) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">Market not found</p>
          <button
            onClick={() => router.push("/predictions")}
            className="mt-4 text-sm font-medium text-primary"
          >
            Back to Predictions
          </button>
        </div>
      </PageTransition>
    )
  }

  const isResolved = market.status === "resolved" || userPrediction?.resolved
  const isActive = market.status === "active" && !userPrediction
  const hasEnded = new Date(market.resolutionDate) <= new Date()

  return (
    <PageTransition>
      <div className="py-4">
        <button
          onClick={() =>
            window.history.length > 1 ? router.back() : router.push("/predictions")
          }
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-start justify-between">
            <span className="text-4xl">{market.coverEmoji}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  try { localStorage.removeItem(WALKTHROUGH_FORM_KEY) } catch {}
                  setFormWalkthroughDone(false)
                  setForceFormWalkthrough(true)
                }}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="How predictions work"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <Badge variant="secondary" className="rounded-lg px-3 py-1 text-sm font-medium">
                About: {market.asset}
              </Badge>
            </div>
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold tracking-tight leading-tight">
            {market.question}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {market.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px]">
              {market.category === "price" ? "Price" : market.category === "event" ? "Event" : "Community"}
            </Badge>
            <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px]">
              {market.difficulty === "beginner" ? "Beginner" : "Intermediate"}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {getTimeRemaining(market.resolutionDate)}
            </span>
          </div>
        </motion.div>

        {/* Odds */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5"
        >
          <PredictionOddsBar
            yesPercent={odds.yesPercent}
            noPercent={odds.noPercent}
            userPosition={userPrediction?.position}
            size="lg"
          />
        </motion.div>

        {/* Resolution banner */}
        {isResolved && userPrediction?.resolved && market.resolvedOutcome && (
          <div className="mt-5">
            <PredictionResolutionBanner
              prediction={userPrediction}
              resolvedOutcome={market.resolvedOutcome}
              currentPrice={getPrice(market.asset)}
            />
          </div>
        )}

        {/* User's active prediction */}
        {userPrediction && !userPrediction.resolved && (
          <motion.div
            initial={{ opacity: 0, scale: justPlaced ? 0.95 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mt-5 space-y-4"
          >
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-3">
                {justPlaced && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary">
                    {justPlaced ? "Prediction placed!" : "Your prediction"}
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    {userPrediction.position.toUpperCase()}
                  </p>
                  <p className="text-sm font-medium">
                    {(userPrediction.cryptoAmount ?? 0).toFixed(userPrediction.asset === "BTC" ? 6 : 4)} {userPrediction.asset ?? ""}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (~${Math.round((userPrediction.cryptoAmount ?? 0) * (getPrice(userPrediction.asset ?? "BTC") || userPrediction.priceAtPrediction || 0))})
                    </span>
                  </p>
                </div>
              </div>
              {justPlaced && (
                <div className="mt-4 rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">What happens next?</span>{" "}
                  Your {userPrediction.asset} is now at stake. This market resolves on{" "}
                  <span className="font-semibold text-foreground">
                    {new Date(market.resolutionDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  . If you&apos;re right, you get your crypto back plus a bonus. If not, you lose what you staked. That&apos;s how real investors think probabilistically.
                </div>
              )}
              {userPrediction.reasoning && (
                <div className="mt-4 rounded-xl bg-muted/40 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Your reasoning</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    &ldquo;{userPrediction.reasoning}&rdquo;
                  </p>
                </div>
              )}
              {hasEnded && (
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  ⏳ Market ended — awaiting official resolution
                </p>
              )}
            </div>

            {justPlaced && (
              <div className="flex gap-3">
                <Link
                  href="/predictions"
                  className="flex-1 rounded-xl border border-border bg-card py-3 text-center text-sm font-medium transition-colors hover:border-primary/30"
                >
                  More predictions
                </Link>
                <button
                  onClick={() => setTradeOpen(true)}
                  className="flex-1 rounded-xl border border-border bg-card py-3 text-center text-sm font-medium transition-colors hover:border-primary/30"
                >
                  Buy more crypto
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Market ended without a prediction — awaiting resolution */}
        {hasEnded && !userPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Market closed</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                This market ended before you placed a prediction. The outcome will be resolved soon — check back to see what happened.
              </p>
            </div>
          </motion.div>
        )}

        {/* Place prediction form */}
        {isActive && !hasEnded && (
          <div className="mt-5" id="pred-form-section">
            <PredictionPlaceForm
              holdings={predictionHoldings}
              onPlace={handlePlace}
              onBuy={isGraduated ? undefined : () => setTradeOpen(true)}
              walletLink={isGraduated ? "/wallet" : undefined}
            />
          </div>
        )}

        {/* Form walkthrough — only when form is actually rendered */}
        {isActive && !hasEnded && !formWalkthroughDone && showFormWalkthrough && (
          <PredictionFormWalkthrough onComplete={() => { setFormWalkthroughDone(true); setForceFormWalkthrough(false); window.scrollTo(0, 0) }} />
        )}

        {/* Educational content */}
        <div className="mt-5">
          <PredictionEducational
            context={market.educationalContext}
            factors={market.factors}
          />
        </div>

        {/* Resolution criteria */}
        <div className="mt-5 rounded-2xl bg-muted/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            How this resolves
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {market.resolutionCriteria}
          </p>
        </div>
      </div>

      <PredictionTradeSheet open={tradeOpen} onOpenChange={setTradeOpen} />
    </PageTransition>
  )
}
