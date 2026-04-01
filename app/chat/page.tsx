"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/layout/PageTransition"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { useChatStore } from "@/store/useChatStore"
import { useUserStore } from "@/store/useUserStore"
import { useProgressStore } from "@/store/useProgressStore"

const starterQuestions = [
  "What is Bitcoin?",
  "Is crypto safe?",
  "How do I start?",
  "What's the risk?",
] as const

export default function ChatPage() {
  const messages = useChatStore((s) => s.messages)
  const isLoading = useChatStore((s) => s.isLoading)
  const addUserMessage = useChatStore((s) => s.addUserMessage)
  const streamAssistantMessage = useChatStore((s) => s.streamAssistantMessage)
  const profile = useUserStore((s) => s.profile)
  const updateStreak = useProgressStore((s) => s.updateStreak)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(
    async (content: string) => {
      addUserMessage(content)
      await updateStreak()
      await streamAssistantMessage({
        experienceLevel: profile?.experienceLevel ?? "new",
        riskStyle: profile?.riskStyle ?? "moderate",
      })
    },
    [addUserMessage, streamAssistantMessage, profile, updateStreak]
  )

  return (
    <PageTransition>
      <div className="flex h-[calc(100dvh-8rem)] flex-col py-4">
        <div className="mb-3">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Ask Anything
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            I&apos;m here to help you learn, not to give advice
          </p>
        </div>

        <div className="rounded-xl bg-accent/10 px-3 py-2 mb-3">
          <p className="text-center text-xs font-medium text-accent">
            I&apos;m an AI learning assistant. I cannot predict markets or give financial advice.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 pb-3"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  Ask me anything about crypto. There are no silly questions.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {starterQuestions.map((question) => (
                  <motion.button
                    key={question}
                    onClick={() => handleSend(question)}
                    disabled={isLoading}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:border-primary/30 active:scale-95 disabled:opacity-50"
                    whileTap={{ scale: 0.95 }}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
        </div>

        <div className="pt-2">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </PageTransition>
  )
}
