import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Practice Portfolio",
  description: "Practice buying and selling Bitcoin, Ethereum, and Solana with $10,000 in simulated money.",
}

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children
}
