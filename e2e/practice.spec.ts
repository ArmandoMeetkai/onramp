import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Practice Portfolio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page)
    await page.locator("nav").getByText("Practice").click()
    await page.getByRole("heading", { name: "Practice Portfolio" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })
  })

  test("shows simulation disclaimer", async ({ page }) => {
    await expect(
      page.getByText("This is a simulation. No real money is involved.").first()
    ).toBeVisible()
  })

  test("starts with $10,000 balance", async ({ page }) => {
    await expect(page.getByText("$10,000.00").first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test("shows current prices section", async ({ page }) => {
    await expect(page.getByText("Current Prices")).toBeVisible()
    await expect(page.getByText("Bitcoin").first()).toBeVisible()
    await expect(page.getByText("Ethereum").first()).toBeVisible()
    await expect(page.getByText("Solana").first()).toBeVisible()
  })

  test("shows first-time explainer card", async ({ page }) => {
    await expect(page.getByText("How this works")).toBeVisible()
    await expect(
      page.getByText(/\$10,000 in play money/)
    ).toBeVisible()
  })

  test("shows empty portfolio state", async ({ page }) => {
    await expect(page.getByText("Ready to practice?")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Start Practicing" })
    ).toBeVisible()
  })

  test("opens trade sheet when clicking Start Practicing", async ({ page }) => {
    await page.getByRole("button", { name: "Start Practicing" }).click()

    await expect(page.getByText("Choose a cryptocurrency")).toBeVisible()
    await expect(page.getByText("Bitcoin").first()).toBeVisible()
    await expect(page.getByText("Ethereum").first()).toBeVisible()
    await expect(page.getByText("Solana").first()).toBeVisible()
  })

  test("trade sheet: select asset shows action step", async ({ page }) => {
    await page.getByRole("button", { name: "Start Practicing" }).click()
    await page.getByText("Choose a cryptocurrency").waitFor({ state: "visible" })

    // Select Bitcoin from the trade sheet list
    await page
      .locator("button")
      .filter({ hasText: "Bitcoin" })
      .filter({ hasText: "The first cryptocurrency" })
      .click()

    await expect(page.getByText(/What would you like to do/i)).toBeVisible()
    await expect(page.getByRole("button", { name: "Buy" })).toBeVisible()
  })

  test("trade sheet: full buy flow", async ({ page }) => {
    await page.getByRole("button", { name: "Start Practicing" }).click()

    // Step 1: Select Bitcoin
    await page.getByText("Choose a cryptocurrency").waitFor({ state: "visible" })
    await page
      .locator("button")
      .filter({ hasText: "Bitcoin" })
      .filter({ hasText: "The first cryptocurrency" })
      .click()

    // Step 2: Choose Buy
    await page.getByRole("button", { name: "Buy" }).click()

    // Step 3: Enter amount
    await expect(page.getByText("How much to buy?")).toBeVisible()
    await page.getByRole("button", { name: "$50" }).click()
    await expect(page.getByText(/You'll receive/i)).toBeVisible()
    await page.getByRole("button", { name: /Review Purchase/i }).click()

    // Step 4: Confirm
    await expect(page.getByText("Confirm your buy")).toBeVisible()
    await expect(page.getByText("$50.00")).toBeVisible()
    await page.getByRole("button", { name: /Confirm Purchase/i }).click()

    // Step 5: Success
    await expect(page.getByText("Purchase complete!")).toBeVisible()
    await page.getByRole("button", { name: "Done" }).click()

    // Portfolio should now show holdings — balance should be around $9,950
    await expect(page.getByText("Ready to practice?")).not.toBeVisible()
    await expect(page.getByText("$9,950.00")).toBeVisible({ timeout: 5_000 })
  })

  test("can select different coins to view chart", async ({ page }) => {
    // Click ETH price card
    await page
      .locator("button")
      .filter({ hasText: "Ethereum" })
      .filter({ hasText: "ETH" })
      .first()
      .click()
    await expect(page.getByText(/Last 7 days/)).toBeVisible()
  })

  test("shows transaction history section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Transaction History/i })
    ).toBeVisible()
  })

  test("shows learn chips", async ({ page }) => {
    await expect(page.getByText("Not sure what any of this means?")).toBeVisible()
  })
})
