import { lessons } from "@/data/lessons"
import { LearnContent } from "@/components/learn/LearnContent"

export default function LearnPage() {
  return <LearnContent lessons={lessons} />
}
