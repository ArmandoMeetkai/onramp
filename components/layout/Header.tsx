"use client"

import { Sun, Moon, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"

export function Header() {
  const { isEligible, hasWallet } = useTestnetGraduation()
  const isTestnet = isEligible && hasWallet
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : true
  )

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("onramp-theme", next ? "dark" : "light")
    } catch {
      // Safari Private Browsing throws QuotaExceededError — visual state still works
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-3" role="banner">
      <div className="flex items-center gap-2.5">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
          Onramp
        </Link>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            isTestnet
              ? "bg-primary/15 text-primary"
              : "bg-accent/15 text-accent"
          }`}
        >
          <span className={`h-1 w-1 rounded-full ${isTestnet ? "bg-primary" : "bg-accent"}`} />
          {isTestnet ? "Testnet" : "Practice"}
        </span>
      </div>
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
