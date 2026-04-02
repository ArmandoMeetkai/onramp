import { test, expect } from "@playwright/test"

test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear IndexedDB so we always start fresh
    await page.goto("/")
    await page.evaluate(() => {
      indexedDB.deleteDatabase("OnrampDB")
    })
    await page.reload()
  })

  test("shows onboarding when no profile exists", async ({ page }) => {
    await page.getByText("Welcome to Onramp").waitFor({
      state: "visible",
      timeout: 10_000,
    })
    await expect(page.getByPlaceholder("What should we call you?")).toBeVisible()
  })

  test("requires name with at least 2 characters", async ({ page }) => {
    await page.getByPlaceholder("What should we call you?").waitFor({
      state: "visible",
      timeout: 10_000,
    })

    // Continue button should be disabled with empty name
    const continueBtn = page.getByRole("button", { name: "Continue" })
    await expect(continueBtn).toBeDisabled()

    // Type 1 character — still disabled
    await page.getByPlaceholder("What should we call you?").fill("A")
    await expect(continueBtn).toBeDisabled()

    // Type 2 characters — enabled
    await page.getByPlaceholder("What should we call you?").fill("Al")
    await expect(continueBtn).toBeEnabled()
  })

  test("completes full 4-step onboarding flow", async ({ page }) => {
    await page.getByPlaceholder("What should we call you?").waitFor({
      state: "visible",
      timeout: 10_000,
    })

    // Step 0: Name
    await page.getByPlaceholder("What should we call you?").fill("Maria")
    await page.getByRole("button", { name: "Continue" }).click()

    // Step 1: Experience
    await expect(page.getByText("How familiar are you with crypto?")).toBeVisible()
    await page.getByText("Completely new").click()
    await page.getByText("Continue", { exact: true }).last().click()

    // Step 2: Risk
    await expect(page.getByText("How do you feel about risk?")).toBeVisible()
    await page.getByText("Play it safe").click()
    await page.getByText("Continue", { exact: true }).last().click()

    // Step 3: Ready
    await expect(page.getByText("You're all set, Maria!")).toBeVisible()
    await expect(page.getByText("Completely new")).toBeVisible()
    await expect(page.getByText("Play it safe")).toBeVisible()

    // Complete onboarding
    await page.getByRole("button", { name: "Start Exploring" }).click()

    // Should see home content with greeting
    await expect(
      page.getByText(/Good (morning|afternoon|evening), Maria/i)
    ).toBeVisible({ timeout: 10_000 })
  })

  test("can go back through steps", async ({ page }) => {
    await page.getByPlaceholder("What should we call you?").waitFor({
      state: "visible",
      timeout: 10_000,
    })

    // Go to step 1
    await page.getByPlaceholder("What should we call you?").fill("Carlos")
    await page.getByRole("button", { name: "Continue" }).click()

    // Go to step 2
    await page.getByText("A little curious").click()
    await page.getByText("Continue", { exact: true }).last().click()

    // Go back to step 1
    await page.getByText("Back").click()
    await expect(page.getByText("How familiar are you with crypto?")).toBeVisible()

    // Go back to step 0
    await page.getByText("Back").click()
    await expect(page.getByPlaceholder("What should we call you?")).toBeVisible()
  })
})
