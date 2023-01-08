import '@/style/main.scss'
import Vue, { markRaw, watch } from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import AppComponent from '@/app/App.vue'
import { createApp } from '@/shared/compat'
import { components, formatDuration } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { useMainStore } from '@/shared/store'
import { API } from '@/shared/api'
import { AuthService } from '@/auth/service'
import { createPlayerStore } from './player/store'
import { createApi } from '@/shared'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useFavouriteStore } from '@/library/favourite/store'
import { usePlaylistStore } from '@/playlist/store'

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

const pinia = createPinia()
  .use(({ store }) => {
    store.api = markRaw(api)
  })

const mainStore = useMainStore(pinia)
const playerStore = createPlayerStore(mainStore, api)

watch(
  () => mainStore.isLoggedIn,
  (value) => {
    if (value) {
      return Promise.all([
        useFavouriteStore().load(),
        usePlaylistStore().load(),
      ])
    }
  })

router.beforeEach((to, from, next) => {
  mainStore.clearError()
  next()
})

const app = createApp(AppComponent, { router, pinia, store: playerStore })

app.config.globalProperties.$auth = authService
app.config.globalProperties.$formatDuration = formatDuration
app.config.errorHandler = (err: Error) => {
  // eslint-disable-next-line
  console.error(err)
  mainStore.setError(err)
}

app.use(api)

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value as any)
})

app.mount('#app')
