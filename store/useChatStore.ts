import { create } from "zustand"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  addUserMessage: (content: string) => void
  streamAssistantMessage: (
    userProfile: { experienceLevel: string; riskStyle: string }
  ) => Promise<void>
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,

  addUserMessage: (content) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }
    set((state) => ({ messages: [...state.messages, message] }))
  },

  streamAssistantMessage: async (userProfile) => {
    set({ isLoading: true })

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    }
    set((state) => ({ messages: [...state.messages, assistantMessage] }))

    try {
      const allMessages = get().messages
      const apiMessages = allMessages
        .filter((m) => m.id !== assistantMessage.id)
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, userProfile }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6)
          if (data === "[DONE]") continue

          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string }
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              accumulated += parsed.text
              set((state) => ({
                messages: state.messages.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: accumulated }
                    : m
                ),
              }))
            }
          } catch {
            // skip unparseable lines
          }
        }
      }
    } catch {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content:
                  "I'm having trouble connecting right now. Please try again in a moment.",
              }
            : m
        ),
      }))
    } finally {
      set({ isLoading: false })
    }
  },

  clearMessages: () => set({ messages: [], isLoading: false }),
}))
