import '@/style/main.scss'
import Vue, { markRaw, watch } from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import AppComponent from '@/app/App.vue'
import { createApp } from '@/shared/compat'
import { components } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { useMainStore } from '@/shared/store'
import { API } from '@/shared/api'
import { createAuth } from '@/auth/service'
import { createPlayerStore } from './player/store'
import { createApi } from '@/shared'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useFavouriteStore } from '@/library/favourite/store'
import { usePlaylistStore } from '@/playlist/store'

declare module 'vue/types/vue' {
  interface Vue {
    $api: API
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

const auth = createAuth()
const api = createApi(auth)
const router = setupRouter(auth)

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

app.config.errorHandler = (err: Error) => {
  // eslint-disable-next-line
  console.error(err)
  mainStore.setError(err)
}

app.use(auth)
app.use(api)

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value as any)
})

app.mount('#app')
