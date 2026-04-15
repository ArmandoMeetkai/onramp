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

const STANDALONE_ROUTES = ["/faucet"]

export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname.startsWith(r))

  if (isStandalone) {
    return (
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <AppShell>{children}</AppShell>
    </MotionConfig>
  )
}
