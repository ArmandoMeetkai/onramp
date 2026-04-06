import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ask Anything",
  description: "Ask an AI learning assistant anything about crypto. No financial advice, just education.",
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
