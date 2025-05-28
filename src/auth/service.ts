import { md5, randomString, toQueryString } from '@/shared/utils'
import { config } from '@/shared/config'
import { inject } from 'vue'
import { App, Plugin } from '@/shared/compat'
import { pickBy } from 'lodash-es'

type Auth = { password?: string, salt?: string, hash?: string, guestSession?: string }
interface AuthParams {
  p?: string,
  s?: string,
  t?: string,
  g?: string,
  u?: string,
}

interface ServerInfo {
  name: string
  version: string
  openSubsonic: boolean
  extensions: string[]
}

export class AuthService {
  public server = ''
  public serverInfo = null as null | ServerInfo
  public username = ''
  private salt = ''
  private hash = ''
  private password = ''
  private authenticated = false
  private guestSession = ''

  constructor() {
    this.server = config.serverUrl || localStorage.getItem('server') || ''
    this.username = localStorage.getItem('username') || ''
    this.salt = localStorage.getItem('salt') || ''
    this.hash = localStorage.getItem('hash') || ''
    this.password = localStorage.getItem('password') || ''
    this.guestSession = localStorage.getItem('guestSession') || ''
  }

  private saveSession() {
    if (!config.serverUrl) {
      localStorage.setItem('server', this.server)
    }
    localStorage.setItem('username', this.username)
    localStorage.setItem('salt', this.salt)
    localStorage.setItem('hash', this.hash)
    localStorage.setItem('password', this.password)
    localStorage.setItem('guestSession', this.guestSession)
  }

  private guestFromResp(response: any): void {
    console.log('resp')
    try {
      const guestSession = response['subsonic-response'].guestSession
      console.log(guestSession, response)
      if (guestSession) {
        this.guestSession = guestSession
        this.saveSession()
      }
    } catch (e) {
      console.log('no guest session found in response')
    }

    console.log('done', this.guestSession)
  }

  async autoLogin(): Promise<boolean> {
    if (!this.server || !this.username) {
      return false
    }
    try {
      let auth = { salt: this.salt, hash: this.hash, password: this.password, guestSession: this.guestSession }
      const response = await login(this.server, this.username, auth)
      this.guestFromResp(response)
      auth = { salt: this.salt, hash: this.hash, password: this.password, guestSession: this.guestSession }
      this.authenticated = true
      this.serverInfo = await fetchServerInfo(this.server, this.username, auth)
      return true
    } catch {
      return false
    }
  }

  async loginWithPassword(server: string, username: string, password: string): Promise<void> {
    const salt = randomString()
    const hash = md5(password + salt)

    try {
      const response = await login(server, username, { hash, salt })
      this.guestFromResp(response)
      this.salt = salt
      this.hash = hash
      this.password = ''
    } catch {
      const response = await login(server, username, { password })
      this.guestFromResp(response)
      this.salt = ''
      this.hash = ''
      this.password = password
    }
    this.server = server
    this.username = username
    this.authenticated = true
    this.serverInfo = await fetchServerInfo(server, username, { hash, salt, password: this.password, guestSession: this.guestSession })
    this.saveSession()
  }

  get urlParams() {
    return filterAuth({
      u: this.username,
      s: this.salt,
      t: this.hash,
      p: this.password,
      g: this.guestSession,
    }, 'urlParams')
  }

  logout() {
    localStorage.clear()
    sessionStorage.clear()
  }

  isAuthenticated() {
    return this.authenticated
  }
}

function filterAuth(auth: AuthParams, src: string): string {
  const result = toQueryString(pickBy(auth, x => (x !== undefined && x !== '')))
  console.log('filterAuth', auth, src, result)
  return result
}

async function login(server: string, username: string, auth: Auth) {
  const qs = filterAuth({
    s: auth.salt,
    t: auth.hash,
    p: auth.password,
    g: auth.guestSession
  }, 'login')
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
      console.log('got from api', response)
      return response
    })
}

async function fetchServerInfo(server: string, username: string, auth: Auth): Promise<ServerInfo> {
  const qs = filterAuth({
    s: auth.salt,
    t: auth.hash,
    p: auth.password,
    g: auth.guestSession,
  }, 'serverInfo')
  const url = `${server}/rest/getOpenSubsonicExtensions?u=${username}&${qs}&v=1.15.0&c=app&f=json`
  const response = await fetch(url)
  if (response.ok) {
    const body = await response.json()
    const subsonicResponse = body['subsonic-response']
    if (subsonicResponse?.status === 'ok') {
      return {
        name: subsonicResponse.type,
        version: subsonicResponse.version,
        openSubsonic: true,
        extensions: subsonicResponse.openSubsonicExtensions.map((ext: any) => ext.name)
      }
    }
  }
  return { name: 'Subsonic', version: 'Unknown', openSubsonic: false, extensions: [] }
}

const apiSymbol = Symbol('')

export function useAuth(): AuthService {
  return inject(apiSymbol) as AuthService
}

export function createAuth(): AuthService & Plugin {
  const instance = new AuthService()
  return Object.assign(instance, {
    install: (app: App) => {
      app.provide(apiSymbol, instance)
    }
  })
}
