"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/PageTransition"
import { DecisionCard } from "@/components/cards/DecisionCard"
import { scenarios } from "@/data/scenarios"
import { cn } from "@/lib/utils"

const filters = [
  { label: "All", value: "all" },
  { label: "Bitcoin", value: "bitcoin" },
  { label: "Ethereum", value: "ethereum" },
  { label: "Solana", value: "solana" },
  { label: "Beginner", value: "beginner" },
] as const

type FilterValue = (typeof filters)[number]["value"]

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")

  const filtered = scenarios.filter((scenario) => {
    if (activeFilter === "all") return true
    if (activeFilter === "beginner") return scenario.difficulty === "beginner"
    const assetMap: Record<string, string> = { bitcoin: "BTC", ethereum: "ETH", solana: "SOL" }
    return scenario.asset === assetMap[activeFilter]
  })

  return (
    <PageTransition>
      <div className="py-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Explore Scenarios
        </h1>
        <p className="mt-1 text-muted-foreground">Real questions, safe answers</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
            >
              <DecisionCard scenario={scenario} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No scenarios match this filter.
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
