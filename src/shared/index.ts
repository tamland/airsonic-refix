import { API } from '@/shared/api'
import { inject } from 'vue'
import { AuthService } from '@/auth/service'
import { App, PluginObject } from '@/shared/compat'

const apiSymbol = Symbol('')

export function useApi(): API {
  return inject(apiSymbol) as API
}

export function createApi(auth: AuthService): API & PluginObject<never> {
  const instance = new API(auth)
  return Object.assign(instance, {
    install: (app: App) => {
      app.config.globalProperties.$api = instance
      app.provide(apiSymbol, instance)
    }
  })
}
