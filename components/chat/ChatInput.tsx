"use client"

import { useState, useCallback } from "react"
import { Send, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  onStop: () => void
  isLoading: boolean
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue("")
  }, [value, isLoading, onSend])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="flex items-end gap-2"
    >
      <label htmlFor="chat-input" className="sr-only">Ask anything about crypto</label>
      <input
        id="chat-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isLoading ? "Wait for response..." : "Ask anything about crypto..."}
        className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
      />
      {isLoading ? (
        <button
          type="button"
          onClick={onStop}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground transition-opacity"
          aria-label="Stop generating"
        >
          <Square className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity",
            !value.trim() && "opacity-40"
          )}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
