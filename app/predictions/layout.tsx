import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Predictions — Onramp",
  description: "Predict crypto outcomes and learn to think probabilistically.",
}

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
