import MD5 from 'md5-es'
import { Track } from '@/shared/api'

export function randomString(): string {
  let arr = new Uint8Array(16)
  window.crypto.getRandomValues(arr)
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  arr = arr.map(x => validChars.charCodeAt(x % validChars.length))
  return String.fromCharCode.apply(null, Array.from(arr))
}

export function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
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

export function toQueryString(params: Record<string, string | string[]>): string {
  const list = Object.entries(params)
    .map(([key, value]) => Array.isArray(value) ? value.map((x) => [key, x]) : [[key, value]])
    .flat()
  return new URLSearchParams(list).toString()
}

export function formatDuration(value: number): string {
  if (!isFinite(value)) {
    return '∞'
  }
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
