import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ready to Make It Real?",
  description: "Join the waitlist for when Onramp connects to real exchanges.",
}

export default function ReadyLayout({ children }: { children: React.ReactNode }) {
  return children
}
