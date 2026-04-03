"use client"

import { motion } from "framer-motion"

function Coin({
  symbol,
  x,
  delay,
  size,
}: {
  symbol: string
  x: number
  delay: number
  size: number
}) {
  const labels: Record<string, string> = {
    BTC: "B",
    ETH: "E",
    SOL: "S",
  }

  return (
    <motion.g
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay,
        duration: 1.2,
        ease: "easeOut",
      }}
    >
      <motion.g
        animate={{ y: [-3, 3, -3] }}
        transition={{
          delay: delay + 0.5,
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow */}
        <circle
          cx={x}
          cy={80}
          r={size + 8}
          fill="currentColor"
          className="text-primary"
          opacity={0.08}
        />
        {/* Coin body */}
        <circle
          cx={x}
          cy={80}
          r={size}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-primary"
        />
        <circle
          cx={x}
          cy={80}
          r={size - 4}
          fill="currentColor"
          className="text-primary"
          opacity={0.1}
        />
        {/* Symbol */}
        <text
          x={x}
          y={85}
          textAnchor="middle"
          fill="currentColor"
          className="text-primary"
          fontSize={size * 0.6}
          fontWeight={700}
          fontFamily="var(--font-dm-sans), sans-serif"
        >
          {labels[symbol]}
        </text>
      </motion.g>
    </motion.g>
  )
}

export function ReadyHero() {
  return (
    <div className="flex justify-center py-6">
      <svg
        viewBox="0 0 280 160"
        className="w-full max-w-[280px]"
        aria-hidden="true"
      >
        {/* Subtle rising lines behind coins */}
        {[80, 140, 200].map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            y1={140}
            x2={x}
            y2={50}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="4 4"
            className="text-border"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 1.5 }}
          />
        ))}

        {/* Three coins at different heights */}
        <Coin symbol="BTC" x={80} delay={0.4} size={26} />
        <Coin symbol="ETH" x={140} delay={0.6} size={22} />
        <Coin symbol="SOL" x={200} delay={0.8} size={20} />

        {/* Upward arrow hint */}
        <motion.path
          d="M 140 30 L 140 10 M 134 16 L 140 10 L 146 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </svg>
    </div>
  )
}
