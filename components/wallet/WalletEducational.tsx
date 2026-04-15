"use client"

import { Info } from "lucide-react"

interface WalletEducationalProps {
  title: string
  children: React.ReactNode
}

export function WalletEducational({ title, children }: WalletEducationalProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  )
}
