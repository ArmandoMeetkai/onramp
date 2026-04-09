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

    // Log to stdout — always captured by Vercel function logs
    console.log(`[waitlist] ${entry.trim()}`)

    // Attempt file persistence: /tmp is writable on Vercel, CWD is writable locally
    const paths = [join("/tmp", "waitlist.csv"), join(process.cwd(), "waitlist.csv")]
    for (const filePath of paths) {
      try {
        await appendFile(filePath, entry, "utf-8")
        break
      } catch {
        // Try next path
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    )
  }
}
