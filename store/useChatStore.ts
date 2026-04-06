import { create } from "zustand"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  abortController: AbortController | null
  addUserMessage: (content: string) => void
  streamAssistantMessage: (
    userProfile: { experienceLevel: string; riskStyle: string }
  ) => Promise<void>
  abortRequest: () => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  abortController: null,

  addUserMessage: (content) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }
    set((state) => ({ messages: [...state.messages, message] }))
  },

  streamAssistantMessage: async (userProfile) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30_000)

    set({ isLoading: true, abortController: controller })

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
        signal: controller.signal,
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
          } catch (e) {
            if (e instanceof SyntaxError) continue
            throw e
          }
        }
      }
    } catch (e) {
      const isAbort = e instanceof DOMException && e.name === "AbortError"
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: m.content || (isAbort
                  ? "Request cancelled."
                  : "I'm having trouble connecting right now. Please try again in a moment."),
              }
            : m
        ),
      }))
    } finally {
      clearTimeout(timeoutId)
      set({ isLoading: false, abortController: null })
    }
  },

  abortRequest: () => {
    const controller = get().abortController
    if (controller) controller.abort()
    set({ isLoading: false, abortController: null })
  },

  clearMessages: () => set({ messages: [], isLoading: false, abortController: null }),
}))
