import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Time Travel",
  description: "Relive real crypto events like the Terra Luna crash and Bitcoin halving. Make decisions and see outcomes.",
}

export default function ReplayLayout({ children }: { children: React.ReactNode }) {
  return children
}
