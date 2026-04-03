"use client"

import { InfoTip } from "@/components/shared/InfoTip"

interface ProbabilityBarProps {
  up: number
  flat: number
  down: number
}

export function ProbabilityBar({ up, flat, down }: ProbabilityBarProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-semibold text-muted-foreground">
          What people are seeing
        </p>
        <InfoTip>
          Based on <strong className="text-foreground">historical data</strong> for
          similar market conditions, this shows how often prices ended up higher, roughly
          the same, or lower. It&apos;s not a prediction. Past patterns don&apos;t
          guarantee future results.
        </InfoTip>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div
          className="bg-success transition-all duration-500"
          style={{ width: `${up}%` }}
        />
        <div
          className="bg-muted-foreground/30 transition-all duration-500"
          style={{ width: `${flat}%` }}
        />
        <div
          className="bg-danger transition-all duration-500"
          style={{ width: `${down}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-success" />
          Up {up}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/30" />
          Flat {flat}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-danger" />
          Down {down}%
        </span>
      </div>
    </div>
  )
}
