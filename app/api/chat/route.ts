import Anthropic from "@anthropic-ai/sdk"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rateLimit"

const anthropic = new Anthropic()

function buildSystemPrompt(experienceLevel: string, riskStyle: string): string {
  return `You are Onramp's learning assistant. You help beginners understand crypto concepts in plain, calm language. You NEVER give financial advice, price predictions, or tell users what to buy or sell. You explain concepts, answer questions, and help users think through decisions on their own.

User's experience level: ${experienceLevel}
User's risk style: ${riskStyle}

Rules:
- Use simple, jargon-free language
- If you must use a technical term, explain it immediately
- Never say "you should buy/sell"
- Always remind users this is educational
- Be warm, patient, and encouraging
- Keep responses concise (2-4 paragraphs max)
- If asked about specific price predictions, politely decline and explain why
- If asked about specific coins to buy, redirect to learning about the fundamentals first
- The app has prediction markets where users predict crypto outcomes (e.g. "Will BTC be above $100K by June 2026?"). If users ask about active predictions, discuss the relevant factors educationally but NEVER tell them which way to predict. Help them think through the factors on their own.`
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown"
    const { allowed } = await rateLimit(ip)

    if (!allowed) {
      return Response.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    }

    const body = await request.json()
    const { messages: rawMessages, userProfile } = body as {
      messages: { role: "user" | "assistant"; content: string }[]
      userProfile: { experienceLevel: string; riskStyle: string }
    }

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return Response.json(
        { error: "Messages are required" },
        { status: 400 }
      )
    }

    const MAX_MESSAGES = 50
    const MAX_CONTENT_LENGTH = 4000
    const messages = rawMessages.slice(-MAX_MESSAGES).map((m) => ({
      role: m.role === "assistant" ? "assistant" as const : "user" as const,
      content: typeof m.content === "string" ? m.content.slice(0, MAX_CONTENT_LENGTH) : "",
    }))

    // Whitelist values before interpolating into the system prompt to prevent injection
    const VALID_EXPERIENCE = new Set(["new", "beginner", "intermediate", "advanced"])
    const VALID_RISK = new Set(["conservative", "moderate", "aggressive"])
    const experienceLevel = VALID_EXPERIENCE.has(userProfile?.experienceLevel)
      ? userProfile.experienceLevel
      : "new"
    const riskStyle = VALID_RISK.has(userProfile?.riskStyle)
      ? userProfile.riskStyle
      : "moderate"

    const systemPrompt = buildSystemPrompt(experienceLevel, riskStyle)

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              )
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch {
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    )
  }
}
