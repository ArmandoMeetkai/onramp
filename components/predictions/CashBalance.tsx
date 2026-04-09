"use client"

import { cn } from "@/lib/utils"

interface CashBalanceProps {
  balance: number
  size?: "sm" | "md"
  className?: string
}

export function CashBalance({ balance, size = "sm", className }: CashBalanceProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent/15 font-semibold text-accent",
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        className
      )}
    >
      ${balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
    </div>
  )
}
