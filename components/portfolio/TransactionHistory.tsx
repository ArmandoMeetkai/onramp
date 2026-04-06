"use client"

import { Badge } from "@/components/ui/badge"
import { CoinIcon } from "@/components/shared/CoinIcon"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/db"

interface TransactionHistoryProps {
  transactions: Transaction[]
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Transaction History
      </h2>
      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No transactions yet. Try buying your first asset!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.slice(0, 20).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-center gap-2.5">
                <CoinIcon symbol={tx.asset} size="xs" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-md px-1.5 py-0 text-[11px] font-semibold",
                        tx.type === "buy"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      )}
                    >
                      {tx.type === "buy" ? "Buy" : "Sell"}
                    </Badge>
                    <p className="text-sm font-medium">
                      {tx.amount < 0.001
                        ? tx.amount.toFixed(6)
                        : tx.amount < 1
                          ? tx.amount.toFixed(4)
                          : tx.amount.toFixed(2)}{" "}
                      {tx.asset}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @ ${tx.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${(tx.amount * tx.price).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
