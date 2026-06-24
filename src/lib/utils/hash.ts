// lib/utils/hash.ts
const SALT = 123456789 

export const encodeId = (id: number) => {
  const obfuscated = (id ^ SALT).toString(36)
  return obfuscated
}

export const decodeId = (encoded: string) => {
  const decoded = parseInt(encoded, 36) ^ SALT
  return decoded
}
