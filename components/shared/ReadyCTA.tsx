"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTestnetGraduation } from "@/hooks/useTestnetGraduation"

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
  const { isEligible } = useTestnetGraduation()
  const href = isEligible ? "/wallet" : "/ready"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={href}
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
            {isEligible ? "Unlock your crypto wallet" : headline}
          </p>
          {(subtext || isEligible) && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isEligible
                ? "Use real tokens for predictions"
                : subtext}
            </p>
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
