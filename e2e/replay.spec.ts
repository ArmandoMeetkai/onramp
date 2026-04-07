import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Scenario Replay — Time Travel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page)
  })

  test("replay hub shows all events", async ({ page }) => {
    await page.goto("/replay")
    await page.getByText("Time Travel").first().waitFor({ state: "visible" })

    await expect(page.getByText("The Terra Luna Collapse")).toBeVisible()
    await expect(page.getByText("The Bitcoin Halving")).toBeVisible()
    await expect(page.getByText("The FTX Collapse")).toBeVisible()
    await expect(page.getByText("Bitcoin's All-Time High")).toBeVisible()
    await expect(page.getByText("The Ethereum Merge")).toBeVisible()
  })

  test("replay hub filter buttons work", async ({ page }) => {
    await page.goto("/replay")
    await page.getByText("Time Travel").first().waitFor({ state: "visible" })

    // Filter by Crashes
    await page.getByRole("button", { name: "Crashes" }).click()
    await expect(page.getByText("The Terra Luna Collapse")).toBeVisible()
    await expect(page.getByText("The FTX Collapse")).toBeVisible()
    // Milestones should not be visible
    await expect(page.getByText("The Bitcoin Halving")).not.toBeVisible()

    // Filter by Milestones
    await page.getByRole("button", { name: "Milestones" }).click()
    await expect(page.getByText("The Bitcoin Halving")).toBeVisible()
    await expect(page.getByText("Bitcoin's All-Time High")).toBeVisible()
  })

  test("navigates to replay detail from hub", async ({ page }) => {
    await page.goto("/replay")
    await page.getByText("Time Travel").first().waitFor({ state: "visible" })

    await page.getByText("The Bitcoin Halving").first().click()
    await expect(page).toHaveURL(/\/replay\/bitcoin-halving-2024/)
    await expect(page.getByRole("heading", { name: "The Bitcoin Halving" })).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Begin Replay" })
    ).toBeVisible()
  })

  test("replay intro shows event details", async ({ page }) => {
    await page.goto("/replay/terra-luna-crash")
    await page.getByText("The Terra Luna Collapse").waitFor({ state: "visible" })

    await expect(page.getByText("The Terra Luna Collapse")).toBeVisible()
    await expect(page.getByText(/\$40 billion/)).toBeVisible()
    await expect(page.getByText("LUNA").first()).toBeVisible()
    await expect(page.getByText("Crash")).toBeVisible()
    await expect(page.getByText("This is a real historical event")).toBeVisible()
  })

  test("begin replay starts phase 1", async ({ page }) => {
    await page.goto("/replay/bitcoin-halving-2024")
    await page.getByText("The Bitcoin Halving").waitFor({ state: "visible" })

    await page.getByRole("button", { name: "Begin Replay" }).click()

    // Wait for time travel animation to complete and phase to appear
    await expect(page.getByRole("heading", { name: "The Buildup" })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText("Headlines")).toBeVisible()
  })

  test("full replay flow: navigate phases and make decision", async ({ page }) => {
    await page.goto("/replay/bitcoin-halving-2024")
    await page.getByRole("heading", { name: "The Bitcoin Halving" }).waitFor({ state: "visible" })

    // Start replay
    await page.getByRole("button", { name: "Begin Replay" }).click()

    // Phase 1: The Buildup
    await expect(page.getByRole("heading", { name: "The Buildup" })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText("Headlines")).toBeVisible()
    await page.getByRole("button", { name: "Continue" }).click()

    // Phase 2: Halving Day — has decision prompt
    await expect(page.getByRole("heading", { name: "Halving Day" })).toBeVisible()
    await expect(page.getByText("Your Decision")).toBeVisible()

    // Make a decision
    await page.getByText("Hold and be patient").click()

    // Click reveal
    await page.getByRole("button", { name: "See What Happened" }).click()

    // Outcome phase
    await expect(page.getByText("The Outcome")).toBeVisible()
    await expect(page.getByText("Revealing what happened...")).toBeVisible()

    // Wait for reveal to complete
    await expect(page.getByText("$100 became")).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText("Lessons Learned")).toBeVisible()
    await expect(page.getByText("What experts did")).toBeVisible()
    await expect(page.getByText("What actually happened")).toBeVisible()

    // Completion
    await expect(
      page.getByText("Replay complete! Confidence score updated!")
    ).toBeVisible()
    await expect(page.getByText("Try another replay")).toBeVisible()
  })

  test("home page shows Time Travel quick action", async ({ page }) => {
    await expect(page.getByText("Time travel")).toBeVisible()
    await page.getByText("Time travel").click()
    await expect(page).toHaveURL("/replay")
  })

  test("profile shows replays completed metric", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Test User" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })
    await expect(page.getByText("Replays completed")).toBeVisible()
  })

  test("back button returns from replay detail", async ({ page }) => {
    await page.goto("/replay/terra-luna-crash")
    await page.getByText("The Terra Luna Collapse").waitFor({ state: "visible" })

    await page.getByText("Back").click()
    // Should go back (previous page)
    await expect(page.getByText("Time Travel").first()).toBeVisible({ timeout: 5_000 })
  })
})
