import posthog from "posthog-js"

let initialized = false

export function initAnalytics() {
  if (
    initialized ||
    typeof window === "undefined" ||
    !process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    return
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: false,
  })
  initialized = true
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  posthog.capture(event, properties)
}

// Pre-defined events for type safety
export const events = {
  onboardingStarted: () => trackEvent("onboarding_started"),
  onboardingCompleted: (experience: string, risk: string) =>
    trackEvent("onboarding_completed", { experience, risk }),
  lessonViewed: (lessonId: string) =>
    trackEvent("lesson_viewed", { lesson_id: lessonId }),
  lessonCompleted: (lessonId: string) =>
    trackEvent("lesson_completed", { lesson_id: lessonId }),
  replayStarted: (eventId: string) =>
    trackEvent("replay_started", { event_id: eventId }),
  replayCompleted: (eventId: string, decision: string) =>
    trackEvent("replay_completed", { event_id: eventId, decision }),
  tradeExecuted: (action: string, asset: string, amount: number) =>
    trackEvent("trade_executed", { action, asset, amount }),
  chatMessageSent: () => trackEvent("chat_message_sent"),
  scenarioViewed: (scenarioId: string) =>
    trackEvent("scenario_viewed", { scenario_id: scenarioId }),
  waitlistJoined: () => trackEvent("waitlist_joined"),
} as const
