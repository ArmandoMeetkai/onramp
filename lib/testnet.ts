import { createPublicClient, http, formatEther, parseEther } from "viem"
import { sepolia } from "viem/chains"

export const SEPOLIA_CHAIN = sepolia

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

/** Format wei to a short numeric string */
export function formatEthShort(wei: bigint): string {
  const eth = formatEther(wei)
  const num = Number.parseFloat(eth)

  if (num === 0) return "0"
  if (num < 0.0001) return "<0.0001"
  if (num < 0.01) return num.toFixed(4)
  if (num < 1) return num.toFixed(3)
  return num.toFixed(2)
}

/** @deprecated Use formatEthShort */
export const formatPracticeTokensShort = formatEthShort

/** Parse a user-entered ETH amount string to wei */
export function parseEthAmount(amount: string): bigint {
  return parseEther(amount)
}

/** @deprecated Use parseEthAmount */
export const parsePracticeTokens = parseEthAmount

/** Truncate an address for display: 0x1234...abcd */
export function truncateAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/** Sepolia Etherscan link for a transaction */
export function getExplorerTxUrl(hash: string): string {
  return `https://sepolia.etherscan.io/tx/${hash}`
}

/** Sepolia Etherscan link for an address */
export function getExplorerAddressUrl(address: string): string {
  return `https://sepolia.etherscan.io/address/${address}`
}
