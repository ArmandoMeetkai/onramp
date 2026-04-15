"use client"

import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { WalletEducational } from "./WalletEducational"
import { useTestnetWalletStore } from "@/store/useTestnetWalletStore"

interface WalletReceiveSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletReceiveSheet({
  open,
  onOpenChange,
}: WalletReceiveSheetProps) {
  const wallet = useTestnetWalletStore((s) => s.wallet)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!wallet) return
    try {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      toast.success("Address copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy address")
    }
  }, [wallet])

  if (!wallet) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        <SheetHeader className="px-0">
          <SheetTitle className="text-xl">Receive tokens</SheetTitle>
          <SheetDescription>
            Share this address to receive tokens from another wallet or a faucet.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-4">
          {/* Address card */}
          <div className="rounded-xl bg-muted/50 p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Your wallet address
            </p>
            <p className="font-mono text-sm text-foreground break-all leading-relaxed">
              {wallet.address}
            </p>
          </div>

          <Button
            onClick={handleCopy}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy address
              </>
            )}
          </Button>

          <WalletEducational title="How receiving works">
            When someone sends tokens to your address, they appear in your
            wallet automatically. It usually takes a few seconds on testnet.
          </WalletEducational>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full rounded-xl font-semibold"
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
