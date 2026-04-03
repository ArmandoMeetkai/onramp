"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

function Slider({
  value,
  defaultValue = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false,
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue[0])
  const currentValue = value ? value[0] : internalValue
  const percentage = ((currentValue - min) / (max - min)) * 100
  const trackRef = React.useRef<HTMLDivElement>(null)

  const updateValue = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const rawValue = min + ratio * (max - min)
      const stepped = Math.round(rawValue / step) * step
      const clamped = Math.max(min, Math.min(max, stepped))

      if (!value) setInternalValue(clamped)
      onValueChange?.([clamped])
    },
    [min, max, step, value, onValueChange, disabled]
  )

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      target.setPointerCapture(e.pointerId)
      updateValue(e.clientX)
    },
    [updateValue, disabled]
  )

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      const target = e.currentTarget as HTMLElement
      if (target.hasPointerCapture(e.pointerId)) {
        updateValue(e.clientX)
      }
    },
    [updateValue, disabled]
  )

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentValue}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2 cursor-pointer",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={(e) => {
        if (disabled) return
        let newVal = currentValue
        if (e.key === "ArrowRight" || e.key === "ArrowUp") newVal = Math.min(max, currentValue + step)
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") newVal = Math.max(min, currentValue - step)
        if (newVal !== currentValue) {
          if (!value) setInternalValue(newVal)
          onValueChange?.([newVal])
        }
      }}
    >
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className="absolute block size-4 rounded-full border border-ring bg-card shadow-sm ring-ring/50 transition-shadow hover:ring-4 focus-visible:ring-4"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  )
}

export { Slider }
export type { SliderProps }
