import { test } from "@playwright/test"

const PAUSE = 2000
const SHORT = 1000

test.use({
  video: { mode: "on", size: { width: 390, height: 844 } },
  viewport: { width: 390, height: 844 },
})

test("Full app demo walkthrough", async ({ page }) => {
  // Clean state
  await page.goto("/")
  await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
  await page.reload()

  // ===== ONBOARDING =====
  await page.getByPlaceholder("What should we call you?").waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)

  // Type name slowly
  await page.getByPlaceholder("What should we call you?").fill("Alex")
  await page.waitForTimeout(SHORT)
  await page.getByRole("button", { name: "Continue" }).click()
  await page.waitForTimeout(PAUSE)

  // Experience
  await page.getByText("A little curious").click()
  await page.waitForTimeout(SHORT)
  await page.getByText("Continue", { exact: true }).last().click()
  await page.waitForTimeout(PAUSE)

  // Risk
  await page.getByText("Open to some risk").click()
  await page.waitForTimeout(SHORT)
  await page.getByText("Continue", { exact: true }).last().click()
  await page.waitForTimeout(PAUSE)

  // Ready
  await page.getByRole("button", { name: "Start Exploring" }).click()
  await page.waitForTimeout(PAUSE)

  // ===== HOME =====
  await page.getByText(/Good (morning|afternoon|evening)/i).first().waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)

  // Scroll down to see quick actions
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(SHORT)

  // ===== EXPLORE =====
  await page.locator("nav").getByText("Explore").click()
  await page.getByText("Explore Scenarios").waitFor({ state: "visible" })
  await page.waitForTimeout(PAUSE)

  // Filter by Bitcoin
  await page.getByRole("button", { name: "Bitcoin" }).click()
  await page.waitForTimeout(SHORT)
  await page.getByRole("button", { name: "All" }).click()
  await page.waitForTimeout(SHORT)

  // Open a scenario
  await page.getByText("Should I buy Bitcoin right now?").click()
  await page.waitForTimeout(PAUSE)

  // Scroll through scenario
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(PAUSE)

  // Open explanation
  const explainBtn = page.getByText("Explain this simply")
  if (await explainBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await explainBtn.click()
    await page.waitForTimeout(PAUSE)
    await page.evaluate(() => window.scrollBy(0, 400))
    await page.waitForTimeout(PAUSE)
  }

  // Go back
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(SHORT)
  await page.getByText("Back").click()
  await page.waitForTimeout(SHORT)

  // ===== PRACTICE PORTFOLIO =====
  await page.locator("nav").getByText("Practice").click()
  await page.getByRole("heading", { name: "Practice Portfolio" }).waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)

  // Scroll to see prices
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(PAUSE)

  // Click on ETH price card
  await page.locator("button").filter({ hasText: "Ethereum" }).filter({ hasText: "ETH" }).first().click()
  await page.waitForTimeout(PAUSE)

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(SHORT)

  // Start practicing - buy flow
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(SHORT)
  await page.evaluate(() => window.scrollBy(0, 500))
  await page.waitForTimeout(SHORT)

  const startBtn = page.getByRole("button", { name: "Start Practicing" })
  if (await startBtn.isVisible()) {
    await startBtn.click()
    await page.waitForTimeout(SHORT)

    // Select Bitcoin
    const btcButton = page.locator("button").filter({ hasText: "Bitcoin" }).filter({ hasText: "The first cryptocurrency" })
    await btcButton.waitFor({ state: "visible" })
    await btcButton.click({ force: true })
    await page.waitForTimeout(SHORT)

    // Buy
    await page.getByRole("button", { name: "Buy" }).dispatchEvent("click")
    await page.waitForTimeout(SHORT)

    // $50
    await page.getByRole("button", { name: "$50" }).dispatchEvent("click")
    await page.waitForTimeout(SHORT)

    // Review
    await page.getByRole("button", { name: /Review Purchase/i }).dispatchEvent("click")
    await page.waitForTimeout(PAUSE)

    // Confirm
    await page.getByRole("button", { name: /Confirm Purchase/i }).dispatchEvent("click")
    await page.waitForTimeout(PAUSE)

    // Done
    await page.getByRole("button", { name: "Done" }).dispatchEvent("click")
    await page.waitForTimeout(PAUSE)
  }

  // ===== LEARN =====
  await page.locator("nav").getByText("Learn").click()
  await page.getByText("Learn at Your Pace").waitFor({ state: "visible" })
  await page.waitForTimeout(PAUSE)

  // Open first lesson
  await page.getByText("What is Bitcoin, really?").click()
  await page.waitForTimeout(PAUSE)

  // Scroll through lesson
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)

  // Go back
  await page.getByText("Back").click()
  await page.waitForTimeout(SHORT)

  // ===== REPLAY (TIME TRAVEL) =====
  await page.goto("/replay")
  await page.getByText("Time Travel").first().waitFor({ state: "visible" })
  await page.waitForTimeout(PAUSE)

  // Open Bitcoin Halving replay
  await page.getByText("The Bitcoin Halving").click()
  await page.waitForTimeout(PAUSE)

  // Begin replay
  await page.getByRole("button", { name: "Begin Replay" }).click()
  await page.waitForTimeout(3000) // Time travel animation

  // Phase 1
  await page.getByRole("heading", { name: "The Buildup" }).waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(PAUSE)
  await page.getByRole("button", { name: "Continue" }).click()
  await page.waitForTimeout(PAUSE)

  // Phase 2 - Decision
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(PAUSE)

  // Make decision
  await page.getByText("Hold and be patient").click()
  await page.waitForTimeout(PAUSE)

  await page.getByRole("button", { name: "See What Happened" }).click()
  await page.waitForTimeout(3000) // Reveal animation

  // Outcome
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)

  // ===== CHAT =====
  await page.locator("nav").getByText("Chat").click()
  await page.getByText("Ask Anything").waitFor({ state: "visible" })
  await page.waitForTimeout(PAUSE)

  // Show starter questions
  await page.waitForTimeout(PAUSE)

  // ===== PROFILE =====
  await page.goto("/profile")
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 300))
  await page.waitForTimeout(PAUSE)

  // ===== READY PAGE =====
  await page.goto("/ready")
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)
  await page.evaluate(() => window.scrollBy(0, 400))
  await page.waitForTimeout(PAUSE)

  // Final pause
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(PAUSE)
})
