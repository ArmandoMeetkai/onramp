import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learn",
  description: "Short beginner-friendly lessons that make crypto make sense. Each takes about 2 minutes.",
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}
