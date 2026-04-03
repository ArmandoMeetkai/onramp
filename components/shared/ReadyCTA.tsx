"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ReadyCTAProps {
  headline: string
  subtext?: string
  variant?: "default" | "subtle"
}

export function ReadyCTA({
  headline,
  subtext,
  variant = "default",
}: ReadyCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href="/ready"
        className={cn(
          "group flex items-center justify-between rounded-2xl p-4 transition-all duration-200 active:scale-[0.98]",
          variant === "default"
            ? "border border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10"
            : "border border-border bg-card hover:border-primary/30"
        )}
      >
        <div>
          <p className={cn(
            "font-semibold",
            variant === "default" ? "text-primary" : "text-foreground"
          )}>
            {headline}
          </p>
          {subtext && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
        <ArrowRight className={cn(
          "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
          variant === "default" ? "text-primary" : "text-muted-foreground"
        )} />
      </Link>
    </motion.div>
  )
}
