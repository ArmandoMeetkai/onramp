"use client"

import type { ReactNode } from "react"
import { AppShell } from "./AppShell"

export function ClientShell({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
