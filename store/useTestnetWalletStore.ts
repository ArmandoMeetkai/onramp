import { create } from "zustand"
import { privateKeyToAccount } from "viem/accounts"
import { db, type TestnetWallet, type TestnetTransaction, type TestnetChain } from "@/lib/db"
import { encryptPrivateKey } from "@/lib/crypto"

const DEFAULT_BALANCES = { ethereum: "0", solana: 0, bitcoin: 0 }

interface ChainBalances {
  ethereum: bigint | null
  solana: number | null
  bitcoin: number | null
}

interface TestnetWalletState {
  wallet: TestnetWallet | null
  balances: ChainBalances
  transactions: TestnetTransaction[]
  activeChain: TestnetChain
  isCreating: boolean
  isFetchingBalance: boolean

  hydrate: (userId: string) => Promise<void>
  createWallet: (userId: string) => Promise<void>
  setActiveChain: (chain: TestnetChain) => void
  fetchBalance: (chain?: TestnetChain) => Promise<void>
  fetchAllBalances: () => Promise<void>
  creditBalance: (chain: TestnetChain, amount: string) => Promise<void>
  debitBalance: (chain: TestnetChain, amount: string) => Promise<boolean>
  sendTransaction: (chain: TestnetChain, to: string, amount: string) => Promise<string | null>
  addTransaction: (tx: TestnetTransaction) => Promise<void>
  getActiveAddress: () => string | null
  resetWallet: () => Promise<void>
}

export const useTestnetWalletStore = create<TestnetWalletState>((set, get) => ({
  wallet: null,
  balances: { ethereum: null, solana: null, bitcoin: null },
  transactions: [],
  activeChain: "ethereum",
  isCreating: false,
  isFetchingBalance: false,

  hydrate: async (userId) => {
    try {
      const wallet = await db.testnetWallets.get(userId)
      if (wallet) {
        const transactions = await db.testnetTransactions
          .where("userId")
          .equals(userId)
          .reverse()
          .sortBy("timestamp")

        // Load persisted balances
        const wb = wallet.balances ?? DEFAULT_BALANCES
        const balances: ChainBalances = {
          ethereum: BigInt(wb.ethereum ?? "0"),
          solana: wb.solana ?? 0,
          bitcoin: wb.bitcoin ?? 0,
        }

        // Migrate: add Solana/Bitcoin keys if missing
        if (!wallet.solana || !wallet.bitcoin) {
          const updated = { ...wallet }
          if (!updated.solana) {
            const { generateSolKeypair } = await import("@/lib/solana")
            const solKeypair = generateSolKeypair()
            const solKeyHex = Array.from(solKeypair.secretKey)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")
            const solEncrypted = await encryptPrivateKey(solKeyHex, wallet.userId)
            updated.solana = {
              address: solKeypair.publicKey,
              encryptedKey: solEncrypted.ciphertext,
              salt: solEncrypted.salt,
              iv: solEncrypted.iv,
            }
          }
          if (!updated.bitcoin) {
            const { generateBtcKeypair } = await import("@/lib/bitcoin")
            const btcKeypair = generateBtcKeypair()
            const btcEncrypted = await encryptPrivateKey(btcKeypair.privateKey, wallet.userId)
            updated.bitcoin = {
              address: btcKeypair.address,
              encryptedKey: btcEncrypted.ciphertext,
              salt: btcEncrypted.salt,
              iv: btcEncrypted.iv,
            }
          }
          if (!updated.balances) {
            updated.balances = DEFAULT_BALANCES
          }
          await db.testnetWallets.put(updated)
          set({ wallet: updated, transactions, balances })
        } else {
          set({ wallet, transactions, balances })
        }
      }
    } catch {
      set({ wallet: null, transactions: [] })
    }
  },

  createWallet: async (userId) => {
    if (get().isCreating) return
    set({ isCreating: true })

    try {
      const { generatePrivateKey } = await import("viem/accounts")
      const ethPrivKey = generatePrivateKey()
      const ethAccount = privateKeyToAccount(ethPrivKey)
      const ethEncrypted = await encryptPrivateKey(ethPrivKey, userId)

      const { generateSolKeypair } = await import("@/lib/solana")
      const solKeypair = generateSolKeypair()
      const solKeyHex = Array.from(solKeypair.secretKey)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      const solEncrypted = await encryptPrivateKey(solKeyHex, userId)

      const { generateBtcKeypair } = await import("@/lib/bitcoin")
      const btcKeypair = generateBtcKeypair()
      const btcEncrypted = await encryptPrivateKey(btcKeypair.privateKey, userId)

      const wallet: TestnetWallet = {
        userId,
        address: ethAccount.address,
        encryptedPrivateKey: ethEncrypted.ciphertext,
        encryptionSalt: ethEncrypted.salt,
        encryptionIV: ethEncrypted.iv,
        solana: {
          address: solKeypair.publicKey,
          encryptedKey: solEncrypted.ciphertext,
          salt: solEncrypted.salt,
          iv: solEncrypted.iv,
        },
        bitcoin: {
          address: btcKeypair.address,
          encryptedKey: btcEncrypted.ciphertext,
          salt: btcEncrypted.salt,
          iv: btcEncrypted.iv,
        },
        balances: DEFAULT_BALANCES,
        createdAt: new Date(),
      }

      await db.testnetWallets.put(wallet)
      set({
        wallet,
        balances: { ethereum: BigInt(0), solana: 0, bitcoin: 0 },
      })
    } catch (error) {
      console.error("Failed to create testnet wallet:", error)
      throw error
    } finally {
      set({ isCreating: false })
    }
  },

  setActiveChain: (chain) => set({ activeChain: chain }),

  /** Load balances from persisted wallet (no blockchain query) */
  fetchBalance: async () => {
    const { wallet } = get()
    if (!wallet) return
    const wb = wallet.balances ?? DEFAULT_BALANCES
    set({
      balances: {
        ethereum: BigInt(wb.ethereum ?? "0"),
        solana: wb.solana ?? 0,
        bitcoin: wb.bitcoin ?? 0,
      },
    })
  },

  fetchAllBalances: async () => {
    get().fetchBalance()
  },

  /** Credit tokens to a chain (used by faucet) */
  creditBalance: async (chain, amount) => {
    const { wallet, balances } = get()
    if (!wallet) return

    const updatedBalances = { ...balances }
    const walletBalances = { ...(wallet.balances ?? DEFAULT_BALANCES) }

    if (chain === "ethereum") {
      const current = updatedBalances.ethereum ?? BigInt(0)
      const added = BigInt(amount)
      updatedBalances.ethereum = current + added
      walletBalances.ethereum = (current + added).toString()
    } else if (chain === "solana") {
      const current = updatedBalances.solana ?? 0
      updatedBalances.solana = current + Number(amount)
      walletBalances.solana = current + Number(amount)
    } else if (chain === "bitcoin") {
      const current = updatedBalances.bitcoin ?? 0
      updatedBalances.bitcoin = current + Number(amount)
      walletBalances.bitcoin = current + Number(amount)
    }

    const updatedWallet = { ...wallet, balances: walletBalances }
    set({ balances: updatedBalances, wallet: updatedWallet })
    await db.testnetWallets.put(updatedWallet)
  },

  /** Debit tokens from a chain (used by send) */
  debitBalance: async (chain, amount) => {
    const { wallet, balances } = get()
    if (!wallet) return false

    const updatedBalances = { ...balances }
    const walletBalances = { ...(wallet.balances ?? DEFAULT_BALANCES) }

    if (chain === "ethereum") {
      const current = updatedBalances.ethereum ?? BigInt(0)
      const deducted = BigInt(amount)
      if (current < deducted) return false
      updatedBalances.ethereum = current - deducted
      walletBalances.ethereum = (current - deducted).toString()
    } else if (chain === "solana") {
      const current = updatedBalances.solana ?? 0
      const deducted = Number(amount)
      if (current < deducted) return false
      updatedBalances.solana = current - deducted
      walletBalances.solana = current - deducted
    } else if (chain === "bitcoin") {
      const current = updatedBalances.bitcoin ?? 0
      const deducted = Number(amount)
      if (current < deducted) return false
      updatedBalances.bitcoin = current - deducted
      walletBalances.bitcoin = current - deducted
    }

    const updatedWallet = { ...wallet, balances: walletBalances }
    set({ balances: updatedBalances, wallet: updatedWallet })
    await db.testnetWallets.put(updatedWallet)
    return true
  },

  sendTransaction: async (chain, to, amount) => {
    const { wallet } = get()
    if (!wallet) return null

    // Convert display amount to raw units for debit
    let rawAmount: string
    if (chain === "ethereum") {
      const { parseEthAmount } = await import("@/lib/testnet")
      rawAmount = parseEthAmount(amount).toString()
    } else if (chain === "solana") {
      const { parseSolAmount } = await import("@/lib/solana")
      rawAmount = String(parseSolAmount(amount))
    } else {
      const { parseBtcAmount } = await import("@/lib/bitcoin")
      rawAmount = String(parseBtcAmount(amount))
    }

    const success = await get().debitBalance(chain, rawAmount)
    if (!success) return null

    const hash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, "0")).join("")}`

    const tx: TestnetTransaction = {
      id: crypto.randomUUID(),
      userId: wallet.userId,
      chain,
      type: "send",
      hash,
      to,
      from: get().getActiveAddress() ?? "",
      amount: rawAmount,
      status: "confirmed",
      timestamp: new Date(),
    }

    await get().addTransaction(tx)
    return hash
  },

  addTransaction: async (tx) => {
    const current = get().transactions
    set({ transactions: [tx, ...current] })
    try {
      await db.testnetTransactions.put(tx)
    } catch {
      set({ transactions: current })
    }
  },

  resetWallet: async () => {
    const { wallet } = get()
    if (!wallet) return
    // Clear transactions
    await db.testnetTransactions.where("userId").equals(wallet.userId).delete()
    // Reset balances to zero
    const updated = { ...wallet, balances: { ethereum: "0", solana: 0, bitcoin: 0 } }
    await db.testnetWallets.put(updated)
    set({
      wallet: updated,
      balances: { ethereum: BigInt(0), solana: 0, bitcoin: 0 },
      transactions: [],
    })
  },

  getActiveAddress: () => {
    const { wallet, activeChain } = get()
    if (!wallet) return null
    if (activeChain === "ethereum") return wallet.address
    if (activeChain === "solana") return wallet.solana?.address ?? null
    if (activeChain === "bitcoin") return wallet.bitcoin?.address ?? null
    return null
  },
}))
