import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Learn & Lessons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page)
    await page.locator("nav").getByText("Learn").click()
    await page.getByText("Learn at Your Pace").waitFor({ state: "visible" })
  })

  test("shows lesson list with progress", async ({ page }) => {
    await expect(page.getByText("Start learning")).toBeVisible()
    await expect(page.getByText("0%")).toBeVisible()
    await expect(page.getByText("What is Bitcoin, really?")).toBeVisible()
  })

  test("shows all lessons", async ({ page }) => {
    await expect(page.getByText("What is Bitcoin, really?")).toBeVisible()
    await expect(page.getByText("What is a blockchain?")).toBeVisible()
  })

  test("navigates to lesson detail", async ({ page }) => {
    await page.getByText("What is Bitcoin, really?").click()
    await expect(page).toHaveURL(/\/learn\/what-is-bitcoin/)

    // Lesson title in hero card
    await expect(
      page.getByRole("heading", { name: "What is Bitcoin, really?" })
    ).toBeVisible()
    await expect(page.getByText("Key Takeaway")).toBeVisible()
  })

  test("lesson shows content paragraphs", async ({ page }) => {
    await page.getByText("What is Bitcoin, really?").click()
    await page.waitForURL(/\/learn\/what-is-bitcoin/)

    await expect(page.getByText(/digital money/i).first()).toBeVisible()
    await expect(page.getByText(/Satoshi Nakamoto/i).first()).toBeVisible()
  })

  test("can mark lesson as complete", async ({ page }) => {
    await page.getByText("What is Bitcoin, really?").click()
    await page.waitForURL(/\/learn\/what-is-bitcoin/)

    const completeBtn = page.getByRole("button", {
      name: "Mark as Complete",
    })
    await expect(completeBtn).toBeVisible()
    await completeBtn.click()

    // Should show completion message
    await expect(page.getByText("Lesson complete!")).toBeVisible({ timeout: 10_000 })

    // After redirect, progress should update
    await page.waitForURL("/learn", { timeout: 10_000 })
    await expect(page.getByText(/1 of/)).toBeVisible()
  })

  test("lesson shows related scenarios", async ({ page }) => {
    await page.getByText("What is Bitcoin, really?").click()
    await page.waitForURL(/\/learn\/what-is-bitcoin/)

    await expect(page.getByText("Try these scenarios")).toBeVisible()
    await expect(
      page.getByText("Should I buy Bitcoin right now?")
    ).toBeVisible()
  })

  test("lesson shows next lesson link", async ({ page }) => {
    await page.getByText("What is Bitcoin, really?").click()
    await page.waitForURL(/\/learn\/what-is-bitcoin/)

    await expect(page.getByText("Next lesson")).toBeVisible()
    await expect(page.getByText("What is a blockchain?")).toBeVisible()
  })

  test("back button returns to learn page", async ({ page }) => {
    await page.getByText("What is Bitcoin, really?").click()
    await page.waitForURL(/\/learn\/what-is-bitcoin/)

    await page.getByText("Back").click()
    await expect(page.getByText("Learn at Your Pace")).toBeVisible()
  })
})
