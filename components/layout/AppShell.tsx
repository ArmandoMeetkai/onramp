"use client"

import type { ReactNode } from "react"
import { useHydration } from "@/hooks/useHydration"
import { ErrorState } from "@/components/shared/ErrorState"
import { Header } from "./Header"
import { BottomNav } from "./BottomNav"
import { ModeBanner } from "./ModeBanner"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { isReady, error } = useHydration()

  if (!isReady) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <div className="mx-auto w-full max-w-[480px]">
          {/* Header skeleton */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-muted" />
            <div className="flex gap-2">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
          {/* Content skeleton */}
          <div className="space-y-4 px-4 pt-6">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ModeBanner />
      <div className="mx-auto w-full max-w-[480px]">
        <Header />
        <main className="flex-1 px-4 pb-24">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
