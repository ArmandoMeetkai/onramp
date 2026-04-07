import { ImageResponse } from "next/og"
import { getScenarioById } from "@/data/scenarios"

export const runtime = "edge"
export const alt = "Onramp Scenario"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const scenario = getScenarioById(id)
  const title = scenario?.title ?? "Explore Scenarios"

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
        <div style={{ fontSize: 20, color: "#3DBF6E", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>
          Onramp Scenario
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
        <div style={{ fontSize: 22, color: "#a0a09a", marginTop: 20 }}>
          Real questions, safe answers
        </div>
      </div>
    ),
    { ...size }
  )
}
