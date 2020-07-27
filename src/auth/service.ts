import axios from 'axios';
import { randomString, md5 } from '@/shared/utils';


export class AuthService {
  public server: string = "";
  public username: string = "";
  public salt: string = "";
  public hash: string = "";
  private authenticated: boolean = false;

  constructor() {
    this.server = localStorage.getItem("server") || "/api";
    this.username = localStorage.getItem("username") || "guest1";
    this.salt = localStorage.getItem("salt") || "";
    this.hash = localStorage.getItem("hash") || "";
  }

  private saveSession() {
    localStorage.setItem("server", this.server);
    localStorage.setItem("username", this.username);
    localStorage.setItem("salt", this.salt);
    localStorage.setItem("hash", this.hash);
  }

  async autoLogin(): Promise<boolean> {
    if (!this.server || !this.username) {
      return false;
    }
    return this.loginWithHash(this.server, this.username, this.salt, this.hash, false)
      .then(() => true)
      .catch(() => false);
  }

  async loginWithPassword(server: string, username: string, password: string, remember: boolean) {
    const salt = randomString();
    const hash = md5(password + salt);
    return this.loginWithHash(server, username, salt, hash, remember);
  }

  private async loginWithHash(server: string, username: string, salt: string, hash: string, remember: boolean) {
    return axios.get(`${server}/rest/ping.view?u=${username}&s=${salt}&t=${hash}&v=1.15.0&c=app&f=json`)
      .then((response) => {
        const subsonicResponse = response.data["subsonic-response"];
        if (!subsonicResponse || subsonicResponse.status !== "ok") {
          const err = new Error(subsonicResponse.status);
          return Promise.reject(err);
        }
        this.authenticated = true;
        this.server = server;
        this.username = username;
        this.salt = salt;
        this.hash = hash;
        if (remember) {
          this.saveSession();
        }
      })
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  isAuthenticated() {
    return this.authenticated;
  }

}