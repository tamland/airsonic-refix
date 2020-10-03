import MD5 from 'md5-es'
import { Track } from '@/shared/api'

export function randomString(): string {
  let arr = new Uint8Array(16)
  window.crypto.getRandomValues(arr)
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  arr = arr.map(x => validChars.charCodeAt(x % validChars.length))
  return String.fromCharCode.apply(null, Array.from(arr))
}

export function md5(str: string): string {
  return MD5.hash(str)
}

export function trackListEquals(a: Track[], b: Track[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) {
      return false
    }
  }
  return true
}
