"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { AppShell } from "./AppShell"

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AppShell>{children}</AppShell>
    </MotionConfig>
  )
}
