import { replayEvents } from "@/data/replayEvents"
import { ReplayHubContent } from "@/components/replay/ReplayHubContent"

export default function ReplayHubPage() {
  return <ReplayHubContent events={replayEvents} />
}
