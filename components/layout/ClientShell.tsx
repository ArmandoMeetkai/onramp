"use client"

import { useEffect, type ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { initAnalytics } from "@/lib/analytics"
import { AppShell } from "./AppShell"

export function ClientShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AppShell>{children}</AppShell>
    </MotionConfig>
  )
}
