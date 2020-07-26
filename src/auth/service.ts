import axios from 'axios';


export class AuthService {
  public server: string = "";
  public username: string = "";
  public password: string = "";
  private authenticated: boolean = false;

  constructor() {
    this.server = localStorage.getItem("server") || "/api";
    this.username = localStorage.getItem("username") || "guest1";
    this.password = localStorage.getItem("password") || "";
  }

  private saveSession() {
    localStorage.setItem("server", this.server);
    localStorage.setItem("username", this.username);
    localStorage.setItem("password", this.password);
  }

  async autoLogin(): Promise<boolean> {
    if (!this.server || !this.username) {
      return false;
    }
    return this.login(this.server, this.username, this.password, false)
      .then(() => true)
      .catch(() => false);
  }

  async login(server: string, username: string, password: string, remember: boolean) {
    return axios.get(`${server}/rest/ping.view?u=${username}&p=${password}&v=1.15.0&c=app&f=json`)
      .then((response) => {
        const subsonicResponse = response.data["subsonic-response"];
        if (!subsonicResponse || subsonicResponse.status !== "ok") {
          const err = new Error(subsonicResponse.status);
          return Promise.reject(err);
        }
        this.authenticated = true;
        this.server = server;
        this.username = username;
        this.password = password;
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