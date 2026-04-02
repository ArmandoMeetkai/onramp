import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page, {
      name: "Maria",
      experience: "curious",
      risk: "moderate",
    })
  })

  test("shows user name and profile badges", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Maria" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })

    await expect(page.getByRole("heading", { name: "Maria" })).toBeVisible()
    await expect(page.getByText("A little curious")).toBeVisible()
    await expect(page.getByText("Moderate")).toBeVisible()
  })

  test("shows confidence score", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Maria" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })

    // ConfidenceScore shows "Just starting" for score 0
    await expect(page.getByText("Just starting")).toBeVisible()
    await expect(page.getByText("of 100")).toBeVisible()
  })

  test("shows streak badge", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Maria" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })

    await expect(page.getByText("Start your streak")).toBeVisible()
  })

  test("shows activity metrics", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Maria" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })

    await expect(page.getByText("Your Activity")).toBeVisible()
    await expect(page.getByText("Scenarios explored")).toBeVisible()
    await expect(page.getByText("Simulations run")).toBeVisible()
    await expect(page.getByText("Lessons completed")).toBeVisible()
    await expect(page.getByText("Explanations read")).toBeVisible()
  })

  test("shows member since date", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Maria" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })

    await expect(page.getByText(/Member since/i)).toBeVisible()
  })

  test("activity metrics start at 0", async ({ page }) => {
    await page.goto("/profile")
    await page.getByRole("heading", { name: "Maria" }).waitFor({
      state: "visible",
      timeout: 10_000,
    })

    const zeros = page.locator("text=0")
    const count = await zeros.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })
})
