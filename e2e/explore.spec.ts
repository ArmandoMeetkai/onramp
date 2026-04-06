import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Explore & Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page)
    await page.locator("nav").getByText("Explore").click()
    await page.getByRole("heading", { name: "Explore Scenarios" }).waitFor({ state: "visible" })
  })

  test("displays scenario cards", async ({ page }) => {
    await expect(page.getByText("Should I buy Bitcoin right now?")).toBeVisible()
  })

  test("filter buttons work", async ({ page }) => {
    const allButton = page.getByRole("button", { name: "All" })
    await expect(allButton).toBeVisible()

    // Filter by Bitcoin
    await page.getByRole("button", { name: "Bitcoin" }).click()
    const cards = page.locator("[class*='rounded']").filter({ hasText: "BTC" })
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // Filter by Beginner
    await page.getByRole("button", { name: "Beginner" }).click()
    await expect(page.getByText("Should I buy Bitcoin right now?")).toBeVisible()
  })

  test("navigates to scenario detail page", async ({ page }) => {
    await page.getByText("Should I buy Bitcoin right now?").first().click()
    await expect(page).toHaveURL(/\/scenario\/should-i-buy-bitcoin/)

    await expect(page.getByRole("heading", { name: "Should I buy Bitcoin right now?" })).toBeVisible()
    await expect(page.getByText("BTC").first()).toBeVisible()
  })

  test("scenario detail shows probability bar", async ({ page }) => {
    await page.getByText("Should I buy Bitcoin right now?").click()
    await page.waitForURL(/\/scenario\//)

    await expect(page.getByText("What people are seeing")).toBeVisible()
    await expect(page.getByText("Up 45%")).toBeVisible()
    await expect(page.getByText("Down 30%")).toBeVisible()
  })

  test("scenario detail shows simulation slider", async ({ page }) => {
    await page.getByText("Should I buy Bitcoin right now?").click()
    await page.waitForURL(/\/scenario\//)

    await expect(page.getByText("If this had been real...")).toBeVisible()
    await expect(page.getByText("Best case")).toBeVisible()
    await expect(page.getByText("Worst case")).toBeVisible()
  })

  test("scenario detail shows explanation panel", async ({ page }) => {
    await page.getByText("Should I buy Bitcoin right now?").click()
    await page.waitForURL(/\/scenario\//)

    // Toggle explanation panel
    await expect(page.getByText("Explain this simply")).toBeVisible()
    await page.getByText("Explain this simply").click()

    await expect(page.getByText("Why it might go up")).toBeVisible()
    await expect(page.getByText("Why it might go down")).toBeVisible()
    await expect(page.getByText("What to watch for")).toBeVisible()
  })

  test("back button returns to explore", async ({ page }) => {
    await page.getByText("Should I buy Bitcoin right now?").click()
    await page.waitForURL(/\/scenario\//)

    await page.getByText("Back").click()
    await expect(page.getByRole("heading", { name: "Explore Scenarios" })).toBeVisible()
  })

  test("scenario has link to practice", async ({ page }) => {
    await page.getByText("Should I buy Bitcoin right now?").click()
    await page.waitForURL(/\/scenario\//)

    await expect(page.getByText("Go to Practice →")).toBeVisible()
  })
})
