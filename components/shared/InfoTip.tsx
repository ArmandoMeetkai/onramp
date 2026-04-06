"use client"

import { useState, useRef, useEffect } from "react"
import { Info, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface InfoTipProps {
  label?: string
  children: React.ReactNode
  className?: string
}

/**
 * Inline tappable educational tip. Shows a ⓘ icon (with optional label).
 * On tap, expands a small explanation card inline — mobile-friendly.
 */
export function InfoTip({ label, children, className }: InfoTipProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
    } else {
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <span className={cn("inline-flex flex-col gap-1", className)}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
        aria-label={label ? `Learn about ${label}` : "Learn more"}
      >
        {label && (
          <span className="underline decoration-dotted underline-offset-2">
            {label}
          </span>
        )}
        <Info className="h-3.5 w-3.5 shrink-0" />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative rounded-xl border border-border/60 bg-muted/50 px-3 py-2.5 pr-7 text-xs leading-relaxed text-muted-foreground">
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close tip"
              >
                <X className="h-3 w-3" />
              </button>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
