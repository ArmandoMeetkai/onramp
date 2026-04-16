"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, TrendingUp, BookOpen, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: BarChart3 },
  { href: "/predictions", label: "Predict", icon: TrendingUp },
  { href: "/chat", label: "Chat", icon: MessageCircle },
] as const

const spring = { type: "spring" as const, stiffness: 260, damping: 28 }

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed left-0 top-0 z-40 hidden h-full w-16 flex-col items-center border-r border-border bg-background py-6 md:flex"
      role="navigation"
      aria-label="Desktop navigation"
    >
      {/* Logo */}
      <span className="mb-8 font-dm-sans text-xl italic font-semibold text-primary">
        O
      </span>

      {/* Nav items */}
      <div className="flex flex-1 flex-col items-center gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col items-center justify-center gap-0.5 py-1"
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.span
                  layoutId="nav-indicator-desktop"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-primary"
                  transition={spring}
                />
              )}

              {/* Icon */}
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon size={18} strokeWidth={1.5} />
              </span>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
