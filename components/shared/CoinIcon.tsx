"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const COIN_IMAGES: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
}

const COIN_FALLBACK: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  SOL: "◎",
}

interface CoinIconProps {
  symbol: string
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  xs: { container: "h-6 w-6", image: 24, text: "text-xs" },
  sm: { container: "h-8 w-8", image: 32, text: "text-base" },
  md: { container: "h-10 w-10", image: 40, text: "text-lg" },
  lg: { container: "h-12 w-12", image: 48, text: "text-xl" },
}

export function CoinIcon({ symbol, size = "md", className }: CoinIconProps) {
  const [imgError, setImgError] = useState(false)
  const { container, image, text } = sizeMap[size]
  const src = COIN_IMAGES[symbol]

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-secondary",
        container,
        className
      )}
    >
      {src && !imgError ? (
        <Image
          src={src}
          alt={symbol}
          width={image}
          height={image}
          className="rounded-lg"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={cn("font-bold", text)}>
          {COIN_FALLBACK[symbol] ?? symbol[0]}
        </span>
      )}
    </div>
  )
}
