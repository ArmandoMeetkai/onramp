import { test } from "@playwright/test"

/**
 * Demo recording — a graduated user (green / Live mode) claims testnet tokens
 * from the faucet on all three chains (ETH, SOL, BTC) and then stakes on a
 * market. Focus: the full "after graduation" loop — claim, return, stake,
 * confirm — showing the Live · testnet visual language throughout.
 */

const SHORT = 900
const PAUSE = 2200
const READ = 3200

test.use({
  video: { mode: "on", size: { width: 390, height: 844 } },
  viewport: { width: 390, height: 844 },
})

test("Live mode — claim ETH/SOL/BTC from the faucet and stake a prediction", async ({ page }) => {
  test.setTimeout(240_000)

  // Clean state → brand-new user
  await page.goto("/")
  await page.evaluate(() => indexedDB.deleteDatabase("OnrampDB"))
  await page.reload()

  // ===== ONBOARDING — quick pass =====
  await page.getByPlaceholder("What should we call you?").waitFor({ state: "visible", timeout: 10_000 })
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

  // ===== FAST-FORWARD TO "READY" via Dexie seeding =====
  // Simulate "already did all the studies": bump progress + seed 2 predictions.
  // Keeps the demo focused on the claim→stake loop, not on completing lessons.
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.open("OnrampDB")
      req.onsuccess = () => {
        const db = req.result
        const getProfileTx = db.transaction(["profiles"], "readonly")
        const profileReq = getProfileTx.objectStore("profiles").getAll()
        profileReq.onsuccess = () => {
          const profile = profileReq.result[0]
          if (!profile) { resolve(); return }
          const userId = profile.id

          const tx = db.transaction(["progress", "userPredictions"], "readwrite")

          tx.objectStore("progress").put({
            userId,
            cardsViewed: 12,
            simulationsRun: 4,
            explanationsOpened: 6,
            replaysCompleted: 1,
            streakDays: 3,
            lastStreakDate: new Date().toISOString().slice(0, 10),
            confidenceScore: 62,
            lessonsCompleted: ["lesson-1", "lesson-2", "lesson-3"],
          })

          tx.objectStore("userPredictions").put({
            id: "seed-1", userId, marketId: "btc-weekly-20260413",
            position: "yes", asset: "BTC", cryptoAmount: 0.001,
            priceAtPrediction: 70000, timestamp: new Date(),
            resolved: false, payoutCrypto: null,
          })
          tx.objectStore("userPredictions").put({
            id: "seed-2", userId, marketId: "eth-above-5k-2026-09",
            position: "no", asset: "ETH", cryptoAmount: 0.01,
            priceAtPrediction: 3500, timestamp: new Date(),
            resolved: false, payoutCrypto: null,
          })

          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }
      req.onerror = () => reject(req.error)
    })
  })
  await page.reload()
  await page.waitForTimeout(PAUSE)

  // ===== HOME — now "Ready" state (primary/green Ready chip) =====
  await page.getByText(/Good (morning|afternoon|evening)/i).first().waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(READ)

  // ===== WALLET — create the testnet wallet with welcome bonus =====
  await page.goto("/wallet")
  await page.getByRole("heading", { name: "You did it!" }).waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(READ)

  // First click — page-level button opens the setup sheet
  await page.getByRole("button", { name: "Create my wallet" }).click()
  await page.waitForTimeout(READ) // setup sheet explanation + welcome bonus

  // Sheet's own confirm button — there are now 2 buttons with the same name;
  // the sheet (Radix dialog) is on top, so .last() reliably hits that one.
  await page.getByRole("button", { name: "Create my wallet" }).last().click()
  await page.waitForTimeout(READ) // keypair generation + success screen

  // Close success screen → land on WalletDashboard
  const getStartedBtn = page.getByRole("button", { name: /Get started/i })
  if (await getStartedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await getStartedBtn.click()
    await page.waitForTimeout(PAUSE)
  }

  // Let the user see the welcome bonus balance on the WalletBalance card
  await page.waitForTimeout(READ)

  // Capture the Ethereum address so we can pre-fill the faucet inputs with the user's own
  const ethAddress = await page.evaluate(async () => {
    return new Promise<string>((resolve) => {
      const req = indexedDB.open("OnrampDB")
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction(["testnetWallets"], "readonly")
        const store = tx.objectStore("testnetWallets")
        const getAll = store.getAll()
        getAll.onsuccess = () => resolve(getAll.result[0]?.address ?? "")
      }
      req.onerror = () => resolve("")
    })
  })

  // ===== FAUCET — claim ETH =====
  // Go directly with the user's own address pre-filled via ?address=
  // (avoids the new-tab flow so the recording stays on one tab)
  await page.goto(`/faucet?chain=ethereum&address=${encodeURIComponent(ethAddress)}`)
  await page.locator("input[type='text']").first().waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(READ)
  await page.getByRole("button", { name: /Send/i }).first().click()
  await page.waitForTimeout(READ + 1500) // simulated network delay + success screen

  // ===== BACK TO WALLET — balance updated after drain =====
  await page.goto("/wallet")
  await page.waitForTimeout(READ)

  // ===== FAUCET — claim SOL =====
  // Solana address differs — capture it now
  const solAddress = await page.evaluate(async () => {
    return new Promise<string>((resolve) => {
      const req = indexedDB.open("OnrampDB")
      req.onsuccess = () => {
        const tx = req.result.transaction(["testnetWallets"], "readonly")
        const r = tx.objectStore("testnetWallets").getAll()
        r.onsuccess = () => resolve(r.result[0]?.solana?.address ?? "")
      }
      req.onerror = () => resolve("")
    })
  })

  await page.goto(`/faucet?chain=solana&address=${encodeURIComponent(solAddress)}`)
  await page.locator("input[type='text']").first().waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(READ)
  await page.getByRole("button", { name: /Send/i }).first().click()
  await page.waitForTimeout(READ + 1500)

  await page.goto("/wallet")
  await page.waitForTimeout(READ)

  // ===== FAUCET — claim BTC =====
  const btcAddress = await page.evaluate(async () => {
    return new Promise<string>((resolve) => {
      const req = indexedDB.open("OnrampDB")
      req.onsuccess = () => {
        const tx = req.result.transaction(["testnetWallets"], "readonly")
        const r = tx.objectStore("testnetWallets").getAll()
        r.onsuccess = () => resolve(r.result[0]?.bitcoin?.address ?? "")
      }
      req.onerror = () => resolve("")
    })
  })

  await page.goto(`/faucet?chain=bitcoin&address=${encodeURIComponent(btcAddress)}`)
  await page.locator("input[type='text']").first().waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(READ)
  await page.getByRole("button", { name: /Send/i }).first().click()
  await page.waitForTimeout(READ + 1500)

  await page.goto("/wallet")
  await page.waitForTimeout(READ)

  // ===== PREDICTIONS — Live tags across the UI =====
  await page.goto("/predictions")
  await page.getByRole("heading", { name: "Predictions" }).waitFor({ state: "visible", timeout: 10_000 })
  await page.waitForTimeout(READ)

  // Dismiss any hub walkthrough that might still render
  const hubSkip = page.getByRole("button", { name: /Skip intro/i })
  if (await hubSkip.isVisible({ timeout: 1500 }).catch(() => false)) {
    await hubSkip.click()
    await page.waitForTimeout(PAUSE)
  }

  // Scroll to show the list with green "Live · testnet" tags + user prediction markers
  await page.evaluate(() => window.scrollBy(0, 180))
  await page.waitForTimeout(READ)

  // ===== OPEN A MARKET + STAKE =====
  // Pick a market the seeded predictions didn't touch so the form is active
  const candidateMarket = page.locator("a[href^='/predictions/']").filter({ hasNotText: /You:/i }).first()
  await candidateMarket.click()
  await page.waitForTimeout(PAUSE)

  // Dismiss form walkthrough overlay if visible
  const formSkip = page.getByRole("button", { name: /Skip intro/i })
  if (await formSkip.isVisible({ timeout: 1500 }).catch(() => false)) {
    await formSkip.click()
    await page.waitForTimeout(PAUSE)
  }

  // Scroll to the stake form
  await page.evaluate(() => {
    const form = document.getElementById("pred-form-section")
    if (form) form.scrollIntoView({ behavior: "smooth", block: "center" })
  })
  await page.waitForTimeout(READ)

  // Select YES
  const yesBtn = page.getByRole("button", { name: /^YES$/ })
  if (await yesBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await yesBtn.click()
    await page.waitForTimeout(PAUSE)
  }

  // Pick a $25 preset amount
  const preset25 = page.getByRole("button", { name: /^\$25/ }).first()
  if (await preset25.isVisible({ timeout: 2000 }).catch(() => false)) {
    await preset25.click()
    await page.waitForTimeout(PAUSE)
  }

  // Stake button
  const stakeBtn = page.getByRole("button", { name: /^Stake/i }).first()
  if (await stakeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await stakeBtn.click()
    await page.waitForTimeout(READ)
  }

  // Let the confirmation card + green Live · testnet tag on "Prediction placed!" shine
  await page.waitForTimeout(READ)
})
