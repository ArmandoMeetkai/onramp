import Anthropic from "@anthropic-ai/sdk"

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
- If asked about specific coins to buy, redirect to learning about the fundamentals first`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, userProfile } = body as {
      messages: { role: "user" | "assistant"; content: string }[]
      userProfile: { experienceLevel: string; riskStyle: string }
    }

    const systemPrompt = buildSystemPrompt(
      userProfile?.experienceLevel ?? "new",
      userProfile?.riskStyle ?? "moderate"
    )

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
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
