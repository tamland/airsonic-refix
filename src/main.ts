import '@/style/main.scss'
import Vue, { markRaw } from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import AppComponent from '@/app/App.vue'
import { createApp } from '@/shared/compat'
import { components, formatDuration } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { setupStore } from '@/shared/store'
import { API } from '@/shared/api'
import { AuthService } from '@/auth/service'
import { setupAudio } from './player/store'
import { createApi } from '@/shared'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useFavouriteStore } from '@/library/favourite/store'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: AuthService
    $api: API
    $formatDuration: typeof formatDuration
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    api: API;
  }
}

Vue.use(Vuex)
Vue.use(Router)
Vue.use(PiniaVuePlugin)

const authService = new AuthService()
const api = createApi(authService)
const router = setupRouter(authService)
const store = setupStore(authService, api)
const pinia = createPinia()
  .use(({ store }) => {
    store.api = markRaw(api)
  })

store.watch(
  (state) => state.isLoggedIn,
  () => {
    useFavouriteStore().load()
  })

setupAudio(store, api)

router.beforeEach((to, from, next) => {
  store.commit('clearError')
  next()
})

const app = createApp(AppComponent, { router, store, pinia })

app.config.globalProperties.$auth = authService
app.config.globalProperties.$formatDuration = formatDuration
app.config.errorHandler = (err: Error) => {
  // eslint-disable-next-line
  console.error(err)
  store.commit('setError', err)
}

app.use(api)

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value as any)
})

app.mount('#app')
