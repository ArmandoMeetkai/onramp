import type { Metadata } from "next"
import { replayEvents } from "@/data/replayEvents"

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }): Promise<Metadata> {
  const { eventId } = await params
  const event = replayEvents.find((e) => e.id === eventId)
  if (!event) return { title: "Replay Not Found" }
  return {
    title: `Replay: ${event.title}`,
    description: event.briefSummary,
  }
}

export default function ReplayEventLayout({ children }: { children: React.ReactNode }) {
  return children
}
