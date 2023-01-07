import '@/style/main.scss'
import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'
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

declare module 'vue/types/vue' {
  interface Vue {
    config: VueConstructor['config']
    component: (k: string, v: any) => void
    mount: (arg: string) => void
    $auth: AuthService
    $api: API
    $formatDuration: typeof formatDuration
  }
  interface VueConfiguration {
    globalProperties: Vue
  }
}

Vue.use(Vuex)
Vue.use(Router)

const authService = new AuthService()
const api = new API(authService)
const router = setupRouter(authService)
const store = setupStore(authService, api)
setupAudio(store, api)

router.beforeEach((to, from, next) => {
  store.commit('clearError')
  next()
})

const app = createApp(AppComponent, { router, store })

app.config.globalProperties.$auth = authService
app.config.globalProperties.$api = api
app.config.globalProperties.$formatDuration = formatDuration

app.config.errorHandler = (err: Error) => {
  // eslint-disable-next-line
  console.error(err)
  store.commit('setError', err)
}

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value as any)
})

app.mount('#app')
