import MD5 from 'md5-es'
import { Track } from '@/shared/api'

export function randomString(): string {
  let arr = new Uint8Array(16)
  window.crypto.getRandomValues(arr)
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  arr = arr.map((x) => validChars.charCodeAt(x % validChars.length))
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

export function secondsToText(seconds: number): string {
  // Calculate the number of hours and minutes
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  // Build the output string based on the hours and minutes
  let result = ''
  if (hours > 0) {
    result += hours + 'h'
    if (minutes > 0) {
      result += minutes.toString().padStart(2, '0')
    }
  } else if (minutes > 0) {
    result += minutes + ' mins'
  } else {
    result += seconds + ' secs'
  }

  return result
}
