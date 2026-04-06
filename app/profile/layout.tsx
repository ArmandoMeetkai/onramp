import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile",
  description: "Track your learning progress, confidence score, and streak.",
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
