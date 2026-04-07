import { NextResponse } from "next/server"
import { appendFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      )
    }

    const entry = `${new Date().toISOString()},${email}\n`

    // Persist to local CSV file as MVP storage
    const filePath = join(process.cwd(), "waitlist.csv")
    await appendFile(filePath, entry, "utf-8")

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    )
  }
}
