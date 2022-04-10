import '@/style/main.scss'
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import CompositionAPI, { createApp } from '@vue/composition-api'
import App from '@/app/App.vue'
import { components, formatDuration } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { setupStore } from '@/shared/store'
import { API } from '@/shared/api'
import { AuthService } from '@/auth/service'
import { setupAudio } from './player/store'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: AuthService
    $api: API
  }
  interface VueConfiguration {
    globalProperties: any
  }
}

Vue.use(CompositionAPI)
Vue.use(Vuex)
Vue.use(Router)

const authService = new AuthService()
const api = new API(authService)
const router = setupRouter(authService)
const store = setupStore(authService, api)
setupAudio(store, api)

const app = createApp({
  router,
  store,
  render: (h: any) => h(App),
})

app.config.globalProperties = Vue.prototype
app.config.globalProperties.$auth = authService
app.config.globalProperties.$api = api
app.config.globalProperties.$formatDuration = formatDuration

app.config.errorHandler = (err: Error) => {
  // eslint-disable-next-line
  console.error(err)
  store.commit('setError', err)
}

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value)
})

app.mount('#app')
