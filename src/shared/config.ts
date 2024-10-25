export interface Config {
  serverUrl: string
  instanceName: string
  instanceSubName: string
  disableSubName: boolean
}

const env = (window as any).env

export const config: Config = {
  serverUrl: env?.SERVER_URL || '',
  instanceName: env?.INSTANCE_NAME || 'airsonic',
  instanceSubName: env?.INSTANCE_SUBNAME || 'refix',
  disableSubName: env?.DISABLE_SUBNAME ? Boolean(env.DISABLE_SUBNAME) : false,
}
