import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explore Scenarios",
  description: "Real crypto questions with safe, simulated answers. Explore Bitcoin, Ethereum, and Solana scenarios.",
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children
}
