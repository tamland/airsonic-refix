import MD5 from 'md5-es'
import { Artist, Track } from '@/shared/api'

export function randomString(): string {
  let arr = new Uint8Array(16)
  window.crypto.getRandomValues(arr)
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  arr = arr.map(x => validChars.charCodeAt(x % validChars.length))
  return String.fromCharCode.apply(null, Array.from(arr))
}

export function shuffle<T>(list: T[], moveFirst?: number): void {
  if (moveFirst !== undefined) {
    [list[0], list[moveFirst]] = [list[moveFirst], list[0]]
  }
  const start = moveFirst !== undefined ? 1 : 0
  const end = list.length - 1
  for (let i = end; i > start; i--) {
    const j = Math.floor(Math.random() * (i - start + 1) + start);
    [list[i], list[j]] = [list[j], list[i]]
  }
}

export function shuffled<T>(list: T[], moveFirst?: number): T[] {
  list = [...list]
  shuffle(list, moveFirst)
  return list
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

export function formatArtists(artists: Artist[]): string {
  return artists.map(ar => ar.name).join(', ')
}

export function toQueryString(params: Record<string, string | string[]>): string {
  const list = Object.entries(params)
    .filter(([, value]) => value !== undefined)
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
