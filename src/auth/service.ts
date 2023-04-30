import { md5, randomString, toQueryString } from '@/shared/utils'
import { config } from '@/shared/config'
import { inject } from 'vue'
import { App, PluginObject } from '@/shared/compat'
import { pickBy } from 'lodash-es'

type Auth = { password?: string, salt?: string, hash?: string }

export class AuthService {
  public server = ''
  public username = ''
  private salt = ''
  private hash = ''
  private password = ''
  private authenticated = false

  constructor() {
    this.server = config.serverUrl || localStorage.getItem('server') || ''
    this.username = localStorage.getItem('username') || ''
    this.salt = localStorage.getItem('salt') || ''
    this.hash = localStorage.getItem('hash') || ''
    this.password = localStorage.getItem('password') || ''
  }

  private saveSession() {
    if (!config.serverUrl) {
      localStorage.setItem('server', this.server)
    }
    localStorage.setItem('username', this.username)
    localStorage.setItem('salt', this.salt)
    localStorage.setItem('hash', this.hash)
    localStorage.setItem('password', this.password)
  }

  async autoLogin(): Promise<boolean> {
    if (!this.server || !this.username) {
      return false
    }
    try {
      const auth = { salt: this.salt, hash: this.hash, password: this.password }
      await login(this.server, this.username, auth)
      this.authenticated = true
      return true
    } catch {
      return false
    }
  }

  async loginWithPassword(server: string, username: string, password: string): Promise<void> {
    const salt = randomString()
    const hash = md5(password + salt)
    try {
      await login(server, username, { hash, salt })
      this.salt = salt
      this.hash = hash
      this.password = ''
    } catch {
      await login(server, username, { password })
      this.salt = ''
      this.hash = ''
      this.password = password
    }
    this.server = server
    this.username = username
    this.authenticated = true
    this.saveSession()
  }

  get urlParams() {
    return toQueryString(pickBy({
      u: this.username,
      s: this.salt,
      t: this.hash,
      p: this.password,
    }))
  }

  logout() {
    localStorage.clear()
    sessionStorage.clear()
  }

  isAuthenticated() {
    return this.authenticated
  }
}

async function login(server: string, username: string, auth: Auth) {
  const qs = toQueryString(pickBy({
    s: auth.salt,
    t: auth.hash,
    p: auth.password,
  }, x => x !== undefined) as Record<string, string>)
  const url = `${server}/rest/ping?u=${username}&${qs}&v=1.15.0&c=app&f=json`
  return fetch(url)
    .then(response => response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText)))
    .then((response) => {
      const subsonicResponse = response['subsonic-response']
      if (!subsonicResponse || subsonicResponse.status !== 'ok') {
        const message = subsonicResponse.error?.message || subsonicResponse.status
        throw new Error(message)
      }
    })
}

const apiSymbol = Symbol('')

export function useAuth(): AuthService {
  return inject(apiSymbol) as AuthService
}

export function createAuth(): AuthService & PluginObject<never> {
  const instance = new AuthService()
  return Object.assign(instance, {
    install: (app: App) => {
      app.provide(apiSymbol, instance)
    }
  })
}
