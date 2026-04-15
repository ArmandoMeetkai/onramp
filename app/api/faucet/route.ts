import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const FAUCET_FALLBACK_URL = "https://cloud.google.com/application/web3/faucet/ethereum/sepolia"

// Strict rate limit: 1 faucet request per address per 24 hours
const upstashFaucetLimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(1, "24 h"),
        prefix: "faucet",
      })
    : null

// In-memory fallback for local dev
const memoryFaucetTimestamps = new Map<string, number>()
const DAY_MS = 24 * 60 * 60 * 1000

function memoryFaucetLimit(address: string): boolean {
  const last = memoryFaucetTimestamps.get(address)
  if (last && Date.now() - last < DAY_MS) return false
  memoryFaucetTimestamps.set(address, Date.now())
  return true
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { address?: string }
    const address = body.address?.trim()

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { success: false, error: "Valid wallet address required" },
        { status: 400 },
      )
    }

    // Rate limit check
    if (upstashFaucetLimit) {
      const result = await upstashFaucetLimit.limit(address)
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: "You can request tokens once every 24 hours. Try again later!",
          },
          { status: 429 },
        )
      }
    } else if (!memoryFaucetLimit(address)) {
      return NextResponse.json(
        {
          success: false,
          error: "You can request tokens once every 24 hours. Try again later!",
        },
        { status: 429 },
      )
    }

    // Try Alchemy faucet API
    if (ALCHEMY_API_KEY) {
      try {
        const response = await fetch(
          `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "alchemy_requestGasAndPaymaster",
              params: [{ address }],
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          if (data.result) {
            return NextResponse.json({
              success: true,
              txHash: data.result.hash ?? data.result,
              amountWei: "100000000000000000", // 0.1 ETH typical faucet amount
            })
          }
        }
      } catch (error) {
        console.error("[faucet] Alchemy API error:", error)
      }
    }

    // Fallback: direct the user to the Alchemy faucet web page
    return NextResponse.json({
      success: false,
      error: "Automatic faucet is currently unavailable. Please try the manual option.",
      fallbackUrl: FAUCET_FALLBACK_URL,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
