"use client"

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { CoinIcon } from "@/components/shared/CoinIcon"
import { usePriceStore } from "@/store/usePriceStore"

const assets = [
  { symbol: "BTC", lessonId: "what-is-bitcoin" },
  { symbol: "ETH", lessonId: "what-is-blockchain" },
  { symbol: "SOL", lessonId: "what-is-market-cap" },
] as const

interface TradeAssetStepProps {
  onSelect: (symbol: string) => void
}

export function TradeAssetStep({ onSelect }: TradeAssetStepProps) {
  const getPrice = usePriceStore((s) => s.getPrice)
  const getName = usePriceStore((s) => s.getName)
  const getTagline = usePriceStore((s) => s.getTagline)

  return (
    <>
      <SheetHeader className="px-0">
        <SheetTitle>Choose a cryptocurrency</SheetTitle>
        <SheetDescription>
          Not sure which to pick? Tap any option to learn more.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-2">
        {assets.map(({ symbol }) => (
          <button
            key={symbol}
            onClick={() => onSelect(symbol)}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
          >
            <CoinIcon symbol={symbol} size="lg" />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="font-semibold">{getName(symbol)}</p>
                <p className="text-xs text-muted-foreground">{symbol}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {getTagline(symbol)}
              </p>
              <p className="mt-0.5 text-xs font-medium">
                ${getPrice(symbol).toLocaleString()} per coin
              </p>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

export { assets }
