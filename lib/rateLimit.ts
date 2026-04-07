import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

// Use Upstash if configured, otherwise fall back to in-memory
const upstashRateLimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 m"),
      })
    : null

// In-memory fallback for local development
const memoryRequests = new Map<string, number[]>()

function memoryRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (memoryRequests.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  )

  if (timestamps.length >= MAX_REQUESTS) {
    memoryRequests.set(ip, timestamps)
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  memoryRequests.set(ip, timestamps)
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length }
}

export async function rateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (upstashRateLimit) {
    const result = await upstashRateLimit.limit(ip)
    return { allowed: result.success, remaining: result.remaining }
  }
  return memoryRateLimit(ip)
}
