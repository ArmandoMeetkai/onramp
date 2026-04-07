import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Onramp — The first safe place to think before entering crypto"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
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
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#3DBF6E",
            letterSpacing: "-2px",
          }}
        >
          Onramp
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a0a09a",
            marginTop: 16,
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          The first safe place to think before entering crypto
        </div>
      </div>
    ),
    { ...size }
  )
}
