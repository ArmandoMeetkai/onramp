import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Chat Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page)
    await page.locator("nav").getByText("Chat").click()
    await page.getByText("Ask Anything").waitFor({ state: "visible" })
  })

  test("shows chat page with title and disclaimer", async ({ page }) => {
    await expect(page.getByText("Ask Anything")).toBeVisible()
    await expect(
      page.getByText(/here to help you learn/i)
    ).toBeVisible()
    await expect(
      page.getByText(/AI learning assistant/i)
    ).toBeVisible()
  })

  test("shows starter question buttons when no messages", async ({ page }) => {
    await expect(page.getByText("What is Bitcoin?")).toBeVisible()
    await expect(page.getByText("Is crypto safe?")).toBeVisible()
    await expect(page.getByText("How do I start?")).toBeVisible()
  })

  test("shows empty state prompt", async ({ page }) => {
    await expect(
      page.getByText(/Ask me anything about crypto/i)
    ).toBeVisible()
  })

  test("has chat input field", async ({ page }) => {
    const input = page.getByPlaceholder("Ask anything about crypto...")
    await expect(input).toBeVisible()
  })

  test("clicking starter question sends a message", async ({ page }) => {
    // Mock the chat API to avoid real API calls
    await page.route("**/api/chat", async (route) => {
      const encoder = new TextEncoder()
      const body = encoder.encode(
        "data: Bitcoin is a decentralized digital currency.\n\n"
      )
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: Buffer.from(body),
      })
    })

    await page.getByText("What is Bitcoin?").click()

    // Starter buttons should disappear once a message is sent
    // and the user message should be in the chat
    await expect(page.getByText(/Ask me anything about crypto/i)).not.toBeVisible({
      timeout: 5_000,
    })
  })
})
