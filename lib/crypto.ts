/**
 * Encryption utilities for testnet wallet private keys.
 * Uses Web Crypto API (PBKDF2 -> AES-256-GCM). No npm dependencies.
 *
 * Security model: testnet-only. The userId acts as the passphrase input
 * combined with a random salt, which prevents casual IndexedDB inspection.
 * This is NOT production-grade key management — it's appropriate for
 * free testnet tokens with zero monetary value.
 */

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function fromBase64(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function deriveKey(userId: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(userId),
    "PBKDF2",
    false,
    ["deriveKey"],
  )
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

export async function encryptPrivateKey(
  privateKey: string,
  userId: string,
): Promise<{ ciphertext: string; salt: string; iv: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(userId, salt.buffer)

  const encoder = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(privateKey),
  )

  return {
    ciphertext: toBase64(encrypted),
    salt: toBase64(salt.buffer),
    iv: toBase64(iv.buffer),
  }
}

export async function decryptPrivateKey(
  ciphertext: string,
  salt: string,
  iv: string,
  userId: string,
): Promise<string> {
  const key = await deriveKey(userId, fromBase64(salt))
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(fromBase64(iv)) },
    key,
    fromBase64(ciphertext),
  )
  return new TextDecoder().decode(decrypted)
}
