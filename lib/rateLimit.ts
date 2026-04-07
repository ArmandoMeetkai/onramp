const requests = new Map<string, number[]>()
const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 10 // 10 requests per minute

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (requests.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    requests.set(ip, timestamps)
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  requests.set(ip, timestamps)
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length }
}
