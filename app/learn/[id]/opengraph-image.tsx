import { ImageResponse } from "next/og"
import { lessons } from "@/data/lessons"

export const runtime = "edge"
export const alt = "Onramp Lesson"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = lessons.find((l) => l.id === id)
  const title = lesson?.title ?? "Learn Crypto"
  const emoji = lesson?.emoji ?? "📚"

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a2e23 0%, #111110 50%, #2a1f14 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 72 }}>{emoji}</div>
        <div style={{ fontSize: 20, color: "#3DBF6E", fontWeight: 600, letterSpacing: 2, marginTop: 16, textTransform: "uppercase" as const }}>
          Onramp Lesson
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#edede8",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  )
}
