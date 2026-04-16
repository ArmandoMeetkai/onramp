"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, TrendingUp, BookOpen, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { GraduationProgressBar } from "./GraduationProgressBar"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: BarChart3 },
  { href: "/predictions", label: "Predict", icon: TrendingUp },
  { href: "/chat", label: "Chat", icon: MessageCircle },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Main navigation"
    >
      <GraduationProgressBar />
      <div className="mx-auto flex max-w-[480px] items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors press-scale",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
              )}
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
