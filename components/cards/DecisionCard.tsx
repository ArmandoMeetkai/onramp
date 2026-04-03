"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CoinIcon } from "@/components/shared/CoinIcon"
import { cn } from "@/lib/utils"
import type { DecisionScenario } from "@/data/scenarios"

interface DecisionCardProps {
  scenario: DecisionScenario
}

const assetColors: Record<string, string> = {
  BTC: "bg-accent/15 text-accent",
  ETH: "bg-primary/15 text-primary",
  SOL: "bg-info/15 text-info",
}

export function DecisionCard({ scenario }: DecisionCardProps) {
  return (
    <Link
      href={`/scenario/${scenario.id}`}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex-1">
        <h3 className="font-heading text-base font-semibold leading-snug">
          {scenario.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {scenario.subtitle}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className={cn("flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[11px] font-medium", assetColors[scenario.asset])}
          >
            <CoinIcon symbol={scenario.asset} size="xs" className="h-3.5 w-3.5 rounded-sm bg-transparent" />
            {scenario.asset}
          </Badge>
          <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-[11px] font-medium">
            {scenario.difficulty === "beginner" ? "Beginner" : "Intermediate"}
          </Badge>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </Link>
  )
}
