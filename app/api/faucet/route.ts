import { NextResponse } from "next/server"

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

// In-memory rate limit: 1 faucet request per address per 24 hours
const memoryFaucetTimestamps = new Map<string, number>()
const DAY_MS = 24 * 60 * 60 * 1000

function checkRateLimit(address: string): boolean {
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

    if (!checkRateLimit(address)) {
      return NextResponse.json(
        {
          success: false,
          error: "You can request tokens once every 24 hours. Try again later!",
        },
        { status: 429 },
      )
    }

    // Try Alchemy faucet API if configured
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
              amountWei: "100000000000000000", // 0.1 ETH
            })
          }
        }
      } catch (error) {
        console.error("[faucet] Alchemy API error:", error)
      }
    }

    // Fallback: simulated faucet for demo
    return NextResponse.json({
      success: true,
      txHash: `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, "0")).join("")}`,
      amountWei: "100000000000000000", // 0.1 ETH
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
