"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Droplets, Clock, Check, X } from "lucide-react"
import { formatEther } from "viem"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { truncateAddress, getExplorerTxUrl } from "@/lib/testnet"
import { getSolExplorerTxUrl, formatSolTokens } from "@/lib/solana"
import { getBtcExplorerTxUrl, formatBtcTokens } from "@/lib/bitcoin"

const typeConfig = {
  send: { icon: ArrowUpRight, label: "Sent", color: "text-destructive" },
  receive: { icon: ArrowDownLeft, label: "Received", color: "text-success" },
  faucet: { icon: Droplets, label: "Faucet", color: "text-accent" },
} as const

const statusConfig = {
  pending: { icon: Clock, label: "Pending", color: "text-warning" },
  confirmed: { icon: Check, label: "Confirmed", color: "text-success" },
  failed: { icon: X, label: "Failed", color: "text-destructive" },
} as const

function formatAmount(amount: string, chain?: string): string {
  try {
    if (chain === "solana") {
      return formatSolTokens(Number(amount))
    }
    if (chain === "bitcoin") {
      return formatBtcTokens(Number(amount))
    }
    // Ethereum: treat as wei
    const eth = formatEther(BigInt(amount))
    const num = Number.parseFloat(eth)
    if (num === 0) return "0"
    if (num < 0.0001) return "<0.0001"
    if (num < 1) return num.toFixed(4)
    return num.toFixed(2)
  } catch {
    return "0"
  }
}

function getTxExplorerUrl(hash: string, chain?: string): string | undefined {
  if (hash === "faucet") return undefined
  if (chain === "solana") return getSolExplorerTxUrl(hash)
  if (chain === "bitcoin") return getBtcExplorerTxUrl(hash)
  return getExplorerTxUrl(hash)
}

function formatTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

export function WalletTransactionList() {
  const allTransactions = useTestnetWalletStore((s) => s.transactions)
  const activeChain = useTestnetWalletStore((s) => s.activeChain)
  const transactions = allTransactions.filter(
    (tx) => !tx.chain || tx.chain === activeChain,
  )

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-dashed border-border p-6 text-center"
      >
        <p className="text-sm text-muted-foreground">No transactions yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Get some tokens to start
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="mb-3 text-sm font-semibold">Recent activity</h3>
      <div className="space-y-2">
        {transactions.slice(0, 20).map((tx) => {
          const typeInfo = typeConfig[tx.type]
          const statusInfo = statusConfig[tx.status]
          const TypeIcon = typeInfo.icon
          const StatusIcon = statusInfo.icon

          return (
            <a
              key={tx.id}
              href={getTxExplorerUrl(tx.hash, tx.chain)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-muted/50"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted ${typeInfo.color}`}
              >
                <TypeIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{typeInfo.label}</p>
                  <p className={`text-sm font-semibold ${typeInfo.color}`}>
                    {tx.type === "send" ? "-" : "+"}
                    {formatAmount(tx.amount ?? "0", tx.chain)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-muted-foreground">
                    {tx.type === "send"
                      ? `To ${truncateAddress(tx.to)}`
                      : tx.type === "faucet"
                        ? "From faucet"
                        : `From ${truncateAddress(tx.from)}`}
                  </p>
                  <div className="flex items-center gap-1">
                    <StatusIcon
                      className={`h-3 w-3 ${statusInfo.color}`}
                    />
                    <span
                      className={`text-[10px] ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(tx.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </motion.div>
  )
}
