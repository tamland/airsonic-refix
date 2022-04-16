import { randomString, md5 } from '@/shared/utils'
import { config } from '@/shared/config'

export class AuthService {
  public server = ''
  public username = ''
  public salt = ''
  public hash = ''
  public roles: string[] = []
  private authenticated = false

  constructor() {
    this.server = config.serverUrl || localStorage.getItem('server') || ''
    this.username = localStorage.getItem('username') || ''
    this.salt = localStorage.getItem('salt') || ''
    this.hash = localStorage.getItem('hash') || ''
    const roleJSON = localStorage.getItem('roles') || ''
    if (roleJSON) {
      this.roles = JSON.parse(roleJSON)
    }
  }

  private saveSession() {
    if (!config.serverUrl) {
      localStorage.setItem('server', this.server)
    }
    localStorage.setItem('username', this.username)
    localStorage.setItem('salt', this.salt)
    localStorage.setItem('hash', this.hash)
  }

  async autoLogin(): Promise<boolean> {
    if (!this.server || !this.username) {
      return false
    }
    return this.loginWithHash(this.server, this.username, this.salt, this.hash, false)
      .then(() => true)
      .catch(() => false)
  }

  async loginWithPassword(server: string, username: string, password: string, remember: boolean) {
    const salt = randomString()
    const hash = md5(password + salt)
    return this.loginWithHash(server, username, salt, hash, remember)
  }

  private async loginWithHash(
    server: string,
    username: string,
    salt: string,
    hash: string,
    remember: boolean
  ) {
    const url = `${server}/rest/ping?u=${username}&s=${salt}&t=${hash}&v=1.15.0&c=app&f=json`
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
        this.authenticated = true
        this.server = server
        this.username = username
        this.salt = salt
        this.hash = hash
        if (remember) {
          this.saveSession()
        }
        this.fetchUserDetails()
      })
  }

  logout() {
    localStorage.clear()
    sessionStorage.clear()
  }

  fetchUserDetails() {
    const url = `${this.server}/rest/getUser?username=${this.username}&u=${this.username}&s=${this.salt}&t=${this.hash}&v=1.15.0&c=app&f=json`
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
        this.roles = []
        for (const [key, value] of Object.entries(subsonicResponse.user)) {
          if (key.endsWith('Role') && value === true) {
            this.roles.push(key.replace(/Role$/, ''))
          }
        }
        localStorage.setItem('roles', JSON.stringify(this.roles))
      })
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }

  isAuthenticated() {
    return this.authenticated
  }
}
