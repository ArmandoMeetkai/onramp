"use client"

import {
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { formatCrypto } from "@/lib/utils"

interface TradeConfirmStepProps {
  action: "buy" | "sell"
  assetName: string
  usdAmount: number
  cryptoAmount: number
  symbol: string
  price: number
  onConfirm: () => void
}

export function TradeConfirmStep({
  action,
  assetName,
  usdAmount,
  cryptoAmount,
  symbol,
  price,
  onConfirm,
}: TradeConfirmStepProps) {
  return (
    <>
      <SheetHeader className="px-0">
        <SheetTitle>Confirm your {action}</SheetTitle>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Asset</span>
            <span className="font-semibold">{assetName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Action</span>
            <span className="font-semibold capitalize">{action}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">You spend</span>
            <span className="font-semibold">${usdAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              You {action === "buy" ? "receive" : "return"}
            </span>
            <span className="font-semibold">
              {formatCrypto(cryptoAmount, symbol)} {symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price per coin</span>
            <span className="font-semibold">${price.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          This is a simulation. No real money is involved.
        </p>
        <Button
          onClick={onConfirm}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          Confirm {action === "buy" ? "Purchase" : "Sale"}
        </Button>
      </div>
    </>
  )
}
