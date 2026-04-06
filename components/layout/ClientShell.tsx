"use client"

import type { ReactNode } from "react"
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion"
import { AppShell } from "./AppShell"

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <AppShell>{children}</AppShell>
      </MotionConfig>
    </LazyMotion>
  )
}
