export interface Config {
  serverUrl: string
}

const env = (window as any).env

export const config: Config = {
  serverUrl: env?.SERVER_URL || 'http://localhost:1981',
}
