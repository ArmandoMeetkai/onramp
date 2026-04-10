"use client"

import { type ReactNode, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import { MotionConfig } from "framer-motion"
import { AppShell } from "./AppShell"

function ScrollToTop() {
  const pathname = usePathname()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <AppShell>{children}</AppShell>
    </MotionConfig>
  )
}
