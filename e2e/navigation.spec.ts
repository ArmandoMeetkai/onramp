import { test, expect } from "@playwright/test"
import { completeOnboarding } from "./helpers"

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
    await page.reload()
    await completeOnboarding(page)
  })

  test("bottom nav has 5 tabs", async ({ page }) => {
    const nav = page.locator("nav")
    await expect(nav).toBeVisible()

    await expect(nav.getByText("Home")).toBeVisible()
    await expect(nav.getByText("Explore")).toBeVisible()
    await expect(nav.getByText("Practice")).toBeVisible()
    await expect(nav.getByText("Learn")).toBeVisible()
    await expect(nav.getByText("Chat")).toBeVisible()
  })

  test("navigates to Explore page", async ({ page }) => {
    await page.locator("nav").getByText("Explore").click()
    await expect(page.getByText("Explore Scenarios")).toBeVisible()
    await expect(page).toHaveURL("/explore")
  })

  test("navigates to Practice page", async ({ page }) => {
    await page.locator("nav").getByText("Practice").click()
    await expect(
      page.getByRole("heading", { name: "Practice Portfolio" })
    ).toBeVisible({ timeout: 10_000 })
    await expect(page).toHaveURL("/practice")
  })

  test("navigates to Learn page", async ({ page }) => {
    await page.locator("nav").getByText("Learn").click()
    await expect(page.getByText("Learn at Your Pace")).toBeVisible()
    await expect(page).toHaveURL("/learn")
  })

  test("navigates to Chat page", async ({ page }) => {
    await page.locator("nav").getByText("Chat").click()
    await expect(page.getByRole("heading", { name: "Ask Anything" })).toBeVisible()
    await expect(page).toHaveURL("/chat")
  })

  test("navigates back to Home", async ({ page }) => {
    await page.locator("nav").getByText("Explore").click()
    await expect(page).toHaveURL("/explore")

    await page.locator("nav").getByText("Home").click()
    await expect(page).toHaveURL("/")
    await expect(
      page.getByRole("heading", { name: /Good (morning|afternoon|evening)/i })
    ).toBeVisible()
  })

  test("home shows quick action cards", async ({ page }) => {
    await expect(page.getByText("Explore scenarios")).toBeVisible()
    await expect(page.getByText("Practice trading")).toBeVisible()
    await expect(page.getByText("Ask a question")).toBeVisible()
  })

  test("quick action cards navigate correctly", async ({ page }) => {
    await page.getByText("Explore scenarios").click()
    await expect(page).toHaveURL("/explore")
  })
})
