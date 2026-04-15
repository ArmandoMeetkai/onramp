"use client"

import { useState, useCallback } from "react"
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"
import { truncateAddress, getExplorerAddressUrl } from "@/lib/testnet"
import { getSolExplorerAddressUrl } from "@/lib/solana"
import { getBtcExplorerAddressUrl } from "@/lib/bitcoin"

export function WalletAddress() {
  const wallet = useTestnetWalletStore((s) => s.wallet)
  const activeChain = useTestnetWalletStore((s) => s.activeChain)
  const [showFull, setShowFull] = useState(false)
  const [copied, setCopied] = useState(false)

  const address =
    activeChain === "ethereum"
      ? wallet?.address
      : activeChain === "solana"
        ? wallet?.solana?.address
        : wallet?.bitcoin?.address

  const explorerUrl =
    activeChain === "ethereum"
      ? address ? getExplorerAddressUrl(address) : null
      : activeChain === "solana"
        ? address ? getSolExplorerAddressUrl(address) : null
        : address ? getBtcExplorerAddressUrl(address) : null

  const handleCopy = useCallback(async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success("Address copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy address")
    }
  }, [address])

  if (!address) return null

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Wallet address
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="mt-2 font-mono text-sm text-foreground">
        {showFull ? address : truncateAddress(address)}
      </p>

      <button
        onClick={() => setShowFull(!showFull)}
        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showFull ? (
          <>
            <ChevronUp className="h-3 w-3" />
            Hide full address
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" />
            Show full address
          </>
        )}
      </button>

      {showFull && explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-primary hover:underline"
        >
          View on block explorer
        </a>
      )}
    </div>
  )
}
