import { ImageResponse } from "next/og"
import { replayEvents } from "@/data/replayEvents"

export const runtime = "edge"
export const alt = "Onramp Time Travel"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const event = replayEvents.find((e) => e.id === eventId)
  const title = event?.title ?? "Time Travel"
  const emoji = event?.coverEmoji ?? "⏳"

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
        <div style={{ fontSize: 20, color: "#D49550", fontWeight: 600, letterSpacing: 2, marginTop: 16, textTransform: "uppercase" as const }}>
          Onramp Time Travel
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
