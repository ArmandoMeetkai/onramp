import * as btc from "@scure/btc-signer"
import { hex } from "@scure/base"
import { secp256k1 } from "@noble/curves/secp256k1.js"

const TESTNET = btc.TEST_NETWORK

/** Generate a Bitcoin testnet keypair (P2WPKH segwit) */
export function generateBtcKeypair(): { address: string; privateKey: string } {
  const privKeyBytes = btc.utils.randomPrivateKeyBytes()
  const privateKey = hex.encode(privKeyBytes)

  const pubKeyBytes = secp256k1.getPublicKey(privKeyBytes, true)
  const payment = btc.p2wpkh(pubKeyBytes, TESTNET)
  const address = payment.address!

  return { address, privateKey }
}

/** Format satoshis to friendly display */
export function formatBtcTokens(satoshis: number): string {
  const btcAmount = satoshis / 1e8
  if (btcAmount === 0) return "0"
  if (btcAmount < 0.00001) return "<0.00001"
  if (btcAmount < 0.001) return btcAmount.toFixed(5)
  if (btcAmount < 1) return btcAmount.toFixed(4)
  return btcAmount.toFixed(3)
}

export function parseBtcAmount(amount: string): number {
  return Math.floor(Number.parseFloat(amount) * 1e8)
}

/** Get balance from Blockstream testnet API */
export async function getBtcBalance(address: string): Promise<number> {
  const res = await fetch(
    `https://blockstream.info/testnet/api/address/${address}`,
  )
  if (!res.ok) throw new Error("Failed to fetch BTC balance")
  const data = await res.json()
  const funded = data.chain_stats?.funded_txo_sum ?? 0
  const spent = data.chain_stats?.spent_txo_sum ?? 0
  const mempoolFunded = data.mempool_stats?.funded_txo_sum ?? 0
  const mempoolSpent = data.mempool_stats?.spent_txo_sum ?? 0
  return funded - spent + mempoolFunded - mempoolSpent
}

/** Get UTXOs for building transactions */
async function getUtxos(
  address: string,
): Promise<Array<{ txid: string; vout: number; value: number }>> {
  const res = await fetch(
    `https://blockstream.info/testnet/api/address/${address}/utxo`,
  )
  if (!res.ok) throw new Error("Failed to fetch UTXOs")
  return res.json()
}

/** Send BTC on testnet */
export async function sendBtc(
  privateKeyHex: string,
  toAddress: string,
  satoshis: number,
): Promise<string> {
  const privKeyBytes = hex.decode(privateKeyHex)
  const pubKeyBytes = secp256k1.getPublicKey(privKeyBytes, true)
  const payment = btc.p2wpkh(pubKeyBytes, TESTNET)
  const fromAddress = payment.address!

  const utxos = await getUtxos(fromAddress)
  if (utxos.length === 0) throw new Error("No UTXOs available")

  const fee = 300
  const needed = satoshis + fee
  let total = 0
  const selected: typeof utxos = []

  for (const utxo of utxos) {
    selected.push(utxo)
    total += utxo.value
    if (total >= needed) break
  }

  if (total < needed) throw new Error("Insufficient balance")

  const tx = new btc.Transaction()

  for (const utxo of selected) {
    tx.addInput({
      txid: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: payment.script,
        amount: BigInt(utxo.value),
      },
    })
  }

  tx.addOutputAddress(toAddress, BigInt(satoshis), TESTNET)

  const change = total - satoshis - fee
  if (change > 546) {
    tx.addOutputAddress(fromAddress, BigInt(change), TESTNET)
  }

  tx.sign(privKeyBytes)
  tx.finalize()

  const txHex = hex.encode(tx.extract())
  const broadcastRes = await fetch(
    "https://blockstream.info/testnet/api/tx",
    { method: "POST", body: txHex },
  )

  if (!broadcastRes.ok) {
    const err = await broadcastRes.text()
    throw new Error(`Broadcast failed: ${err}`)
  }

  return broadcastRes.text()
}

export function getBtcExplorerTxUrl(txid: string): string {
  return `https://blockstream.info/testnet/tx/${txid}`
}

export function getBtcExplorerAddressUrl(address: string): string {
  return `https://blockstream.info/testnet/address/${address}`
}

export function isValidBtcTestnetAddress(address: string): boolean {
  return /^(m|n|2)[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
    /^tb1[a-z0-9]{39,59}$/.test(address)
}
