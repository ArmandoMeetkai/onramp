import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js"

export const solanaConnection = new Connection(clusterApiUrl("devnet"), "confirmed")

/** Format lamports to friendly display */
export function formatSolTokens(lamports: number): string {
  const sol = lamports / LAMPORTS_PER_SOL
  if (sol === 0) return "0"
  if (sol < 0.0001) return "<0.0001"
  if (sol < 0.01) return sol.toFixed(4)
  if (sol < 1) return sol.toFixed(3)
  return sol.toFixed(2)
}

export function parseSolAmount(amount: string): number {
  return Math.floor(Number.parseFloat(amount) * LAMPORTS_PER_SOL)
}

export async function getSolBalance(address: string): Promise<number> {
  const pubkey = new PublicKey(address)
  return solanaConnection.getBalance(pubkey)
}

export async function requestSolAirdrop(address: string): Promise<string> {
  const pubkey = new PublicKey(address)
  const sig = await solanaConnection.requestAirdrop(pubkey, LAMPORTS_PER_SOL)
  await solanaConnection.confirmTransaction(sig, "confirmed")
  return sig
}

export async function sendSol(
  fromSecretKey: Uint8Array,
  toAddress: string,
  lamports: number,
): Promise<string> {
  const from = Keypair.fromSecretKey(fromSecretKey)
  const to = new PublicKey(toAddress)

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports,
    }),
  )

  return sendAndConfirmTransaction(solanaConnection, tx, [from])
}

export function generateSolKeypair(): { publicKey: string; secretKey: Uint8Array } {
  const keypair = Keypair.generate()
  return {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: keypair.secretKey,
  }
}

export function getSolExplorerTxUrl(sig: string): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`
}

export function getSolExplorerAddressUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`
}

export function isValidSolAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}
