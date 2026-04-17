"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/layout/PageTransition"
import { WalletGraduationGate } from "@/components/wallet/WalletGraduationGate"
import { WalletDashboard } from "@/components/wallet/WalletDashboard"
import { WalletSetupSheet } from "@/components/wallet/WalletSetupSheet"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"
import { useUserStore } from "@/store/useUserStore"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import type { TestnetChain } from "@/lib/db"

const VALID_CHAINS: TestnetChain[] = ["ethereum", "solana", "bitcoin"]

export default function WalletPage() {
  return (
    <Suspense>
      <WalletContent />
    </Suspense>
  )
}

function WalletContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profile = useUserStore((s) => s.profile)
  const { isEligible, hasWallet, milestones } = useTestnetGraduation()
  const setActiveChain = useTestnetWalletStore((s) => s.setActiveChain)
  const resetWallet = useTestnetWalletStore((s) => s.resetWallet)
  const [setupOpen, setSetupOpen] = useState(false)

  // Set active chain from URL parameter
  useEffect(() => {
    const chain = searchParams.get("chain") as TestnetChain | null
    if (chain && VALID_CHAINS.includes(chain)) {
      setActiveChain(chain)
    }
  }, [searchParams, setActiveChain])

  return (
    <PageTransition>
      <div className="py-4">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {!isEligible ? (
          <WalletGraduationGate milestones={milestones} />
        ) : hasWallet ? (
          <>
            <WalletDashboard />
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={async () => {
                  await resetWallet()
                  window.location.reload()
                }}
                className="mt-6 w-full rounded-xl border border-destructive/30 py-2.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                Reset to starter balance (dev only)
              </button>
            )}
          </>
        ) : (
          <div className="py-6 text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              You did it!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              You&apos;ve unlocked your crypto wallet. Get free tokens and
              use them for predictions on test blockchains (no real money).
            </p>
            <Button
              onClick={() => setSetupOpen(true)}
              className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
            >
              Create my wallet
            </Button>
          </div>
        )}

        {profile && (
          <WalletSetupSheet
            open={setupOpen}
            onOpenChange={setSetupOpen}
            userId={profile.id}
          />
        )}
      </div>
    </PageTransition>
  )
}
