"use client"

import type { ReactNode } from "react"
import { useHydration } from "@/hooks/useHydration"
import { Header } from "./Header"
import { BottomNav } from "./BottomNav"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const isReady = useHydration()

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto w-full max-w-[480px]">
        <Header />
        <main className="flex-1 px-4 pb-24">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
