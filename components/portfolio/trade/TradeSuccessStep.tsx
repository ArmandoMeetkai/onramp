"use client"

import { motion } from "framer-motion"
import { Check, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePriceStore } from "@/store/usePriceStore"

const successLearnLinks: Record<string, { lessonId: string; label: string }> = {
  BTC: { lessonId: "what-is-bitcoin", label: "Learn about Bitcoin" },
  ETH: { lessonId: "what-is-blockchain", label: "Learn about blockchains" },
  SOL: { lessonId: "what-is-market-cap", label: "Learn about market cap" },
}

interface TradeSuccessStepProps {
  action: "buy" | "sell"
  symbol: string
  onClose: () => void
}

export function TradeSuccessStep({ action, symbol, onClose }: TradeSuccessStepProps) {
  const getName = usePriceStore((s) => s.getName)
  const learnLink = successLearnLinks[symbol]

  return (
    <div className="flex flex-col items-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
      >
        <Check className="h-8 w-8 text-success" />
      </motion.div>
      <h3 className="mt-4 font-heading text-xl font-bold">
        {action === "buy" ? "Purchase" : "Sale"} complete!
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your practice portfolio has been updated.
      </p>

      {action === "buy" && (
        <div className="mt-4 w-full rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
          💡 <strong className="text-foreground">What just happened?</strong>{" "}
          Some of your cash was exchanged for a fraction of{" "}
          {getName(symbol)}. Its value will rise and fall with the
          market. Watch it in Your Holdings.
        </div>
      )}

      {learnLink && (
        <Link
          href={`/learn/${learnLink.lessonId}`}
          onClick={onClose}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          <BookOpen className="h-4 w-4 text-primary" />
          {learnLink.label}
        </Link>
      )}

      <Button
        onClick={onClose}
        className="mt-3 h-12 w-full rounded-xl text-base font-semibold"
      >
        Done
      </Button>
    </div>
  )
}
