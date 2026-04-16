import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format crypto amount, trimming insignificant trailing zeros. */
export function formatCrypto(amount: number, asset: string): string {
  if (asset === "BTC") return parseFloat(amount.toFixed(6)).toString()
  if (asset === "ETH") return parseFloat(amount.toFixed(4)).toString()
  if (asset === "SOL") return parseFloat(amount.toFixed(4)).toString()
  return parseFloat(amount.toFixed(2)).toString()
}

/** Consistent time-remaining string used across hub cards and detail pages. */
export function getTimeRemaining(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return "Ended"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return remainingDays > 0 ? `${months}mo ${remainingDays}d left` : `${months}mo left`
  }
  if (days > 0) return `${days}d left`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return `${hours}h left`
}
