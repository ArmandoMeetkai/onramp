"use client"

import { useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const networks = [
  { id: "ethereum", label: "Ethereum Sepolia", coin: "ETH", amount: "0.1", raw: "100000000000000000", gradient: "from-[#627EEA] to-[#3B5998]" },
  { id: "solana", label: "Solana Devnet", coin: "SOL", amount: "2", raw: "2000000000", gradient: "from-[#9945FF] to-[#14F195]" },
  { id: "bitcoin", label: "Bitcoin Testnet", coin: "BTC", amount: "0.001", raw: "100000", gradient: "from-[#F7931A] to-[#E8890C]" },
] as const

type FaucetStep = "form" | "sending" | "success" | "error"

function getInitialNetwork(chain: string | null) {
  if (chain) {
    const found = networks.find((n) => n.id === chain)
    if (found) return found
  }
  return networks[0]
}

export default function FaucetPage() {
  return (
    <Suspense>
      <FaucetContent />
    </Suspense>
  )
}

function FaucetContent() {
  const searchParams = useSearchParams()
  const [selectedNetwork, setSelectedNetwork] = useState<(typeof networks)[number]>(() =>
    getInitialNetwork(searchParams.get("chain"))
  )
  const [address, setAddress] = useState("")
  const [step, setStep] = useState<FaucetStep>("form")
  const [txHash, setTxHash] = useState("")

  const isValidAddress = (() => {
    if (!address.trim()) return false
    if (selectedNetwork.id === "ethereum") return /^0x[a-fA-F0-9]{40}$/.test(address)
    if (selectedNetwork.id === "solana") return address.length >= 32 && address.length <= 44
    if (selectedNetwork.id === "bitcoin") return /^(m|n|2|tb1)[a-zA-Z0-9]{25,60}$/.test(address)
    return false
  })()

  const handleSend = useCallback(async () => {
    if (!isValidAddress) return
    setStep("sending")

    await new Promise((r) => setTimeout(r, 2500 + Math.random() * 1500))

    const hash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setTxHash(selectedNetwork.id === "bitcoin" ? hash : `0x${hash}`)

    // Store the faucet result so the wallet page can pick it up
    try {
      const pending = JSON.parse(localStorage.getItem("onramp-faucet-pending") ?? "[]")
      pending.push({
        chain: selectedNetwork.id,
        address,
        amount: selectedNetwork.raw,
        hash: selectedNetwork.id === "bitcoin" ? hash : `0x${hash}`,
        timestamp: Date.now(),
      })
      localStorage.setItem("onramp-faucet-pending", JSON.stringify(pending))
    } catch {}

    setStep("success")
  }, [isValidAddress, address, selectedNetwork])

  return (
    <div className="min-h-dvh bg-[#0a0a1a] text-white">
      {/* Header bar */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
              T
            </div>
            <span className="text-lg font-semibold tracking-tight">
              TestDrip
            </span>
          </div>
          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            Testnet
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Multi-Chain{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Testnet Faucet
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Get free testnet tokens for Ethereum, Solana, and Bitcoin.
            <br />
            No signup required.
          </p>
        </motion.div>

        {/* Faucet card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 space-y-5"
              >
                {/* Network selector */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Select network
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {networks.map((net) => (
                      <button
                        key={net.id}
                        onClick={() => {
                          setSelectedNetwork(net)
                          setAddress("")
                        }}
                        className={`rounded-xl border-2 px-3 py-3 text-center transition-all ${
                          selectedNetwork.id === net.id
                            ? "border-white/30 bg-white/10"
                            : "border-transparent bg-white/5 hover:bg-white/8"
                        }`}
                      >
                        <p className="text-lg font-bold">{net.coin}</p>
                        <p className="text-[10px] text-gray-400">{net.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address input */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Wallet address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value.trim())}
                    placeholder={
                      selectedNetwork.id === "ethereum"
                        ? "0x..."
                        : selectedNetwork.id === "solana"
                          ? "Your Solana address..."
                          : "tb1... or m/n..."
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 font-mono text-sm text-white placeholder:text-gray-500 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    spellCheck={false}
                  />
                  {address.length > 3 && !isValidAddress && (
                    <p className="mt-1.5 text-xs text-red-400">
                      Invalid {selectedNetwork.coin} address format
                    </p>
                  )}
                </div>

                {/* Amount info */}
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm font-semibold">
                    {selectedNetwork.amount} {selectedNetwork.coin}
                  </span>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!isValidAddress}
                  className={`w-full rounded-xl bg-gradient-to-r ${selectedNetwork.gradient} py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  Send {selectedNetwork.amount} {selectedNetwork.coin}
                </button>

                <p className="text-center text-xs text-gray-500">
                  Testnet tokens have no monetary value. Free to use.
                </p>
              </motion.div>
            )}

            {step === "sending" && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center p-12"
              >
                <div className="relative">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${selectedNetwork.gradient} opacity-20 animate-ping`} />
                  <div className={`absolute inset-0 flex items-center justify-center`}>
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${selectedNetwork.gradient} flex items-center justify-center`}>
                      <span className="text-lg font-bold">{selectedNetwork.coin.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-lg font-semibold">
                  Sending {selectedNetwork.amount} {selectedNetwork.coin}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Confirming transaction on {selectedNetwork.label}...
                </p>
                <div className="mt-6 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-white/40"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center p-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
                >
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <p className="mt-4 text-xl font-bold">Transaction confirmed!</p>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedNetwork.amount} {selectedNetwork.coin} sent to your wallet
                </p>

                {/* Tx details */}
                <div className="mt-6 w-full space-y-2 rounded-xl bg-white/5 p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span>{selectedNetwork.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span>{selectedNetwork.amount} {selectedNetwork.coin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">To</span>
                    <span className="font-mono">
                      {address.slice(0, 8)}...{address.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tx Hash</span>
                    <span className="font-mono text-blue-400">
                      {txHash.slice(0, 10)}...{txHash.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400">Confirmed</span>
                  </div>
                </div>

                <div className="mt-6 flex w-full gap-3">
                  <button
                    onClick={() => {
                      setStep("form")
                      setAddress("")
                    }}
                    className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold transition-colors hover:bg-white/5"
                  >
                    Request more
                  </button>
                  <a
                    href={`/wallet?chain=${selectedNetwork.id}`}
                    className="flex-1 rounded-xl bg-white/10 py-3 text-center text-sm font-semibold transition-colors hover:bg-white/20"
                  >
                    Back to wallet
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { title: "Free tokens", desc: "No signup or payment required. Tokens are free for testing." },
            { title: "Instant delivery", desc: "Tokens arrive in your wallet within seconds." },
            { title: "Multi-chain", desc: "Support for Ethereum, Solana, and Bitcoin testnets." },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm font-semibold">{card.title}</p>
              <p className="mt-1 text-xs text-gray-400">{card.desc}</p>
            </div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Testnet tokens have no monetary value. Free to use for development and testing.
        </p>
      </main>
    </div>
  )
}
