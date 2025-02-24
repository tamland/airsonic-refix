import '@/style/main.scss'
import { createApp, markRaw, watch } from 'vue'
import AppComponent from '@/app/App.vue'
import { components } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { useMainStore } from '@/shared/store'
import { API } from '@/shared/api'
import { createAuth } from '@/auth/service'
import { setupAudio, usePlayerStore } from './player/store'
import { createApi } from '@/shared'
import { createPinia } from 'pinia'
import { useFavouriteStore } from '@/library/favourite/store'
import { usePlaylistStore } from '@/library/playlist/store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: typeof router
    $api: API
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    api: API;
  }
}
const app = createApp(AppComponent)
const auth = createAuth()
const api = createApi(auth)
const router = setupRouter(auth)

const pinia = createPinia()
  .use(() => ({ api: markRaw(api) }))

app.use(pinia)
app.use(router)
app.use(auth)
app.use(api)

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value as any)
})

const mainStore = useMainStore(pinia)
const playerStore = usePlayerStore(pinia)

setupAudio(playerStore, mainStore, api)

watch(
  () => mainStore.isLoggedIn,
  (value) => {
    if (value) {
      return Promise.all([
        useFavouriteStore().load(),
        usePlaylistStore().load(),
        playerStore.loadQueue(),
      ])
    }
  })

router.beforeEach((to, from, next) => {
  mainStore.clearError()
  next()
})

app.config.errorHandler = (err) => {
  // eslint-disable-next-line
  console.error(err)
  mainStore.setError(err as Error)
}

app.mount('#app')
