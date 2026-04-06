import type { Metadata } from "next"
import { getScenarioById } from "@/data/scenarios"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const scenario = getScenarioById(id)
  if (!scenario) return { title: "Scenario Not Found" }
  return {
    title: scenario.title,
    description: scenario.description,
  }
}

export default function ScenarioLayout({ children }: { children: React.ReactNode }) {
  return children
}
