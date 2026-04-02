import type { Page } from "@playwright/test"

/**
 * Complete the onboarding flow so the user has a profile.
 * Call this before testing any authenticated page.
 */
export async function completeOnboarding(
  page: Page,
  options: {
    name?: string
    experience?: "new" | "curious" | "cautious" | "active"
    risk?: "conservative" | "moderate" | "aggressive"
  } = {}
) {
  const {
    name = "Test User",
    experience = "curious",
    risk = "moderate",
  } = options

  await page.goto("/")

  // Step 0: Welcome — enter name
  const nameInput = page.getByPlaceholder("What should we call you?")
  await nameInput.waitFor({ state: "visible", timeout: 10_000 })
  await nameInput.fill(name)
  await page.getByRole("button", { name: "Continue" }).click()

  // Step 1: Experience level
  const experienceLabels: Record<string, string> = {
    new: "Completely new",
    curious: "A little curious",
    cautious: "Cautious but interested",
    active: "Somewhat active",
  }
  await page.getByText(experienceLabels[experience], { exact: false }).click()
  await page.getByText("Continue", { exact: true }).last().click()

  // Step 2: Risk style
  const riskLabels: Record<string, string> = {
    conservative: "Play it safe",
    moderate: "Open to some risk",
    aggressive: "Comfortable with uncertainty",
  }
  await page.getByText(riskLabels[risk], { exact: false }).click()
  await page.getByText("Continue", { exact: true }).last().click()

  // Step 3: Ready — finish
  await page.getByRole("button", { name: "Start Exploring" }).click()

  // Wait for home content to render
  await page.getByText(/Good (morning|afternoon|evening)/i).waitFor({
    state: "visible",
    timeout: 10_000,
  })
}
