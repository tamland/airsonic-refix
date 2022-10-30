import '@/style/main.scss'
import { createApp, configureCompat } from 'vue'
import App from '@/app/App.vue'
import { components, formatDuration } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { setupStore } from '@/shared/store'
import { API } from '@/shared/api'
import { AuthService } from '@/auth/service'
import { setupAudio } from './player/store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store;
    $router: typeof router
    $auth: AuthService
    $api: API
    $formatDuration: typeof formatDuration
  }
}

const authService = new AuthService()
const api = new API(authService)
const router = setupRouter(authService)
const store = setupStore(authService, api)
setupAudio(store, api)

const app = createApp(App)
app.config.globalProperties.$auth = authService
app.config.globalProperties.$api = api
app.config.globalProperties.$formatDuration = formatDuration

app.config.errorHandler = (err) => {
  // eslint-disable-next-line
  console.error(err)
  store.commit('setError', err)
}

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value)
})

app.use(router)
app.use(store)
app.mount('#app')
