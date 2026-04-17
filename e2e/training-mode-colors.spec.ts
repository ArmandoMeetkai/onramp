import { test } from "@playwright/test"

/**
 * Demo recording — a brand-new user in Training mode enters prediction markets.
 * Focus: show how every visual cue (chip, banner, mode tags, progress bars,
 * prediction form) comes up AMBER — the colour that says "you can train and
 * practice, but not yet stake real testnet tokens".
 */

const PAUSE = 2200
const SHORT = 900
const READ = 3200

test.use({
  video: { mode: "on", size: { width: 390, height: 844 } },
  viewport: { width: 390, height: 844 },
})

test("Training mode — amber colours across predictions as a brand-new user", async ({ page }) => {
  // Narrative has ~50s of pauses for readability — push past the default 30s timeout.
  test.setTimeout(180_000)

  // Clean state → brand-new user
  await page.goto("/")
  await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
  await page.reload()

  // ===== ONBOARDING — keep it short =====
  await page.getByPlaceholder("What should we call you?").waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)
  await page.getByPlaceholder("What should we call you?").fill("Maya")
  await page.waitForTimeout(SHORT)
  await page.getByRole("button", { name: "Continue" }).click()
  await page.waitForTimeout(PAUSE)

  await page.getByText("A little curious").click()
  await page.waitForTimeout(SHORT)
  await page.getByText("Continue", { exact: true }).last().click()
  await page.waitForTimeout(PAUSE)

  await page.getByText("Open to some risk").click()
  await page.waitForTimeout(SHORT)
  await page.getByText("Continue", { exact: true }).last().click()
  await page.waitForTimeout(PAUSE)

  await page.getByRole("button", { name: "Start Exploring" }).click()
  await page.waitForTimeout(PAUSE)

  // ===== HOME — pause on amber mode chip & banner =====
  await page.getByText(/Good (morning|afternoon|evening)/i).first().waitFor({ state: "visible", timeout: 10_000 })
  // Let the user read the Training banner + amber chip in the header.
  await page.waitForTimeout(READ)

  // ===== NAVIGATE TO PREDICTIONS =====
  // Bottom nav: "Predict"
  await page.locator("nav").getByText("Predict").click()
  await page.getByRole("heading", { name: "Predictions" }).waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)

  // Hub walkthrough spotlight appears for new users — let it show for a beat,
  // then dismiss so it doesn't block the video narrative.
  await page.waitForTimeout(READ)
  const hubSkip = page.getByRole("button", { name: /Skip intro/i })
  if (await hubSkip.isVisible({ timeout: 1500 }).catch(() => false)) {
    await hubSkip.click()
    await page.waitForTimeout(PAUSE)
  }

  // Scroll gently so the $1,000 balance chip + the first market are both visible
  await page.evaluate(() => window.scrollBy(0, 180))
  await page.waitForTimeout(PAUSE)

  // ===== OPEN A MARKET — show amber cues inside the stake form =====
  // First market card
  await page.locator("a[href^='/predictions/']").first().click()
  await page.waitForTimeout(PAUSE)

  // Let the detail page settle; walkthrough overlay may appear — skip it if so
  const skipBtn = page.getByRole("button", { name: /Skip intro/i })
  if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await skipBtn.click()
    await page.waitForTimeout(SHORT)
  }

  // Scroll to the "Make your prediction" form where the amber ModeTag lives
  await page.evaluate(() => {
    const form = document.getElementById("pred-form-section")
    if (form) form.scrollIntoView({ behavior: "smooth", block: "center" })
  })
  await page.waitForTimeout(READ)

  // Scroll a touch further to show the amber "Your BTC balance" ModeTag row
  await page.evaluate(() => window.scrollBy(0, 160))
  await page.waitForTimeout(READ)

  // ===== BACK TO HUB — reinforce the amber narrative =====
  await page.goBack()
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(READ)

  // ===== WALLET GATE — amber progress bars across the graduation gate =====
  // A brand-new user hitting /wallet is the amber story's climax: everything
  // on the gate screen is amber because they're still in Training.
  await page.goto("/wallet")
  await page.getByRole("heading", { name: /Unlock your crypto wallet/i }).waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)

  // Scroll slowly through the 3 milestone cards so the amber fills are visible
  await page.evaluate(() => window.scrollBy(0, 180))
  await page.waitForTimeout(READ)
  await page.evaluate(() => window.scrollBy(0, 180))
  await page.waitForTimeout(READ)

  // End scrolled back to top to let the amber aggregate bar close the video
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(READ)
})
