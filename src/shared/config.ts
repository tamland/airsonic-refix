export interface Config {
  serverUrl: string
  settingsEnv: string
}

const env = (window as any).env

export const config: Config = {
  serverUrl: env?.SERVER_URL || '',
  settingsEnv: env?.SETTINGS || '',
}
