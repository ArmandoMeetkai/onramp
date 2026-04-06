"use client"

import { Sun, Moon, User } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Header() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("onramp-theme", next ? "dark" : "light")
  }

  return (
    <header className="flex items-center justify-between px-4 py-3" role="banner">
      <Link href="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
        Onramp
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground press-scale"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          role="switch"
          aria-checked={isDark}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <Link
          href="/profile"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Profile"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
