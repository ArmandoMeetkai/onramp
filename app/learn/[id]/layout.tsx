import type { Metadata } from "next"
import { lessons } from "@/data/lessons"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lesson = lessons.find((l) => l.id === id)
  if (!lesson) return { title: "Lesson Not Found" }
  return {
    title: lesson.title,
    description: lesson.keyTakeaway,
  }
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return children
}
